import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IPlan} from '../../interfaces/iPlan';
import FormConfig from '../../../../dynamic-form/config/form-config';
import {Subject} from 'rxjs/Subject';

@Component({selector: 'gpr-validate-plan', template: ``})
export class ValidatePlanStubComponent {
  @Input() plan: IPlan;
  @Input() config: FormConfig;
  @Input() saveSubject?: Subject<boolean>;
  @Output() saveDirtyData: EventEmitter<any> = new EventEmitter();
}
