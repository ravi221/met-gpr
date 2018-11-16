import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SearchPlanListItemComponent} from './plan-list-item.component';
import {SearchResultComponent} from '../search-result/search-result.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchResultTitleService} from '../../../services/search-result-title.service';
import {click} from '../../../../../assets/test/TestHelper';

describe('SearchPlanListItemComponent', () => {
  let component: TestSearchPlanListItemComponent;
  let fixture: ComponentFixture<TestSearchPlanListItemComponent>;
  let searchResult: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchPlanListItemComponent,
        SearchPlanListItemComponent,
        SearchResultComponent,
        IconComponent,
        SearchResultTitleComponent
      ],
      providers: [
        SearchResultTitleService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchPlanListItemComponent);
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

  it('should setup the plan search result correctly', () => {
    const icon = searchResult.query(By.css('img'));
    const title = searchResult.query(By.css('.search-result-title span:first-child'));
    const subtitle = searchResult.query(By.css('.search-result-subtitle'));
    expect(icon.nativeElement.src).toContain('dental-icon');
    expect(title.nativeElement.innerHTML).toBe('Dental - Plan 1');
    expect(subtitle.nativeElement.innerHTML).toBe('Effective: 01/01/2018, 0% Complete');
  });

  it('should trigger the plan click event when the plan is clicked', () => {
    const spy = spyOn(component, 'onPlan').and.stub();
    click(searchResult, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('1');
  });

  @Component({
    template: `
      <gpr-search-plan-list-item [plan]="plan" (planClick)="onPlan($event)"></gpr-search-plan-list-item>
    `
  })
  class TestSearchPlanListItemComponent {
    @ViewChild(SearchPlanListItemComponent) planListItem;

    plan = {
      planIds: ['1'],
      coverageId: 201000,
      effectiveDate: '01/01/2018',
      planName: 'Dental - Plan 1',
      completionPercentage: 0,
      productType: 'Dental'
    };

    onPlan(e): void {
    }
  }
});
