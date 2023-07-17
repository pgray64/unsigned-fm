import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';
import { PlaylistSong } from './playlist-song.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const maxTracksInSpotifyPlaylist = 30;

@Injectable()
export class PlaylistRefreshService {
  constructor(
    private playlistService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}
  async refreshSpotifyPlaylists() {
    const playlists = await this.playlistService.getAll(false);
    for (const playlist of playlists) {
      await this.refreshSpotifyPlaylist(playlist);
    }
  }
  async refreshSpotifyPlaylist(playlist: Playlist) {
    if (!playlist?.id) {
      throw new InternalServerErrorException(
        playlist?.id,
        'Playlist ID is required',
      );
    }
    const playlistSongs = await this.playlistService.listPlaylistSongs(
      playlist.id,
      maxTracksInSpotifyPlaylist,
      0,
    );
    const dbTrackIds = playlistSongs.map(
      (playlistSong: PlaylistSong) => playlistSong.song.spotifyTrackId,
    );
    await this.spotifyApiService.updatePlaylistTracks(
      playlist.spotifyPlaylistId,
      dbTrackIds,
    );
    await this.playlistRepository.update(
      { id: playlist.id },
      { spotifyPlaylistUpdatedAt: new Date() },
    );
  }
}
