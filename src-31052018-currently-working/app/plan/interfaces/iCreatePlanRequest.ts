/**
 * This interface will be used as the payload for the createPlan post call utilized by {@link PlanCreateComponent}
 */
export interface ICreatePlanRequest {
  /**
   * Plan Name for the new plan
   */
  planName: string;
  /**
   * The coverage id for the new plan
   */
  coverageId: string;
  /**
   * The name of the coverage for the new plan
   */
  coverageName: string;
  /**
   * The plan's effective date
   */
  effectiveDate: string;
  /**
   * The plan's customer number
   */
  customerNumber: number;
  /**
   * The ppc model name for this new plan
   */
  ppcModelName: string;
}
