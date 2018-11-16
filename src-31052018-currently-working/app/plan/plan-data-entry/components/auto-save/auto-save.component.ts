import {Component, OnChanges, OnDestroy, OnInit, Type} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {SaveUtility} from '../../../plan-shared/utilities/save-utility';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {SubscriptionManager} from '../../../../core/utilities/subscription-manager';
import {PlanDataEntryService} from '../../services/plan-data-entry.service';
import {ModalService} from '../../../../ui-controls/services/modal.service';
import {LoadingSpinnerService} from '../../../../ui-controls/services/loading-spinner.service';
import {ConfirmDialogComponent} from '../../../../ui-controls/components/modal/confirm-dialog/confirm-dialog.component';
import {SaveComponent} from '../../../plan-shared/abstract-components/save-component';


/**
 * An auto-save component class that subscribes to an {@link Entity} instance's form observable to react to form changes.
 */
@Component({
  selector: 'gpr-auto-save',
  template: `
    <gpr-snack-bar [show]="true" [autoHide]="autoHide">
      <p *ngIf="message.text"><i class="material-icons">{{message.icon}}</i>&nbsp;&nbsp;{{message.text}}</p>
      <button [disabled]="isSaveDisabled" (click)="save()">SAVE</button>
    </gpr-snack-bar>
  `,
  styleUrls: ['./auto-save.component.scss']
})
export class AutoSaveComponent extends SaveComponent implements OnDestroy  {

  /**
   * Subject for the timer. Allows for the timer to be destroyed along with the subscription to the timer.
   * @type {Subject<boolean>}
   * @private
   */
  private _destroy: Subject<boolean> = new Subject<boolean>();

  /**
   * The amount of time to wait to autosave
   * @type {number}
   */
  public readonly SAVE_TIME_MS: number = 120000;

  /**
   * The default constructor.
   */
  constructor(_dataService: PlanDataEntryService, private _modalService: ModalService, _loadingSpinnerService: LoadingSpinnerService) {
    super(_dataService, _loadingSpinnerService);
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy() {
    const subscriptions: Subscription[] = [this._formSub, this._saveServiceSubscription, this._sectionSub];
    SubscriptionManager.massUnsubscribe(subscriptions);
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }

  /**
   * Returns a modal dialog to confirm if the user would like to save
   * @returns {Observable<boolean> | boolean}
   */
  public openSaveModal(): Observable<boolean> {
    if ( this._isDirty === false || !this.model.isValid()) {
      return Observable.of(true);
    }
    this._loadingSpinnerService.hide();
    const component = ConfirmDialogComponent as Type<Component>;
    const inputs = new Map<string, any>();
    inputs.set('message', 'You have unsaved changes. Would you like to save?');
    inputs.set('confirmText', 'Yes');
    inputs.set('cancelText', 'No');
    inputs.set('isAsync', true);
    inputs.set('args', [this.model, this.customerNumber, this.planStatus, this.planId, this._dataService]);
    inputs.set('action', SaveUtility.saveData);
    return this._modalService.open(component, {
      backdrop: true,
      size: 'sm',
      inputs: inputs,
      closeOnEsc: true,
      title: 'Save Confirmation'
    }).onClose;
  }

  /**
   * Override set up save and adds a two minute timer
   * @private
   */
  protected _setUpSave() {
    if (this._dataService.canSave()) {
      this.isSaveDisabled = false;
    }
    Observable.interval(this.SAVE_TIME_MS).takeUntil(this._destroy).subscribe(() => {
      if (this._isDirty) {
        this.save();
        this._isDirty = false;
      }
    });
  }
}

