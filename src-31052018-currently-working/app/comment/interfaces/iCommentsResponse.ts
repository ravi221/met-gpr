import { IComment } from './iComment';

/**
 * response got from service for comment request
 */

export interface ICommentsResponse {
   /**
    * array of comments
    */
   comments: IComment[];
}
