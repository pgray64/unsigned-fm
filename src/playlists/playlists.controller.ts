import { Controller, Get } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';
import { PlaylistSearchResultDto } from './playlist-search-result.dto';
import { SpotifyApiService } from '../spotify/spotify-api.service';

@Controller('internal/playlists')
export class PlaylistsController {
  constructor(
    private playlistsService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
  ) {}
  @Get('all')
  async getPlaylists(): Promise<PlaylistSearchResultDto[]> {
    return (await this.playlistsService.getAll()).map((playlist: Playlist) => {
      return {
        id: playlist.id,
        name: playlist.name,
        isRestricted: playlist.isRestricted,
        spotifyPlaylistId: playlist.spotifyPlaylistId,
        spotifyPlaylistUrl: `${this.spotifyApiService.spotifyWebPlaylistUrl}/${playlist.spotifyPlaylistId}`,
      };
    });
  }
}
