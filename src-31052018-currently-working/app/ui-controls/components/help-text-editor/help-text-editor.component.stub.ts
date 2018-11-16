import {Component, EventEmitter, Input, Output} from '@angular/core';
import QuestionConfig from '../../../dynamic-form/config/question-config';

@Component({
  selector: 'gpr-help-text-editor',
  template: ``
})
export class HelpTextEditorStubComponent {
  /**
   *
   * @type {EventEmitter<any>}
   */
  @Output() saveHelpText: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {EventEmitter<any>}
   */
  @Output() cancelHelpText: EventEmitter<any> = new EventEmitter();


  /**
   * The configuration for the question
   */
  @Input() config: QuestionConfig;
}
