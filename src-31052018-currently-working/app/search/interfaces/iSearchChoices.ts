/**
 * Represents the current search choices available
 */
import ChoiceConfig from '../../forms-controls/config/choice-config';

export interface ISearchChoices {
  /**
   * The current search by choices
   */
  searchByChoices: ChoiceConfig[];

  /**
   * The current search for choices
   */
  searchForChoices: ChoiceConfig[];
}
