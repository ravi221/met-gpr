import {Component, Input} from '@angular/core';
import {AnimationState} from '../../animations/AnimationState';

@Component({selector: 'gpr-loading-spinner', template: ``})
export class LoadingSpinnerStubComponent {
  @Input() state: AnimationState = AnimationState.HIDDEN;
}
