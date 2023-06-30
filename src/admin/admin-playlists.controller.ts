import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { Playlist } from '../playlists/playlist.entity';
import { PlaylistsService } from '../playlists/playlists.service';
import { PlaylistSearchResultDto } from '../playlists/playlist-search-result.dto';
import { SpotifyApiService } from '../spotify/spotify-api.service';

@Controller('internal/admin/playlists')
@UseGuards(AdminJwtAuthGuard)
export class AdminPlaylistsController {
  constructor(
    private playlistsService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
  ) {}
  @Post('save')
  async save(@Body() playlist: Playlist) {
    await this.playlistsService.save(playlist);
  }
  @Post('remove')
  async remove(@Body('playlistId') playlistId: number) {
    await this.playlistsService.remove(playlistId);
  }
  @Get('all')
  async getPlaylists(): Promise<PlaylistSearchResultDto[]> {
    return (await this.playlistsService.getAll(true)).map(
      (playlist: Playlist) => {
        return {
          id: playlist.id,
          name: playlist.name,
          isRestricted: playlist.isRestricted,
          spotifyPlaylistId: playlist.spotifyPlaylistId,
          spotifyPlaylistUrl: `${this.spotifyApiService.spotifyWebPlaylistUrl}/${playlist.spotifyPlaylistId}`,
          deletedAt: playlist.deletedAt,
          submissionCount: playlist.submissionCount,
        };
      },
    );
  }
}
