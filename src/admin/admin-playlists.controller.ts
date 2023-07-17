import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { Playlist } from '../playlists/playlist.entity';
import { PlaylistsService } from '../playlists/playlists.service';
import { PlaylistSearchResultDto } from '../playlists/playlist-search-result.dto';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { PlaylistRefreshService } from '../playlists/playlist-refresh.service';

@Controller('internal/admin/playlists')
@UseGuards(AdminJwtAuthGuard)
export class AdminPlaylistsController {
  constructor(
    private playlistsService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
    private objectStorageService: ObjectStorageService,
    private playlistRefreshService: PlaylistRefreshService,
  ) {}
  @Post('save')
  async save(@Body() playlist: Playlist) {
    await this.playlistsService.createOrUpdate(playlist);
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
          playlistImageUrl: this.objectStorageService.getFullObjectUrl(
            playlist.playlistImage,
          ),
        };
      },
    );
  }
  @Post('refresh-spotify-playlists')
  async refreshSpotifyPlaylists() {
    await this.playlistRefreshService.refreshSpotifyPlaylists();
  }
  @Post('refresh-spotify-playlist')
  async refreshSpotifyPlaylist(@Body('playlistId') playlistId: number) {
    const playlist = await this.playlistsService.getSingle(playlistId);
    await this.playlistRefreshService.refreshSpotifyPlaylist(playlist);
  }
}
