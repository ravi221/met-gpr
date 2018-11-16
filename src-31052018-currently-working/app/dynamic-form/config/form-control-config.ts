import {StateResolver} from './state-resolver';
import ChoiceConfig from '../../forms-controls/config/choice-config';
import StateConfig from '../../forms-controls/config/state-config';

/**
 * Configures the appearance of the form control which is used to modify a plan attribute.
 */
export default class FormControlConfig extends StateResolver {
  /**
   * Represents the type of form control to be rendered.  Each component which extends
   * {@link FormControl} should have the @FormControlClassProviderService.Register()
   * decorator, and may also pass an optional array of aliases.  This, then, is either
   * one of those aliases or the name of the component class.
   */
  type: string;

  /**
   * An optional array of choices which should be provided for any control
   * with a finite number of predefined values
   */
  choices?: ChoiceConfig[];

  /**
   * An optional string describing the purpose and usage of the attribute
   */
  hint?: string;

  /**
   * Construct a new instance from a JSON representation of the control config
   */
  constructor(sourceId: string, json: any, onStateUpdate: (sourceId: string, newState: StateConfig) => void) {
    super(sourceId, json.state, onStateUpdate);
    this.type = json.type;
    this.choices = json.choices ? json.choices.map(choiceJson => new ChoiceConfig(choiceJson)) : undefined;
    this.hint = json.hint;
  }

  /**
   * Sets the available options for a control
   */
  public setChoices(choices: ChoiceConfig[]): void {
    this.choices = choices ? choices.map(choiceJson => new ChoiceConfig(choiceJson)) : undefined;
  }
}
