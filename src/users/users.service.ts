import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { FederatedCredentials } from './federated-credentials.entity';
import { AuthProviderEnum } from './auth-provider.enum';
import { UserAuthDataDto } from '../auth/user-auth-data.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FederatedCredentials)
    private federatedCredentialsRepository: Repository<FederatedCredentials>,
  ) {}
  async findOneById(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException();
    }
    return this.usersRepository.findOneBy({ id });
  }
  async remove(id: number): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    await this.usersRepository.softDelete(id);
  }
  async createOrUpdateUser(
    newUser: UserAuthDataDto,
    provider: AuthProviderEnum,
  ): Promise<User> {
    if (!newUser.email) {
      throw new BadRequestException();
    }
    const storedCreds = await this.federatedCredentialsRepository.findOneBy({
      provider: provider,
      subject: newUser.email,
    });
    if (storedCreds) {
      const updatedUser = await this.usersRepository.save({
        id: storedCreds.userId,
        username: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      });
      return updatedUser;
    } else {
      const user = await this.usersRepository.save({
        username: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      });
      await this.federatedCredentialsRepository.insert({
        userId: user.id,
        subject: newUser.email,
        provider: provider,
      });
      return user;
    }
  }
}
