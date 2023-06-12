import { Module } from '@nestjs/common';
import { AppService } from './app.service';
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
      entities: [User, FederatedCredentials, Admin],
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
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
