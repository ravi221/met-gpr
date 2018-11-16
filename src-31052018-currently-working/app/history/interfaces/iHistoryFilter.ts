/**
 * Interface to describe the shape of the history filter types to be used by {@link HistoryFilterComponent} .
 */
import {PlanStatus} from '../../plan/enums/plan-status';

export interface IHistoryFilter {
  /**
   * The string value for filtering by keyword.
   */
  keyword: string;

  /**
   * The string value for filtering by username.
   */
  userName: string;

  /**
   * The string value for filtering by plan name.
   */
  planName: string;

  /**
   * The value for filtering by plan status.
   */
  planStatus: PlanStatus;

  /**
   * The from value for filtering by date range.
   */
  dateRangeFrom: string;

  /**
   * The to value for filtering by date range.
   */
  dateRangeTo: string;

  /**
   * The from value for filtering by version.
   */
  versionFrom: number;

  /**
   * The to value for filtering by version.
   */
  versionTo: number;

  /**
   * The value for filtering by effective date.
   */
  effectiveDate: string;
}
