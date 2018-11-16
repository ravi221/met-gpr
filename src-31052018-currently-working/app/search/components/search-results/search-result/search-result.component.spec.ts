import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchResultComponent} from './search-result.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleService} from '../../../services/search-result-title.service';
import {click} from '../../../../../assets/test/TestHelper';

describe('SearchResultComponent', () => {
  let component: TestSearchResultComponent;
  let fixture: ComponentFixture<TestSearchResultComponent>;
  let searchResult: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchResultComponent,
        TestSearchResultWithMoreInfoComponent,
        SearchResultComponent,
        SearchResultTitleComponent,
        IconComponent
      ],
      providers: [
        SearchResultTitleService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        searchResult = fixture.debugElement.query(By.css('.search-result'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Events', () => {
    it('should fire event when the search result is clicked', () => {
      const spy = spyOn(component, 'onSearchResult').and.stub();
      click(searchResult, fixture);
      expect(spy).toHaveBeenCalled();
    });

    it('should trigger the more info event when clicked', () => {
      const newFixture = TestBed.createComponent(TestSearchResultWithMoreInfoComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      const spy = spyOn(newComponent, 'onMoreInfo');
      const moreInfoBtn = newFixture.debugElement.query(By.css('.search-result-more-info'));
      click(moreInfoBtn, newFixture);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Rendering', () => {
    it('should render the icon as a customer icon', () => {
      const element = searchResult.query(By.css('img'));
      expect(element.nativeElement.src).toContain('customer');
    });

    it('should render \'Title\' as the title', () => {
      const element = searchResult.query(By.css('.search-result-title span:first-child'));
      expect(element.nativeElement.innerHTML).toBe('Title');
    });

    it('should render \'Subtitle\' as the subtitle', () => {
      const element = searchResult.query(By.css('.search-result-subtitle'));
      expect(element.nativeElement.innerHTML).toBe('Subtitle');
    });

    describe('More info button', () => {
      it('should not render the more info button if no label is provided', () => {
        const element = searchResult.query(By.css('.search-result-more-info'));
        expect(element).toBeNull();
      });

      it('should render the more info button if a label is provided', () => {
        let newFixture = TestBed.createComponent(TestSearchResultWithMoreInfoComponent);
        newFixture.detectChanges();

        const moreInfoBtn = newFixture.debugElement.query(By.css('.search-result-more-info'));
        expect(moreInfoBtn.nativeElement.innerHTML).toContain('Test');
      });
    });
  });

  @Component({
    'template': `
      <gpr-search-result [icon]="'customer'"
                         [title]="'Title'"
                         [subtitle]="'Subtitle'"
                         (searchResultClick)="onSearchResult($event)"
                         (searchResultMoreInfoClick)="onMoreInfo($event)"></gpr-search-result>
    `
  })
  class TestSearchResultComponent {
    @ViewChild(SearchResultComponent) searchResult;

    onSearchResult(e) {

    }

    onMoreInfo(e) {

    }
  }

  @Component({
    'template': `
      <gpr-search-result [icon]="'customer'"
                         [title]="'Title'"
                         [subtitle]="'Subtitle'"
                         [moreInfoLabel]="'Test'"
                         (searchResultClick)="onSearchResult($event)"
                         (searchResultMoreInfoClick)="onMoreInfo($event)"></gpr-search-result>
    `
  })
  class TestSearchResultWithMoreInfoComponent {
    @ViewChild(SearchResultComponent) searchResult;

    onSearchResult(e) {
    }

    onMoreInfo(e) {
    }
  }
});
