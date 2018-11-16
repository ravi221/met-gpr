/**
 * Describes the shape of a single PPC validation for a question on the UI.
 *
 * The questionId is determined by the metadata associated to the plan being evaluated.
 */
export interface IPPCValidation {
  /**
   * The id of the question (see {@link QuestionConfig}).
   */
  questionId: string;
  /**
   * The Plain text name of the question
   */
  questionLabel: string;
  /**
   * The current value of the question
   */
  questionValue: string;
  /**
   * The list of messages returned from PPC rules engine.
   */
  errors: string[];
}
