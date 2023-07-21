import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { UsersService } from '../users/users.service';

const searchUserResultCount = 10;
@Controller('internal/admin/users')
@UseGuards(AdminJwtAuthGuard)
export class AdminUsersController {
  constructor(private usersService: UsersService) {}
  @Get('search')
  async SearchUsers(
    @Query('username') username: string,
    @Query('page') page: number,
  ) {
    return await this.usersService.searchUsers(
      username,
      searchUserResultCount,
      page,
    );
  }
  @Post('set-ban-status')
  async SetBanStatus(
    @Body('userId') userId: number,
    @Body('isBanned') isBanned: boolean,
  ) {
    await this.usersService.setUserBanStatus(userId, isBanned);
  }
}
