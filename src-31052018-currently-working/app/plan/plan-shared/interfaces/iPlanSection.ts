/**
 * Interface used to define what a Plan Section Object should contain
 */
export interface IPlanSection {
  /**
   * The number of fields completed for this plan section
   */
  completedFieldCount: number;

  /**
   * The percentage of completed fields for this plan section
   */
  completionPercentage: number;

  /**
   * A unique section id for this plan section
   */
  sectionId: string;

  /**
   * The name of this plan section
   */
  sectionName: string;

  /**
   * The total number of fields for this plan section
   */
  totalFieldCount: number;

  /**
   * Indicates if this plan section has been validated
   */
  validationIndicator: string;

  /**
   * The number of validation errors on the section
   */
  errorCount: number;
}
