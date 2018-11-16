import {Component, Input} from '@angular/core';
import FormConfig from '../../config/form-config';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import DataManager from '../../classes/data-manager';

/**
 * Stub of {@link DynamicFormComponent}
 */
@Component({selector: 'gpr-dynamic-form', template: ``})
export class DynamicFormStubComponent {
  @Input() config: FormConfig;
  @Input() model: DataManager;
  @Input() plan: IPlan;
  @Input() customerNumber: number;
}
