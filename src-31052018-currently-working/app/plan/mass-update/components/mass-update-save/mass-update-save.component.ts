import {Component, OnDestroy} from '@angular/core';
import {SaveComponent} from '../../../plan-shared/abstract-components/save-component';
import {Subscription} from 'rxjs/Subscription';
import {SubscriptionManager} from '../../../../core/utilities/subscription-manager';
import {PlanDataEntryService} from '../../../plan-data-entry/services/plan-data-entry.service';
import {LoadingSpinnerService} from '../../../../ui-controls/services/loading-spinner.service';
import {MassUpdateDataService} from '../../services/mass-update-data.service';

/**
 * A component that handles saving related functionality for mass update
 */
@Component({
  selector: 'gpr-mass-update-save',
  template: `
    <gpr-snack-bar [show]="true" [autoHide]="autoHide">
      <p *ngIf="message.text"><i class="material-icons">{{message.icon}}</i>&nbsp;&nbsp;{{message.text}}</p>
      <button [disabled]="isSaveDisabled" (click)="save()">SAVE</button>
    </gpr-snack-bar>
  `,
  styleUrls: ['./mass-update-save.component.scss']
})
export class MassUpdateSaveComponent extends SaveComponent implements OnDestroy {

  /**
   * The default constructor.
   */
  constructor(_dataService: MassUpdateDataService, _loadingSpinnerService: LoadingSpinnerService) {
    super(_dataService, _loadingSpinnerService);
  }
  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy() {
    const subscriptions: Subscription[] = [this._formSub, this._saveServiceSubscription, this._sectionSub];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }
}
