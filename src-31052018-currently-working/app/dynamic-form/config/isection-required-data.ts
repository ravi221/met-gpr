/**
 * Holds information related to track required questions for a section
 */
export interface ISectionRequiredData {

  /**
   * The id of the section
   */
  sectionId: string;

  /**
   * The number of answered required Questions
   */
  answeredRequiredQuestions: number;

  /**
   * The number of required questions
   */
  totalRequiredQuestions: number;
}
