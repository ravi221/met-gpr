import {Observable} from 'rxjs/Observable';
import {ICustomers} from 'app/customer/interfaces/iCustomers';
import {IUserPreference} from '../../core/interfaces/iUserPreference';
import {ICustomerRequest} from '../interfaces/iCustomerRequest';

/**
 * Represents a mocked customer data service
 */
export class MockCustomerDataService {

  /**
   * Mocked list of customers
   * @type {ICustomers}
   * @private
   */
  private _mockCustomers = <ICustomers>{
    'customers': [
      {
        'customerName': 'Acme Widgets International',
        'customerNumber': 163137,
        'effectiveDate': '06/01/2017',
        'status': 'Unapproved',
        'percentageCompleted': 50,
        'market': 'Regional',
        'hiddenStatus': false
      },
      {
        'customerName': 'Clampett Oil, LLP',
        'customerNumber': 98065,
        'effectiveDate': '02/15/2018',
        'status': 'Unapproved',
        'percentageCompleted': 0,
        'market': 'Regional',
        'hiddenStatus': false
      },
      {
        'customerName': 'Cyberdyne Systems Corp.',
        'customerNumber': 67887,
        'effectiveDate': '12/01/2017',
        'status': 'Unapproved',
        'percentageCompleted': 68,
        'market': 'Regional',
        'hiddenStatus': false
      },
      {
        'customerName': 'Globex, Inc.',
        'customerNumber': 787423,
        'effectiveDate': '04/01/2017',
        'status': 'Unapproved',
        'percentageCompleted': 0,
        'market': 'Regional',
        'hiddenStatus': false
      },
      {
        'customerName': 'Initech',
        'customerNumber': 8673509,
        'effectiveDate': '02/19/1999',
        'status': 'Approved',
        'percentageCompleted': 9,
        'market': 'Mulitnational',
        'hiddenStatus': false
      },
      {
        'customerName': '111111',
        'customerNumber': 8673510,
        'effectiveDate': '02/19/1999',
        'status': 'Approved',
        'percentageCompleted': 9,
        'market': 'Mulitnational',
        'hiddenStatus': false
      },
      {
        'customerName': '1111111',
        'customerNumber': 8673511,
        'effectiveDate': '02/19/1999',
        'status': 'Approved',
        'percentageCompleted': 9,
        'market': 'Mulitnational',
        'hiddenStatus': false
      },
      {
        'customerName': '11111111',
        'customerNumber': 8673512,
        'effectiveDate': '02/19/1999',
        'status': 'Approved',
        'percentageCompleted': 9,
        'market': 'Mulitnational',
        'hiddenStatus': false
      },
      {
        'customerName': '11111111',
        'customerNumber': 8673513,
        'effectiveDate': '02/19/1999',
        'status': 'Approved',
        'percentageCompleted': 9,
        'market': 'Mulitnational',
        'hiddenStatus': false
      }
    ],
    'totalCount': 45,
    'page': 1,
    'pageSize': 9
  };

  public getCustomersForUser(): Observable<ICustomers> {
    return Observable.of(this._mockCustomers);
  }

  /**
   * Initializes a customer request
   */
  public initCustomerRequest(userPreference: IUserPreference, userId?: string): ICustomerRequest {
    return {
      searchField: '',
      sortAsc: userPreference.sortAsc,
      sortBy: userPreference.sortBy,
      page: 1,
      pageSize: 12,
      hidden: false,
      globalSearch: false,
      userId
    };
  }

  public getCustomers(): Observable<ICustomers> {
    return Observable.of(this._mockCustomers);
  }
}
