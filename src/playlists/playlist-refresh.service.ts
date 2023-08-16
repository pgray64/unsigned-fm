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
import { In, LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlaylistRefreshLog } from './playlist-refresh-log.entity';
import { subMinutes } from 'date-fns';
import { PlaylistRefreshStatus } from './playlist-refresh-status.enum';

const maxTracksInSpotifyPlaylist = 30;
const minNetVotesForSpotifyPlaylist = 2;

@Injectable()
export class PlaylistRefreshService {
  constructor(
    private playlistService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(PlaylistSong)
    private playlistSongRepository: Repository<PlaylistSong>,
    @InjectRepository(PlaylistRefreshLog)
    private playlistRefreshLogRepository: Repository<PlaylistRefreshLog>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSpotifyRefreshCron() {
    const tenMinAgo = subMinutes(new Date(), 10);

    const inserted = await this.playlistRefreshLogRepository.save({
      status: PlaylistRefreshStatus.Pending,
    });
    const logId = inserted.id;

    // Ensure job only runs once even if multiple node processes
    if (
      (await this.playlistRefreshLogRepository.exist({
        where: {
          createdAt: MoreThan(tenMinAgo),
          status: In([PlaylistRefreshStatus.Success]),
        },
      })) ||
      (await this.playlistRefreshLogRepository.exist({
        where: {
          createdAt: MoreThan(tenMinAgo),
          status: In([PlaylistRefreshStatus.Pending]),
          id: LessThan(logId),
        },
      }))
    ) {
      await this.playlistRefreshLogRepository.update(
        { id: logId },
        { status: PlaylistRefreshStatus.Canceled },
      );
      return;
    }

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
    const playlistSongs = await this.playlistSongRepository.find({
      order: { hotScore: 'desc' },
      take: maxTracksInSpotifyPlaylist,
      relations: ['song'],
      where: {
        playlistId: playlist.id,
        netVotes: MoreThanOrEqual(minNetVotesForSpotifyPlaylist),
      },
    });
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
