import {IHistoricalVersion} from './iHistoricalVersion';
import {PlanStatus} from '../../plan/enums/plan-status';

/**
 * An interface for a history plan that contains history items
 */
export interface IHistoricalPlan {

  /**
   * PlanId used to retrieve the tags
   */
  planId?: number;

  /**
   * PlanName to be displayed
   */
  planName: string;

  /**
   * EffectiveDate to be displayed
   */
  effectiveDate: string;

  /*
   * Status to be displayed
   */
  planStatus: PlanStatus;

  /**
   * Category Id will filter the flags belonging to a plan on the category page
   */
  categoryId?: string;

  /**
   * A list of coverage Ids separated by a comma
   */
  coverageIds?: string;

  /**
   * the list of history items for the plan.
   */
  historicalVersions: IHistoricalVersion[];
}
