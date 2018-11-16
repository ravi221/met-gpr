import {IActivity} from '../../../app/activity/interfaces/iActivity';

/**
 * Mock activity
 */
export const activity1: IActivity = {
  customerNumber: 1668565,
  planId: '406701519939521835',
  planName: 'Voluntary - Test 1,1',
  status: 'CREATED',
  attribute: null,
  timestamp: '2018-03-01T16:25:21',
  firstName: 'Matthew',
  lastName: 'Rosner',
  emailId: 'mrosner@metlife.com',
  metnetId: 'mrosner',
  totalFlagCount: 0
};

/**
 * Mock activity
 */
export const activity2: IActivity = {
  customerNumber: 5001107,
  planId: '346151517515529115',
  planName: 'Voluntary - Critical Illness Test',
  status: 'Approved',
  attribute: 'Attribute name',
  firstName: 'Sowmiya',
  lastName: 'Rajagopalan',
  emailId: 'srajagopalan1@metlife.com',
  metnetId: 'srajagopalan1',
  timestamp: '02-12-2018 16:32:59.910',
  totalFlagCount: 0
};

/**
 * Mock activity
 */
export const activity3: IActivity = {
  customerNumber: 5001107,
  planId: '346151517515529115',
  planName: 'Voluntary - Critical Illness Test',
  status: null,
  attribute: null,
  firstName: 'Sowmiya',
  lastName: 'Rajagopalan',
  emailId: 'srajagopalan1@metlife.com',
  metnetId: 'srajagopalan1',
  timestamp: '02-12-2018 16:32:59.910',
  totalFlagCount: 0
};
