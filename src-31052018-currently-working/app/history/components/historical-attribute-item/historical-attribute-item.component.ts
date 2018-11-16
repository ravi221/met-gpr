import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IHistoricalAttribute} from '../../interfaces/iHistoricalAttribute';
import {fadeInOut} from '../../../ui-controls/animations/fade-in-out';
import {AnimationState} from '../../../ui-controls/animations/AnimationState';
import {HistoryService} from '../../services/history.service';
import {Subscription} from 'rxjs/Subscription';

/**
 * Represents a single historical attribute
 */
@Component({
  selector: 'gpr-historical-attribute-item',
  template: `
    <section class="attribute">
      <div class="attribute-info">
        <h2 class="attribute-title">
          {{attribute.attributeName}}: <span class="attribute-description">{{attribute.attributeDescription}}</span>
        </h2>
        <div class="text-muted attribute-details">
          <span>
            <gpr-user-tooltip [userInfo]="attribute.userInfo" [position]="'bottom'"></gpr-user-tooltip>
          </span>{{attribute.lastUpdatedTimestamp}}
        </div>
        <div [@fadeInOut]="commentsVisibilityState" class="comment-list">
          <gpr-comment-list [comments]="attribute.comments"></gpr-comment-list>
        </div>
      </div>
      <div>
        <button class="btn btn-more-info comment-button" *ngIf="attribute.comments" (click)="sectionToggle()">{{commentsButtonLabel}}</button>
      </div>
    </section>
  `,
  styleUrls: ['./historical-attribute-item.component.scss'],
  animations: [fadeInOut]
})
export class HistoricalAttributeItemComponent implements OnInit, OnDestroy {

  /**
   * A historical attribute to be displayed
   */
  @Input() attribute: IHistoricalAttribute;

  /**
   * The label for the comment button
   * @type {string}
   */
  public commentsButtonLabel = '';

  /**
   * Determines if to display or hide the comments
   * @type {AnimationState}
   */
  public commentsVisibilityState: AnimationState = AnimationState.HIDDEN;

  /**
   * Indicates that section comments show/hide
   * @type {boolean}
   */
  private _showComments: boolean = false;

  /**
   * Subscription for toggling all comments
   */
  private _historyToggleCommentsSubscription: Subscription;

  /**
   * Constructor for the historical attribute item
   * @param {HistoryService} _historyService
   */
  constructor(private _historyService: HistoryService) {
  }

  /**
   * On init, setup the error tooltip
   */
  ngOnInit(): void {
    this._updateButtonLabel();
    this._historyToggleCommentsSubscription = this._historyService.toggleAllComments$.subscribe((showComments: boolean) => {
      this._showComments = showComments;
      this.commentsVisibilityState = this._showComments ? AnimationState.VISIBLE : AnimationState.HIDDEN;
    });
  }

  /**
   * On destroy, unsubscribe from subscriptions
   */
  ngOnDestroy(): void {
    if (this._historyToggleCommentsSubscription) {
      this._historyToggleCommentsSubscription.unsubscribe();
    }
  }

  /**
   * Toggling comments for sections.
   */
  public sectionToggle(): void {
    this._showComments = !this._showComments;
    this.commentsVisibilityState = this._showComments ? AnimationState.VISIBLE : AnimationState.HIDDEN;
  }

  /**
   * Updates the button label
   * @private
   */
  private _updateButtonLabel(): void {
    const comments = this.attribute.comments;
    if (!comments) {
      return;
    }
    const buttonLabelEnd = this.attribute.comments.length === 1 ? 'Comment' : 'Comments';
    this.commentsButtonLabel = `Show ${this.attribute.comments.length} ${buttonLabelEnd}`;
  }
}
