import { PlaylistSearchResultDto } from './playlist-search-result.dto';

export interface PlaylistSongResultDto {
  totalCount: number;
  perPage: number;
  playlist?: PlaylistSearchResultDto;
  songs: {
    id: number;
    songId: number;
    name: string;
    spotifyTrackId: string;
    spotifyTrackUrl: string;
    albumImageUrl: string;
    artists: string[];
    netVotes: number;
    userVoteValue?: number;
    playlist?: PlaylistSearchResultDto;
  }[];
}
