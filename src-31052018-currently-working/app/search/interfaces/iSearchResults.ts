/**
 * Interface used for search results
 */
export interface ISearchResults {
  /**
   * The actual results to display
   */
  results: any[];

  /**
   * The current page
   */
  page: number;

  /**
   * The number of results to display per page
   */
  pageSize: number;

  /**
   * The total number of results
   */
  totalCount: number;
}
