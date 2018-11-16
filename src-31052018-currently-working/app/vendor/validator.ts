import {Validator as SchemaValidator, Schema, Options} from 'jsonschema';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

/**
 * Default validation result
 * @type {{isValid: boolean; messages: Array}}
 */
const DEFAULT_RESULT = {
  isValid: true,
  messages: []
};
/**
 * This class is a wrapper for the https://github.com/tdegrunt/jsonschema library.
 *
 * To run a simple validation:
 * ```typescript
 *
 * const validator = new Validator();
 * const value = 4;
 * const schema = {"type": "number"};
 *
 * console.log(validator.validate(value, schema); // should return successful validation!
 *
 * // you can subscribe to the validation observable to know when any validations are ran
 * const subscription = validator.source.subscribe((result) => {...});
 *
 * ```
 */
export class Validator {

  /**
   * Private instance of the json schema validator class.
   */
  private _schemaValidator: SchemaValidator;
  /**
   * Private subject to be observed upon.
   * @type {Subject<IObservedValidation>}
   */
  private validationSubject: Subject<IObservedValidation> = new Subject<IObservedValidation>();
  /**
   * Observable that can be subscribed to for updates in validation.
   * @type {Observable<IObservedValidation>}
   */
  source: Observable<IObservedValidation> = this.validationSubject.asObservable();

  /**
   * Constructs new instance of json schema validator.
   */
  constructor() {
    this._schemaValidator = new SchemaValidator();
  }

  /**
   * Validates a value against the provided schema.
   * @param {string} id
   * @param value
   * @param {Schema} schema
   * @param {Options} options
   * @returns {IValidationResult}
   */
  validate(id: string, value: any, schema: Schema, options?: Options): IValidationResult {
    const validationResult = Object.assign({}, DEFAULT_RESULT);
    if (this.isNilOrEmpty(value)) {
      return validationResult;
    }
    const schemaResult = this._schemaValidator.validate(value, schema, options);

    validationResult.isValid = schemaResult.valid;
    validationResult.messages = !schemaResult.valid ? schemaResult.errors.map((e) => e.toString()) : [];

    this.validationSubject.next(<IObservedValidation>{id: id, validationResult: validationResult});

    return validationResult;
  }

  /**
   * Private method to check if value is null, undefined or empty.
   *
   * TODO: Possibly move this out to utility class.
   * @param value
   * @returns {boolean}
   */
  private isNilOrEmpty(value: any) {
    return (typeof value === 'undefined' || value === null || value === '');
  }
}

/**
 * Describes the shape of an observed object that's provided in the subscription handler.
 */
export interface IObservedValidation {
  /**
   * The id of the attribute being validated.
   */
  id: string;
  /**
   * The result of the validation.
   */
  validationResult: IValidationResult;
}

/**
 * Describes the shape of a validation result returned by schema validator.
 */
export interface IValidationResult {
  /**
   * Indicates whether the instance is valid.
   */
  isValid: boolean;
  /**
   * Messages provided by validator.
   */
  messages: Array<string>;
}
