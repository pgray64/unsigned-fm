import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { ArtistsService } from '../artists/artists.service';
import { SpotifyTrackDto } from '../spotify/spotify-track.dto';
import { SpotifyArtistDto } from '../spotify/spotify-artist.dto';
import { ObjectStorageService } from '../object-storage/object-storage.service';

@Injectable()
export class SongsService {
  private maxArtistCount = 5; // Only process the first X artists
  // private songCacheDays = 7;

  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private spotifyApiService: SpotifyApiService,
    private artistsService: ArtistsService,
    private objectStorageService: ObjectStorageService,
  ) {}
  private async save(spotifyTrack: SpotifyTrackDto): Promise<Song> {
    const spotifyTrackId = spotifyTrack.spotifyTrackId;
    if (!spotifyTrackId) {
      throw new InternalServerErrorException(
        spotifyTrack,
        'Spotify track response has no track ID',
      );
    }
    const spotifyArtistsIds = spotifyTrack.artists
      ?.slice(0, this.maxArtistCount)
      ?.map((artist: SpotifyArtistDto) => {
        return artist.spotifyArtistId;
      });
    const spotifyArtistsToUpdate =
      await this.artistsService.getArtistsNeedingUpdate(spotifyArtistsIds);

    if (spotifyArtistsToUpdate.length > 0) {
      const updatedSpotifyArtistResponse =
        await this.spotifyApiService.getArtists(spotifyArtistsToUpdate);

      // This is poorly optimized, but the vast majority of songs have a single artist,
      // and we are capping it, so it does not really matter

      for (const artist of updatedSpotifyArtistResponse) {
        await this.artistsService.createOrUpdate(artist);
      }
    }

    const song =
      (await this.songRepository.findOne({
        where: { spotifyTrackId },
        relations: ['artists'],
      })) ??
      ({
        spotifyTrackId,
      } as Song);

    song.spotifyAlbumId = spotifyTrack.spotifyAlbumId;
    song.name = spotifyTrack.name;
    song.artists = await this.artistsService.findBySpotifyIds(
      spotifyArtistsIds,
    );
    if (spotifyTrack.albumImageUrl) {
      const objectKey = this.objectStorageService.getUniqueObjectKey();
      await this.objectStorageService.uploadObjectFromUrl({
        urlToUpload: spotifyTrack.albumImageUrl,
        key: objectKey,
        isPublic: true,
      });
      song.albumImage = objectKey;
    }
    return await this.songRepository.save(song);
  }
  async getOrCreate(spotifyTrackId: string): Promise<Song> {
    if (!spotifyTrackId) {
      throw new BadRequestException();
    }
    const song = await this.songRepository.findOne({
      where: { spotifyTrackId },
      relations: ['artists'],
    });
    if (song /*&& addDays(song.updatedAt, this.songCacheDays) > new Date()*/) {
      return song;
    }
    const spotifyTrack = await this.spotifyApiService.getTrack(spotifyTrackId);
    return await this.save(spotifyTrack);
  }
}
