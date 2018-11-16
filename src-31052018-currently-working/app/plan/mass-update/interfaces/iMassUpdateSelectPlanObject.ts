
/**
 * Interface used by to define the plans information in Object
 */
export interface IMassUpdateSelectPlanObject {

  productName: string;
  /**
   * Indicates the plan name
   */
  planName: string;

  /**
   * The unique id of plan
   */
  planId: string;

  /**
   * Coverage id of the plan
   */
  coverageId: string;

  /**
   * The effectiveDate for the plan
   */
  effectiveDate: string;

  /**
   * Timestamp of when the plan was created
   */
  creationTimestamp: string;

  /**
   * Timestamp of when the plan was last updated
   */
  lastUpdatedTimestamp: string;

  /**
   * CompletionPercentage of the plan
   */
  completionPercentage: string;

  /**
   * Indicates ppcModel Name for plan
   */
  ppcModelName: string;

  /**
   * Indicates ppcModel version for plan
   */
  ppcModelVersion: string;

  /**
   * Indicates the error count of plan
   */
  errorCount: number;

  /**
   * Indicates the status for plan
   */
  status: string;

  /**
   * categories of plan
   */
  categories: any[];

  /**
   * Indicates the checkbox to be true/false
   */
  isChecked: boolean;

}
