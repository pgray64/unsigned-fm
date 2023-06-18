import { Injectable } from '@nestjs/common';
import { SpotifyArtistDto } from '../spotify/spotify-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  async createIfNotExists(
    spotifyArtistId: string,
    artist: SpotifyArtistDto,
  ): Promise<Artist> {
    const currentArtist = await this.artistRepository.findOneBy({
      spotifyArtistId,
    });
    if (currentArtist) {
      return currentArtist;
    } else {
      // todo re-encode and save artist image
      return await this.artistRepository.save({
        spotifyArtistId: spotifyArtistId,
        name: artist.name,
      });
    }
  }
}
