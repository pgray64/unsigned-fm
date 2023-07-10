import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  spotifyPlaylistId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  playlistImage: string;

  @Column({ default: 0, type: 'double precision' })
  @Index()
  hotScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  isRestricted: boolean;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: 0 })
  submissionCount: number;
}
