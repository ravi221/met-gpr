import {Component, Input, Type} from '@angular/core';
import {GroupedQuestionConfig} from '../../../config/grouped-question-config';
import {DynamicFormBaseComponent} from '../../dynamic-form-base/dynamic-form-base.component';
import {ModalRef} from '../../../../ui-controls/classes/modal-references';
import {TableModalComponent} from './table-modal.component';
import {ModalService} from '../../../../ui-controls/services/modal.service';
import { IFlag } from 'app/flag/interfaces/iFlag';

@Component({
  selector: `gpr-dynamic-form-table`,
  template: ` <fieldset class="control-group" >
      <table class="question-table">
        <tr>
          <td>
            <span class="control-number">{{index}}.</span>
          </td>
          <td>
            <label class="control-label">{{config.label}}&nbsp;</label>
          </td>
        </tr>
      </table>
      <button class="btn btn-secondary open-table-btn" (click)="handleTableOpen()">Open Table</button>
  </fieldset>`,
  styleUrls: ['./dynamic-form-table.component.scss']
})
/**
 * Opens the modal for tabled form items
 */
export class TableComponent extends DynamicFormBaseComponent {
  /**
   * The configuration for the input group
   */
  @Input() config: GroupedQuestionConfig;

  /**
   * Get a copy of the modal service
   * @param {ModalService} _modalService
   */
  constructor(private _modalService: ModalService) {
    super();
  }

  /**
   * Opens a table modal and returns a reference to that modal
   * @returns {ModalRef}
   * @private
   */
  private _openTableModal(): ModalRef {
    const componentType: Type<Component> = TableModalComponent as Type<Component>;
    const inputs: Map<string, any> = new Map<string, any>();
    inputs.set('config', this.config);
    inputs.set('model', this.model);
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'lg',
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'gpr-table-modal',
      title: this.config.label
    });
  }

  /**
   * Handles the opening of the table
   */
  public handleTableOpen(): void {
    this._openTableModal();
  }
}
