import { Component, EventEmitter, Input, Output } from '@angular/core';
import QuestionConfig from '../../../dynamic-form/config/question-config';

import {IHelpText} from '../../../plan/interfaces/iHelpText';

/**
* A component to handle gpr help text updates
*/
@Component({
  selector: 'gpr-help-text-editor',
  template: `
    <section class="help-text-editor">
      <div class="textarea-editor">
        <label class="text-editor-label">Help Text</label>
        <textarea [(ngModel)]="config.help.helpText" name="help-text" rows="3" cols="65">></textarea>
      </div>
      <div class="text-editor">
        <label class="text-editor-label">Get more url</label>
        <input [(ngModel)]="config.help.helpUrl" name="url-text" type="text"
               class="text-editor-value text-editor">
      </div>

      <footer class="help-text-editor-footer">
        <button class="btn btn-tertiary" (click)="onCancelClick()">Cancel</button>
        <button class="btn btn-secondary" (click)="onSaveClick()">Save</button>
      </footer>
    </section>
  `,
  styleUrls: ['./help-text-editor.component.scss']
})

export class HelpTextEditorComponent {
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

  /**
   * Handles the confirm event of the close link.
   */
  public  onSaveClick(): void {
    this.saveHelpText.emit();
  }

  /**
   * Handles the cancel event of the dismiss link.
   */
  public  onCancelClick(): void {
    this.cancelHelpText.emit();
  }
}
