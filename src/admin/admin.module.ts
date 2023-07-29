import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminUserService } from '../users/admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../users/admin.entity';
import { SpotifyModule } from '../spotify/spotify.module';
import { AdminPlaylistsController } from './admin-playlists.controller';
import { PlaylistsModule } from '../playlists/playlists.module';
import { ObjectStorageModule } from '../object-storage/object-storage.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SpotifyModule, PlaylistsModule, ObjectStorageModule, UsersModule],
  controllers: [AdminController, AdminPlaylistsController],
  providers: [],
  exports: [],
})
export class AdminModule {}
