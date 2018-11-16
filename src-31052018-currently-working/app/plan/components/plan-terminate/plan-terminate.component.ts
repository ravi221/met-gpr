import {Component} from '@angular/core';
import {isNil} from 'lodash';
import {ActiveModalRef} from 'app/ui-controls/classes/modal-references';
import {IDatePickerOutput} from '../../../ui-controls/interfaces/iDatePickerOutput';

@Component({
  selector: 'gpr-plan-terminate',
  template: `
    <header class="modal-header">
      <h2>Terminate Plan</h2>
    </header>
    <div class="modal-body">
      <div class="row">
        <p>
          Termination Date:
          <gpr-date-picker [shouldAllowInput]="true" [required]="true"
                           [dateFormat]="'MM/dd/yyyy'"
                           [flatPickerDateFormat]="'m/d/Y'"
                           [placeholder]="'mm/dd/yyyy'"
                           (dateChanged)="onDateSelected($event)"></gpr-date-picker>
        </p>
      </div>
      <div *ngIf="errorMessage" class="row">
        <p><label class="error">{{errorMessage}}</label></p>
      </div>
      <div *ngIf="warningMessage" class="row">
        <p><label class="warning">{{warningMessage}}</label></p>
      </div>
    </div>
    <div class="modal-footer">
      <a (click)="dismissModal()">Dismiss</a>
      <a (click)="closeModal()">Terminate Plan</a>
    </div>
  `,
  styleUrls: ['./plan-terminate.component.scss']
})
export class PlanTerminateComponent {

  /**
   * Minimum date that can be entered for the termination date.  Defaults to 90 days ago.
   */
  public minDate: number;
  /**
   * Message to display to user indicating if there is an error with the date entered
   */
  public errorMessage: string;
  /**
   * Message to display to user indicating if there is an issue with the date entered
   */
  public warningMessage: string;
  /**
   * Variable used to store the selected/entered date
   */
  public selectedDate: string;

  /**
   * 90 days represented in milliseconds
   */
  private _ninetyDaysInMilliseconds: number = (90 * 24 * 60 * 60 * 1000);

  /**
   * Default constructor
   * @param {ActiveModalRef} _activeModalRef
   */
  constructor(private _activeModalRef: ActiveModalRef) {
    this.minDate = new Date(Date.now() - this._ninetyDaysInMilliseconds).setHours(0, 0, 0, 0);
  }


  /**
   * modifies the date string to match the expected format
   * ensures that the date is not undefined before validation
   * @param date
   * @param plan
   */
  public onDateSelected(date: IDatePickerOutput): void {
    if (isNil(date)) {
      this.selectedDate = '';
    } else {
      this.selectedDate = date.dateString;
    }
    this.validateDate(this.selectedDate);
  }
  /**
   * checks that the date is after the min date
   * checks that the date is a sufficient number of characters
   * @param {string} dateToValidate
   */
  public validateDate(dateToValidate: string): boolean {
    let isValid = false;
    this.errorMessage = null;
    this.warningMessage = null;
    try {
      if (isNil(dateToValidate) || dateToValidate.length === 0) {
        this.errorMessage = 'Please enter a date';
      } else {
        const date = new Date(dateToValidate).setHours(0, 0, 0, 0);
        const inValidDate = isNil(date) || (dateToValidate.length > 0 && dateToValidate.length < 10);
        if (inValidDate) {
          this.errorMessage = 'Incorrect date/format';
        } else if (date < this.minDate) {
          this.warningMessage = 'You have entered a termination date 90 days prior to today';
          isValid = true;
        } else {
          this.errorMessage = null;
          this.warningMessage = null;
          isValid = true;
        }
      }
    } catch {
      this.errorMessage = 'Date is incorrect';
    }
    return isValid;
  }
  /**
   * Closes the modal window
   */
  public dismissModal(): void {
    this._activeModalRef.dismiss();
  }
  /**
   * Closes the modal window
   */
  public closeModal(): void {
    if (this.validateDate(this.selectedDate)) {
      this._activeModalRef.close(
        {
          terminationDate: this.selectedDate
        }
      );
    }
  }
}
