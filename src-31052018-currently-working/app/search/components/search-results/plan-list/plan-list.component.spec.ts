import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SearchPlanListComponent} from './plan-list.component';
import {SearchPlanListItemComponent} from '../plan-list-item/plan-list-item.component';
import {SearchResultComponent} from '../search-result/search-result.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchResultTitleService} from '../../../services/search-result-title.service';
import {click} from '../../../../../assets/test/TestHelper';

describe('SearchPlanListComponent', () => {
  let component: TestSearchPlanListComponent;
  let fixture: ComponentFixture<TestSearchPlanListComponent>;
  let searchResult: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchPlanListComponent,
        TestSearchPlanListComponent,
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
        fixture = TestBed.createComponent(TestSearchPlanListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        searchResult = fixture.debugElement.query(By.css('.search-result:first-child'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create 5 plan search results', () => {
    const plans = fixture.debugElement.query(By.css('.search-plan-list'));
    expect(plans.children).toBeTruthy();
    expect(plans.children.length).toBe(5);
  });

  it('should emit an event when a plan is clicked', () => {
    const spy = spyOn(component, 'onPlan').and.stub();
    click(searchResult, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('1');
  });

  @Component({
    template: `
      <gpr-search-plan-list [plans]="plans"
                            (planClick)="onPlan($event)"></gpr-search-plan-list>
    `
  })
  class TestSearchPlanListComponent {
    @ViewChild(SearchPlanListComponent) planList;

    plans = [
      {
        planIds: ['1'],
        coverageId: 201000,
        effectiveDate: '01/01/2018',
        planName: 'Dental - Plan 1',
        productType: 'Dental'
      },
      {
        planIds: ['1'],
        coverageId: 204000,
        effectiveDate: '01/01/2018',
        planName: 'Vision - Plan 1',
        productType: 'Vision'
      },
      {planIds: ['3'], coverageId: 2, effectiveDate: '01/01/2018', planName: 'Life - Plan 1', productType: 'Life'},
      {
        planIds: ['4'],
        coverageId: 202000,
        effectiveDate: '01/01/2018',
        planName: 'Disability - Plan 1',
        productType: 'Disability'
      },
      {
        planIds: ['5'],
        coverageId: 24,
        effectiveDate: '01/01/2018',
        planName: 'Voluntary - Plan 1',
        productType: 'Voluntary'
      }
    ];

    onPlan(e) {

    }
  }
});
