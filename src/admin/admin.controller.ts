import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  @Post('spotify/update-access-token')
  async spotifyUpdateAccessToken(@Body('code') code: string) {
    if (!code) {
      throw new BadRequestException('auth code', 'Auth code is missing');
    }
    const token =
      await this.spotifyService.updateSpotifyUserAccessTokenFromCode(
        code,
        false,
      );
    if (!token) {
      throw new InternalServerErrorException(
        'auth code redacted',
        'Failed to update access token from code',
      );
    }
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
