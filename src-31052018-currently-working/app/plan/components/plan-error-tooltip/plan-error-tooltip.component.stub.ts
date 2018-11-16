import {Component, Input} from '@angular/core';

/**
 * A stub component for the {@link PlanErrorTooltipComponent}
 */
@Component({selector: 'gpr-plan-error-tooltip', template: ``})
export class PlanErrorTooltipStubComponent {
  @Input() errorCount: number = 0;
  @Input() planId: string;
}
