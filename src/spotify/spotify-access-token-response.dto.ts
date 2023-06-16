export default interface SpotifyAccessTokenResponseDto {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number; // seconds
  refresh_token: string;
}
