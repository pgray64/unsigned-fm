import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private spotifyApiService: SpotifyApiService,
    private artistsService: ArtistsService,
  ) {}
  async getOrSaveSong(spotifyTrackId: string): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { spotifyTrackId },
      relations: { artists: true },
    });
    if (song) {
      return song;
    }
    const track = await this.spotifyApiService.getTrack(spotifyTrackId);
    if (!track) {
      return null;
    }
    const artists = track.artists;
    // This is poorly optimized, but the vast majority of songs have a single artist,
    // so it does not really matter
    for (const artist of artists) {
      await this.artistsService.createIfNotExists(
        artist.spotifyArtistId,
        artist,
      );
    }

    await this.songRepository.insert({
      spotifyTrackId: track.spotifyTrackId,
      spotifyAlbumId: track.spotifyAlbumId,
      name: track.name,
      artists,
    });
    // todo: re-encode and save track image
  }
}
