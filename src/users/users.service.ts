import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ILike, Repository } from 'typeorm';
import { FederatedCredentials } from './federated-credentials.entity';
import { AuthProviderEnum } from './auth-provider.enum';
import { UserAuthDataDto } from '../auth/user-auth-data.dto';
import { UserSearchResultDto } from './user-search-result.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FederatedCredentials)
    private federatedCredentialsRepository: Repository<FederatedCredentials>,
  ) {}
  async findOneById(id: number, withDeleted = false): Promise<User> {
    if (!id) {
      throw new BadRequestException();
    }
    return this.usersRepository.findOne({ where: { id }, withDeleted });
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
      // user exists
      await this.usersRepository.update(
        { id: storedCreds.userId },
        {
          username: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      );
      return await this.findOneById(storedCreds.userId, true);
    } else {
      // creating a new user
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

  async searchUsers(
    username: string,
    resultCount: number,
    page: number,
  ): Promise<UserSearchResultDto> {
    const result = await this.usersRepository.findAndCount({
      where: {
        username: ILike(`%${username}%`), // this is safe from sql injection
      },
      take: resultCount,
      skip: resultCount * page,
      order: { username: 'asc' },
      withDeleted: true,
    });
    return {
      users: result[0].map((user: User) => {
        return {
          id: user.id,
          isBanned: user.isBanned,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          deletedAt: user.deletedAt,
        };
      }),
      totalCount: result[1],
      perPage: resultCount,
    };
  }
  async setUserBanStatus(userId: number, isBanned: boolean) {
    if (!userId) {
      throw new BadRequestException(undefined, 'User ID is required');
    }
    await this.usersRepository.update(
      { id: userId },
      {
        isBanned,
      },
    );
  }
  async deleteAccount(userId: number) {
    if (!userId) {
      throw new BadRequestException(undefined, 'User ID is required');
    }
    await this.usersRepository.softDelete({ id: userId });
  }
}
