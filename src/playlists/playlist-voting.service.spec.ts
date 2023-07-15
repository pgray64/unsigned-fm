import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistVotingService } from './playlist-voting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { PlaylistSong } from './playlist-song.entity';
import { PlaylistSongVote } from './playlist-song-vote';
import { ModuleMocker } from 'jest-mock';
describe('PlaylistVotingService', () => {
  const moduleMocker = new ModuleMocker(global);
  let service: PlaylistVotingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistVotingService],
    })
      .useMocker(() => {
        return {};
      })
      .compile();

    service = module.get<PlaylistVotingService>(PlaylistVotingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getVoteDelta', () => {
    it('should return correct results', () => {
      expect(service.getVoteDelta(0, 0)).toBe(0);
      expect(service.getVoteDelta(0, 1)).toBe(1);
      expect(service.getVoteDelta(0, -1)).toBe(-1);
      expect(service.getVoteDelta(-1, 0)).toBe(1);
      expect(service.getVoteDelta(1, 0)).toBe(-1);
      expect(service.getVoteDelta(-1, 1)).toBe(2);
      expect(service.getVoteDelta(1, -1)).toBe(-2);
    });
  });
});
