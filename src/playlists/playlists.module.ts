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
import { PlaylistSongVote } from './playlist-song-vote.entity';
import { PlaylistVotingService } from './playlist-voting.service';
import { PlaylistRefreshService } from './playlist-refresh.service';
import { PlaylistRefreshLog } from './playlist-refresh-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Playlist,
      PlaylistSong,
      PlaylistSongVote,
      PlaylistRefreshLog,
    ]),
    SpotifyModule,
    SongsModule,
    ArtistsModule,
    ObjectStorageModule,
    UtilsModule,
  ],
  providers: [PlaylistsService, PlaylistVotingService, PlaylistRefreshService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService, PlaylistRefreshService],
})
export class PlaylistsModule {}
