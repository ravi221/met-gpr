import {IMassUpdateChoice} from 'app/plan/mass-update/interfaces/iMassUpdateChoice';
import {IMassUpdateState} from 'app/plan/mass-update/interfaces/iMassUpdateState';
/**
 * Configures the appearance of the form control which is used to modify a mass update attribute.
 */
export interface IMassUpdateControl {
/**
   * The type field represents the text, checkbox, radio button
   */
  type: string;

  /**
   * An optional string describing the purpose and usage of the attribute
   */
  hint?: string;

  /**
   * The state field represents the states for mass category
   */
  state: IMassUpdateState;

  /**
   * An optional array of choices which should be provided for any control
   * with a finite number of predefined values
   */
  choices?: IMassUpdateChoice[];

}
