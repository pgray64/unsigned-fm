import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private spotifyApiService: SpotifyApiService,
  ) {}
  async getAll(withDeleted: boolean): Promise<Playlist[]> {
    const playlists = await this.playlistRepository.find({
      order: { hotScore: 'desc' },
      withDeleted,
    });
    return playlists;
  }

  async remove(playlistId: number) {
    await this.playlistRepository.softDelete({ id: playlistId });
  }

  async save(playlist: Playlist) {
    const spotifyData = await this.spotifyApiService.getPlaylist(
      playlist.spotifyPlaylistId,
    );
    playlist.name = spotifyData.name;
    // todo update image
    await this.playlistRepository.save(playlist, {});
  }
}
