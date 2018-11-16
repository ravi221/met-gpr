import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {isNil} from 'lodash';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';
import { IFlagsRequest } from '../../interfaces/iFlagsRequest';
import { FlagService } from 'app/flag/services/flag.service';
import { ISummaryFlagsRequest } from '../../interfaces/iSummaryFlagsRequest';
import { ISummaryFlagsResponse } from '../../interfaces/iSummaryFlagsResponse';
import { FlagContextTypes } from 'app/flag/enums/flag-context-types';
import { IFlag } from 'app/flag/interfaces/iFlag';

/**
 * Flag-card is a reusable component, that shows 3 flags per plan/category/or customer.
 * It has a link that allows the user to navigate to a screen to see more flags.
 */
@Component({
  selector: 'gpr-flag-card',
  template: `
    <gpr-detail-card [heading]="flagsHeading"
                     [headingCount]="flagCount"
                     [headingIcon]="'flag-on'"
                     [showHeadingCount]="true">
      <aside class="flags-container" *ngIf="hasFlags">
        <div *ngFor="let flag of flags" class="flag">
          <gpr-flag-resolver-tooltip *ngIf="isHeadingPlanFlags" [customer]="customer" [flag]="flag"></gpr-flag-resolver-tooltip>
          <div class="flag-info">
            <h2 class="text-overflow flag-plan-name">{{flag.planName}}</h2>
            <h3 class="text-overflow flag-question-name">{{flag.questionName}}</h3>
          </div>
        </div>
        <a class="see-all-link" *ngIf="showSeeAllLink" (click)="navigateToFlags()">See All</a>
      </aside>
      <span class="no-flags-message" *ngIf="!hasFlags">{{noFlagsMessage}}</span>
    </gpr-detail-card>
  `,
  styleUrls: ['./flag-card.component.scss']
})
export class FlagCardComponent implements OnInit, OnDestroy {

  /**
   * Represents the customer currently being viewed.
   */
  @Input() customer: ICustomer;

  /**
   *  This is the unique identifier for a plan.
   */
  @Input() planId: number;

  /**
   * This is the unique identifier for a category.
   */
  @Input() categoryId: string;

  /**
   * if there is flags
   */
  public hasFlags: boolean = false;

  /**
   * if the heading is plan flags
   */
  public isHeadingPlanFlags: boolean = false;

  /**
   * The heading for the flag card
   * @type {string}
   */
  public flagsHeading: string = '';

  /**
   * A list of flags
   */
  public flags: IFlag[] = [];

  /**
   * The total number of flags for this context
   */
  public flagCount: number;

  /**
   * A message to display when there are no flags for a customer, plan, or category
   * @type {string}
   */
  public noFlagsMessage: string = '';

  /**
   * Indicates if to show the see all link
   * @type {boolean}
   */
  public showSeeAllLink: boolean = false;

  /**
   * The context for the flag, determines if to display flags for customer, plan, or category
   */
  private _flagContext: FlagContextTypes;

  /**
   * The request to get the flags
   */
  private _flagRequest: ISummaryFlagsRequest;

  /**
   * A subscription to get the flags based on the current flag context
   */
  private _flagSubscription: Subscription;

  /**
   * A subscription to get the flags whenever the flags are updated
   */
  private _flagUpdateSubscription: Subscription;

  /**
   * Basic constructor for the flag card component
   * @param {FlagService} _flagService the service that retrieves plans
   * @param {NavigatorService} _navigator the service that allows a user to navigate
   */
  constructor(private _flagService: FlagService,
              private _navigator: NavigatorService) {
  }

  /**
   * On init, retrieve flags for this customer, plan or category.
   */
  ngOnInit(): void {
    this._flagRequest = this._createFlagRequest();
    this._flagContext = this._getFlagContext();
    this.flagsHeading = FlagService.FLAGS_HEADINGS[this._flagContext];
    if (this.flagsHeading === FlagContextTypes.CATEGORY) {
      this.isHeadingPlanFlags = true;
    }
    this.noFlagsMessage = FlagService.NO_FLAGS_MESSAGES[this._flagContext];
    this._getFlags();
    this._flagUpdateSubscription = this._flagService.update$.subscribe(() => {
      this._getFlags();
    });
  }

  /**
   *  On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._flagSubscription,
      this._flagUpdateSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * Navigates to the flag page. It uses the Plan in the route to set up page
   */
  public navigateToFlags(): void {
    this._navigator.goToFlagHome();
  }

  /**
   * Creates the flag request
   * @returns {ITagRequestParam}
   * @private
   */
  private _createFlagRequest(): ISummaryFlagsRequest {
    let planId;
    if (!isNil(this.planId)) {
      planId = String(this.planId);
    }

    return <ISummaryFlagsRequest> {
      customerNumber: Number(this.customer.customerNumber),
      planId: planId,
      categoryId: this.categoryId,
      flagCount: this.flagCount
    };
  }

  /**
   * Gets the flag context
   * @returns {FlagContextTypes}
   * @private
   */
  private _getFlagContext(): FlagContextTypes {
    const hasCategoryId = !isNil(this.categoryId);
    if (hasCategoryId) {
      return FlagContextTypes.CATEGORY;
    }

    const hasPlanId = !isNil(this.planId);
    if (hasPlanId) {
      return FlagContextTypes.PLAN;
    }

    return FlagContextTypes.CUSTOMER;
  }

  /**
   * Gets the flags
   * @private
   */
  private _getFlags(): void {
    const flagContext = this._flagContext;
    const flagRequest = this._flagRequest;
    this._flagSubscription = this._flagService.getFlags(flagContext, flagRequest)
      .subscribe((response: ISummaryFlagsResponse) => {
        this.updateFlags(response);
      });
  }

  /**
   * Takes a response object and puts the data into page variables to be displayed
   */
  public updateFlags(contextFlagResponse: ISummaryFlagsResponse): void {
    const flagCount = contextFlagResponse.totalFlagCount;
    const flags = contextFlagResponse.flags;
    this.flagCount = flagCount || 0;
    this.flags = flags.splice(0, 3);
    this.showSeeAllLink = flagCount >= 3;
    this.hasFlags = flagCount > 0;
  }
}
