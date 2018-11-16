/**
 * Raw mock choices, which will be mapped to ChoiceConfig
 * @type {[{value: string; label: string} , {value: string; label: string}]}
 */
import ChoiceConfig from '../../../app/forms-controls/config/choice-config';

const rawMockChoices = [
  {value: 'A', label: 'Apples'},
  {value: 'B', label: 'Bananas'},
  {value: 'C', label: 'Coconut'},
  {value: 'D', label: 'Honeydew'},
];

/**
 * A mock choices object, used in dynamic form tests
 * @type {ChoiceConfig[]}
 */
export const mockChoices = rawMockChoices.map(choice => new ChoiceConfig(choice));
