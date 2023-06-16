import { Injectable } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Injectable()
export class SpotifyApiService {
  constructor(private spotifyService: SpotifyService) {}

  async getUserProfile(): Promise<{
    displayName: string;
    email: string;
    imageUrl: string;
    spotifyUrl: string;
  }> {
    const response = await this.spotifyService.performApiRequest('me', 'GET');
    return {
      displayName: response.data?.display_name,
      email: response.data?.email,
      imageUrl:
        response.data?.images?.length > 0
          ? response.data?.images[0].url
          : undefined,
      spotifyUrl: response.data?.external_urls?.spotify,
    };
  }
}
