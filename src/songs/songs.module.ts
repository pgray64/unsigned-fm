import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { SpotifyModule } from '../spotify/spotify.module';
import { ArtistsModule } from '../artists/artists.module';
import { ObjectStorageModule } from '../object-storage/object-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    SpotifyModule,
    ArtistsModule,
    ObjectStorageModule,
  ],
  providers: [SongsService],
  controllers: [SongsController],
  exports: [SongsService],
})
export class SongsModule {}
