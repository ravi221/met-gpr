import {Component} from '@angular/core';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {FormControl} from '../form-control';

/**
 * The {@link FormControl} implementation for the {@link AddRemoveListComponent}
 */
@Component({
  selector: 'gpr-add-remove-list-control',
  template: `
    <gpr-add-remove-list [id]="id"
                         [isDisabled]="isDisabled"
                         [selectableChoices]="choices"
                         [selectedValues]="value"
                         (selectedValuesChange)="onValueChanged($event)"></gpr-add-remove-list>
  `
})
@FormControlClassProviderService.Register(['add-remove-list'])
export class AddRemoveListControlComponent extends FormControl  {
  /**
   * Delegate construction to the superclass
   */
  constructor() {
    super();
  }
}
