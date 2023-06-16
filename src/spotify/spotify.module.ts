import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotifyAccessToken } from './spotify-access-token.entity';
import { HttpModule } from '@nestjs/axios';
import { SpotifyApiService } from './spotify-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpotifyAccessToken]), HttpModule],
  providers: [SpotifyService, SpotifyApiService],
  exports: [SpotifyService, SpotifyApiService],
})
export class SpotifyModule {}
