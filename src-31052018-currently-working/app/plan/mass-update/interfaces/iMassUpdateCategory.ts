import {IMassUpdateSection} from 'app/plan/mass-update/interfaces/iMassUpdateSection';
import {IMassUpdateState} from 'app/plan/mass-update/interfaces/iMassUpdateState';
/**
 * Interface used by to define what a Mass Category Object should contain
 */
export interface IMassUpdateCategory {

  /**
   * The unique id for the category
   */
  categoryId: string;

  /**
   * The label of the category
   */
  label: string;

  /**
   * The order filed to sort order by
   */
  order: number;

  /**
   * The state field represents the states for mass category
   */
  state: IMassUpdateState;

  /**
   * An array of the sections which will be displayed within this category.
   */
  sections: IMassUpdateSection[];

}
