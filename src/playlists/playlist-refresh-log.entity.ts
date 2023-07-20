import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistRefreshStatus } from './playlist-refresh-status.enum';

@Entity()
export class PlaylistRefreshLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @Column()
  status: PlaylistRefreshStatus;
}
