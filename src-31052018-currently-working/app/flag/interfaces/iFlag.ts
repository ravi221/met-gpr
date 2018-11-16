/**
 * A Flag
 */
export interface IFlag {
/**
   * The name of specific question
   */
  questionName: string;
  /**
   * question id
   */
  questionId: string;
  /**
   * The value of a question
   */
  questionValue: string;
  /**
   * Comment on a flag
   */
  text: string;
  /**
   * plan id
   */
  planId?: string;
  /**
   * plan name
   */
  planName?: string;
  /**
   * name of the flag last updated by
   */
  lastUpdatedBy: string;
  /**
   * email of the flag last updated
   */
  lastUpdatedByEmail: string;
  /**
   * Timestamp of when the flag was last updated
   */
  lastUpdatedTimestamp: string;
  /**
   * Resolved
   */
  isResolved: boolean;
}



