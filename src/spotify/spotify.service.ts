import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpotifyAccessToken } from './spotify-access-token.entity';
import { SpotifyAuthType } from './spotify-auth-type.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import SpotifyAccessTokenResponseDto from './spotify-access-token-response.dto';
import { addSeconds } from 'date-fns';
import { AxiosResponse } from 'axios';

@Injectable()
export class SpotifyService {
  private readonly spotifyUserAuthedClientScope =
    'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-email ';
  private readonly spotifyGetAccessTokenUrl =
    'https://accounts.spotify.com/api/token';
  private readonly accessTokenExpirationOffsetSeconds = 60; // treat token as expired if this or fewer seconds left
  private readonly spotifyApiBaseUrl = 'https://api.spotify.com/v1';

  private spotifyClientId: string;
  private spotifyClientSecret: string;
  private spotifyAuthCallbackUrl: string;
  constructor(
    private configService: ConfigService,
    @InjectRepository(SpotifyAccessToken)
    private accessTokensRepository: Repository<SpotifyAccessToken>,
    private httpService: HttpService,
  ) {
    this.initSpotifyClientCredentials();
  }
  private initSpotifyClientCredentials() {
    this.spotifyClientId = this.configService.getOrThrow('SPOTIFY_CLIENT_ID');
    this.spotifyClientSecret = this.configService.getOrThrow(
      'SPOTIFY_CLIENT_SECRET',
    );
    this.spotifyAuthCallbackUrl = this.configService.getOrThrow<string>(
      'SPOTIFY_AUTH_CALLBACK_URL',
    );
  }

  getUserAuthorizationUrl(): string {
    return (
      'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: this.spotifyClientId,
        scope: this.spotifyUserAuthedClientScope,
        redirect_uri: this.spotifyAuthCallbackUrl,
        state: '', // If this is ever used for non-admins, we must generate a secure random token and verify this
      })
    );
  }
  async updateSpotifyUserAccessTokenFromCode(
    code: string,
    isRefreshToken: boolean,
  ): Promise<string | null> {
    let payload = null as any;
    if (isRefreshToken) {
      payload = { grant_type: 'refresh_token', refresh_token: code };
    } else {
      payload = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.spotifyAuthCallbackUrl, // Note that spotify verifies this matches the one passed in on auth code creation
      };
    }
    const response = await firstValueFrom(
      this.httpService.post(this.spotifyGetAccessTokenUrl, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            (
              Buffer.from(
                this.spotifyClientId + ':' + this.spotifyClientSecret,
              ) as any
            ).toString('base64'),
        },
      }),
    ).catch((e: any) => {
      Logger.error(e, 'Failed to retrieve Spotify access token from auth code');
      throw e;
    });
    const responseData = response.data as SpotifyAccessTokenResponseDto;

    if (responseData && responseData.access_token && responseData.expires_in) {
      const now = new Date();
      const expiresAt = addSeconds(now, responseData.expires_in);

      if (isRefreshToken) {
        // Note that Spotify has us re-use the same refresh token
        // and doesn't return a new one, which is a bad practice
        // Added defensive code in case they change to single-use ones.

        const updatedProperties = {
          accessToken: responseData.access_token,
          expiresAt,
        } as any;
        if (responseData.refresh_token) {
          updatedProperties.refreshToken = responseData.refresh_token;
        }
        await this.accessTokensRepository.update(
          {
            spotifyAuthType: SpotifyAuthType.AuthorizationCode,
          },
          updatedProperties,
        );
      } else {
        // We want to be able to force refresh as an admin,
        // which is why we do an upsert for all cols
        const newToken = {
          accessToken: responseData.access_token,
          spotifyAuthType: SpotifyAuthType.AuthorizationCode,
          expiresAt,
          refreshToken: responseData.refresh_token,
        } as SpotifyAccessToken;
        await this.accessTokensRepository
          .createQueryBuilder()
          .insert()
          .into(SpotifyAccessToken)
          .values(newToken)
          .orUpdate({
            overwrite: ['refreshToken', 'accessToken', 'expiresAt'],
            conflict_target: ['spotifyAuthType'],
          })
          .setParameter('accessToken', responseData.access_token)
          .execute();
      }
      return responseData.access_token;
    } else {
      Logger.error('Failed to refresh Spotify user access token');
      return null;
    }
  }
  async getOrRefreshSpotifyUserAccessToken(
    retryOnFailure?: boolean,
  ): Promise<string | null> {
    const token = await this.accessTokensRepository.findOne({
      where: { spotifyAuthType: SpotifyAuthType.AuthorizationCode },
    });
    if (!token) {
      Logger.error('No access token exists for the AuthorizationCode strategy');
      return;
    }
    if (
      addSeconds(new Date(), this.accessTokenExpirationOffsetSeconds) >
      token.expiresAt
    ) {
      let newToken: string;
      let refreshFailed = false;
      try {
        newToken = await this.updateSpotifyUserAccessTokenFromCode(
          token.refreshToken,
          true,
        );
      } catch (e: any) {
        Logger.error(e, 'Failed to refresh access token');
        refreshFailed = true;
      }
      if (!newToken) {
        refreshFailed = true;
      }
      if (refreshFailed && retryOnFailure) {
        Logger.error('Failed to refresh access token, retrying once');
        return await this.getOrRefreshSpotifyUserAccessToken(false);
      }
      if (refreshFailed) {
        Logger.error('Failed to refresh access token, not retrying');
        return null;
      }
      return newToken;
    }
    return token.accessToken;
  }
  async performApiRequest(
    route: string,
    method: 'POST' | 'GET' | 'PUT',
    data?: any,
    params?: any,
    retryOnFailure?: boolean,
  ): Promise<AxiosResponse<any, any>> {
    const token = await this.getOrRefreshSpotifyUserAccessToken(true);

    return await firstValueFrom(
      this.httpService.request({
        url: this.spotifyApiBaseUrl + '/' + route,
        method,
        data,
        params,
        headers: { Authorization: 'Bearer ' + token },
      }),
    ).catch(async (e: any) => {
      Logger.error(e, 'Spotify API request failed: /' + route);
      if (retryOnFailure) {
        Logger.error('Retrying Spotify API request: /' + route);
        return await this.performApiRequest(route, method, data, false);
      } else {
        throw e;
      }
    });
  }
}
