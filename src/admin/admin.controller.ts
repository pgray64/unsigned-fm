import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';

@Controller('internal/admin')
@UseGuards(AdminJwtAuthGuard)
export class AdminController {
  @Get('test')
  GetTest() {
    return 'this worked';
  }
}
