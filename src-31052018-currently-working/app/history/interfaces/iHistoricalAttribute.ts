
import {IUserInfo} from '../../customer/interfaces/iUserInfo';
import { IComment } from 'app/comment/interfaces/iComment';

/**
 * An interface for a history attribute that contains comments
 */
export interface IHistoricalAttribute {

  /**
   * Attribute name to be displayed
   */
  attributeName: string;

  /**
   * Attribute description to be displayed
   */
  attributeDescription: string;

  /**
   * User info to be displayed
   */
  userInfo: IUserInfo;

  /**
   * LastUpdatedTimestamp to be displayed
   */
  lastUpdatedTimestamp: string;

  /**
   * comments to be displayed
   */
  comments?: IComment[];
}
