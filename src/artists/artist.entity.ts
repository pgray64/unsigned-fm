import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  spotifyArtistId: string;

  @Column()
  name: string;

  @Column()
  artistImage: string;

  @Column()
  followers: number;
}
