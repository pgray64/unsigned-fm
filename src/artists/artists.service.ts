import { Injectable } from '@nestjs/common';
import { SpotifyArtistDto } from '../spotify/spotify-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { subDays } from 'date-fns';

@Injectable()
export class ArtistsService {
  private readonly staleArtistDays = 7;
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  async createOrUpdate(spotifyArtist: SpotifyArtistDto): Promise<Artist> {
    const spotifyArtistId = spotifyArtist.spotifyArtistId;
    const currentArtist =
      (await this.artistRepository.findOneBy({
        spotifyArtistId,
      })) ??
      ({
        spotifyArtistId,
      } as Artist);

    // Update properties that artists can change
    currentArtist.name = spotifyArtist.name;
    currentArtist.followers = spotifyArtist.followers;
    // todo re-encode and save artist image

    return await this.artistRepository.save(currentArtist);
  }
  async getArtistsNeedingUpdate(spotifyArtistIds: string[]): Promise<string[]> {
    const upToDateArtists = await this.artistRepository.find({
      where: {
        spotifyArtistId: In(spotifyArtistIds),
        updatedAt: MoreThan(subDays(new Date(), this.staleArtistDays)),
      },
      select: { spotifyArtistId: true },
    });
    const upToDateSpotifyArtists = upToDateArtists.map((artist: Artist) => {
      return artist.spotifyArtistId;
    });
    return spotifyArtistIds.filter((artist: string) => {
      return upToDateSpotifyArtists.indexOf(artist) < 0;
    });
  }
}
