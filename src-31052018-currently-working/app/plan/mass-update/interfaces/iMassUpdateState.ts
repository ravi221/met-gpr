/**
 * Represents the state of a {@link IMassCategory}, {@link IMassSection}, or {@link IMassControl} instance.
 */
export interface IMassUpdateState {
  /**
   * Indicates if the state is disabled
   * @type {boolean}
   */
  isDisabled: boolean;

  /**
   * Indicates if the state is hidden
   * @type {boolean}
   */
  isHidden: boolean;

  /**
   * Indicates if the state is required
   * @type {boolean}
   */
  isRequired: boolean;
}
