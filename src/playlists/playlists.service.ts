import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}
  async listPlaylists(): Promise<Playlist[]> {
    const playlists = await this.playlistRepository.find({
      order: { hotScore: 'desc' },
    });
    return playlists;
  }

  /* This is dangerous and should only be used for admins */
  async saveAll(playlists: Playlist[]) {
    await this.playlistRepository.save(playlists);
  }
  async remove(playlistId: number) {
    await this.playlistRepository.softDelete({ id: playlistId });
  }
}
