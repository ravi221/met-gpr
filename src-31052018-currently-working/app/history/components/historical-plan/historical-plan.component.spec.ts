import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HistoricalPlanComponent} from './historical-plan.component';
import {ExpandCollapseIconComponent} from '../../../ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import {AnimationState} from '../../../ui-controls/animations/AnimationState';
import {click} from '../../../../assets/test/TestHelper';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';
import {PlanStatus} from '../../../plan/enums/plan-status';
import {HistoricalVersionListStubComponent} from '../historical-version-list/historical-version-list.component.stub';

describe('HistoricalPlanComponent', () => {
  let component: TestHistoricalPlanComponent;
  let fixture: ComponentFixture<TestHistoricalPlanComponent>;
  let collapseBtn: DebugElement;
  let historicalPlan: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [
        ExpandCollapseIconComponent,
        HistoricalPlanComponent,
        HistoricalVersionListStubComponent,
        TestHistoricalPlanComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHistoricalPlanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        historicalPlan = fixture.debugElement.query(By.css('.historical-plan'));
        collapseBtn = fixture.debugElement.query(By.css('.expand-collapse-icon'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Historical Plan', () => {
    it('plan-name should be present', function () {
      const planName = historicalPlan.query(By.css('.plan-name'));
      expect(planName.nativeElement.innerHTML).toContain('Test Plan');
    });

    it('plan-details should be present', function () {
      const planDetails = historicalPlan.query(By.css('.plan-details'));
      expect(planDetails.nativeElement.innerHTML).toContain('Effective Date: 6/01/17');
    });

    it('historical-plan-list class should be present', () => {
      expect(component.historicalPlanComponent.historicalPlan).toBeTruthy();
    });
  });

  describe('Historical Plan Toggle', () => {
    it('should toggle between showing and hiding the historical plan', () => {
      expect(component.historicalPlanComponent.historicalPlanState).toBe(AnimationState.VISIBLE);
      click(collapseBtn, fixture);
      expect(component.historicalPlanComponent.historicalPlanState).toBe(AnimationState.HIDDEN);
      click(collapseBtn, fixture);
      expect(component.historicalPlanComponent.historicalPlanState).toBe(AnimationState.VISIBLE);
    });
  });


  @Component({
    template: `
      <gpr-historical-plan [historicalPlan]="historicalPlan"></gpr-historical-plan>
    `
  })
  class TestHistoricalPlanComponent {
    @ViewChild(HistoricalPlanComponent) historicalPlanComponent;
    public historicalPlan = <IHistoricalPlan>{
      planName: 'Test Plan',
      effectiveDate: '6/01/17',
      planStatus: PlanStatus.IN_REVISION,
      historicalVersions: []
    };
    public historicalPlanState: AnimationState = AnimationState.VISIBLE;
  }
});
