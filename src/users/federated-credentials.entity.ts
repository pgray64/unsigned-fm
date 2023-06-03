import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthProviderEnum } from './auth-provider.enum';
import { User } from './user.entity';

@Entity()
@Index(['provider', 'subject'], { unique: true })
export class FederatedCredentials {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  provider: AuthProviderEnum;
  @Column()
  subject: string;
  @OneToOne(() => User)
  @JoinColumn()
  @Index()
  user: User;
}
