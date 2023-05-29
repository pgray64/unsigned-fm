import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FederatedCredentials } from './federated-credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FederatedCredentials])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
