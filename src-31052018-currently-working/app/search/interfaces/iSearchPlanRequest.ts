/**
 * An interface to represent searching for a plan
 */
export interface ISearchPlanRequest {
  /**
   * The customer to search within
   */
  customerNumber: number;

  /**
   * The type of search to perform
   */
  searchCriteria: 'planName' | 'attribute' | 'effectiveDate';

  /**
   * The term to search by
   */
  searchKey: string;

  /**
   * The page to retrieve
   */
  page: number;

  /**
   * The number of results per page
   */
  pageSize: number;

  /**
   * The field to sort by
   */
  sortBy: string;

  /**
   * Indicates if to sort ascending (true) or descending (false)
   */
  sortAsc: boolean;
}
