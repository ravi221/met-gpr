import StateConfig from '../../../app/forms-controls/config/state-config';


export   function onChildUpdate(sourceId: string, newState: StateConfig) {
  /* // update validity of instance based upon validity of all child nodes under instance.
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
  } */
}
