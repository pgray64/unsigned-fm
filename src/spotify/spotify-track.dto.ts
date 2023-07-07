import { SpotifyArtistDto } from './spotify-artist.dto';

export interface SpotifyTrackDto {
  name: string;
  spotifyTrackId: string;
  artists: SpotifyArtistDto[];
  albumImageUrl: string;
  spotifyAlbumId: string;
}
