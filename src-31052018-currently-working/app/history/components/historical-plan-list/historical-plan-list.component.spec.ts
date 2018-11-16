import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {HistoricalPlanListComponent} from './historical-plan-list.component';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';
import {PlanStatus} from '../../../plan/enums/plan-status';
import { CommentListComponent } from 'app/comment/components/comment-list/comment-list.component';
import { CommentListItemComponent } from 'app/comment/components/comment-list-item/comment-list-item.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HistoricalPlanListStubComponent} from './historical-plan-list.component.stub';

describe('HistoricalPlanListComponent', () => {
  let component: TestHistoricalPlanListComponent;
  let fixture: ComponentFixture<TestHistoricalPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [
        HistoricalPlanListStubComponent,
        TestHistoricalPlanListComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHistoricalPlanListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('Historical Plan List', () => {
    it('should have two plans', function () {
      expect(component.historicalPlans.length).toBe(2);
    });
  });

  @Component({
    template: `
      <gpr-historical-plan-list [historicalPlans]="historicalPlans"></gpr-historical-plan-list>
    `
  })
  class TestHistoricalPlanListComponent {
    @ViewChild(HistoricalPlanListComponent) historicalPlanList;
    public historicalPlans = [<IHistoricalPlan>{
      planName: 'Test Plan',
      effectiveDate: '6/01/17',
      planStatus: PlanStatus.IN_REVISION,
      historicalVersions: []
    },
      <IHistoricalPlan>{
        planName: 'Test Plan',
        effectiveDate: '6/01/17',
        planStatus: PlanStatus.IN_REVISION,
        historicalVersions: []
      }];
  }
});
