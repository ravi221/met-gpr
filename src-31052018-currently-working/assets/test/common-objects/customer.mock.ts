import {ICustomer} from '../../../app/customer/interfaces/iCustomer';
import {CustomerStatus} from '../../../app/customer/enums/customer-status';

/**
 * A mock customer
 */
export const mockCustomer: ICustomer = {
  customerName: 'Test Customer',
  customerNumber: 1234,
  effectiveDate: null,
  status: CustomerStatus.UNAPPROVED,
  percentageCompleted: 50,
  market: 'Small Market',
  hiddenStatus: false,
  scrollVisibility: true,
  lastActivity: {
    customerNumber: 1234567,
    planId: '136181520257786893',
    planName: 'Voluntary - Test1',
    status: 'UPDATED',
    attribute: null,
    timestamp: '03-05-2018 09:07:01.316',
    firstName: 'Matthew',
    lastName: 'Rosner',
    emailId: 'mrosner@metlife.com',
    metnetId: 'mrosner1',
    totalFlagCount: 0
  }
};
