import {IHistoricalAttribute} from './iHistoricalAttribute';
import {IUserInfo} from '../../customer/interfaces/iUserInfo';

/**
 * An interface for a history version to display
 */
export interface IHistoricalVersion {

  /**
   * Version name to be displayed
   */
  versionName: string;

  /**
   * User info to be displayed
   */
  userInfo: IUserInfo;

  /**
   * LastUpdatedTimestamp to be displayed
   */
  lastUpdatedTimestamp: string;

  /**
   * historicalAttributes to be displayed
   */
  historicalAttributes: IHistoricalAttribute[];
}
