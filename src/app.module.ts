import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { FederatedCredentials } from './users/federated-credentials.entity';
import { Admin } from './admin/admin.entity';
import { AdminModule } from './admin/admin.module';
import { SpotifyModule } from './spotify/spotify.module';
import { SpotifyAccessToken } from './spotify/spotify-access-token.entity';
import { SongsModule } from './songs/songs.module';
import { ArtistsModule } from './artists/artists.module';
import { Song } from './songs/song.entity';
import { Artist } from './artists/artist.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { Playlist } from './playlists/playlist.entity';
import { PlaylistSong } from './playlists/playlist-song.entity';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { UtilsModule } from './utils/utils.module';
import { PlaylistSongVote } from './playlists/playlist-song-vote.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { PlaylistRefreshLog } from './playlists/playlist-refresh-log.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'unsigned-fm-client/dist'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.UFM_PG_USER, // These are only loaded from OS env variables, not env files
      password: process.env.UFM_PG_PASS,
      database: process.env.UFM_PG_DB,
      entities: [
        User,
        FederatedCredentials,
        Admin,
        SpotifyAccessToken,
        Song,
        Artist,
        Playlist,
        PlaylistSong,
        PlaylistSongVote,
        PlaylistRefreshLog,
      ],
      synchronize: process.env.UFM_SYNC_DB === '1',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    AdminModule,
    SpotifyModule,
    SongsModule,
    ArtistsModule,
    PlaylistsModule,
    ObjectStorageModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
