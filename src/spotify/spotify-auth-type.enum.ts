export enum SpotifyAuthType {
  // No user access, grabs a new access token using api keys. Not supported currently.
  // ClientCredentials = 1,

  // User access, requires a user sign-in, uses refresh tokens
  AuthorizationCode = 2,
}
