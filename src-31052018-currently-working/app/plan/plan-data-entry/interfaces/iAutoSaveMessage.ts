/**
 * Describes the shape of the auto-save message that is utilized by the {@link AutoSaveComponent}.
 */
export interface IAutoSaveMessage {
  /**
   * The string value of the material icon literature to display.
   */
  icon: '' | 'cached' | 'done' | 'warning';
  /**
   * The message to display in the snackbar.
   */
  text: string;
}
