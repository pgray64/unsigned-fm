import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistSong } from './playlist-song.entity';
import { In, Repository } from 'typeorm';
import { Artist } from '../artists/artist.entity';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { PlaylistSongRecDto } from './playlist-song-rec.dto';

const maxRecommendations = 20;
@Injectable()
export class PlaylistRecommendationsService {
  constructor(
    @InjectRepository(PlaylistSong)
    private playlistSongRepository: Repository<PlaylistSong>,
    private objectStorageService: ObjectStorageService,
    private spotifyApiService: SpotifyApiService,
  ) {}
  async getRecommendations(userId: number): Promise<PlaylistSongRecDto[]> {
    if (!userId) {
      throw new BadRequestException(userId, 'User ID is invalid');
    }
    const rawRank = await this.playlistSongRepository.query(
      `with song_rank as 
                (select s."userId", count(*) as rank 
                 from playlist_song_vote as target join playlist_song_vote as s 
                 on target."playlistSongId"=s."playlistSongId" 
                  and target."userId"!=s."userId" 
                  and target."voteValue"=s."voteValue" 
                 where target."userId"=$1 
                  and target."voteValue"=1 
                 group by s."userId") 
                 select s."playlistSongId", sum(song_rank.rank) total_rank 
                 from song_rank join playlist_song_vote s 
                 on song_rank."userId"=s."userId" 
                 left join playlist_song_vote target 
                 on target."userId"=$1
                  and target."playlistSongId"=s."playlistSongId" 
                 where target."playlistSongId" is null 
                 group by s."playlistSongId" 
                 order by total_rank desc
                 limit $2`,
      [userId, maxRecommendations],
    );
    const playlistSongIds = rawRank.map((r: any) => r.playlistSongId);
    const playlistSongs = await this.playlistSongRepository.find({
      where: {
        id: In(playlistSongIds),
      },
      order: { hotScore: 'desc' },
      relations: ['song', 'song.artists'],
    });
    return playlistSongs.map((s: PlaylistSong) => {
      return {
        id: s.songId,
        name: s.song.name,
        albumImageUrl: this.objectStorageService.getFullObjectUrl(
          s.song.albumImage,
        ),
        spotifyTrackId: s.song.spotifyTrackId,
        spotifyTrackUrl: `${this.spotifyApiService.spotifyWebTrackUrl}/${s.song.spotifyTrackId}`,
        artists: s.song.artists.map((a: Artist) => {
          return a.name;
        }),
        netVotes: s.netVotes,
      };
    });
  }
}
