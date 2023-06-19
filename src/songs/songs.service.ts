import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { ArtistsService } from '../artists/artists.service';
import { SpotifyTrackDto } from '../spotify/spotify-track.dto';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private spotifyApiService: SpotifyApiService,
    private artistsService: ArtistsService,
  ) {}
  async saveSong(track: SpotifyTrackDto): Promise<Song> {
    const spotifyTrackId = track.spotifyTrackId;
    const artists = track.artists;
    // This is poorly optimized, but the vast majority of songs have a single artist,
    // so it does not really matter
    for (const artist of artists) {
      await this.artistsService.createOrUpdate(artist);
    }

    // Artists cannot change song data in Spotify, so don't bother updating
    return (
      (await this.songRepository.findOne({
        where: { spotifyTrackId },
        relations: { artists: true },
      })) ??
      (await this.songRepository.save({
        spotifyTrackId: track.spotifyTrackId,
        spotifyAlbumId: track.spotifyAlbumId,
        name: track.name,
        artists,
      }))
    );
    // todo: re-encode and save track image
  }
}
