import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {DataManagerSubscriptionType} from '../../../enumerations/data-manager-subscription-type';
import {GroupedQuestionConfig} from '../../../config/grouped-question-config';
import {SubscriptionManager} from '../../../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';
import {IObservedModel} from '../../../../entity/entity';
import {DynamicFormBaseComponent} from '../../dynamic-form-base/dynamic-form-base.component';
import {DynamicFormTableService} from '../../../services/dynamic-form-table.service';
import {DataType} from '../../../enumerations/data-type';
import {FormUtility} from '../../../classes/form-utility';
import QuestionConfig from '../../../config/question-config';
import {FormControl} from '../../../../forms-controls/components/form-control';

@Component({
  selector: `gpr-table-modal`,
  template: `
    <fieldset class="control-group modal-table">
      <div class="flex-container-column">
      <div class="flex-container-row">
        <div class="flex-container-column">
          <div class="control-label row-number">#</div>
          <div class="control-label row-number" *ngFor="let row of rows; let i = index">
            {{i + 1}}
          </div>
          <a class="add-row" (click)="addRow()">Add Another</a>
        </div>
        <div *ngFor="let formItem of config.formItems as QuestionConfig" class="flex-container-column">
          <div class="table-header"> {{formItem.label}}</div>
          <div class="table-content" *ngFor="let row of rows; let j = index"
               [class.drop-down]="formItem.control.type === 'drop-down' || formItem.control.type === 'select'">
            <gpr-dynamic-form-control
              [value]="modelDataMap.get(formItem.formItemId)[j]"
              [config]="formItem"
              [id]="formItem.formItemId"
              [type]="formItem.control.type"
              [choices]="formItem.control.choices"
              [isDisabled]="formItem.control.state?.isDisabled"
              [isHidden]="formItem.control.state?.isHidden"
              [isValid]="formItem.control.state?.isValid"
              [isRequired]="formItem.control.state?.isRequired"
              (valueChanged)="onValueChanged($event, j)">
            </gpr-dynamic-form-control>
          </div>
        </div>
        <div class="flex-container-column">
          <div class="table-header"></div>
          <div *ngFor="let row of rows; let k = index " class="table-content-remove">
            <gpr-icon *ngIf="rows.length> 1 " [name]="'remove'" (click)="removeRow(k)"></gpr-icon>
          </div>
        </div>
      </div>
      </div>
    </fieldset>`,
  styleUrls: ['./dynamic-form-table.component.scss'],
})
/**
 * The component for data stored in tables
 */
export class TableModalComponent extends DynamicFormBaseComponent implements OnInit, OnDestroy {

  /**
   * Set the display of the component to be inline-block
   */
  @HostBinding('style.display') display = 'inline-block';

  /**
   * Set the overflow for the component to be auto
   */
  @HostBinding('style.overflow') overflow = 'auto';

  /**
   * The configuration for the input group
   */
  @Input() config: GroupedQuestionConfig;

  /**
   * Associates each form item with an array of values
   */
  public modelDataMap: Map<string, any[]> = new Map<string, any[]>();

  /**
   * The number of rows in the table. Set to one by default
   * @type {number}
   */
  public rowCount: number = 1;

  /**
   * Contains an index for each row
   * @type {number[]}
   */
  public rows: number[] = [1];

  /**
   * An array of subscriptions
   * @type {any[]}
   * @private
   */
  private _subscriptions: Subscription[] = [];

  /**
   * Get an instance of the table service
   * @param {DynamicFormTableService} _dynamicFormTableService
   */
  constructor(private _dynamicFormTableService: DynamicFormTableService) {
    super();
  }

  /**
   * create a map and map each formItem to a column
   */
  ngOnInit() {
    this._initializeData();
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    SubscriptionManager.massUnsubscribe(this._subscriptions);
    const emptyRows = this._dynamicFormTableService.getEmptyRows(this.config, this.model, this.rows);
    this.config.formItems.forEach( (formItem: QuestionConfig) => {
      emptyRows.sort( (a, b) => b - a);
      emptyRows.forEach( (row) => {
        const newRow = this._dynamicFormTableService.removeRow(row, this.modelDataMap.get(formItem.formItemId));
        this._updateModel(formItem.formItemId, newRow);
      });
    });
  }

  /**
   * Removes a specified row from the table
   * @param {number} rowNum
   */
  public removeRow(rowIndex: number): void {
    this.config.formItems.forEach( (formItem: QuestionConfig) => {
      const newRow = this._dynamicFormTableService.removeRow(rowIndex, this.modelDataMap.get(formItem.formItemId));
      this._updateModel(formItem.formItemId, newRow);
    });
    this.rows.pop();
  }

  /**
   * Adds a row to the table
   */
  public addRow(): void {
    this.config.formItems.forEach( (formItem: QuestionConfig) => {
      const newRow = this._dynamicFormTableService.addRow(this.modelDataMap.get(formItem.formItemId));
      this._updateModel(formItem.formItemId, newRow);
    });
    this.rows.push(null);
  }

  /**
   * Checks if the value exists for the input question. Sets the corresponding index in the values array and then places that array in the model. The index is capped by the rowCount,
   * and the length of the array is equal to the rowCount
   * @param question
   * @param {number} index
   * @Override
   */
  public onValueChanged(question: FormControl, index?: number): void {
    if (this.model) {
      if (FormUtility.isSchemaTypeNumber(question.config.schema.type) && typeof question.value === DataType.STRING) {
        question.value = parseInt(question.value);
      }
      let dataArray = this.modelDataMap.get(question.id);
      dataArray[index] = question.value;
      this.model.setById(question.id, dataArray);
    }
  }

  /**
   * Initializes the data of the table
   * @private
   */
  private _initializeData(): void {
    this.config.formItems.forEach( (formItem: QuestionConfig) => {
      let dataArray: any[] = this.model.getById(formItem.formItemId);
      if (!dataArray) {
        dataArray = [null];
      }
      this.rowCount = dataArray.length > this.rowCount ? dataArray.length : this.rowCount;
      this._updateModel(formItem.formItemId, dataArray);
      this._subscriptions.push(this.model.subscribe(`${DataManagerSubscriptionType.VIEW_MODEL}:${formItem.formItemId}`,
        (model: IObservedModel) => this.modelDataMap.set(formItem.formItemId, model.currentValue)));
    });
    this.rows = this._dynamicFormTableService.initializeTable(this.rowCount);
  }

  /**
   * Updates the map and data model for a specific question and row
   * @private
   */
  private _updateModel(formItemId: string, newRow: number[] | string[]): void {
    this.modelDataMap.set(formItemId, newRow);
    this.model.setById(formItemId, newRow);
  }

}
