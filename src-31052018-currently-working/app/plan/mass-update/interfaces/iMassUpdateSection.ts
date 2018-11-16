import {MassUpdateQuestion} from 'app/plan/mass-update/interfaces/massUpdateQuestion';
import {IMassUpdateState} from 'app/plan/mass-update/interfaces/iMassUpdateState';
/**
 * Interface used to define what a Mass Section Object should contain
 */
export interface IMassUpdateSection {

  /**
   * A unique section id for this mass section
   */
  sectionId: string;

  /**
   * The label of the category
   */
  label: string;

  /**
   * The order field to sort order by
   */
  order: number;

  /**
   * The state field should indicates the states for mass section
   */
  state: IMassUpdateState;

  /**
   * An array of the sections which will be displayed within this category.
   */
  questions: MassUpdateQuestion[];

}
