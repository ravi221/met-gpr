import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {INavState} from 'app/navigation/interfaces/iNavState';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MassUpdateCategoryAction} from 'app/plan/mass-update/enums/category-entry-action';
import {MassUpdateCategoryInfo} from 'app/plan/mass-update/interfaces/massUpdateCategoryInfo';
import {IMassUpdateCheckedPlansResponse} from 'app/plan/mass-update/interfaces/iMassUpdateCheckedPlansResponse';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';

/**
 * A mass update landing page component class that lists out the categories of relevant attributes.
 */
@Component({
  selector: 'gpr-mass-update-landing',
  template: `
    <gpr-breadcrumbs></gpr-breadcrumbs>
    <div class="banner">
      <h4><strong>Mass Update Tool</strong></h4>
    </div>
	<div class="row">
      <div class="col-md-18">
        <gpr-card>
		<div class="mass-update-content">
			<section>
				<h3><strong>Cross Product Plan Attributes</strong></h3>
				<p class="mass-content"><label>To use, fill out a section below, select (one or many) attributes to send, then select plan to send to. You may reuse <br/>to send unique data to send plans</label></p>
				<p class="mass-content"><label>NOTE: The data below will not automatically sync with plans and may not reflect data currently existing within plans</label></p>
            </section>

			<!-- Mass Update Category Info --->
			<section class="mass-update-info" *ngFor="let categories of categoryInfo; let i=index;">
				<!-- Category Icon -->
				<gpr-icon [name]="'plandoc'" [state]="" class="doc-icon"></gpr-icon>
				<!-- Category Info --->
				<section class="mass-update-info-row">
					<section class="mass-update-label-info">
						<label class="mass-update-label">{{categories.label}}</label>
						<gpr-mass-update-select-plans-tooltip
                          [selectedPlansResponse]="selectedPlansResponse"
                          [index]="i">
						</gpr-mass-update-select-plans-tooltip>
					</section>
				</section>
				<!-- Category Actions -->
				<section class="mass-update-action-buttons">
				  <button class="btn btn-secondary" (click)="actionClick(categories.actionBtnLabel, i)">START</button>
				</section>
			</section>
		</div>
		</gpr-card>
	  </div>
	  <div class="col-md-6">
		<gpr-activity-card [customer] = "customer"></gpr-activity-card>
		<gpr-flag-card [customer]="customer"></gpr-flag-card>
      </div>
	</div>
  `,
  styleUrls: ['./mass-update-landing.component.scss']
})
export class MassUpdateLandingComponent implements OnInit, OnDestroy {

  /**
   * The Current Customer
   * @type {ICustomer}
   */
  @Input() customer: ICustomer;

  /**
   * It contains checked plans response for specific product and also show plans on tooltip
   */
  public selectedPlansResponse: IMassUpdateCheckedPlansResponse[];


  /**
   * A list of category information
   */
  public categoryInfo: MassUpdateCategoryInfo[] = [
    {label: 'New Plan', actionBtnLabel: 'newPlan'},
    {label: 'Eligibility Provisions', actionBtnLabel: 'eligibilityProvisions'},
    {label: 'ERISA Information & HIPAA', actionBtnLabel: 'eRISAInformationHIPAA'}
  ];

  /**
   * Creates the Mass Update Component
   * @param {NavigatorService} _navigator
   */
  constructor(private _navigator: NavigatorService,
              private _massUpdateDataService: MassUpdateDataService) {}

  /**
   * On init, subscribe to the navigation state
   */
  ngOnInit() {
    const navState: INavState = this._navigator.subscribe('mass-update', (value: INavState) => this._initialize(value));
    this._initialize(navState);
    this.selectedPlansResponse = this._massUpdateDataService.productResponse;
  }

  /**
	* On destroy, unsubscribe from all subscriptions
	*/
   ngOnDestroy() {

   }

  /**
   * Private initialization method to set the customer variable and load the associated view configuration.
   * @param {INavState} navState: The state of the current route provided by {@link NavigatorService}.
   */
  private _initialize(navState: INavState): void {
    if (navState.data) {
      this.customer = navState.data.customer;
    }
  }

  /**
   * Handles the click event of an action button associated with a category.
   */
  public actionClick(categoryId: string, categoryIndex: number): void {
    this._massUpdateDataService.getCategorySelectedIndex(categoryIndex);
    this._navigator.goToMassUpdateEntry(categoryId);
  }
}
