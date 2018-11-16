import {isNil, isArray, cloneDeep, get, set} from 'lodash';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

/**
* A data model management class that shields direct updates to a given data object.
*
* Exposes an observable to allow notification of data model updates.
*
* To create a new entity from a data model:
*
* ```typescript
* const dataModel = {person: {firstName: 'Tom', lastName: 'Smith'} };
* const entity = new Entity(dataModel);
*
* // To update first name of person
* entity.setIn('person.firstName', 'John');
*
* const firstName = entity.getIn('person.firstName'); // should return 'John';
*
* // To subscribe to model updates
* entity.source.subscribe((updated) => {
*  console.log(updated); // should log {path:'person.firstName', previousValue: 'Tom', currentValue: 'John'}
* });
*
* ```
*/

export class Entity {

/**
* Private data model object.
* @type {{}}
* @private
*/
private _store: any = {};

/**
* The subject that is observed upon.
* @type {Subject<IObservedModel>}
* @private
*/
private _dataSubject: Subject <IObservedModel> = new Subject<IObservedModel>();

/**
* The observable that can be subscribed to for notification of data model updates.
* @type {Observable<IObservedModel>}
*/
public source: Observable <IObservedModel> = this._dataSubject.asObservable();

/**
* Creates a deep copy of inbound data model.
* TODO: Consider using immutable.js versus deep cloning?
* @param data
*/
constructor(data: any) {
    this._store = cloneDeep(data);
  }

  /**
   * Function to get a value given the dot notated path to that value in the model.
   * @param {string} path
   * @returns {any}
   *
   * NOTE: Function is created as a property in order to preserve the 'this' context.
   *
   * This method is only intended to by used by DSL and subclasses.
   */
  public getIn = (path: string): any => {
    if (isNil(path)) {
      return;
    }
    return cloneDeep(get(this._store, path));
  }

  /**
   * Function to check for a value inside an array of values given the dot notated path to that values array in the model.
   * Used for checkboxes and any other controls where multiple values can be selected
   * @param {string} path
   * @param {any} value
   * @returns {boolean}
   *
   * NOTE: Function is created as a property in order to preserve the 'this' context.
   *
   * This method is only intended to by used by DSL and subclasses.
   */
  public isIn = (path: string, value: any): boolean => {
    if (isNil(path) || isNil(value)) {
      return false;
    }
    const clonedData = cloneDeep(get(this._store, path));
    if (clonedData === undefined || !isArray(clonedData)) {
      return false;
    }
    return clonedData.indexOf(value) > -1;
  }

  /**
   * Function to set a value given the dot notated path in the model.
   * @param {string} path
   * @param newValue
   * @returns {Observable<IObservedModel>}
   *
   * NOTE: Function is created as a property in order to preserve the 'this' context.
   *
   * This method is only intended to by used by DSL and subclasses.
   */
  public setIn = (path: string, newValue: any): Observable<IObservedModel> => {
    if (isNil(path)) {
      return;
    }
    const modelPath = isArray(path) ? path.join('.') : path;
    const currentValue = this.getIn(modelPath);

    if (currentValue !== newValue) {
      set(this._store, modelPath, newValue);
      const observedModel: IObservedModel = {path: modelPath, previousValue: currentValue, currentValue: newValue};
      this.emitSource(observedModel);
    }
    return this.source;
  }

  /**
   * Function to return a deep copy of the current data model.
   * @returns {any}
   *
   * NOTE: Function is created as a property in order to preserve the 'this' context.
   */
  public toJS = () => {
    return cloneDeep(this._store);
  }

  /**
   * Function to return a JSON representation of the data model.
   * @returns {string}
   *
   * NOTE: Function is created as a property in order to preserve the 'this' context.
   */
  public toJSON = () => {
    return JSON.stringify(this._store);
  }

  /**
   * Emits the source to notify all subscribers that the model has been updated.
   * @param {IObservedModel} observed
   * @returns {Observable<IObservedModel>}
   */
  public emitSource(observed: IObservedModel): Observable<IObservedModel> {
    this._dataSubject.next(observed);
    return this.source;
  }
}

/**
 * Describes the shape of the observed model that's provided in the subscription handler.
 */
export interface IObservedModel {
  /**
   * The path of the model that's associated to the update.
   */
  path: string;

  /**
   * The current updated value that was changed in the model.
   */
  currentValue: any;

  /**
   * The previous value in the model.
   */
  previousValue: any;

}
