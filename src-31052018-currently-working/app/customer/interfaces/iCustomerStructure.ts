/**
 * Generic interface to represent a customer structure. Experience, report, sub code, and claim branch
 * structures return with the following fields
 */
export interface ICustomerStructure {
  /**
   * The value of this structure
   */
  value: string;
  /**
   * The name of the this structure
   */
  name: string;
  /**
   * The list of plan ids associated with this structure
   */
  planIds: string[];
}
