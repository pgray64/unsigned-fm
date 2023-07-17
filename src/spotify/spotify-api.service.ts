import { Injectable } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyTrackDto } from './spotify-track.dto';
import { SpotifyUserDto } from './spotify-user.dto';
import { SpotifyPlaylistDto } from './spotify-playlist.dto';
import { SpotifyArtistDto } from './spotify-artist.dto';
import { SpotifyPlaylistItemDto } from './spotify-playlist-item.dto';

@Injectable()
export class SpotifyApiService {
  constructor(private spotifyService: SpotifyService) {}

  readonly spotifyWebPlaylistUrl = 'https://open.spotify.com/playlist';
  readonly spotifyWebTrackUrl = 'https://open.spotify.com/track';

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
      undefined,
      { market },
    );
    return {
      spotifyTrackId: response.data.id,
      name: response.data.name,
      albumImageUrl:
        response.data.album?.images?.length > 0
          ? response.data?.album?.images[0].url
          : undefined,
      spotifyAlbumId: response.data.album?.id,
      artists: response.data.artists?.map((artist: any): SpotifyArtistDto => {
        return {
          // note spotify returns a simplified artist object here
          spotifyArtistId: artist.id,
          name: artist.name,
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
      playlistImageUrl:
        response.data.images?.length > 0
          ? response.data.images[0].url
          : undefined,
    };
  }

  async getPlaylistTracks(
    spotifyPlaylistId: string,
    limit: number,
    offset: number,
  ): Promise<SpotifyPlaylistItemDto[]> {
    const response = await this.spotifyService.performApiRequest(
      'playlists/' + spotifyPlaylistId + '/tracks',
      'GET',
      undefined,
      { fields: 'items(track(id))', limit, offset },
    );
    return response.data.items
      ?.filter((item: any) => item.track?.id)
      .map((item: any) => {
        return {
          trackId: item.track?.id,
        };
      });
  }
  async updatePlaylistTracks(
    spotifyPlaylistId: string,
    spotifyTrackIds: string[],
  ) {
    const trackUris = spotifyTrackIds.map(
      (track: string) => `spotify:track:${track}`,
    );
    await this.spotifyService.performApiRequest(
      'playlists/' + spotifyPlaylistId + '/tracks',
      'PUT',
      { uris: trackUris },
      undefined,
    );
  }

  async getArtists(spotifyArtistIds: string[]): Promise<SpotifyArtistDto[]> {
    const joinedIds = spotifyArtistIds.join(',');
    const response = await this.spotifyService.performApiRequest(
      'artists',
      'GET',
      undefined,
      { ids: joinedIds },
    );
    return response.data.artists?.map((artist: any) => {
      return {
        spotifyArtistId: artist.id,
        name: artist.name,
        artistImageUrl:
          artist.images?.length > 0 ? artist.images[0].url : undefined,
        followers: artist.followers?.total ?? 0,
      } as SpotifyArtistDto;
    });
  }
}
