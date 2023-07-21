export interface UserSearchResultDto {
  totalCount: number;
  perPage: number;
  users: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    isBanned: boolean;
  }[];
}
