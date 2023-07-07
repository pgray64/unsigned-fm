import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { PlaylistSong } from './playlist-song.entity';
import { SpotifyModule } from '../spotify/spotify.module';
import { SongsModule } from '../songs/songs.module';
import { ArtistsModule } from '../artists/artists.module';
import { ObjectStorageModule } from '../object-storage/object-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, PlaylistSong]),
    SpotifyModule,
    SongsModule,
    ArtistsModule,
    ObjectStorageModule,
  ],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
