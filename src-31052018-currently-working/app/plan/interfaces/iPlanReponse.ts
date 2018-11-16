import {IPlan} from '../plan-shared/interfaces/iPlan';

/**
 * An interface to represent the plan response object
 */
export interface IPlanResponse {
  /**
   * The current page of plans to display
   */
  page: number;

  /**
   * The current number of plans to display
   */
  pageSize: number;

  /**
   * The total number of plans
   */
  totalCount: number;

  /**
   * The actual plan objects
   */
  plans: IPlan[];
}
