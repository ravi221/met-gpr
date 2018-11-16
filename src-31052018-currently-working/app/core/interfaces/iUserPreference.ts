import {PageContextTypes} from '../enums/page-context-types';

/**
 * Interface to a user's preferences for a specific page context
 */
export interface IUserPreference {
  /**
   * The name of the page for which the user preferences apply
   */
  pageName: PageContextTypes;
  /**
   * Field to sort by
   */
  sortBy: string;
  /**
   * Sort direction of sortBy field. true for ascending false for descending
   */
  sortAsc: boolean;
  /**
   * Edit count that only applies to the History page
   */
  editDisplayCount: number;
}
