export interface PlaylistSearchResultDto {
  id: number;
  name: string;
  isRestricted: boolean;
  spotifyPlaylistId: string;
  spotifyPlaylistUrl: string;
  deletedAt?: Date;
  submissionCount: number;
  playlistImageUrl: string | null;
}
