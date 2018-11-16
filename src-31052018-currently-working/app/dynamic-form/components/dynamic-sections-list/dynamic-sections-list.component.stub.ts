import {Component, Input} from '@angular/core';
import FormConfig from '../../config/form-config';
import DataManager from '../../classes/data-manager';

/**
 * Stub of {@link DynamicSectionsListComponent}
 */
@Component({selector: 'gpr-dynamic-sections-list', template: ``})
export class DynamicSectionsListStubComponent {
  @Input() config: FormConfig;
  @Input() model: DataManager;
}
