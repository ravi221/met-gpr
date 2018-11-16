import {Component} from '@angular/core';
import {FormControl} from '../form-control';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';

/**
 * This can be used to display static text in a form, but it can also be
 * used as a fallback in a dynamic form where the control type is unknown.
 */
@Component({
  selector: 'gpr-static-text',
  template: `<label>{{value}}</label>`
})
@FormControlClassProviderService.Register(['static', 'static-text', 'fallback', 'default', ''])
export class StaticTextComponent extends FormControl {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }
}
