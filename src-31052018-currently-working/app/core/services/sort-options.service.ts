import {Injectable} from '@angular/core';
import {ISortOption} from '../interfaces/iSortOption';
import {PageContextTypes} from '../enums/page-context-types';
import {SortByOption} from '../enums/sort-by-option';

/**
 * A service to keep track of the sort options for specific pages
 */
@Injectable()
export class SortOptionsService {

  /**
   * A map of sort options
   * @type {Map<PageContextTypes, ISortOption[]>}
   */
  private static SORT_OPTIONS: Map<PageContextTypes, ISortOption[]> = new Map<PageContextTypes, ISortOption[]>();

  /**
   * Sort options for the GPR Home Page
   * @type {[ISortOption , ISortOption , ISortOption , ISortOption]}
   */
  private static USER_HOME_SORT_OPTIONS: ISortOption[] = [
    <ISortOption>{label: 'Customer Name', sortBy: SortByOption.CUSTOMER_NAME, sortAsc: true, active: false},
    <ISortOption>{label: 'Customer Number', sortBy: SortByOption.CUSTOMER_NUMBER, sortAsc: true, active: false},
    <ISortOption>{label: 'Effective Date', sortBy: SortByOption.EFFECTIVE_DATE, sortAsc: true, active: false},
    <ISortOption>{label: 'Last Modified Date', sortBy: SortByOption.LAST_MODIFIED, sortAsc: true, active: false},
    <ISortOption>{label: 'Status', sortBy: SortByOption.STATUS, sortAsc: true, active: false}
  ];

  /**
   * Sort options for the Customer Home Page
   * @type {[ISortOption , ISortOption , ISortOption , ISortOption]}
   */
  private static CUSTOMER_HOME_SORT_OPTIONS: ISortOption[] = [
    {label: 'Plan Name', sortBy: SortByOption.PLAN_NAME, sortAsc: true, active: false},
    {label: 'Plan Status', sortBy: SortByOption.COMPLETION_PERCENTAGE, sortAsc: true, active: false},
    {label: 'Effective Date', sortBy: SortByOption.EFFECTIVE_DATE, sortAsc: true, active: false},
    {label: 'Last Updated', sortBy: SortByOption.LAST_UPDATED, sortAsc: true, active: true},
    {label: 'Flags', sortBy: SortByOption.FLAG_COUNT, sortAsc: true, active: false, icon: 'flag-on'}
  ];

  /**
   * Sort options for the History Page
   * @type {[ISortOption , ISortOption , ISortOption]}
   */
  private static HISTORY_SORT_OPTIONS: ISortOption[] = [
    {label: 'NEWEST', sortBy: SortByOption.LAST_UPDATED, sortAsc: true, active: true},
    {label: 'A-Z', sortBy: SortByOption.CUSTOMER_NAME, sortAsc: true, active: false}
  ];

  /**
   * Sort options for the Navigation Menu for Customers
   */
  private static NAV_MENU_CUSTOMER_SORT_OPTIONS: ISortOption[] = [
    {label: 'A-Z', sortBy: SortByOption.CUSTOMER_NAME, sortAsc: true, active: false},
    {label: 'Completion', sortBy: SortByOption.COMPLETION_PERCENTAGE, sortAsc: true, active: false},
    {label: 'Effective Date', sortBy: SortByOption.EFFECTIVE_DATE, sortAsc: false, active: true},
  ];

  /**
   * Sort options for the Navigation Menu for Customers
   */
  private static NAV_MENU_PLAN_SORT_OPTIONS: ISortOption[] = [
    <ISortOption>{label: 'A-Z', sortBy: SortByOption.PLAN_NAME, sortAsc: true, active: false},
    <ISortOption>{label: 'Completion', sortBy: SortByOption.COMPLETION_PERCENTAGE, sortAsc: true, active: false},
    <ISortOption>{label: 'Effective Date', sortBy: SortByOption.EFFECTIVE_DATE, sortAsc: false, active: true},
    <ISortOption>{label: 'Product', sortBy: SortByOption.PRODUCT, sortAsc: true, active: false},
  ];

  /**
   * Creates the sort options service, and initializes the map of sort options
   */
  constructor() {
    SortOptionsService.SORT_OPTIONS.set(PageContextTypes.USER_HOME, SortOptionsService.USER_HOME_SORT_OPTIONS);
    SortOptionsService.SORT_OPTIONS.set(PageContextTypes.CUSTOMER_HOME, SortOptionsService.CUSTOMER_HOME_SORT_OPTIONS);
    SortOptionsService.SORT_OPTIONS.set(PageContextTypes.HISTORY, SortOptionsService.HISTORY_SORT_OPTIONS);
    SortOptionsService.SORT_OPTIONS.set(PageContextTypes.NAV_MENU_CUSTOMERS, SortOptionsService.NAV_MENU_CUSTOMER_SORT_OPTIONS);
    SortOptionsService.SORT_OPTIONS.set(PageContextTypes.NAV_MENU_PLANS, SortOptionsService.NAV_MENU_PLAN_SORT_OPTIONS);
  }

  /**
   * Returns a list of sort options based on the page given
   * @param {PageContextTypes} pageContext
   * @returns {ISortOption[]}
   */
  public getSortOptionsByPage(pageContext: PageContextTypes): ISortOption[] {
    return SortOptionsService.SORT_OPTIONS.get(pageContext);
  }
}
