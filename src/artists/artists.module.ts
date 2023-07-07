import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ObjectStorageModule } from '../object-storage/object-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), ObjectStorageModule],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
