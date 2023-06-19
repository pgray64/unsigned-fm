import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { Playlist } from '../playlists/playlist.entity';
import { PlaylistsService } from '../playlists/playlists.service';

@Controller('internal/admin/playlists')
@UseGuards(AdminJwtAuthGuard)
export class AdminPlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}
  @Post('save-all')
  async saveAll(@Body('playlists') playlists: Playlist[]) {
    await this.playlistsService.saveAll(playlists);
  }
  @Post('remove')
  async remove(@Body('playlistId') playlistId: number) {
    await this.playlistsService.remove(playlistId);
  }
}
