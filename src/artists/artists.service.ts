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
  async createOrUpdate(artist: SpotifyArtistDto): Promise<Artist> {
    const spotifyArtistId = artist.spotifyArtistId;
    const currentArtist =
      (await this.artistRepository.findOneBy({
        spotifyArtistId,
      })) ??
      ({
        spotifyArtistId,
      } as Artist);

    // Update properties that artists can change
    currentArtist.name = artist.name;
    // todo re-encode and save artist image

    return await this.artistRepository.save(currentArtist);
  }
}
