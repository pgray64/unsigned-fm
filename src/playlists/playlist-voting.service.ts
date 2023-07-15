import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistSong } from './playlist-song.entity';
import { In, Repository } from 'typeorm';
import { PlaylistSongVote } from './playlist-song-vote';
import { RankingService } from '../utils/ranking.service';

@Injectable()
export class PlaylistVotingService {
  constructor(
    @InjectRepository(PlaylistSong)
    private playlistSongRepository: Repository<PlaylistSong>,
    @InjectRepository(PlaylistSongVote)
    private playlistSongVoteRepository: Repository<PlaylistSongVote>,
    private rankingService: RankingService,
  ) {}
  async createOrUpdateVote(
    playlistSongId: number,
    userId: number,
    newVoteValue: number,
  ) {
    if (!playlistSongId || newVoteValue > 1 || newVoteValue < -1) {
      throw new BadRequestException();
    }
    const currentVote = await this.playlistSongVoteRepository.findOneBy({
      playlistSongId,
      userId,
    });

    // a first-time upvote increases the hot-score, but we want to do it after updating votes table
    // in case of an error
    const needsHotScoreUpdate = !currentVote && newVoteValue === 1;
    if (currentVote && currentVote.id) {
      await this.playlistSongVoteRepository.update(
        {
          id: currentVote.id,
        },
        {
          voteValue: newVoteValue,
        },
      );
    } else {
      await this.playlistSongVoteRepository.insert({
        playlistSongId,
        userId,
        voteValue: newVoteValue,
      });
    }
    const voteDelta = this.getVoteDelta(
      currentVote?.voteValue ?? 0,
      newVoteValue,
    );
    if (voteDelta !== 0) {
      await this.playlistSongRepository.increment(
        {
          id: playlistSongId,
        },
        'netVotes',
        voteDelta,
      );
    }
    if (needsHotScoreUpdate) {
      const currentPlaylistSong = await this.playlistSongRepository.findOneBy({
        id: playlistSongId,
      });
      if (!currentPlaylistSong) {
        throw new InternalServerErrorException(
          playlistSongId,
          'Playlist song entry does not exist',
        );
      }
      const newHotScore = this.rankingService.getHotScore(
        currentPlaylistSong.hotScore,
      );

      await this.playlistSongRepository.update(
        { id: playlistSongId },
        {
          hotScore: newHotScore,
        },
      );
    }
  }
  getVoteDelta(currentVal: number, newVal: number): number {
    return newVal - currentVal;
  }

  async getUserVotesForPlaylistSongs(
    playlistSongIds: number[],
    userId: number,
  ): Promise<Record<number, number>> {
    if (!userId || !playlistSongIds || playlistSongIds.length < 1) {
      return {};
    }
    const rawResult = await this.playlistSongVoteRepository.findBy({
      userId,
      playlistSongId: In(playlistSongIds),
    });
    const result = {} as Record<number, number>;
    for (const row of rawResult) {
      result[row.playlistSongId] = row.voteValue;
    }
    return result;
  }
}
