import { Injectable } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyTrackDto } from './spotify-track.dto';
import { SpotifyUserDto } from './spotify-user.dto';
import { SpotifyPlaylistDto } from './spotify-playlist.dto';

@Injectable()
export class SpotifyApiService {
  constructor(private spotifyService: SpotifyService) {}

  readonly spotifyWebPlaylistUrl = 'https://open.spotify.com/playlist';

  async getUserProfile(): Promise<SpotifyUserDto> {
    const response = await this.spotifyService.performApiRequest('me', 'GET');
    return {
      displayName: response.data?.display_name,
      email: response.data?.email,
      imageUrl:
        response.data?.images?.length > 0
          ? response.data?.images[0].url
          : undefined,
      spotifyUrl: response.data?.external_urls?.spotify,
    };
  }

  async getTrack(
    spotifyTrackId: string,
    market = 'US',
  ): Promise<SpotifyTrackDto> {
    const response = await this.spotifyService.performApiRequest(
      'tracks/' + spotifyTrackId,
      'GET',
      { market },
    );
    return {
      spotifyTrackId: response.data.id,
      name: response.data.name,
      albumImage:
        response.data.album?.images?.length > 0
          ? response.data?.album?.images[0].url
          : undefined,
      spotifyAlbumId: response.data.album?.id,
      artists: response.data.artists?.map((artist: any) => {
        return {
          spotifyArtistId: artist.id,
          name: artist.name,
          artistImage:
            artist.images?.length > 0 ? artist.images[0].url : undefined,
        };
      }),
    };
  }
  async getPlaylist(spotifyPlaylistId: string): Promise<SpotifyPlaylistDto> {
    const response = await this.spotifyService.performApiRequest(
      'playlists/' + spotifyPlaylistId,
      'GET',
    );
    return {
      spotifyPlaylistId: response.data.id,
      name: response.data.name,
      playlistImage:
        response.data.images?.length > 0
          ? response.data.image[0].url
          : undefined,
    };
  }
}
