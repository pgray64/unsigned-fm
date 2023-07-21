import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { SongsService } from '../songs/songs.service';
import { PlaylistSong } from './playlist-song.entity';
import { subDays, subHours } from 'date-fns';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { RankingService } from '../utils/ranking.service';
import { UsersService } from '../users/users.service';

const maxFollowersForRestrictedPlaylists = 1000;
const daysBetweenDuplicatePlaylistSubmissions = 30;
const maxDailySubmissionsPerUser = 2;
@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private spotifyApiService: SpotifyApiService,
    private songsService: SongsService,
    @InjectRepository(PlaylistSong)
    private playlistSongRepository: Repository<PlaylistSong>,
    private objectStorageService: ObjectStorageService,
    private rankingService: RankingService,
    private usersService: UsersService,
  ) {}
  async getSingle(playlistId: number) {
    if (!playlistId) {
      throw new BadRequestException();
    }
    return await this.playlistRepository.findOneBy({
      id: playlistId,
    });
  }
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

  async createOrUpdate(playlist: Playlist) {
    const spotifyData = await this.spotifyApiService.getPlaylist(
      playlist.spotifyPlaylistId,
    );

    // properties to update:
    playlist.name = spotifyData.name;
    if (spotifyData.playlistImageUrl) {
      const objectKey = this.objectStorageService.getUniqueObjectKey();
      await this.objectStorageService.uploadObjectFromUrl({
        urlToUpload: spotifyData.playlistImageUrl,
        key: objectKey,
        isPublic: true,
      });
      playlist.playlistImage = objectKey;
    }
    if (!playlist.hotScore) {
      playlist.hotScore = this.rankingService.getHotScore(0);
    }
    await this.playlistRepository.save(playlist, {});
  }
  async addSongToPlaylist(
    spotifyTrackId: string,
    playlistId: number,
    userId: number,
  ) {
    if (!playlistId || !userId) {
      throw new BadRequestException();
    }
    await this.throwIfUserCannotSubmit(userId);

    const song = await this.songsService.getOrCreate(spotifyTrackId);
    const playlist = await this.playlistRepository.findOneBy({
      id: playlistId,
    });
    if (!song || !playlist) {
      throw new BadRequestException();
    }
    if (
      playlist.isRestricted &&
      song.artists[0].followers > maxFollowersForRestrictedPlaylists
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
      hotScore: this.rankingService.getHotScore(0),
    });
    await this.playlistRepository.increment(
      { id: playlistId },
      'submissionCount',
      1,
    );
  }
  async isSongDuplicatedInPlaylist(songId: number, playlistId: number) {
    return await this.playlistSongRepository.exist({
      where: {
        playlistId,
        songId,
        createdAt: MoreThan(
          subDays(new Date(), daysBetweenDuplicatePlaylistSubmissions),
        ),
      },
    });
  }
  async listPlaylistSongs(
    playlistId: number,
    resultCount: number,
    page: number,
  ) {
    if (!playlistId) {
      throw new BadRequestException();
    }
    return await this.playlistSongRepository.find({
      where: {
        playlistId,
      },
      order: { hotScore: 'desc' },
      relations: ['song', 'song.artists'],
      take: resultCount,
      skip: resultCount * page,
    });
  }
  async throwIfUserCannotSubmit(userId: number) {
    if (!userId) {
      throw new BadRequestException(userId, 'User ID is invalid');
    }
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new BadRequestException(userId, 'User is invalid');
    }
    if (user.isBanned) {
      throw new ForbiddenException(
        userId,
        'Your account is banned from submitting',
      );
    }
    const oneDayAgo = subHours(new Date(), 24);
    if (
      (await this.playlistSongRepository.count({
        where: {
          createdAt: MoreThan(oneDayAgo),
          userId,
        },
      })) > maxDailySubmissionsPerUser
    ) {
      throw new BadRequestException(
        userId,
        'You can only submit two songs per day',
      );
    }
  }
  async listPlaylistSongsForUser(
    userId: number,
    resultCount: number,
    page: number,
  ) {
    if (!userId) {
      throw new BadRequestException();
    }
    return await this.playlistSongRepository.find({
      where: {
        userId,
      },
      order: { hotScore: 'desc' },
      relations: ['song', 'song.artists'],
      take: resultCount,
      skip: resultCount * page,
    });
  }
}
