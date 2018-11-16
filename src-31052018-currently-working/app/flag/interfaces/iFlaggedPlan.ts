import { IFlag } from 'app/flag/interfaces/iFlag';


/**
 * An interface for tying plans to tags. The fields are optional because it will create this object in multiple backend calls.
 */
export interface IFlaggedPlan {
  /**
   * The unique identifier for a plan
   */
  planId: string;
  /**
   * The name of a plan
   */
  planName: string;
  /**
   * The flags that a plan contains
   */
  flags: IFlag[];
}
