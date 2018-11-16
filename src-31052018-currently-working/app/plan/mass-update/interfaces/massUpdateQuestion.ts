import {IMassUpdateControl} from 'app/plan/mass-update/interfaces/iMassUpdateControl';
/**
 * Represents a category Information for Mass Update Home Page
 */
export interface MassUpdateQuestion {
  /**
   * A unique section id for this mass section
   */
  questionId: string;

  /**
   * The label of the category
   */
  label: string;

  /**
   * The order filed to sort order by
   */
  order: number;

  /**
   * The view model of the question. Use for mapping to the answer
   */
  viewModel: string;

  /**
   * A string representing the path to the correct attribute in the mass update
   * object. A question with model 'PRVD.DFCLT_CD' will be bound to the
   * difficulty code in the mass update provisions, at ADMN.PLN_ORIG_CD.
   */
  model: string;

  /**
   * A configuration for the form control which will be displayed in the
   * UI and used to modify the model.
   */
  control: IMassUpdateControl;

}
