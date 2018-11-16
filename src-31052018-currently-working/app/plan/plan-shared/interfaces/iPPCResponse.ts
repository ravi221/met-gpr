import {IPPCResponseCategory} from './iPPCResponseCategory';

/**
 * Describes the shape of a PPC validation response from the API.
 */
export interface IPPCResponse {
  /**
   * The number of errors in a response
   */
  errorCount: number;
  /**
   * The id of the plan that's was validated against PPC.
   */
  planId: string;
  /**
   * The name of the plan that was validated against PPC
   */
  planName: string;
  /**
   * The unique id of the customer associated with a plan
   */
  customerNumber: string;
  /**
   * The collection of PPC Categories.
   */
  categories: IPPCResponseCategory[];
}
