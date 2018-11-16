import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Component} from '@angular/core';
import {IComment} from '../../interfaces/iComment';
import {CommentViewTypes} from '../../enums/CommentViewTypes';
import {By} from '@angular/platform-browser';
import * as mockComments from '../../../../assets/test/tagging/comments/comments.mock.json';
import {CommentListItemComponent} from './comment-list-item.component';

describe('CommentListItemComponent', () => {
  let component: TestCommentListItemComponent;
  let fixture: ComponentFixture<TestCommentListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestCommentListItemComponent, CommentListItemComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestCommentListItemComponent);
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
    it('Should render a comment in default view', () => {
      const comment = fixture.debugElement.query(By.css('.comment-list-item .default-view'));
      expect(comment).toBeTruthy();

      const invalidComment = fixture.debugElement.query(By.css('.comment-list-item .compact-view'));
      expect(invalidComment).toBeNull();
    });

    it('Should render a comment in compact view', () => {
      component.commentView = CommentViewTypes.COMPACT;
      fixture.detectChanges();

      const comment = fixture.debugElement.query(By.css('.comment-list-item .compact-view'));
      expect(comment).toBeTruthy();

      const invalidComment = fixture.debugElement.query(By.css('.comment-list-item .default-view'));
      expect(invalidComment).toBeNull();
    });

    it('Should toggle between compact and default view', () => {
      component.commentView = CommentViewTypes.COMPACT;
      fixture.detectChanges();

      let comment = fixture.debugElement.query(By.css('.comment-list-item .compact-view'));
      expect(comment).toBeTruthy();
      let invalidComment = fixture.debugElement.query(By.css('.comment-list-item .default-view'));
      expect(invalidComment).toBeNull();

      component.commentView = CommentViewTypes.DEFAULT;
      fixture.detectChanges();

      comment = fixture.debugElement.query(By.css('.comment-list-item .default-view'));
      expect(comment).toBeTruthy();
      invalidComment = fixture.debugElement.query(By.css('.comment-list-item .compact-view'));
      expect(invalidComment).toBeNull();

      component.commentView = CommentViewTypes.COMPACT;
      fixture.detectChanges();

      comment = fixture.debugElement.query(By.css('.comment-list-item .compact-view'));
      expect(comment).toBeTruthy();
      invalidComment = fixture.debugElement.query(By.css('.comment-list-item .default-view'));
      expect(invalidComment).toBeNull();
    });
  });

  @Component({
    template: `
      <gpr-comment-list-item [comment]="comment" [commentView]="commentView"></gpr-comment-list-item>
    `
  })
  class TestCommentListItemComponent {
    public comment: IComment = JSON.parse(JSON.stringify(mockComments))[0];
    public commentView: CommentViewTypes = CommentViewTypes.DEFAULT;
  }
});
