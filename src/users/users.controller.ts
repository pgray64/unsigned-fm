import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('internal/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get('test')
  async test() {
    return 'hello world!'; // todo delete test route
  }
}
