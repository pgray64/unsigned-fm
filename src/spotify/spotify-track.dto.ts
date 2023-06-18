import { SpotifyArtistDto } from './spotify-artist.dto';

export interface SpotifyTrackDto {
  name: string;
  spotifyTrackId: string;
  artists: SpotifyArtistDto[];
  albumImage: string;
  spotifyAlbumId: string;
}
