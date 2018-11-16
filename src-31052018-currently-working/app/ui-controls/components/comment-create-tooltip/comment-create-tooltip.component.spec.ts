import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TooltipContentComponent} from 'app/ui-controls/components/tooltip/tooltip-content.component';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {TooltipDirective} from 'app/ui-controls/components/tooltip/tooltip.directive';
import {TooltipService} from 'app/ui-controls/services/tooltip.service';
import {TooltipPositionService} from 'app/ui-controls/services/tooltip-position.service';
import {CommentCreateTooltipComponent} from './comment-create-tooltip.component';
import { FormsModule } from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NotificationService} from 'app/core/services/notification.service';
import { CommentService } from '../../../comment/services/comment.service';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IComment } from '../../../comment/interfaces/iComment';
import { ICommentsRequest } from '../../../comment/interfaces/iCommentsRequest';
import { ICommentsResponse } from '../../../comment/interfaces/iCommentsResponse';
import { ISummaryFlagsResponse } from '../../../flag/interfaces/iSummaryFlagsResponse';
import { ISummaryFlagsRequest } from 'app/flag/interfaces/iSummaryFlagsRequest';
import { FlagService } from '../../../flag/services/flag.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigatorService } from '../../../navigation/services/navigator.service';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';
import * as mockComments from 'assets/test/common-objects/comments.mock.json';

describe('CommentCreateTooltipComponent', () => {
  let component: CommentCreateTooltipComponent;
  let fixture: ComponentFixture<CommentCreateTooltipComponent>;

  beforeEach(() => {
   TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [CommentCreateTooltipComponent, TooltipContentComponent, IconComponent, TooltipDirective],
      providers: [TooltipService, TooltipPositionService, NotificationService, CommentService, FlagService, NavigatorService, LoadingSpinnerService
        ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentCreateTooltipComponent);
    component = fixture.componentInstance;
    component.existingComments = [];
    fixture.detectChanges();
  });

  it('Comment create tooltip should be created', () => {
    expect(component).toBeTruthy();
  });

  it('Comments should be 1 item longer than before refresh', () => {
    component.comments = [mockComments[0], mockComments[1]];
    let tagData = <ICommentsRequest>{};
    tagData.questionId = '1234';
    let response: ICommentsResponse = <ICommentsResponse>{};
    response.comments = [mockComments[0], mockComments[1], mockComments[2]];

    component.refreshComments(response, tagData);

    expect(component.comments.length).toEqual(3);
  });

  it('Should not be added to comments if the comment coming from the response has a different question name', () => {
    component.comments = [mockComments[0], mockComments[1]];
    let tagData = <ICommentsRequest>{};
    tagData.questionId = '1234';
    let response: ICommentsResponse = <ICommentsResponse>{};
    response.comments = [mockComments[0], mockComments[1]];

    component.refreshComments(response, tagData);

    expect(component.comments.length).toEqual(2);
  });
});
