import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}
  async isUserAnAdmin(userId: number): Promise<boolean> {
    if (!userId) {
      return false;
    }
    return this.adminRepository.exist({ where: { userId } });
  }
}
