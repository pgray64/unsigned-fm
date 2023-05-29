import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { AuthProviderEnum } from './auth-provider.enum';

@Entity()
@Index(['provider', 'subject'], { unique: true })
export class FederatedCredentials {
  @PrimaryColumn()
  userId: number;
  @Column()
  provider: AuthProviderEnum;
  @Column()
  subject: string;
}
