import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';
import { PlaylistSearchResultDto } from './playlist-search-result.dto';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayloadDto } from '../auth/jwt-payload.dto';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { PlaylistSongResultDto } from './playlist-song-result.dto';
import { PlaylistSong } from './playlist-song.entity';
import { Artist } from '../artists/artist.entity';
import { PlaylistVotingService } from './playlist-voting.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

const playlistSongResultCount = 10;
@Controller('internal/playlists')
export class PlaylistsController {
  constructor(
    private playlistsService: PlaylistsService,
    private spotifyApiService: SpotifyApiService,
    private objectStorageService: ObjectStorageService,
    private playlistVotingService: PlaylistVotingService,
  ) {}

  @Get('all')
  async getAll(): Promise<PlaylistSearchResultDto[]> {
    return (await this.playlistsService.getAll(false)).map(
      (playlist: Playlist) => {
        return {
          id: playlist.id,
          name: playlist.name,
          isRestricted: playlist.isRestricted,
          spotifyPlaylistId: playlist.spotifyPlaylistId,
          spotifyPlaylistUrl: `${this.spotifyApiService.spotifyWebPlaylistUrl}/${playlist.spotifyPlaylistId}`,
          submissionCount: playlist.submissionCount,
          playlistImageUrl: this.objectStorageService.getFullObjectUrl(
            playlist.playlistImage,
          ),
        };
      },
    );
  }

  @Post('add-song')
  @UseGuards(JwtAuthGuard)
  async addSong(
    @Body('trackId') trackId: string,
    @Body('playlistId') playlistId: number,
    @Req() request: Request,
  ) {
    if (!trackId || !playlistId) {
      throw new BadRequestException();
    }
    const userJwt = request.user as JwtPayloadDto;

    await this.playlistsService.addSongToPlaylist(
      trackId,
      playlistId,
      userJwt.userId,
    );
  }

  @Get('playlist-songs')
  @UseGuards(OptionalJwtAuthGuard)
  async getPlaylistSongs(
    @Query('playlistId') playlistId: number,
    @Query('page') page: number,
    @Req() request: Request,
  ): Promise<PlaylistSongResultDto> {
    if (!playlistId) {
      throw new BadRequestException();
    }
    const playlist = await this.playlistsService.getSingle(playlistId);
    if (!playlist) {
      throw new NotFoundException(playlistId, 'Playlist not found');
    }

    const songs = await this.playlistsService.listPlaylistSongs(
      playlistId,
      playlistSongResultCount,
      page,
    );
    const userId = (request.user as JwtPayloadDto)?.userId;
    let votesByPlaylistSongId = {} as Record<number, number>;
    if (userId && userId > 0) {
      votesByPlaylistSongId =
        await this.playlistVotingService.getUserVotesForPlaylistSongs(
          songs.map((x) => x.id),
          userId,
        );
    }
    return {
      totalCount: playlist.submissionCount,
      perPage: playlistSongResultCount,
      playlist: {
        id: playlist.id,
        name: playlist.name,
        isRestricted: playlist.isRestricted,
        spotifyPlaylistId: playlist.spotifyPlaylistId,
        spotifyPlaylistUrl: `${this.spotifyApiService.spotifyWebPlaylistUrl}/${playlist.spotifyPlaylistId}`,
        submissionCount: playlist.submissionCount,
        playlistImageUrl: this.objectStorageService.getFullObjectUrl(
          playlist.playlistImage,
        ),
      },
      songs: songs.map((s: PlaylistSong) => {
        return {
          id: s.id,
          songId: s.songId,
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
          userVoteValue: votesByPlaylistSongId[s.id] ?? 0,
        };
      }),
    };
  }
  @Post('playlist-song-vote')
  @UseGuards(JwtAuthGuard)
  async updatePlaylistSongVote(
    @Body('playlistSongId') playlistSongId: number,
    @Body('voteValue') voteValue: number,
    @Req() request: Request,
  ) {
    if (!playlistSongId) {
      throw new BadRequestException();
    }
    const userJwt = request.user as JwtPayloadDto;
    await this.playlistVotingService.createOrUpdateVote(
      playlistSongId,
      userJwt.userId,
      voteValue,
    );
  }
}
