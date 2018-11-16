import {Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {OnDestroy} from '@angular/core/src/metadata/lifecycle_hooks';
import {NotificationService} from 'app/core/services/notification.service';
import {NotificationTypes} from 'app/core/models/notification-types';
import {CookieHelper} from 'app/core/utilities/cookie-helper';
import { ICommentsRequest } from '../../../comment/interfaces/iCommentsRequest';
import { IComment } from 'app/comment/interfaces/iComment';
import { CommentService } from '../../../comment/services/comment.service';
import { ICommentsResponse } from '../../../comment/interfaces/iCommentsResponse';
import { PageAccessType } from 'app/core/enums/page-access-type';
import { TooltipService } from 'app/ui-controls/services/tooltip.service';
import { INavState } from 'app/navigation/interfaces/iNavState';
import { isNil } from 'lodash';
import { ICreateFlagRequest } from '../../../flag/interfaces/iCreateFlagRequest';
import { NavigatorService } from 'app/navigation/services/navigator.service';
import { ICreateCommentRequest } from '../../../comment/interfaces/iCreateCommentRequest';
import { CommentErrorType } from 'app/comment/enums/comment-error-type';

/**
 * A component that handles the creation of a flag. When an icon is clicked a popover pops up that allows the user
 * to create a flag
 */
@Component({
  selector: 'gpr-comment-create-tooltip',
  template: `
    <gpr-tooltip-content #commentToolTip>
      <div class="plrbt-15 tooltip-container">
      <div class="comment-record-box" *ngIf = "commentsExist">
        <div class="existing-comment" *ngFor = "let comment of comments">
          <span class="created-by">{{comment.lastUpdatedBy}}</span><br/>
          <span class="created-date">{{comment.lastUpdatedTimestamp}}</span>
          <p class ="tag-text">{{comment.text}}</p>
        </div>
      </div>
        <span id="comment-header">Add a Comment</span>
        <br>
        <textarea maxlength="256" class="flag-textarea" [(ngModel)]="text"></textarea>
        <footer class="flag-footer">
          <button class="save-button" (click) = "submitComment()">ADD COMMENT</button>
        </footer>
      </div>
    </gpr-tooltip-content>
    <gpr-icon gprTooltip [tooltipContent]="commentToolTip"
              position="bottom"
              [theme]="'white'"
              [displayCloseIcon]="true"
              name="comment"
              [state]="commentState"
              *ngIf="isAddCommentDisabled">
    </gpr-icon>

  `,
  styleUrls: ['./comment-create-tooltip.component.scss']
})
export class CommentCreateTooltipComponent implements OnDestroy, OnInit {

  /**
   * The position where to place the tooltip
   */
  @Input() position: string = 'bottom';
  /**
   * parent data needed to make the request
   */
  @Input() tagData: ICreateCommentRequest;
  /**
   * array of existing comments
   */
  @Input() existingComments: IComment[];

  /**
   * determines which icon to display, based on whether commentExists is true or false
   */
  public commentState: 'on' | 'off' = 'off';

  /**
   * used to hold new comments on page
   */
  public comments: IComment[] = [<IComment>{}];
  /**
   * contains text to be added to the comment in the database
   */
  public text: string = null;

  /**
   * Indicates if the add comment icon should be disabled
   * @type {boolean}
   */
  public isAddCommentDisabled: boolean = false;

  /**
   * The current access for this page
   */
  private _pageAccessType: PageAccessType;

  /**
   * subscription for the tag service
   */
  private _subscription: Subscription;

  /**
   * does a comment exist for this question?
   */
  public commentsExist: boolean;



  /**
   * The default constructor.
   */
  constructor(private _createTagService: CommentService,
              private _notificationService: NotificationService,
              private _changeDetector: ChangeDetectorRef,
              private _tooltipService: TooltipService,
              private _navigator: NavigatorService) {
  }

  ngOnInit() {
    if (this.existingComments) {
      this.commentsExist = true;
      this.commentState = 'on';
      this.comments = this.existingComments;
    } else {
      this.commentsExist = false;
      this.commentState = 'off';
    }
    const navState: INavState = this._navigator.subscribe('plan-data-entry', (value: INavState) => {
      this._updateNavState(value);
    });
    this._updateNavState(navState);
    this.isAddCommentDisabled = this._createTagService.canAddFlagComment(this._pageAccessType);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  /**
   * on hitting the save button use the createcomment function on the tagging service
   */
  public submitComment(): void {
    if (this.text) {
      this.tagData.text = this.text;
      this._subscription = this._createTagService.createComment(this.tagData)
        .subscribe((result) => this._successMessage(this.tagData),
        error => this._showErrorMessage(CommentErrorType.CREATE_ERROR));
    } else {
      this._showErrorMessage(CommentErrorType.NULL_ERROR);
    }
  }

  /**
   * show message confirming the comment was created
   */
  private _successMessage(tagData: ICommentsRequest): void {
    this.commentsExist = true;
    this.commentState = 'on';
    this.text = '';
    const successMessage = `Comment was created for ${this.tagData.questionId}`;
    this._tooltipService.hideAllTooltips();
    this._notificationService.addNotification(NotificationTypes.SUCCESS, successMessage);
    const commentRequest = <ICommentsRequest> {
      planId: tagData.planId,
      categoryId: tagData.categoryId,
      sectionId: tagData.sectionId
    };
    this._subscription = this._createTagService.fetchSectionComments(commentRequest)
    .subscribe((response) => {
      this.refreshComments(response, tagData);
    });
  }
/**
 * show message stating that the comment was not created
 */
  private _showErrorMessage(type: string): void {
    let errorMessage = '';
    switch (type) {
      case CommentErrorType.CREATE_ERROR:
        errorMessage = `Comment was not created for ${this.tagData.questionId}`;
        this._tooltipService.hideAllTooltips();
        this._notificationService.addNotification(NotificationTypes.ERROR, errorMessage);
        break;
      case CommentErrorType.NULL_ERROR:
        errorMessage = `Empty text not allowed. Comment was not created for ${this.tagData.questionId}`;
        this._tooltipService.hideAllTooltips();
        this._notificationService.addNotification(NotificationTypes.ERROR, errorMessage);
        break;
      default:
    }
  }

  /**
   * Refreshes the comments displayed to the user after submit
   * @param response
   * @param tagData
   */
  public refreshComments(response: ICommentsResponse, tagData: ICommentsRequest): void {
    this.comments = [];
    this.comments = response.comments;
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
