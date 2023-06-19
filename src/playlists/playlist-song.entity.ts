import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Song } from '../songs/song.entity';

@Entity()
export class PlaylistSong {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Playlist)
  @JoinColumn()
  @Index()
  playlist: Playlist;
  @Column()
  playlistId: number;

  @OneToOne(() => Song)
  @JoinColumn()
  @Index()
  song: Song;
  @Column()
  songId: number;

  @CreateDateColumn()
  createdAt: Date;
}
