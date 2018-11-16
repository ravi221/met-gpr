/**
 * Represents a category Information for Mass Update Home Page
 */
export interface IMassUpdateSelectPlanRequest {
  /**
   * The array of questionIds
   */
  questionIds: string[];

  /**
   * Unique category Id for mut
   */
  mutCategoryID: string;

}
