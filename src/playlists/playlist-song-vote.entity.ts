import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { PlaylistSong } from './playlist-song.entity';

@Entity()
@Index(['playlistSongId', 'userId'], { unique: true })
export class PlaylistSongVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  @Index()
  user: User;
  @Column()
  userId: number;

  @ManyToOne(() => PlaylistSong)
  @JoinColumn()
  @Index()
  playlistSong: PlaylistSong;
  @Column()
  playlistSongId: number;

  @Column()
  voteValue: number;
}
