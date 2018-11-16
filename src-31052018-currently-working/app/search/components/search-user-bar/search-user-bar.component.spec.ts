import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchUserBarComponent} from './search-user-bar.component';
import {UserSearchService} from '../../services/user-search.service';
import {Component, ViewChild} from '@angular/core';
import {ISearchUser} from '../../interfaces/iSearchUser';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {AutoSearchStubComponent} from '../../../ui-controls/components/auto-search/auto-search.component.stub';

describe('SearchUserBarComponent', () => {
  let component: TestSearchUserBarComponent;
  let fixture: ComponentFixture<TestSearchUserBarComponent>;
  let subscription: Subscription;
  const testUser: ISearchUser = {
    userId: '1',
    firstName: 'Test',
    lastName: 'Test',
    emailAddress: 'test@metlife.com'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestSearchUserBarComponent, SearchUserBarComponent, AutoSearchStubComponent],
      providers: [UserSearchService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchUserBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Event emitters', () => {
    it('should emit a user when the auto search item is selected', () => {
      const spy = spyOn(component, 'onUserSelect').and.stub();
      component.searchUserBar.onUserSelect(testUser);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(testUser);
    });

    it('should emit the user is selected', (done) => {
      subscription = component.searchUserBar.userSelect.subscribe(user => {
        expect(user).toBe(testUser);
        done();
      });
      component.searchUserBar.onUserSelect(testUser);
    });
  });

  @Component({
    template: `
      <gpr-search-user-bar (userSelect)="onUserSelect($event)"></gpr-search-user-bar>`
  })
  class TestSearchUserBarComponent {
    @ViewChild(SearchUserBarComponent) searchUserBar;

    onUserSelect(e) {
    }
  }
});
