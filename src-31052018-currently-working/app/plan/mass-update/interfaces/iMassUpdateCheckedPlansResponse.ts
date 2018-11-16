/**
 * Represents a category Information for Mass Update Home Page
 */
export interface IMassUpdateCheckedPlansResponse {
  /**
   * The count of selected plans
   */
  updatedPlanCount: number;

  /**
   * The label for action Buttons
   */
  planNames: string[];

}
