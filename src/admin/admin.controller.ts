import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { Request, Response } from 'express';
import { SpotifyService } from '../spotify/spotify.service';
import { SpotifyApiService } from '../spotify/spotify-api.service';

@Controller('internal/admin')
@UseGuards(AdminJwtAuthGuard)
export class AdminController {
  constructor(
    private spotifyService: SpotifyService,
    private spotifyApiService: SpotifyApiService,
  ) {}
  @Get('spotify/auth-redirect')
  async spotifyAuthRedirect(
    @Query('code') code: string,
    @Res() response: Response,
  ) {
    if (!code) {
      return response.redirect('/admin/spotify-auth/error');
    }
    const token =
      await this.spotifyService.updateSpotifyUserAccessTokenFromCode(
        code,
        false,
      );
    if (token) {
      return response.redirect('/admin/spotify-auth/success');
    }
    return response.redirect('/admin/spotify-auth/error');
  }

  @Get('spotify/authorization-url')
  async getAuthorizationUrl() {
    return { url: this.spotifyService.getUserAuthorizationUrl() };
  }

  @Get('spotify/user-info')
  async getUserInfo() {
    return await this.spotifyApiService.getUserProfile();
  }
}
