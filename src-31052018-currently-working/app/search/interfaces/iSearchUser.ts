/**
 * Represents a search user, used with the {@link SearchUserBarComponent and @link UserSearchService}
 */
export interface ISearchUser {
  /**
   * The user's unique id
   */
  userId: string;

  /**
   * The user's first name
   */
  firstName: string;

  /**
   * The user's first name
   */
  lastName: string;

  /**
   * The user's email
   */
  emailAddress: string;
}
