import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistRefreshService } from './playlist-refresh.service';

describe('PlaylistRefreshService', () => {
  let service: PlaylistRefreshService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistRefreshService],
    }).compile();

    service = module.get<PlaylistRefreshService>(PlaylistRefreshService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
