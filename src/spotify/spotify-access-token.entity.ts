import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SpotifyAuthType } from './spotify-auth-type.enum';
@Entity()
export class SpotifyAccessToken {
  @PrimaryColumn()
  spotifyAuthType: SpotifyAuthType;
  @Column({ type: 'timestamptz' })
  expiresAt: Date;
  @Column()
  accessToken: string;
  @Column()
  refreshToken: string;
}
