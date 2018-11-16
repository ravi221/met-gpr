import {Component, EventEmitter, Input, Output} from '@angular/core';
import ChoiceConfig from '../../../forms-controls/config/choice-config';

/**
 * A stub component for {@link HistoryHeadingComponent}
 */
@Component({
  selector: 'gpr-history-heading', template: ``})
export class HistoryHeadingStubComponent {
  @Input() customerName: string;
  @Input() customerNumber: string;
  @Input() effectiveDate: string;
  @Output() commentsShow: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectOption: EventEmitter<ChoiceConfig> = new EventEmitter<ChoiceConfig>();
}
