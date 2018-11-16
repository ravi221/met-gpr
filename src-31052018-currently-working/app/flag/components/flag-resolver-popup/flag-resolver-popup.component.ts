import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import { ICustomer } from '../../../customer/interfaces/iCustomer';
import { IFlaggedPlan } from '../../interfaces/iFlaggedPlan';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { FlagService } from 'app/flag/services/flag.service';
import { IFlagResolveRequest } from '../../interfaces/iFlagResolveRequest';
import { CommentService } from '../../../comment/services/comment.service';
import { ICommentsRequest } from '../../../comment/interfaces/iCommentsRequest';
import { Subscription } from 'rxjs/Subscription';
import { NotificationService } from 'app/core/services/notification.service';
import { NotificationTypes } from 'app/core/models/notification-types';
import { FlagContextTypes } from 'app/flag/enums/flag-context-types';
import { ISummaryFlagsRequest } from 'app/flag/interfaces/iSummaryFlagsRequest';
import { FlagCreateTooltipComponent } from '../flag-create-tooltip/flag-create-tooltip.component';
import { ISummaryFlagsResponse } from 'app/flag/interfaces/iSummaryFlagsResponse';
import { FlagCardComponent } from '../flag-card/flag-card.component';
import { IFlagsRequest } from '../../interfaces/iFlagsRequest';
import { FlagLandingComponent } from 'app/flag/components/flag-landing/flag-landing.component';
import { SubscriptionManager } from '../../../core/utilities/subscription-manager';

/**
 * The FlagResolverPopupComponent is used to resolve flags. It can resolve all flags or just one flag
 */
@Component({
  selector: 'gpr-flag-resolver-popup',
  template: `
    <aside>
      <h2>{{title}}</h2>
      <p>{{question}}</p>
      <div><input type="checkbox" [value]="isRetained" (change)="isRetained = !isRetained"> {{retainText}}</div>
      <div class="modal-footer">
        <a class="confirm-link-resolver" (click)="resolveFlags()">Confirm</a>
        <a class="cancel-link-resolver" (click)="cancel()">Cancel</a>
      </div>
    </aside>
  `,
  styleUrls: ['./flag-resolver-popup.component.scss']
})
export class FlagResolverPopupComponent implements OnInit, OnDestroy {

  /**
   * customer
   */
  @Input() customer: ICustomer;

  /**
   * plan
   */
  @Input() flaggedPlans: IFlaggedPlan[];

  /**
   * plan details
   */
  @Input() planDetails: IFlaggedPlan;

  /**
   * flagsCount
   */
  @Input() flagsCount: number;

  /**
   * The flag that needs to be resolved. It can be null depending on if the ResolveAll attributes is true.
   */
  @Input() flag: IFlag;

  /**
   * Outputs event when a flag is resolved
   * @type {EventEmitter<any>}
   */
  @Output() flagResolved: EventEmitter<IFlag> = new EventEmitter<IFlag>();

  /**
   * Retain the text for flags/flag
   */
  public retainText: string;

  /**
   * Determines if flags should be
   */
  public isRetained: boolean;

  /**
   * A question that asks if the user wants to resolve a flag
   */
  public question: string;

  /**
   * flag create tooltip component
   */
  public flagCreateTooltip: FlagCreateTooltipComponent;

  /**
   * The title of the popup. Should be Resolve Flag/Resolve Flags
   */
  public title: string;

  /**
   *  The subscription for when the modal opens.
   */
  private _modalSubscription: Subscription;

  /**
   *  The subscription for when the modal opens.
   */
  private _flagSubscription: Subscription;

  /**
   * flag card
   */
  public flagCard: FlagCardComponent;

  /**
   * Constructor for FlagResolverComponent
   * @param {ActiveModalRef} _activeModalRef: Allows user to handle closing and opening the modal
   * @param {TaggingService} _taggingService
   */
  constructor(private _activeModalRef: ActiveModalRef,
              private _flagService: FlagService,
              private _notificationService: NotificationService,
              private _commentService: CommentService) {
  }

  /**
   * Used to set up the inital view based on the input paremeters. Since resolving one flag and many flags
   * is so similiar I figured they could be isolated to same component
   */
  ngOnInit() {
    if (this.flag) {
      this.getMessages(1, this.customer.customerName);
    } else if (this.flagsCount) {
      this.getMessages(this.flagsCount, this.customer.customerName);
    }
  }

  /**
   * On destroy, unsubscribe from the modal subscription
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [this._modalSubscription, this._flagSubscription];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * Get confirmation box messages
   * @param flagCount
   * @param customerName
   */
  public getMessages(flagCount: number, customerName: string): void {
    if (flagCount > 1) {
      this.retainText = 'Retain Flags';
      this.title = 'Resolve all Flags';
      this.question = 'Are you sure you want to resolve all flags for ' + customerName + '?';
    } else {
      this.retainText = 'Retain Flag';
      this.title = 'Resolve Flag';
      this.question = 'Are you sure you want to resolve this flag for ' + customerName + '?';
    }
  }

  /**
   * Handles the confirm event of the close link. Will determine if a flag(s) are to be resolved or retained
   */
  public resolveFlags(): void {
    this._closeModal();
    let retained = false;
    let planId: string;
    if (this.planDetails) {
      planId = this.planDetails.planId;
    } else if (this.flag.planId) {
      planId = this.flag.planId;
    }
    let resolveFlagRequest: IFlagResolveRequest;
    if (this.isRetained) {
      retained = true;
        if (this.flaggedPlans) {
          this.flaggedPlans.forEach(plan => {
            plan.flags.forEach(flag => {
              this.createCommentFromFlag(flag);
          });
          resolveFlagRequest = {
            planId: String(plan.planId),
            shouldRetain: retained
          };
        });
      } else if (this.flag) {
        this.createCommentFromFlag(this.flag);
        this.flag.isResolved = true;
        resolveFlagRequest = {
          planId: planId,
          questionId: this.flag.questionId,
          shouldRetain: retained
        };
      }

    } else {
      if (this.flaggedPlans) {
        this.flaggedPlans.forEach(plan => {
          resolveFlagRequest = {
            planId: String(plan.planId),
            shouldRetain: retained
          };
        });
      } else if (this.flag) {
        this.flag.isResolved = true;
        resolveFlagRequest = {
          planId: planId,
          questionId: this.flag.questionId,
          shouldRetain: retained
        };
      }
    }
    this._modalSubscription = this._flagService.resolveFlag(resolveFlagRequest).subscribe((result) => this._resolveFlagSuccess(resolveFlagRequest),
        error => this._resolveFlagError(resolveFlagRequest));
  }

  /**
   * When successfully resolving a flag, show a success message in the banner
   */
  private _resolveFlagSuccess(resolveFlagRequest: IFlagResolveRequest): void {
    let successMessage;
    if (resolveFlagRequest.questionId) {
      successMessage = `Flag was resolved for ${resolveFlagRequest.questionId}`;
    } else {
      successMessage = `Flag was resolved for ${resolveFlagRequest.planId}`;
    }
    this._notificationService.addNotification(NotificationTypes.SUCCESS, successMessage);
    this._flagService.update();
  }

  /**
   * creates notification that the flag was not resolved
   */
  private _resolveFlagError(resolveFlagRequest: IFlagResolveRequest): void {
    let errorMessage;
    if (resolveFlagRequest.questionId) {
      errorMessage = `Flag was not resolved for ${resolveFlagRequest.questionId}`;
    } else {
      errorMessage = `Flag was not resolved for ${resolveFlagRequest.planId}`;
    }
    this._notificationService.addNotification(NotificationTypes.ERROR, errorMessage);
  }

  /**
   * Create comments from flags when retained
   */
  private retainFlag(): void {
      let retained = true;
      if (this.flaggedPlans) {
        this.flaggedPlans.forEach(plan => {
          plan.flags.forEach(flag => {
            this.createCommentFromFlag(flag);
        });
        plan.flags.forEach(flag => {
           this.flagResolved.emit(flag);
        });
      });
      } else if (this.flag) {
        this.createCommentFromFlag(this.flag);
        this.flag.isResolved = true;
        this.flagResolved.emit(this.flag);
      }
  }

  private _closeModal(): void {
    this._activeModalRef.close();
  }

  /**
   * creating comment from flag
   * @param flag
   */
  public createCommentFromFlag(flag: IFlag): void {
    let comment = <ICommentsRequest>{
      categoryName: null,
      categoryId: null,
      sectionName: null,
      sectionId: null,
      questionId: null,
      questionName: flag.questionName,
      customerName: this.customer.customerName,
      customerNumber: this.customer.customerNumber,
      planId: flag.planId,
      planName: flag.planName,
      ppcModelName: null,
      ppcVersion: null,
      coverageId: null,
      text: flag.text
    };
    this._commentService.createComment(comment);
  }

  /**
   * Handles the cancel event of the dismiss link.
   */
  public cancel(): void {
    this._activeModalRef.dismiss();
    this._activeModalRef.close();
  }

}
