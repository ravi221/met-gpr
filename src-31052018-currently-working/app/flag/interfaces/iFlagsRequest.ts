import {ICoverage} from '../../core/interfaces/iCoverage';
/**
 * An interface that makes it easier to interact with the flag service
 */
export interface IFlagsRequest {
    /**
   * The customer number to search for plans
   */
  customerNumber: number;

  /**
   * The coverages to filter on
   */
  coverages?: ICoverage[];

  /**
   * Is flag resolved to search within
   */
  isResolved: string;

  /**
   * plan name used to land on plan home page when clicked
   */
  planName?: string;

  /**
   * plan number used to land on plan home page when clicked
   */
  planId?: string;
  }

