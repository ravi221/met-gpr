
import { ISummaryFlagsResponse } from 'app/flag/interfaces/iSummaryFlagsResponse';
import { IFlagsResponse } from 'app/flag/interfaces/iFlagsResponse';
import { IFlag } from 'app/flag/interfaces/iFlag';

/**
 * A mock context flag
 * @type {{planName: string; questionName: string; userName: string; lastUpdatedTimestamp: string; flagText: string}}
 */
export const contextFlag: IFlag = {
  text: '',
  questionId: '1',
  questionName: 'Test Question Name',
  questionValue: 'Value of the question',
  lastUpdatedBy: '',
  lastUpdatedByEmail: '',
  lastUpdatedTimestamp: '',
  isResolved: false
};

/**
 * A mock context flag response
 * @type {{}}
 */
export const contextFlagResponse: ISummaryFlagsResponse = {
  totalFlagCount: 1,
  flags: [contextFlag]
};

export const flagResponse: IFlagsResponse = {
  totalFlagCount: 9,
  plans: [
    {
      planId: '719451519312458930',
      planName: 'Voluntary - Test Plan Context Flags',
      flags: [
        {
          questionName: 'Plan Name',
          questionId: '1',
          questionValue: 'null',
          isResolved: false,
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        },
        {
          questionName: 'GPC Code',
          questionValue: 'null',
          questionId: '1',
          isResolved: false,
          text: '',
          lastUpdatedBy: 'Jason Hescheles',
          lastUpdatedByEmail: 'jhescheles@metlife.com',
          lastUpdatedTimestamp: '02/22/2018 11:48'
        },
        {
          questionName: 'Financial Arrangement',
          questionValue: 'null',
          questionId: '1',
          isResolved: false,
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        },
        {
          questionName: 'Plan Name 1',
          questionValue: 'null',
          questionId: '1',
          isResolved: false,
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        },
        {
          questionName: 'Plan Name 3',
          questionValue: 'null',
          questionId: '1',
          isResolved: false,
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        }
      ]
    },
    {
      planId: '428421520619478035',
      planName: 'Voluntary - test plan new metadata',
      flags: [
        {
          questionName: 'Plan Name',
          questionValue: 'null',
          questionId: '1',
          isResolved: false,
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        }
      ]
    },
    {
      planId: '238011520888651514',
      planName: 'Voluntary - test plan 504',
      flags: [
        {
          questionName: 'Plan Name',
          questionValue: 'null',
          isResolved: false,
          questionId: '1',
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        },
        {
          questionName: 'Plan Name',
          questionValue: 'null',
          questionId: '1',
          isResolved: false,
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        }
      ]
    },
    {
      planId: '455101520951428282',
      planName: 'Voluntary - test plan1030',
      flags: [
        {
          questionName: 'Plan Name',
          questionValue: 'null',
          questionId: '1',
          isResolved: false,
          text: 'add text test',
          lastUpdatedBy: 'Matthew Rosner',
          lastUpdatedByEmail: 'mrosner@metlife.com',
          lastUpdatedTimestamp: '03/08/2018 16:20'
        }
      ]
    }
  ]
};

export const flagResponse1: IFlagsResponse = {
  totalFlagCount: 0,
  plans: []
};

