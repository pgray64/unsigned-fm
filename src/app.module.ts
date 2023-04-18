import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
      entities: [],
      synchronize: false,
    }),
    ConfigModule.forRoot({ envFilePath: ['.local.env', '.env'] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
