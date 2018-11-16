import {Component, Input} from '@angular/core';
import { ICommentsRequest } from '../../../comment/interfaces/iCommentsRequest';
import { IComment } from '../../../comment/interfaces/iComment';

@Component({
  selector: 'gpr-comment-create-tooltip',
  template: ``
})
export class CommentCreateTooltipStubComponent {
  /**
   * The position where to place the tooltip
   */
  @Input() position: string = 'bottom';
  /**
   * parent data needed to make the request
   */
  @Input() tagData: ICommentsRequest;
  /**
   * array of existing comments
   */
  @Input() existingComments: IComment[];

}
