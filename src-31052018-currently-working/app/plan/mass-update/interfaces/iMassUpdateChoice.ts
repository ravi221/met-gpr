/**
 * Configures an option for a drop-down, radio button, or checkbox
 */
export interface IMassUpdateChoice {

  /**
   * A string which will represent the choice in the UI
   */
  label: string;

  /**
   * The value which will be bound to the model when the choice is selected
   */
  value: any;

}
