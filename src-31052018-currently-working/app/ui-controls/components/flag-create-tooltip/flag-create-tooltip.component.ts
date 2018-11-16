import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {OnDestroy} from '@angular/core/src/metadata/lifecycle_hooks';
import {NotificationService} from 'app/core/services/notification.service';
import {NotificationTypes} from 'app/core/models/notification-types';
import { IFlagsRequest } from '../../../flag/interfaces/iFlagsRequest';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { FlagService } from '../../../flag/services/flag.service';
import { ICreateFlagRequest } from '../../../flag/interfaces/iCreateFlagRequest';
import { CommentService } from '../../../comment/services/comment.service';
import { ISummaryFlagsResponse } from '../../../flag/interfaces/iSummaryFlagsResponse';
import { ISummaryFlagsRequest } from '../../../flag/interfaces/iSummaryFlagsRequest';
import { FlagContextTypes } from 'app/flag/enums/flag-context-types';
import { TooltipService } from 'app/ui-controls/services/tooltip.service';
import { NavigatorService } from 'app/navigation/services/navigator.service';
import { PageAccessType } from 'app/core/enums/page-access-type';
import { INavState } from 'app/navigation/interfaces/iNavState';
import { IFlagsResponse } from '../../../flag/interfaces/iFlagsResponse';
import { isNil } from 'lodash';

/**
 * A component that handles the creation of a flag. When an icon is clicked a popover pops up that allows the user
 * to create a flag
 */
@Component({
  selector: 'gpr-flag-create-tooltip',
  template: `
    <gpr-tooltip-content #flagTooltip>
      <div class="create-flag-container">
        <h3 class="create-flag-heading">Create a Flag</h3>
        <textarea maxlength="256" class="create-flag-text" [(ngModel)]="text"></textarea>
        <footer class="create-flag-footer">
          <button class="btn btn-secondary" (click)="createFlag()">Create Flag</button>
        </footer>
      </div>
    </gpr-tooltip-content>
    <gpr-icon gprTooltip
              [tooltipContent]="flagTooltip"
              [position]="position"
              [theme]="'white'"
              [displayCloseIcon]="true"
              [name]="'flag'"
              [state]="flagState"
              *ngIf="isAddFlagDisabled">
    </gpr-icon>
  `,
  styleUrls: ['./flag-create-tooltip.component.scss']
})
export class FlagCreateTooltipComponent implements OnDestroy, OnInit {

  /**
   * The position where to place the tooltip
   */
  @Input() position: string = 'left';

  /**
   * request bod for post to create the flag, contains data from parent
   */
  @Input() tagData: ICreateFlagRequest;

  /**
   * is there a flag already on this object
   */
  @Input() questionFlag: IFlag;

  /**
   * determines which icon to display, based on whether flagExists is true or false
   */
  public flagState: 'on' | 'off' = 'off';

  /**
   * text to be added to the flag when request is made
   */
  public text: string;

  /**
   * Indicates if the add flag icon should be disabled
   * @type {boolean}
   */
  public isAddFlagDisabled: boolean = false;

  /**
   * determines whether to call create flag or add text service
   */
  public flagExists: boolean;

  /**
   * The current access for this page
   */
  private _pageAccessType: PageAccessType;

  /**
   * subscription for the tag service
   */
  private _subscription: Subscription;

  /**
   * array of flags
   */
  private flags: IFlag[];

  /**
   * subscription
   */
  private _createFlagSubscription: Subscription;

  /**
   * The default constructor.
   */
  constructor(private _tooltipService: TooltipService,
              private _notificationService: NotificationService,
              private _navigator: NavigatorService,
              private _flagService: FlagService) {
  }

  /**
   * On init, setup the flag tooltip
   */
  ngOnInit(): void {
    if (this.questionFlag !== undefined && this.questionFlag !== null) {
      this.flagState = 'on';
      this.text = this.questionFlag.text;
      this.flagExists = true;
    } else {
      this.flagState = 'off';
      this.text = '';
      this.flagExists = false;
    }
    const navState: INavState = this._navigator.subscribe('plan-data-entry', (value: INavState) => {
      this._updateNavState(value);
    });
    this._updateNavState(navState);
    this.isAddFlagDisabled = this._flagService.canAddFlagComment(this._pageAccessType);
  }

  /**
   * On destroy, unsubscribe from the create flags subscription
   */
  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  /**
   * on hitting save use the createTagService Create Flag function
   */
  public createFlag(): void {
    if (isNil(this.tagData.questionValue)) {
      this.tagData.questionValue = '';
    }
    this.tagData.text = this.text;
    this._createFlagSubscription = this._flagService.createFlag(this.tagData, this.flagExists)
      .subscribe((result) => this._createFlagSuccess(),
        error => this._createFlagError());
  }

  /**
   * When successfully creating a flag, show a success message in the banner
   */
  private _createFlagSuccess(): void {
    const successMessage = `Flag was created for ${this.tagData.questionId}`;
    this._tooltipService.hideAllTooltips();
    this._notificationService.addNotification(NotificationTypes.SUCCESS, successMessage);
    this.flagState = 'on';
    const flagRequest = <ISummaryFlagsRequest> {
      customerNumber: this.tagData.customerNumber,
      planId: this.tagData.planId,
      categoryId: this.tagData.categoryId
    };
    this._subscription = this._flagService.getFlags(FlagContextTypes.CATEGORY, flagRequest)
    .subscribe((response) => {
      this.refreshFlags(response, this.tagData);
    });
  }

  /**
   * Refreshes the flags displayed to the user
   * @param response
   * @param tagData
   */
  public refreshFlags(response: ISummaryFlagsResponse, tagData: ICreateFlagRequest): void {
    this.flags = [];
    response.flags.forEach(flag => {
      if (flag.questionName === tagData.questionName) {
        this.flags.push(flag);
      }
    });
  }

  /**
   * creates notification that the flag was not created
   */
  private _createFlagError(): void {
    const errorMessage = `Flag was not created ${this.tagData.questionId}`;
    this._tooltipService.hideAllTooltips();
    this._notificationService.addNotification(NotificationTypes.ERROR, errorMessage);
  }

  /**
   * Updates parameters based on the nav state
   * @param {INavState} navState
   * @private
   */
  private _updateNavState(navState: INavState): void {
    const data = navState.data;
    if (isNil(data)) {
      return;
    }

    this._pageAccessType = data.pageAccessType;
  }

}
