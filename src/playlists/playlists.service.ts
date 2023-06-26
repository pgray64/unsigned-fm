import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { SongsService } from '../songs/songs.service';
import { PlaylistSong } from './playlist-song.entity';
import { subDays } from 'date-fns';

@Injectable()
export class PlaylistsService {
  private readonly maxFollowersForRestrictedPlaylists = 1000;
  private readonly daysBetweenDuplicatePlaylistSubmissions = 30;
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private spotifyApiService: SpotifyApiService,
    private songsService: SongsService,
    @InjectRepository(PlaylistSong)
    private playlistSongRepository: Repository<PlaylistSong>,
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
  async addSongToPlaylist(
    spotifyTrackId: string,
    playlistId: number,
    userId: number,
  ) {
    const song = await this.songsService.getOrCreate(spotifyTrackId);
    const playlist = await this.playlistRepository.findOneBy({
      id: playlistId,
    });
    if (!song || !playlist) {
      throw new BadRequestException();
    }
    if (
      playlist.isRestricted &&
      song.artists[0].followers > this.maxFollowersForRestrictedPlaylists
    ) {
      throw new BadRequestException(
        spotifyTrackId,
        'This playlist is for artists with less than 1,000 followers',
      );
    }
    if (await this.isSongDuplicatedInPlaylist(song.id, playlistId)) {
      throw new BadRequestException(
        spotifyTrackId,
        'Wait 30 days to resubmit the same song to the same playlist',
      );
    }
    await this.playlistSongRepository.insert({
      songId: song.id,
      playlistId,
      userId,
    });
  }
  async isSongDuplicatedInPlaylist(songId: number, playlistId: number) {
    return await this.playlistSongRepository.exist({
      where: {
        playlistId,
        songId,
        createdAt: MoreThan(
          subDays(new Date(), this.daysBetweenDuplicatePlaylistSubmissions),
        ),
      },
    });
  }
}
