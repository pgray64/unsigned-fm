import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  spotifyArtistId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistImage: string;

  @Column()
  followers: number;
}
