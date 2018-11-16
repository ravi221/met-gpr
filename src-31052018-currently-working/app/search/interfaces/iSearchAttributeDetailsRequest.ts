/**
 * An interface to represent the request when searching for attribute details
 */
export interface ISearchAttributeDetailsRequest {

  /**
   * Indicates which customer to search within
   */
  customerNumber: number;

  /**
   * The plan ids to search within
   */
  planIds: string[];

  /**
   * The PPC model to lookup
   */
  model: string;

  /**
   * The label of the attribute
   */
  attributeLabel: string;

  /**
   * The page to retrieve
   */
  page: number;

  /**
   * The number of results per page
   */
  pageSize: number;

  /**
   * The field to sort by
   */
  sortBy: string;

  /**
   * Indicates if to sort ascending (true) or descending (false)
   */
  sortAsc: boolean;
}
