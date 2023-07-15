import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Song } from '../songs/song.entity';
import { User } from '../users/user.entity';

@Entity()
export class PlaylistSong {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Playlist)
  @JoinColumn()
  @Index()
  playlist: Playlist;
  @Column()
  playlistId: number;

  @ManyToOne(() => Song)
  @JoinColumn()
  @Index()
  song: Song;
  @Column()
  songId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  @Index()
  user: User;
  @Column()
  userId: number;

  @Column({ default: 0, type: 'double precision' })
  @Index()
  hotScore: number;

  @Column({ default: 0 })
  netVotes: number;
}
