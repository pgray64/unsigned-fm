import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  spotifyArtistId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistImage: string | null;

  @Column()
  followers: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
