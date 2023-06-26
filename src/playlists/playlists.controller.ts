import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';
import { PlaylistSearchResultDto } from './playlist-search-result.dto';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayloadDto } from '../auth/jwt-payload.dto';

@Controller('internal/playlists')
export class PlaylistsController {
  constructor(
    private playlistsService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
  ) {}

  @Get('all')
  async getAll(): Promise<PlaylistSearchResultDto[]> {
    return (await this.playlistsService.getAll(false)).map(
      (playlist: Playlist) => {
        return {
          id: playlist.id,
          name: playlist.name,
          isRestricted: playlist.isRestricted,
          spotifyPlaylistId: playlist.spotifyPlaylistId,
          spotifyPlaylistUrl: `${this.spotifyApiService.spotifyWebPlaylistUrl}/${playlist.spotifyPlaylistId}`,
        };
      },
    );
  }

  @Post('add-song')
  @UseGuards(JwtAuthGuard)
  async addSong(
    @Body('trackId') trackId: string,
    @Body('playlistId') playlistId: number,
    @Req() request: Request,
  ) {
    if (!trackId || !playlistId) {
      throw new BadRequestException();
    }
    const userJwt = request.user as JwtPayloadDto;

    await this.playlistsService.addSongToPlaylist(
      trackId,
      playlistId,
      userJwt.userId,
    );
  }
}
