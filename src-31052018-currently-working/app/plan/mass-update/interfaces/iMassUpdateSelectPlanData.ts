import {IMassUpdateSelectPlanObject} from 'app/plan/mass-update/interfaces/iMassUpdateSelectPlanObject';
/**
 * Interface used by to define what a Mass Category Select Plan Object should contain
 */
export interface IMassUpdateSelectPlanData {

  /**
   * Inidcates The page limit
   */
  numberOfPages: number;

  /**
   * Inidcates The page size
   */
  pageSize: number;

  /**
   * The count of plans
   */
  numberOfPlans: number;

  /**
   * An array of the plans which will be displayed within this select plans modal.
   */
  objects: IMassUpdateSelectPlanObject[];
}
