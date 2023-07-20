import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';
import { PlaylistSong } from './playlist-song.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlaylistRefreshLog } from './playlist-refresh-log.entity';
import { subHours } from 'date-fns';
import { PlaylistRefreshStatus } from './playlist-refresh-status.enum';

const maxTracksInSpotifyPlaylist = 30;

@Injectable()
export class PlaylistRefreshService {
  constructor(
    private playlistService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(PlaylistRefreshLog)
    private playlistRefreshLogRepository: Repository<PlaylistRefreshLog>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSpotifyRefreshCron() {
    // Ensure job only runs once even if multiple node processes
    const oneHourAgo = subHours(new Date(), 1);
    if (
      await this.playlistRefreshLogRepository.exist({
        where: {
          createdAt: LessThan(oneHourAgo),
          status: In([
            PlaylistRefreshStatus.Pending,
            PlaylistRefreshStatus.Success,
          ]),
        },
      })
    ) {
      return;
    }
    const inserted = await this.playlistRefreshLogRepository.save({
      status: PlaylistRefreshStatus.Pending,
    });
    const logId = inserted.id;
    let newStatus = PlaylistRefreshStatus.Error;
    try {
      await this.refreshSpotifyPlaylists();
      newStatus = PlaylistRefreshStatus.Success;
    } catch (e) {
      Logger.error(e, 'Failed to refresh playlists on Spotify: ');
    }
    await this.playlistRefreshLogRepository.update(
      { id: logId },
      { status: newStatus },
    );
  }

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
