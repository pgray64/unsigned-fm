import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { Playlist } from '../playlists/playlist.entity';
import { PlaylistsService } from '../playlists/playlists.service';

@Controller('internal/admin/playlists')
@UseGuards(AdminJwtAuthGuard)
export class AdminPlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}
  @Post('save')
  async save(@Body() playlist: Playlist) {
    await this.playlistsService.save(playlist);
  }
  @Post('remove')
  async remove(@Body('playlistId') playlistId: number) {
    await this.playlistsService.remove(playlistId);
  }
}
