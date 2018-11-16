/**
 * Represents the state of a {@link CategoryConfig}, {@link SectionConfig}, or {@link FormControlConfig} instance.
 *
 * Getters and Setters are set for each property to ensure that updates to respective values are properly propagated up the hierarchy.
 *
 */
export default class StateConfig {
  /**
   * Indicates if the state is disabled
   * @type {boolean}
   * @private
   */
  private _isDisabled: boolean = false;

  /**
   * Indicates if the state is hidden
   * @type {boolean}
   * @private
   */
  private _isHidden: boolean = false;

  /**
   * Indicates if the state has any errors
   * @type {boolean}
   * @private
   */
  private _hasErrors: boolean = false;

  /**
   * Indicates if the state has any warnings
   * @type {boolean}
   * @private
   */
  private _hasWarnings: boolean = false;

  /**
   * Indicates if the state is required
   * @type {boolean}
   * @private
   */
  private _isRequired: boolean = false;

  /**
   * Indicates if the state has dirty data
   * @type {boolean}
   * @private
   */
  private _isDirty: boolean = false;

  /**
   * Indicates if the state would be complete
   * @type {boolean}
   */
  private _isComplete: boolean = false;

  /**
   * An array of errors for the state
   * @type {Array}
   * @private
   */
  private _errors: Array<string> = [];

  /**
   * An array of warning for the state
   * @type {Array}
   * @private
   */
  private _warnings: Array<string> = [];

  /**
   * Represents a function that will be called when the state changes
   */
  private _onStateUpdate: Function;

  /**
   * A boolean representing whether the UI element should be disabled.
   *
   * This may be modified by the rules.
   * @returns {boolean}
   */
  get isDisabled(): boolean {
    return this._isDisabled;
  }

  set isDisabled(isDisabled: boolean) {
    if (this._isDisabled !== isDisabled) {
      this._isDisabled = isDisabled;
      this._onStateUpdate();
    }
  }

  /**
   * A boolean representing whether the UI element should be hidden.
   *
   * This may be modified by the rules.
   * @returns {boolean}
   */
  get isHidden(): boolean {
    return this._isHidden;
  }

  set isHidden(isHidden: boolean) {
    if (this._isHidden !== isHidden) {
      this._isHidden = isHidden;
      this._onStateUpdate();
    }
  }

  /**
   * A boolean representing whether the UI element has warnings (soft-errors).
   *
   * NOTE: If this value is set to false, the warnings array will be emptied.
   *
   * @returns {boolean}
   */
  get hasWarnings(): boolean {
    return this._hasWarnings;
  }

  /**
   * Sets the has warnings indicator, clearing out any warnings if set to false
   * @param {boolean} hasWarnings
   */
  set hasWarnings(hasWarnings: boolean) {
    if (this._hasWarnings !== hasWarnings) {
      this._hasWarnings = hasWarnings;
      if (!hasWarnings) {
        this._warnings = [];
      }
      this._onStateUpdate();
    }
  }

  /**
   * A boolean representing whether the UI element has errors (hard-errors).
   *
   * NOTE: If this value is set to false, the errors array will be emptied.
   *
   * @returns {boolean}
   */
  get hasErrors(): boolean {
    return this._hasErrors;
  }

  /**
   * Sets the has errors indicator, clearing out any errors if set to false
   * @param {boolean} hasErrors
   */
  set hasErrors(hasErrors: boolean) {
    if (this._hasErrors !== hasErrors) {
      this._hasErrors = hasErrors;
      if (!hasErrors) {
        this._errors = [];
      }
      this._onStateUpdate();
    }
  }

  /**
   * A boolean representing whether the UI element is valid. This is a read-only derived field.
   *
   * This is not applicable to choices.
   * @returns {boolean}
   */
  get isValid(): boolean {
    return (!this._hasWarnings && !this._hasErrors);
  }

  /**
   * A boolean representing whether the UI element is required. This may be modified by the rules.
   *
   * This is only applicable to controls - not to categories, sections, or choices.
   * @returns {boolean}
   */
  get isRequired(): boolean {
    return this._isRequired;
  }

  /**
   * Sets the if the state is required
   * @param {boolean} isRequired
   */
  set isRequired(isRequired: boolean) {
    if (this._isRequired !== isRequired) {
      this._isRequired = isRequired;
      this._onStateUpdate();
    }
  }

  /**
   * A boolean representing whether the UI element is dirty.
   *
   * This is modified by a {@link DataManager} instance when a model is updated by the UI.
   *
   * This is not applicable to choices.
   * @returns {boolean}
   */
  get isDirty(): boolean {
    return this._isDirty;
  }

  /**
   * Sets if the state is dirty
   * @param {boolean} isDirty
   */
  set isDirty(isDirty: boolean) {
    if (this._isDirty !== isDirty) {
      this._isDirty = isDirty;
      this._onStateUpdate();
    }
  }

  /**
   * An array of warning messages to be displayed under the element.
   *
   * This may be modified by the rules, by schema validation, or by PPC validation.
   *
   * NOTE: If there are no warning messages, hasWarnings will be set to false and vice versa.
   *
   * This is only applicable to questions.
   */
  get warnings(): Array<string> {
    return this._warnings;
  }

  /**
   * Sets the warnings for this state
   * @param {Array<string>} warnings
   */
  set warnings(warnings: Array<string>) {
    if (this._warnings !== warnings) {
      this._warnings = warnings;
      this._hasWarnings = (warnings.length !== 0);
      this._onStateUpdate();
    }
  }

  /**
   * An array of error messages to be displayed under the element.
   *
   * This may be modified by the rules, by schema validation, or by PPC validation.
   *
   * NOTE: If there are no error messages, hasErrors will be set to false and vice versa.
   *
   * This is only applicable to questions.
   */
  get errors(): Array<string> {
    return this._errors;
  }

  /**
   * Sets the errors for this state
   * @param {Array<string>} errors
   */
  set errors(errors: Array<string>) {
    if (this._errors !== errors) {
      this._errors = errors;
      this._hasErrors = (errors.length !== 0);
      this._onStateUpdate();
    }
  }

  /**
   * An array of all current error and warning messages. This is a read-only derived field.
   *
   * This is only applicable to questions.
   *
   * @returns {Array<string>}
   */
  get messages(): Array<string> {
    return [...this._errors, ...this._warnings];
  }

  /**
   * Sets the completion of the section
   * @param {boolean} complete
   */
  set isComplete(complete: boolean) {
    this._isComplete = complete;
    this._onStateUpdate();
  }

  /**
   * Returns a boolean indicating if the item is complete
   * @returns {boolean}
   */
  get isComplete(): boolean {
    return this._isComplete;
  }

  /**
   * Construct a new instance
   * @param json a JSON representation of the state
   */
  constructor(json: any, onStateUpdate?: () => void) {
    this._isDisabled = json.isDisabled || false;
    this._isHidden = json.isHidden || false;
    this._hasErrors = json.hasErrors || false;
    this._hasWarnings = json.hasWarnings || false;
    this._isRequired = json.isRequired || false;
    this._isDirty = json.isDirty || false;
    if (onStateUpdate) {
      this._onStateUpdate = onStateUpdate;
    } else {
      this._onStateUpdate = () => {
      };
    }
  }
}
