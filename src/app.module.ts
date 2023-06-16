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
      entities: [User, FederatedCredentials, Admin, SpotifyAccessToken],
      synchronize: process.env.UFM_SYNC_DB === '1',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    SpotifyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
