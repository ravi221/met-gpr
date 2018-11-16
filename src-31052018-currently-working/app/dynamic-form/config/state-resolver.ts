/**
 * This abstract class handles the logic of propagating a change event up the UI hierarchy when there is an update to the state of a {@link CategoryConfig}, {@link SectionConfig}, or {@link FormControlConfig} instance.
 *
 * The above classes utilizes this class to set up the initial state of that instance and to relay the appropriate input callback.
 *
 * This approach ensures that the parent state is properly updated and aligns with the current state of its children.
 *
 */
import StateConfig from '../../forms-controls/config/state-config';

export abstract class StateResolver {

  /**
   * Internal map on current children instances that have errors.
   * @type {number}
   * @private
   */
  private _childErrorsMap: Map<string, boolean> = new Map();
  /**
   * Internal map on current children instances that have warnings.
   * @type {number}
   * @private
   */
  private _childWarningsMap: Map<string, boolean> = new Map();
  /**
   * Internal map on current children instances that are dirty.
   * @type {number}
   * @private
   */
  private _childDirtyMap: Map<string, boolean> = new Map();
  /**
   * Internal store of the state of instance.
   */
  private _state: StateConfig;
  /**
   * Internal function that will be initialized during the construction of this instance to execute the passed in callback.
   */
  private _onStateUpdate;

  /**
   * Initializes the callback to execute when state is updated and constructs the initial state of this instance.
   * @param {string} sourceId
   * @param stateJson
   * @param {(newState: StateConfig) => void} onStateUpdate
   */
  constructor(sourceId: string, stateJson: any, onStateUpdate: (sourceId: string, newState: StateConfig) => void) {
    this._onStateUpdate = () => {
      onStateUpdate(sourceId, this.state);
    };
    this._state = new StateConfig(stateJson, this._onStateUpdate);
  }

  /**
   * Method to be jointly used across subclasses to handle a state update by the subclass's children.
   *
   * NOTE: Due to the synchronous nature of this callback execution, we use maps to store the aggregate children states to ensure that we don't process duplicated entries.
   *
   * @param {string} sourceId
   * @param {StateConfig} newState
   * @private
   */
  protected _onChildUpdate = (sourceId: string, newState: StateConfig) => {
    // update validity of instance based upon validity of all child nodes under instance.
    if (newState.hasWarnings) {
      this._childWarningsMap.set(sourceId, true);
    } else {
      this._childWarningsMap.delete(sourceId);
    }

    if (newState.hasErrors) {
      this._childErrorsMap.set(sourceId, true);
    } else {
      this._childErrorsMap.delete(sourceId);
    }

    this.state.hasWarnings = (this._childWarningsMap.size > 0);
    this.state.hasErrors = (this._childErrorsMap.size > 0);

    // update dirty state of instance based upon dirty state of all child nodes under instance.
    if (newState.isDirty) {
      this._childDirtyMap.set(sourceId, true);
    } else {
      this._childDirtyMap.delete(sourceId);
    }
    this.state.isDirty = (this._childDirtyMap.size > 0);

    // if child is not hidden but instance is, update hidden attribute to false.
    if (this._state.isHidden && !newState.isHidden) {
      this.state.isHidden = false;
    }

    // if child is not disabled but instance is, update disabled attribute to false.
    if (this._state.isDisabled && !newState.isDisabled) {
      this.state.isDisabled = false;
    }
  }

  /**
   * Gets the number of errors (read-only).
   * @returns {number}
   */
  get errorCount() {
    return this._childErrorsMap.size;
  }

  /**
   * Gets the number of warnings (read-only).
   * @returns {number}
   */
  get warningCount() {
    return this._childWarningsMap.size;
  }

  /**
   * Gets the current state of this instance.
   * @returns {StateConfig}
   */
  get state(): StateConfig {
    return this._state;
  }

  /**
   * Sets the current state to a different value and handles the callback to alert parent instance that change has occurred.
   * @param {StateConfig} newState
   */
  set state(newState: StateConfig) {
    if (this._state !== newState) {
      this._state = newState;
      this._onStateUpdate();
    }
  }
}
