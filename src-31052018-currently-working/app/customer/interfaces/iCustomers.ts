import {ICustomer} from 'app/customer/interfaces/iCustomer';

/**
 * describes the shape of the data returned from a call to retrieve customers on the gpr home screen
 */
export interface ICustomers {
  /**
   * a collection of customers
   */
  customers: ICustomer[];
  /**
   * page number of the call made to get the collection of customers
   */
  page: number;
  /**
   * amount of customers requested per page
   */
  pageSize: number;
  /**
   * total number of customers available
   */
  totalCount: number;
}
