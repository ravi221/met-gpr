import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, Output, EventEmitter} from '@angular/core';
import {IComment} from '../../interfaces/iComment';
import {CommentViewTypes} from '../../enums/CommentViewTypes';
import {ScrollDirection} from 'app/ui-controls/enums/scroll-direction';

/**
 * A component to display a list of comments
 **/
@Component({
  selector: 'gpr-comment-list',
  template: `
    <div class="comment-list" [class]="styleClass" [style.height]="height" gprScroll (scroll)="onScroll($event)">
      <gpr-comment-list-item *ngFor="let comment of comments"
                             [comment]="comment"
                             [commentView]="commentView"></gpr-comment-list-item>
    </div>
  `,
  styleUrls: ['./comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent implements OnInit, OnChanges {
  /**
   * The comments to display
   */
  @Input() comments: IComment[];

  /**
   * How to display the comments, either compact or default
   * @type {CommentViewTypes}
   */
  @Input() commentView: CommentViewTypes = CommentViewTypes.DEFAULT;

  /**
   * Determines the max height of the list, to allow overflow scrolling
   * @type {number}
   */
  @Input() maxHeight: number = 0;

  /**
   * Emits an event to show more results when scrolling
   * @type {EventEmitter<any>}
   */
  @Output() showMoreResultsScroll: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The style to apply to comment list
   */
  public styleClass: string = 'comment-list';

  /**
   * The height of the comment list
   * @type {string}
   */
  public height: string = 'auto';

  /**
   * On init, setup the comment
   */
  ngOnInit(): void {
    this._setupComments();
  }

  /**
   * On changes, setup the comment
   */
  ngOnChanges(): void {
    this._setupComments();
  }

  /**
   * Sets up the comment
   * @private
   */
  private _setupComments(): void {
    const hasMaxHeight = this.maxHeight !== 0;
    if (hasMaxHeight) {
      this.styleClass = 'comment-list scroll';
      this.height = `${this.maxHeight}px`;
    } else {
      this.styleClass = 'comment-list';
      this.height = 'auto';
    }
  }

  /**
   * Whenever a scroll occurs, potentially load more components
   * @param {ScrollDirections} scrollDirection
   */
  public onScroll(scrollDirection: ScrollDirection): void {
    const isScrollNext = scrollDirection === ScrollDirection.NEXT;
    if (!isScrollNext) {
      return;
    }
  }
}
