import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('internal/songs')
@UseGuards(JwtAuthGuard)
export class SongsController {}
