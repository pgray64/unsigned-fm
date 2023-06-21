import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { SongsService } from '../songs/songs.service';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private spotifyApiService: SpotifyApiService,
    private songsService: SongsService,
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
  async addSongToPlaylist(spotifyTrackId: string, playlistId: number) {
    const song = await this.songsService.getOrCreate(spotifyTrackId);
    const playlist = await this.playlistRepository.findOneBy({
      id: playlistId,
    });
    if (!song || !playlist) {
      throw new BadRequestException();
    }
    if (playlist.isRestricted) {
      // todo check if artist has less than 1k Followers, all or any?
    }
  }
}
