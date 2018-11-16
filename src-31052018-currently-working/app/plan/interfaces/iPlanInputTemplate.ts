/**
 * Interface for the plan input grid to store data
 */
export interface IPlanInputTemplate {
  /**
   * User entered plan name
   */
  planNameBody: string;
  /**
   * Drop-down generated plan name prefix
   */
  planNamePrefix: string;
  /**
   * plan effective date
   */
  effectiveDate: string;
  /**
   * Customer Number to copy plan to
   */
  customerNumber: number;
  /**
   * PPC model name, populated by the drop-down
   */
  ppcModelName: string;
  /**
   * coverage ID, populated by the drop-down
   */
  coverageId: string;
  /**
   * The coverage name of the new plan
   */
  coverageName: string;
  /**
   * Indicates if the plan template has errors
   */
  hasErrors: boolean;
  /**
   * The error message
   */
  errors: string[];
  /**
   * Indicates if the plan template has been completed
   */
  isComplete: boolean;
}
