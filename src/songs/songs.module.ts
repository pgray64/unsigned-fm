import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { SpotifyModule } from '../spotify/spotify.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [TypeOrmModule.forFeature([Song]), SpotifyModule, ArtistsModule],
  providers: [SongsService],
  controllers: [SongsController],
})
export class SongsModule {}
