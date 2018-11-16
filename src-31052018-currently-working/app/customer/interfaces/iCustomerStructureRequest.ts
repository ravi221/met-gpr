/**
 * Represents a request to get a customer's structure information. There are optional parameters for getting a
 * specific experience, report, or sub code
 */
export interface ICustomerStructureRequest {
  /**
   * The customer number to get structure information for
   */
  customerNumber: number;
  /**
   * The specific structure information to get
   */
  experience?: string;
  /**
   * The specific report information to get
   */
  report?: string;
  /**
   * The specific sub code information to get
   */
  subCode?: string;
}
