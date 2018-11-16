import { Component, OnInit, OnDestroy, Input, ViewChild  } from '@angular/core';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {IMassUpdateSelectPlanData} from 'app/plan/mass-update/interfaces/iMassUpdateSelectPlanData';
import {IMassUpdateSelectPlanObject} from 'app/plan/mass-update/interfaces/iMassUpdateSelectPlanObject';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {INavState} from 'app/navigation/interfaces/iNavState';
import {IMassUpdateSelectPlanModelNames} from 'app/plan/mass-update/interfaces/iMassUpdateSelectPlanModelNames';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ActiveModalRef} from 'app/ui-controls/classes/modal-references';
import {AnimationState} from 'app/ui-controls/animations/AnimationState';
import {fadeInOut} from 'app/ui-controls/animations/fade-in-out';
import {IMassUpdateCheckedPlansResponse} from 'app/plan/mass-update/interfaces/iMassUpdateCheckedPlansResponse';
import {IMassUpdateProductNames} from 'app/plan/mass-update/interfaces/iMassUpdateProductNames';


@Component({
  selector: 'gpr-mass-update-select-plan',
  template: `
    <gpr-card>
<table class="mass-update-selected-plans-info">
  <tr>
    <td>
      <div class="checkbox-control select-all-checkbox" >
        <input id="select-plan-checkbox" type="checkbox" 
        [(ngModel)]="selectAllPlans" (change)="isSelectAllPlans($event.target.checked)"/>
        <label for="select-plan-checkbox">Select All Plans</label>
       </div>	  
	</td>
	<td valign="top"><small>Collapse all</small></td>
  </tr>
  <tr *ngFor="let productLabel of productNames">
    <td>
		<div class="checkbox-control select-product-checkbox">
		  <input id="{{productLabel.name}}" type="checkbox" (change)="isSelectProduct($event.target.checked, productLabel.name)" [(ngModel)]="productLabel.isChecked"/>
		  <label for="{{productLabel.name}}">{{productLabel.name}}</label>
		</div>
		<div [@fadeInOut]="sectionVisibilityState" *ngIf="productLabel.name === selectedProductLabel">
		<div *ngFor="let productList of products; let i=index">
		  <div class="checkbox-control select-plans-checkbox" *ngIf="productLabel.name === productList.productName">
			<input id="{{productList.planName}}-{{i}}" type="checkbox" (change)="isSelectPlan($event.target.checked, productLabel.name)" [(ngModel)]="productList.isChecked"/>
			<label for="{{productList.planName}}-{{i}}">{{productList.planName}}  <small>Effective:{{productList.effectiveDate}}</small></label>
		  </div>
		</div>
       </div>		

	</td>
	<td valign="top">
	  <div>
	  <gpr-expand-collapse-icon (expand)="togglePlansVisibility($event, productLabel.name)"></gpr-expand-collapse-icon>
	  </div>
	</td>
  </tr>
  
</table>
</gpr-card>
<div class="pull-right">
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-secondary" [disabled]="!canUpdateButtonDisabled"  (click)="getSelectedPlanNames()">Update Plans {{checkedPlansCount}}</button>
</div>
  `,
  styleUrls: ['./mass-update-select-plan.component.scss'],
  animations: [fadeInOut]
})
export class MassUpdateSelectPlanComponent implements OnInit, OnDestroy {

  /**
   * The Current Customer
   * @type {ICustomer}
   */
  @Input() customer: ICustomer;

  /**
   * A subscription to any model changes
   */
  private _selectedPlansSubscription: Subscription;

  /**
   * Indicates the Selected plans view.
   */
  public products: IMassUpdateSelectPlanObject[];

  /**
   * Indicates if the select all checkbox is selected (true) or unselected (false)
   * @type {boolean}
   */
  public selectAllPlans: boolean = false;

  /**
   * The mass update plan visibility
   * @type {AnimationState}
   */
  public sectionVisibilityState: AnimationState = AnimationState.VISIBLE;

  /**
   * Indicates the count of the number of plans checked
   * @type {number}
   */
  public checkedPlansCount: number = 0;

  /**
   * Indicates the count of the number of products checked
   * @type {number}
   */
  public checkedProductCount: number = 0;

  /**
   * List of product names
   */
  public productNames: IMassUpdateProductNames[] = [];

  /**
   * Gets the response of selected plans
   */
  public _selectedPlansResponse: IMassUpdateCheckedPlansResponse[] = [];

  /**
   * Gets the length of products
   */
  public productLength: number = 0;

  /**
   * Indicates the update button to be disabled/enabled
   */
  public canUpdateButtonDisabled: boolean = false;
  
  /**
   * Indicates the selected product label
   */
  public selectedProductLabel: string;

  /**
   * Creates the Mass Update Select Plan Component
   * @param {MassUpdateDataService} _massUpdateDataService
   * @param {NavigatorService} _navigator
   */
  constructor(private _massUpdateDataService: MassUpdateDataService,
              private _navigator: NavigatorService,
              private _activeModalRef: ActiveModalRef) { }

  /**
   * On init, subscribe to the navigation state
   */
  ngOnInit() {
    const navState: INavState = this._navigator.subscribe('mass-update', (value: INavState) => this._initialize(value));
    this._initialize(navState);
  }

  /**
   * On destroy, unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    if (this._selectedPlansSubscription) {
      this._selectedPlansSubscription.unsubscribe();
    }
    this._navigator.unsubscribe('mass-update');
  }

  /**
   * Toggles the visibility of a category's sections
   * @param {boolean} isExpanded
   */
  public togglePlansVisibility(isExpanded: boolean, productAnimateLabel: string): void {
    this.selectedProductLabel = productAnimateLabel;
    this.sectionVisibilityState = isExpanded ? AnimationState.VISIBLE : AnimationState.HIDDEN;
  }

  /**
   * Private initialization method to set the customer variable and load the associated configuration.
   * @param {INavState} navState
   */
  private _initialize(navState: INavState): void {
    if (navState.data) {
      this.customer = navState.data.customer;
      this._selectedPlansSubscription = this._massUpdateDataService.getSelectedPlans(this.customer.customerNumber)
      .subscribe((plansData: IMassUpdateSelectPlanData) => {
        this.products = plansData.objects;
		
        this.products.filter((product) => {
          let foundValue = this.productNames.filter( productInfo =>
            productInfo.name === product.productName );
          if (foundValue.length === 0) {
            this.productNames.push({'name': product.productName, 'isChecked': false});
          }
        });
      });
    }
  }

  /**
   * on Selecting selectAll checkbox it select/deselect vice-versa
   * @param {selectAllPlans : boolean}
   */
  public isSelectAllPlans(selectAllPlans: boolean): void {
    this.productNames.filter((productName) => {
      productName.isChecked = selectAllPlans;
    });
    this.products.filter((product) => {
      product.isChecked = selectAllPlans;
    });
    this.getSelectedPlansCount();
  }

  /**
   * on Selecting product checkbox it select/deselets plans checkboxes and increment/decrement the count of plans
   * @param {isProductSelected : boolean}
   * @param {checkedProductLabel : string}
   */
  public isSelectProduct(isProductSelected: boolean, checkedProductLabel: string): void {
    this.products.forEach((product) => {
      if (product.productName === checkedProductLabel) {
        product.isChecked = isProductSelected;
      }
    });
    this.getSelectedPlansCount();
  }

  /**
   * on Selecting plan checkbox, count gets increment/decrement and also specific product checkbox gets checked/unchecked if all plans got checked/unchecked
   * @param {isPlanSelected : boolean}
   * @param {checkedProductLabel : string}
   */
  public isSelectPlan(isPlanSelected: boolean, checkedProductLabel: string): void {
    if (isPlanSelected) {
      const numProductsChecked = this.products.filter(isProduct => isProduct.isChecked === true && isProduct.productName === checkedProductLabel).length;
      this.productLength = this.products.filter((productInfo) => productInfo.productName === checkedProductLabel).length;
      this.productNames.filter((productName) => {
        if (productName.name === checkedProductLabel) {
          if (numProductsChecked === this.productLength) {
            productName.isChecked = isPlanSelected;
          }
        }
      });
    } else {
      this.productNames.filter((productName) => {
        if (productName.name === checkedProductLabel) {
          productName.isChecked = isPlanSelected;
        }
      });
    }
    this.getSelectedPlansCount();
  }

  /**
   * Gets the selected plan names and updated count of plans response
   */
  public getSelectedPlanNames(): void {
    this._massUpdateDataService.getSelectedPlanNames()
    .subscribe((response) => {
      this._selectedPlansResponse = response;
    });
    this._navigator.getProductPlans();
    this._activeModalRef.close();
  }

  /**
   * Gets the count of selected checkboxes
   */
  public getSelectedPlansCount() {
    this.checkedPlansCount = this.products.filter(plan => plan.isChecked).length;
    this.checkedProductCount = this.productNames.filter(product => product.isChecked).length;
    this.selectAllPlans = this.checkedProductCount === this.productNames.length;
    this.selectAllPlans = this.checkedPlansCount === this.products.length;
    this.canUpdateButtonDisabled = this.checkedPlansCount > 0;
  }
}
