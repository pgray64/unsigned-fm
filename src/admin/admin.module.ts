import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { SpotifyModule } from '../spotify/spotify.module';
import { AdminPlaylistsController } from './admin-playlists.controller';
import { PlaylistsModule } from '../playlists/playlists.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), SpotifyModule, PlaylistsModule],
  controllers: [AdminController, AdminPlaylistsController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
