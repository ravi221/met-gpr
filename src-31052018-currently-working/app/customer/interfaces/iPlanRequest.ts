import {ICoverage} from '../../core/interfaces/iCoverage';

/**
 * An interface for creating a request to filter plans
 */
export interface IPlanRequest {
  /**
   * The customer number to search for plans
   */
  customerNumber: number;

  /**
   * The coverages to filter on
   */
  coverages?: ICoverage[];

  /**
   * The name of the plan
   */
  planName?: string;

  /**
   * A list of plan ids to search within
   */
  planIds?: number[];

  /**
   * The property to sort the plans by
   */
  sortBy?: string;

  /**
   * Indicates if to sort ascending (true) or descending (false)
   */
  sortAsc?: boolean;

  /**
   * The page of plans to retrieve
   */
  page?: number;

  /**
   * The number of plans to get per page
   */
  pageSize?: number;
}
