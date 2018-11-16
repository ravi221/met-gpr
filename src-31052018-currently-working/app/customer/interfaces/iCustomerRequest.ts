/**
 * Interface to represent getting a list of customers
 */
export interface ICustomerRequest {
  /**
   * The string to search on
   */
  searchField: string;

  /**
   * Determines which field to sort by
   */
  sortBy: string;

  /**
   * Indicates whether to sort ascending (true) or descending (false)
   */
  sortAsc: boolean;

  /**
   * The current page of results to retrieve
   */
  page: number;

  /**
   * The number of results per page
   */
  pageSize: number;

  /**
   * Indicates if this request should get hidden customers
   */
  hidden: boolean;

  /**
   * Indicates if this is a global search
   */
  globalSearch: boolean;

  /**
   * Indicates if this is a user search
   */
  userSearch?: boolean;

  /**
   * An optional id to search for a specific user's customers
   */
  userId?: string;
}
