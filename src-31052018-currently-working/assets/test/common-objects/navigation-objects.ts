import {NavContextType} from '../../../app/navigation/enums/nav-context';
import {ICustomer} from '../../../app/customer/interfaces/iCustomer';
import {CustomerStatus} from '../../../app/customer/enums/customer-status';

/**
 * Mock customer to be passed in resolve data
 */
const mockCustomer: ICustomer = {
  customerNumber: 5001107,
  customerName: 'Acme Widgets International',
  effectiveDate: '01/01/2000',
  market: 'Small Market',
  status: CustomerStatus.APPROVED,
  percentageCompleted: 0,
  hiddenStatus: false,
  scrollVisibility: false,
  marketSegmentId: '4'
};

/**
 * Mock plan to be passed in resolve data
 */
const mockPlan = {
  planId: '333333',
  planName: 'Josh'
};

/**
 * Mock params to be passed in
 * @type {Map<string, any>}
 */
const mockParams = new Map<string, any>().set('customerNumber', '5555555');

/**
 * Mock customer context
 */
export const customerContext = {
  context: NavContextType.CUSTOMER,
  url: '/customers/5555555',
  params: mockParams,
  data: {
    context: NavContextType.CUSTOMER,
    customer: mockCustomer
  }
};

/**
 * Mock plan context
 */
export const planContext = {
  context: NavContextType.CUSTOMER,
  url: '/customers/5555555/plans/3',
  params: mockParams,
  data: {
    context: NavContextType.CUSTOMER,
    customer: mockCustomer,
    plan: mockPlan
  }
};
