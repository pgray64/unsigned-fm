import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Artist } from '../artists/artist.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  spotifyTrackId: string;

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[];

  @Column()
  name: string;

  @Column()
  albumImage: string;

  @Column()
  spotifyAlbumId: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
