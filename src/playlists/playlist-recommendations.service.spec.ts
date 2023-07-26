import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistRecommendationsService } from './playlist-recommendations.service';

describe('PlaylistRecommendationsService', () => {
  let service: PlaylistRecommendationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistRecommendationsService],
    }).compile();

    service = module.get<PlaylistRecommendationsService>(PlaylistRecommendationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
