import {Component, OnDestroy, OnInit, EventEmitter, Output, ViewChild} from '@angular/core';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {ViewConfigDataService} from 'app/plan/plan-shared/services/view-config-data.service';
import {LogService} from 'app/core/services/log.service';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {Subscription} from 'rxjs/Subscription';
import {INavState} from 'app/navigation/interfaces/iNavState';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import FormConfig from 'app/dynamic-form/config/form-config';
import DataManager from 'app/dynamic-form/classes/data-manager';
import {SubscriptionManager} from 'app/core/utilities/subscription-manager';
import {isNil} from 'lodash';
import {AutoSaveComponent} from 'app/plan/plan-data-entry/components/auto-save/auto-save.component';
import {Subject} from 'rxjs/Subject';
import {DataEntryComponent} from '../../../plan-shared/abstract-components/data-entry.component';
import {MassUpdateSaveComponent} from '../mass-update-save/mass-update-save.component';

/**
 * A mass update data entry component class that allows a user to apply attributes across multiple plans.
 */
@Component({
  selector: 'gpr-mass-update-entry',
  templateUrl: './mass-update-entry.component.html',
  styleUrls: []
})
export class MassUpdateEntryComponent extends DataEntryComponent implements OnInit, OnDestroy {

   /**
    * A view of the autosave component. Used to call save when validating dirty data
    */
   @ViewChild(MassUpdateSaveComponent) saveComponent: MassUpdateSaveComponent;

   /**
	* Creates the Mass Update Entry component
	* @param {NavigatorService} _navigator
	* @param {MassUpdateDataService} _massUpdateDataService
	* @param {LogService} _log
	*/
   constructor( _navigator: NavigatorService,
                _viewConfigDataService: ViewConfigDataService,
                _log: LogService) {
     super(_navigator, _viewConfigDataService, _log);
   }

   /**
	* On init, subscribe to the navigation state
	*/
   ngOnInit() {
     const navState = this._navigator.subscribe('mass-update-entry', (value: INavState) => this._initialize(value));
     this._initialize(navState);
   }

   /**
	* On destroy, unsubscribe from all subscriptions
	*/
   ngOnDestroy() {
    const subscriptions: Subscription[] = [this._viewSubscription, this._saveUtilitySubscription];
    SubscriptionManager.massUnsubscribe(subscriptions);
    this._navigator.unsubscribe('mass-update-entry');
   }

   /**
	* Initialization method that takes in the current navState and fetches the corresponding view configuration.
	* @param {INavState} navState
	*/
   private _initialize(navState: INavState): void {
     const data = navState.data;
     if (isNil(data)) {
       return;
     }
     this.customer = data.customer;
     let categoryId = '';
     let activeSectionId = '';
     if (navState.params) {
        categoryId = navState.params.get('categoryId');
        activeSectionId = navState.params.get('activeSectionId');
     }
     this._viewSubscription = this._viewConfigDataService.getViewByCategory('PPC_MUT', '0.1', categoryId)
     .subscribe(formConfig => {
       this.config = formConfig;
       this.config.activateCategoryById(categoryId);
       this.model = formConfig.initializeModel(navState);
       this._log.info(`Mass Update Category Info: ${this.config}`);

       this.categoryName = this.config.getCategory(categoryId).label;
       if (!activeSectionId || activeSectionId === '') {
         activeSectionId = this.config.getCategory(categoryId).sections[0].sectionId;
       }
       this.config.activateSectionById(activeSectionId);
     });
   }

}
