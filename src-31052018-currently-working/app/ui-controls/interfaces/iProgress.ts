import {ITransaction} from './iTransaction';

/**
 * Describes the shape of the progress object that's used by {@link ProgressService} to store the current loading progress of async transactions.
 */
export interface IProgress {
  /**
   * The total number of requests currently in flight.
   */
  totalRequests: number;
  /**
   * The total number of completed requests.
   */
  completedRequests: number;
  /**
   * Indicates that there are currently active transactions.
   */
  active: boolean;
  /**
   * The actual decimal (0-1) representation of the overall progress.
   */
  value: number;
  /**
   * A collection of active transactions.
   */
  transactions: ITransaction[];
}
