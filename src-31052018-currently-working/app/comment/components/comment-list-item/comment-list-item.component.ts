import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {IComment} from '../../interfaces/iComment';
import {CommentViewTypes} from '../../enums/CommentViewTypes';

/**
 * A component to display a single comment, used in the {@link CommentListComponent}
 */
@Component({
  selector: 'gpr-comment-list-item',
  template: `
    <div class="comment-list-item">
      <div>
        <section class="compact-view" *ngIf="isCompactView">
          <span class="comment-timestamp">{{comment.lastUpdatedTimestamp}}</span>
          <h3 class="comment-user">{{comment.lastUpdatedBy}}</h3>
          <p class="comment-text">{{comment.text}}</p>
        </section>
        <div class="default-view" *ngIf="!isCompactView">
          <h3 class="comment-user">{{comment.lastUpdatedBy}}</h3>
          <span class="comment-timestamp">{{comment.lastUpdatedTimestamp}}</span>
          <p class="comment-text">{{comment.text}}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./comment-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListItemComponent implements OnInit, OnChanges {
  /**
   * The comment to display
   */
  @Input() comment: IComment;

  /**
   * How to display the comment, either compact or default
   * @type {CommentViewTypes}
   */
  @Input() commentView: CommentViewTypes = CommentViewTypes.DEFAULT;

  /**
   * Indicates if to display the comment compact
   * @type {boolean}
   */
  public isCompactView: boolean = false;

  /**
   * On init, setup the comment
   */
  ngOnInit(): void {
    this._setupComment();
  }

  /**
   * On changes, setup the comment
   */
  ngOnChanges(): void {
    this._setupComment();
  }

  /**
   * Sets up the comment
   * @private
   */
  private _setupComment(): void {
    this.isCompactView = this.commentView === CommentViewTypes.COMPACT;
  }
}
