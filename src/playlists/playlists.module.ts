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
import { UtilsModule } from '../utils/utils.module';
import { PlaylistSongVote } from './playlist-song-vote';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, PlaylistSong, PlaylistSongVote]),
    SpotifyModule,
    SongsModule,
    ArtistsModule,
    ObjectStorageModule,
    UtilsModule,
  ],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
