import {Injectable, Type} from '@angular/core';
import {FormControl} from '../components/form-control';

/**
 * Responsible for maintaining a registry of all of the {@link FormControl} classes,
 * accessible by a set of aliases.
 *
 * To be registered, the class must include the {@link Register} decorator
 */
@Injectable()
export class FormControlClassProviderService {
  /**
   * A map to hold all form controls. This is populated via the Register function below. The Register function
   * is used as a decorator on the form control classes to map a unique text value to the form control
   * @type {Map<any, any>}
   */
  public static DYNAMIC_FORM_CONTROLS_MAP: Map<string, Type<FormControl>> = new Map();

  /**
   * A class decorator which should be included on all subclasses of {@link FormControl}
   * that need to be instantiated by the {@link DynamicFormControlComponent}.  Including
   * this decorator after the Component decorator will register the constructor of the class
   * with the {@link FormControlClassProviderService} so that it can be accessed by any of the registered aliases.
   *
   * You can register a component like this:
   *
   * ```typescript
   * \@Component({ ... })
   * \@FormControlClassProviderService.Register(['example-alias', 'another-alias'])
   * export class MyFormControl extends FormControl {
   *   ...
   * }
   * ```
   *
   * And then elsewhere in the application...
   *
   * ```typescript
   * \@Component({ ... })
   * export class SomeOtherComponent {
   *   constructor(private _formControlProvider: FormControlClassProviderService) {}
   *
   *   doSomethingWithAFormControlClass() {
   *     this._formControlProvider.getFormControlClass('example-alias'); // Works!
   *     this._formControlProvider.getFormControlClass('another-alias'); // Works!
   *   }
   * }
   * ```
   */
  public static Register (aliases: Array<string> = []) {
    return (annotatedClass: Function) => {
      let formControlType: Type<FormControl> = annotatedClass as Type<FormControl>;

      if (aliases && aliases.length) {
        aliases.forEach(addKey);
      }
      return formControlType;

      /**
       * Adds a unique key to the map of form controls
       * @param {string} key
       */
      function addKey(key: string) {
        if (FormControlClassProviderService.DYNAMIC_FORM_CONTROLS_MAP.has(key)) {
          throw new Error(`The form control alias '${key}' is already registered!`);
        }
        FormControlClassProviderService.DYNAMIC_FORM_CONTROLS_MAP.set(key, formControlType);
      }
    };
  }

  /**
   * Takes a key (either the class name or an alias) for one of our form
   * control classes (subclasses of {@link FormControl}) and returns the
   * class itself (which is also the constructor)
   */
  public getFormControlClass(key: string): Type<FormControl> {
    return FormControlClassProviderService.DYNAMIC_FORM_CONTROLS_MAP.get(key);
  }
}
