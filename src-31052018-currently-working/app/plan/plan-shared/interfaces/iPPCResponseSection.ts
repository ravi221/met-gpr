import {IPPCValidation} from './iPPCValidation';

/**
 * Contains PPC response data at the section level
 */
export interface IPPCResponseSection {
  /**
   * The plain text section label
   */
  sectionLabel: string;
  /**
   * the unique identifier for the section
   */
  sectionId: string;
  /**
   * The number of errors in the section
   */
  errorCount: number;
  /**
   * A collection of all of the specific validations
   */
  questions: IPPCValidation[];
  /**
   * The total number of field in the section
   */
  totalFieldCount: number;
  /**
   * The number of completed fields in the section
   */
  completedFieldCount: number;
  /**
   * The percentage of completed fields in the section
   */
  completionPercentage: number;
}
