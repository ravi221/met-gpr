import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import DataManager from '../../../classes/data-manager';
import {DynamicFormBaseComponent} from '../../dynamic-form-base/dynamic-form-base.component';
import {GroupedQuestionConfig} from '../../../config/grouped-question-config';

@Component({
  selector: `gpr-table-modal`,
  template: ``,
  styleUrls: ['./dynamic-form-table.component.scss']
})
/**
 * The component for data stored in tables
 */
export class TableModalStubComponent extends DynamicFormBaseComponent {
  /**
   * The configuration for the input group
   */
  @Input() config: GroupedQuestionConfig;
  /**
   * An {@link DataManager} wrapping the model object to be edited through the form
   */
  @Input() model: DataManager;

  /**
   * Alerts the parent component that the question has been answered for the first time
   */
  @Output() answeredQuestion: EventEmitter<void> = new EventEmitter<void>();
}
