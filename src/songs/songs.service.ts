import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { ArtistsService } from '../artists/artists.service';
import { SpotifyTrackDto } from '../spotify/spotify-track.dto';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class SongsService {
  private maxArtistCount = 3; // Only process the first X artists
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private spotifyApiService: SpotifyApiService,
    private artistsService: ArtistsService,
  ) {}
  async saveSong(spotifyTrack: SpotifyTrackDto): Promise<Song> {
    const spotifyTrackId = spotifyTrack.spotifyTrackId;
    const spotifyArtists = spotifyTrack.artists?.slice(0, this.maxArtistCount);
    // This is poorly optimized, but the vast majority of songs have a single artist,
    // and we are capping it, so it does not really matter
    const artistList = [] as Artist[];
    for (const artist of spotifyArtists) {
      artistList.unshift(await this.artistsService.createOrUpdate(artist));
    }

    const song =
      (await this.songRepository.findOne({
        where: { spotifyTrackId },
        relations: { artists: true },
      })) ??
      ({
        spotifyTrackId,
      } as Song);

    song.spotifyAlbumId = spotifyTrack.spotifyAlbumId;
    song.name = spotifyTrack.name;
    song.artists = artistList;
    return await this.songRepository.save(song);

    // todo: re-encode and save track image
  }
}
