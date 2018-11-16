import {Component, OnDestroy, OnInit} from '@angular/core';
import {IFilterLink} from '../../../core/interfaces/iFilterLink';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {ModalService} from '../../../ui-controls/services/modal.service';
import {ModalRef} from '../../../ui-controls/classes/modal-references';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {FilterBarComponent} from '../../../core/components/filter-bar/filter-bar.component';
import {FilterLinkService} from '../../../core/services/filter-link.service';
import {ICoverage} from '../../../core/interfaces/iCoverage';
import {FilterMenuComponent} from '../../../core/components/filter-menu/filter-menu.component';
import { FlagFilterComponent } from '../flag-filter/flag-filter.component';
import { FlagFilterService } from '../../services/flag-filter.service';
import { IFlaggedPlan } from '../../interfaces/iFlaggedPlan';
import { FilterService } from '../../../core/services/filter.service';
import { isNil } from 'lodash';
import { ProductDataService } from '../../../core/services/product-data.service';
import { IFlagsResponse } from 'app/flag/interfaces/iFlagsResponse';
import { IFlagsRequest } from 'app/flag/interfaces/iFlagsRequest';
import { FlagService } from 'app/flag/services/flag.service';
import { IFlagFilter } from 'app/flag/interfaces/iFlagFilter';
import { PlanDataService } from 'app/plan/plan-shared/services/plan-data.service';


/**
 * The FlagLanding Page component. On this page there will be a customer with a list of plans that will contain flags.
 * There will be the ability to filter the flags.
 */
@Component({
  selector: 'gpr-flag-landing',
  template: `
      <div class="banner padding-top-banner">
        <h4><strong>Flags</strong></h4>
      </div>
      <gpr-filter-bar [showSortMenu]="false"
                            [showFilterLinks]="true"
                            [showFilterMenu]="true"
                            [filterLinks]="filterLinks"
                            (filterLinkChange)="handleFilterLinkChange($event)"
                            (filterMenuChange)="handleFilterMenuChange($event)">
          <ng-container ngProjectAs="filter">
            <gpr-flag-filter [customer]="customer"></gpr-flag-filter>
          </ng-container>
        </gpr-filter-bar>
      <div class="row">
        <gpr-card [asyncMode]="plansObservable">
          <div *ngIf="hasPlans">
            <gpr-flag-list [flaggedPlans]="flaggedPlans" [customer]="customer" [flagsCount]="flagsCount"></gpr-flag-list>
          </div>
          <div *ngIf="!hasPlans" class="no-flags">
            <div class="no-flag-container">
              <gpr-icon name="no-flag"></gpr-icon>
              <div class="no-flags-text">No flags created yet.</div>
            </div>
          </div>
        </gpr-card>
      </div>
      <button *ngIf="hasPlans" [disabled]="isExportDisabled"
              class="btn btn-tertiary pull-right export-button">Export
      </button>
  `,
  styleUrls: ['./flag-landing.component.scss']
})
export class FlagLandingComponent implements OnInit, OnDestroy {

  /**
   * A reference to the Modal that pops up when flags are resolved
   */
  public modalRef: ModalRef;

  /**
   * Indicates if the current search has any plans
   * @type {boolean}
   */
  public hasPlans: boolean = false;

  /**c
   * An array of Plans that hold plan information and tags.
   * @type {Array}
   */
  public flaggedPlans: IFlaggedPlan[] = [];

  /**
   * Information about the customer. Should be passed in using Resolver
   */
  public customer: ICustomer;

  /**
   * Number of flags for the customer
   */
  public flagsCount: number;

  /**
   * plan id
   */
  public planId: string = '';

  /**
   * Observable plan objects
   */
  public plansObservable: Observable<IFlagsResponse>;

  /**
   * The conditions that will be used to Filter Plans and their containing flags by.
   * TODO - get products from the nav state - See CustomerLandingPageComponent
   */
  public filterLinks: IFilterLink[] = [];

  /**
   * When the export button is clicked it has to wait for the request to end before the button is enabled again
   * @type {boolean}
   */
  public isExportDisabled: boolean = false;

  /**
   * The subscription to load the filterLinks and flags on initial startup
   */
  private _initSubscription: Subscription;
  /**
   *  The subscription for when the modal opens.
   */
  private _modalSubscription: Subscription;

  /**
   * The flag request used to retrieve flags
   */
  private _flagRequest: IFlagsRequest;

  /**
   * An Array to hold the coverages that a user will search for
   * @type {Array}
   * @private
   */
  private _coverages: string[];

  /**
   * Creates the customer landing component
   * @param {FilterLinkService} _filterLinkService
   * @param {NavigatorService} _navigator
   * @param {TaggingService} _taggingService
   * @param {PlanDataService} _planDataService
   */
  constructor(private _flagService: FlagService,
    private _modalService: ModalService,
    private _navigator: NavigatorService,
    private _filterLinkService: FilterLinkService,
    private _planDataService: PlanDataService,
    private _productDataService: ProductDataService) {
  }

  /**
   * Default ngOnInit for FlagLandingComponent
   */
  ngOnInit() {
    const navState: INavState = this._navigator.subscribe('flags-landing', (value: INavState) => this._updateNavState(value));
    this._updateNavState(navState);
    this._flagRequest = {
      customerNumber: this.customer.customerNumber,
      isResolved: '',
      planId: this.planId
    };
    this.searchFlags();
  }

  /**
   * Searches for plans
   */
  public searchFlags(): void {
    this.plansObservable = this._flagService.getPlansWithFlags(this._flagRequest);
    this.plansObservable.subscribe((response) => {
      if (response.plans) {
        this.hasPlans = true;
      }
      this.flagsCount = response.totalFlagCount;
      this.flaggedPlans = response.plans;
    });
  }

  /**
   * Handles the {@link FilterBarComponent} event emitter when filtering has been updated.
   *  @param {ICoverage[]} coverages
   */
  public handleFilterLinkChange(coverages: ICoverage[]): void {
    this._flagRequest.coverages = coverages;
    this.searchFlags();
  }

  /**
   * Handles the {@link FilterMenuComponent} event emitter when filtering has been updated.
   * @param filter
   */
  public handleFilterMenuChange(filter: IFlagFilter): void {
    if (!filter) {
      return;
    }
    if (!this.planId) {
      this.flaggedPlans = this.flaggedPlans.filter(plan => plan.planName === filter.planName);
      if (this.flaggedPlans.length > 0) {
        this._flagRequest.planId = String(this.flaggedPlans[0].planId);
      }
    }
    this._flagRequest.isResolved = String(filter.status);
    this.searchFlags();
  }

  /**
   * Unsubscribes the subscription that manages flags
   */
  ngOnDestroy(): void {
    if (this._navigator) {
      this._navigator.unsubscribe('flags');
    }
    if (this._modalSubscription) {
      this._modalSubscription.unsubscribe();
    }
  }

  /**
   * Updates parameters based on the nav state
   * @param {INavState} navState
   * @private
   */
  private _updateNavState(navState: INavState): void {
    if (navState.data && navState.data.customer) {
      this.customer = navState.data.customer;
      this._productDataService.getProductsForCustomer(this.customer.customerNumber).subscribe((products) => {
        this.filterLinks = this._filterLinkService.getFilterLinksFromProducts(products);
      });

      if (!isNil(navState.data.plan)) {
        this.planId = navState.data.plan.planId;
        this._coverages = [navState.data.plan.coverageId];
      }
    }
  }
}
