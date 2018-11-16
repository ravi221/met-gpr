import {SearchForOptions} from '../enums/SearchForOptions';
import {SearchByOptions} from '../enums/SearchByOptions';

/**
 * Interface to represent which options to search on
 */
export interface ISearchOptions {
  /**
   * The option to search by
   */
  searchByOption: SearchByOptions;
  /**
   * The option to search for
   */
  searchForOption: SearchForOptions;
}
