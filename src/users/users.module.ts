import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FederatedCredentials } from './federated-credentials.entity';
import { UsersController } from './users.controller';
import { AdminUserService } from './admin-user.service';
import { Admin } from './admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FederatedCredentials, Admin])],
  providers: [UsersService, AdminUserService],
  exports: [UsersService, AdminUserService],
  controllers: [UsersController],
})
export class UsersModule {}
