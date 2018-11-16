import {IPPCResponseSection} from './iPPCResponseSection';

/**
 * Holds PPC response data at the category level for PPC responses
 */
export interface IPPCResponseCategory {
  /**
   * The text label for a category
   */
  categoryLabel: string;
  /**
   * The unique identifier for a category
   */
  categoryId: string;
  /**
   * The total number of errors in a category
   */
  errorCount: number;
  /**
   * A collection of a category's sections
   */
  sections: IPPCResponseSection[];
}
