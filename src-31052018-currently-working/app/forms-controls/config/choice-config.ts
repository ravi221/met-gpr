import StateConfig from './state-config';

/**
 * Configures an option for a drop-down, radio button, or checkbox
 */
export default class ChoiceConfig {
  /**
   * A string which will represent the choice in the UI
   */
  label: string;

  /**
   * The value which will be bound to the model when the choice is selected
   */
  value: any;

  /**
   * The current {@link StateConfig|state} of the choice.  When the
   * rules run, this can be modified to hide or disable the choice.
   */
  state?: StateConfig;

  /**
   * Constructs a new instance from a JSON representation
   */
  constructor(json: any) {
    this.label = json.label;
    this.value = json.value;
    this.state = json.state ? new StateConfig(json.state) : undefined;
  }
}
