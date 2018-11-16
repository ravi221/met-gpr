/**
 * Defines rules that will run when a UI element is initialized or changed, or
 * when there is an error.  This uses a format defined by the Remix DSL rules
 * engine.  These rules might modify the data on the {@link IPlan|plan}, or the
 * state of any {@link CategoryConfig|category}, {@link SectionConfig|section},
 * {@link FormControlConfig|control}, or {@link ChoiceConfig|choice}.
 */
export default class RuleConfig {
  /**
   * Rules to be run when the UI element is initialized
   */
  onInit: Array<any>;

  /**
   * Rules to be run when there is an error
   */
  onError: Array<any>;

  /**
   * Rules to be run when the data associated with the UI element changes
   */
  onChange: Array<any>;

  /**
   * Rules to be run when the UI element is clicked (if applicable)
   */
  onClick: Array<any>;

  /**
   * Construct a new instance
   * @param json a JSON representation of the rules
   */
  constructor(json: any) {
    this.onInit = json.onInit;
    this.onError = json.onError;
    this.onChange = json.onChange;
    this.onClick = json.onClick;
  }
}
