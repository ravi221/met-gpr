import {TestBed} from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { CommentService } from 'app/comment/services/comment.service';
import { Subscription } from 'rxjs/Subscription';
import { ICommentsRequest } from '../interfaces/iCommentsRequest';
import { PageAccessType } from 'app/core/enums/page-access-type';
import { FlagService } from '../../flag/services/flag.service';
import { IComment } from 'app/comment/interfaces/iComment';
import { ICommentsResponse } from '../interfaces/iCommentsResponse';

describe('CommentService', () => {
  let service: CommentService;
  let subscription: Subscription;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService, FlagService]
    });
    service = TestBed.get(CommentService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('FetchSectionComments', () => {
    it('should fetch all comments', () => {
        let commentRequest = <ICommentsRequest> {
            customerNumber: 1234,
            planId: '123'
        };
        subscription = service.fetchSectionComments(commentRequest).subscribe((response: ICommentsResponse) => {
          expect(response.comments.length).toBe(1);
          expect(response.comments[0].text).toBe('comment 1');
        });
        const reqStub = httpMock.expectOne({method: 'GET'});
        const comments = <ICommentsResponse>{ 'comments': [{
          'text': 'comment 1',
          'commentId': 1,
          'lastUpdatedBy': 'person1',
          'lastUpdatedByEmail': 'lastemail',
          'lastUpdatedByTimestamp': ''
      }]};
        reqStub.flush(comments);
        httpMock.verify();
    });
  });

  describe('can add flag comments', () => {
    it('if read only user access cannot add comments and flags', () => {
        expect(service.canAddFlagComment(PageAccessType.READ_ONLY)).toBeFalsy();
    });

    it('if super user access can add comments and flags', () => {
      expect(service.canAddFlagComment(PageAccessType.SUPER_USER)).toBeTruthy();
  });
  });
});
