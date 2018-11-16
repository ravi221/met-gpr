/**
 * Interface for what the Plan Create Service call will return
 */
export interface ICreatePlanResponse {

  /**
   * Status message sent back from server
   */
  responseCode: string;

  /**
   * Plan ID where the plan was copied to
   */
  planId: string;

  /**
   * Plan Name of the plan that was copied
   */
  planName: string;
}
