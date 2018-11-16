import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Component} from '@angular/core';
import {CommentListComponent} from './comment-list.component';
import {IComment} from '../../interfaces/iComment';
import {CommentViewTypes} from '../../enums/CommentViewTypes';
import {By} from '@angular/platform-browser';
import * as mockComments from '../../../../assets/test/tagging/comments/comments.mock.json';
import {CommentListItemComponent} from '../comment-list-item/comment-list-item.component';

describe('CommentListComponent', () => {
  let component: TestCommentListComponent;
  let fixture: ComponentFixture<TestCommentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentListComponent, TestCommentListComponent, CommentListItemComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestCommentListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Changing view type', () => {
    it('Should render two comments in default view', () => {
      const comments = fixture.debugElement.queryAll(By.css('.comment-list-item'));
      expect(comments).toBeTruthy();
      expect(comments.length).toBe(2);

      const commentsWithDefaultView = fixture.debugElement.queryAll(By.css('.comment-list-item .default-view'));
      expect(commentsWithDefaultView).toBeTruthy();
      expect(commentsWithDefaultView.length).toBe(2);
    });

    it('Should render two comments in compact view', () => {
      component.commentView = CommentViewTypes.COMPACT;
      fixture.detectChanges();

      const comments = fixture.debugElement.queryAll(By.css('.comment-list-item'));
      expect(comments).toBeTruthy();
      expect(comments.length).toBe(2);

      const commentsWithDefaultView = fixture.debugElement.queryAll(By.css('.comment-list-item .compact-view'));
      expect(commentsWithDefaultView).toBeTruthy();
      expect(commentsWithDefaultView.length).toBe(2);
    });
  });

  describe('Changing max height', () => {
    it('Should not add the \'scroll\' class by default', () => {
      const commentList = fixture.debugElement.query(By.css('.comment-list.scroll'));
      expect(commentList).toBeNull();
    });

    it('Should add the \'scroll\' class when maxHeight is not zero', () => {
      component.maxHeight = 20;
      fixture.detectChanges();

      const commentList = fixture.debugElement.query(By.css('.comment-list.scroll'));
      expect(commentList).toBeTruthy();
    });

    it('Should toggle \'scroll\' class when maxHeight changes', () => {
      let commentList = fixture.debugElement.query(By.css('.comment-list.scroll'));
      expect(commentList).toBeNull();

      component.maxHeight = 20;
      fixture.detectChanges();
      commentList = fixture.debugElement.query(By.css('.comment-list.scroll'));
      expect(commentList).toBeTruthy();

      component.maxHeight = 0;
      fixture.detectChanges();
      commentList = fixture.debugElement.query(By.css('.comment-list.scroll'));
      expect(commentList).toBeNull();
    });
  });

  @Component({
    template: `
      <gpr-comment-list [comments]="comments" [commentView]="commentView" [maxHeight]="maxHeight"></gpr-comment-list>
    `
  })
  class TestCommentListComponent {
    public comments: IComment[] = JSON.parse(JSON.stringify(mockComments));
    public commentView: CommentViewTypes = CommentViewTypes.DEFAULT;
    public maxHeight: number = 0;
  }
});
