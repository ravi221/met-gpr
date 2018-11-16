import {PlanStatus} from '../../enums/plan-status';
import {PlanProductType} from '../../enums/plan-product-type';
import {IPlanCategory} from 'app/plan/plan-shared/interfaces/iPlanCategory';

/**
 * Describes the raw plan object.
 */
export interface IPlan {

  /**
   * The id of the plan
   */
  planId?: string;

  /**
   * The percent completed of the plan
   */
  completionPercentage?: number;

  /**
   * The plan's coverage id
   */
  coverageId?: string;

  /**
   * The plan's coverage name
   */
  coverageName?: string;

  /**
   * The plan's effective date
   */
  effectiveDate?: string;

  /**
   * The plan's number of flags
   */
  flagsCount?: number;

  /**
   * Indicates if the number of errors for this plan
   */
  errorCount?: number;

  /**
   * The last update timestamp for this plan
   */
  lastUpdatedTimestamp?: string;

  /**
   * The plan's name
   */
  planName?: string;

  /**
   * The plan's status
   */
  status?: PlanStatus;

  /**
   * The plan's product type
   */
  productType?: PlanProductType;

  /**
   * A list of categories for the plan
   */
  categories?: Array<IPlanCategory>;

  /**
   * The version of the metadata for the plan
   */
  ppcModelVersion?: string;

  /**
   * The name of the metadata model
   */
  ppcModelName?: string;
}
