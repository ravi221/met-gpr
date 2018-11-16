/**
 * An interface that makes it easier to interact with the history service
 */
export interface IHistoryRequestParam {

  /**
   * Customer number used to retrieve the history
   */
  customerNumber: number;

  /**
   * userId used for the history request
   */
  userId?: number;

  /**
   * lastEdits used for the history request
   */
  lastEdits?: string;

  /**
   * page used for the history request
   */
  page?: number;

  /**
   * pageSize used for the history request
   */
  pageSize?: number;

  /**
   * orderBy used for the history request
   */
  orderBy?: string;

  /**
   * sortBy used for the history request
   */
  sortBy?: string;

  /**
   * A list of coverage Ids separated by a comma
   */
  coverageIds?: string;
}
