/**
 * Represents a transaction call to the back-end
 */
export interface ITransaction {
  /**
   * A unique id
   */
  id: string;

  /**
   * The method called
   */
  method: string;

  /**
   * The url where the method was called at
   */
  url: string;
}
