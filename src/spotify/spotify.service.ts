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
  ): Promise<SpotifyAccessToken | null> {
    const response = await firstValueFrom(
      this.httpService.post(
        this.spotifyGetAccessTokenUrl,
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.spotifyAuthCallbackUrl, // Note that spotify verifies this matches the one passed in on auth code creation
        },
        {
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
          /*auth: {
            username: this.spotifyClientId,
            password: this.spotifyClientSecret,
          },*/
        },
      ),
    ).catch((e: any) => {
      Logger.error(e, 'Failed to retrieve Spotify access token from auth code');
      throw e;
    });
    const responseData = response.data as SpotifyAccessTokenResponseDto;
    if (
      responseData &&
      responseData.access_token &&
      responseData.expires_in &&
      responseData.refresh_token
    ) {
      const now = new Date();
      const expiresAt = addSeconds(now, responseData.expires_in);
      const newToken = {
        accessToken: responseData.access_token,
        spotifyAuthType: SpotifyAuthType.AuthorizationCode,
        expiresAt,
        refreshToken: responseData.refresh_token,
      };
      await this.accessTokensRepository.upsert(newToken, {
        conflictPaths: { spotifyAuthType: true },
        upsertType: 'on-conflict-do-update',
      });
      return newToken;
    } else {
      Logger.error('Failed to refresh Spotify user access token');
      return null;
    }
  }
  async getOrRefreshSpotifyUserAccessToken(
    retryOnFailure?: boolean,
  ): Promise<SpotifyAccessToken | null> {
    const token = await this.accessTokensRepository.findOne({
      where: {
        spotifyAuthType: SpotifyAuthType.AuthorizationCode,
      },
    });
    if (!token) {
      Logger.error('No access token exists for the AuthorizationCode strategy');
      return;
    }
    if (
      addSeconds(new Date(), this.accessTokenExpirationOffsetSeconds) >
      token.expiresAt
    ) {
      let newToken: SpotifyAccessToken;
      let refreshFailed = false;
      try {
        newToken = await this.updateSpotifyUserAccessTokenFromCode(
          token.refreshToken,
        );
      } catch {
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
    return token;
  }
  async performApiRequest(
    route: string,
    method: 'POST' | 'GET',
    data?: any,
  ): Promise<AxiosResponse<any, any>> {
    const token = await this.getOrRefreshSpotifyUserAccessToken(true);
    return await firstValueFrom(
      this.httpService.request({
        url: this.spotifyApiBaseUrl + '/' + route,
        method,
        data,
        headers: { Authorization: 'Bearer ' + token.accessToken },
      }),
    ).catch((e: any) => {
      console.log(e);
      Logger.error(e, 'Spotify API request failed: /' + route);
      throw e;
    });
  }
}
