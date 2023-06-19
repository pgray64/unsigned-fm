import { Test, TestingModule } from '@nestjs/testing';
import { AdminPlaylistsController } from './admin-playlists.controller';

describe('AdminPlaylistsController', () => {
  let controller: AdminPlaylistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPlaylistsController],
    }).compile();

    controller = module.get<AdminPlaylistsController>(AdminPlaylistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
