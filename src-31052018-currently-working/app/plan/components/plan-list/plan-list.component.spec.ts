import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {PlanContextMenuStubComponent} from '../plan-context-menu/plan-context-menu.component.stub';
import {PlanDataService} from '../../plan-shared/services/plan-data.service';
import {PlanListComponent} from './plan-list.component';
import {IPlanAction} from '../../interfaces/iPlanAction';
import {PlanErrorTooltipStubComponent} from '../plan-error-tooltip/plan-error-tooltip.component.stub';

describe('PlanListComponent', () => {
  let component: TestPlanListComponent;
  let fixture: ComponentFixture<TestPlanListComponent>;
  let headers: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardComponent,
        IconComponent,
        LoadingIconComponent,
        PlanContextMenuStubComponent,
        PlanErrorTooltipStubComponent,
        PlanListComponent,
        TestPlanListComponent,
        TestPlanListWithFlagsComponent,
        TestPlanListWithoutPlansComponent,
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestPlanListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        headers = fixture.debugElement.query(By.css('tr:first-child'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Sorting', () => {
    it('should sort plan name in descending order when clicked twice', () => {
      const otherHeader = headers.children[1];
      click(otherHeader, fixture);

      const planNameHeader = headers.children[0];
      click(planNameHeader, fixture);

      expect(planNameHeader.nativeElement.classList).toContain('active');
      expect(component.planList.sortOptions[0].active).toBeTruthy();
      expect(component.planList.sortOptions[0].sortAsc).toBeTruthy();

      click(planNameHeader, fixture);
      expect(planNameHeader.nativeElement.classList).toContain('active');
      expect(component.planList.sortOptions[0].active).toBeTruthy();
      expect(component.planList.sortOptions[0].sortAsc).toBeFalsy();
    });

    it('should sort by plan status when clicked for the first time', () => {
      const planStatusHeader = headers.children[1];
      click(planStatusHeader, fixture);
      expect(planStatusHeader.nativeElement.classList).toContain('active');
      expect(component.planList.sortOptions[1].active).toBeTruthy();
      expect(component.planList.sortOptions[1].sortAsc).toBeTruthy();
    });

    it('should reset others to inactive when clicking plan status for the first time', () => {
      const planStatusHeader = headers.children[1];
      click(planStatusHeader, fixture);
      expect(component.planList.sortOptions[0].active).toBeFalsy();
      expect(component.planList.sortOptions[2].active).toBeFalsy();
      expect(component.planList.sortOptions[3].active).toBeFalsy();
      expect(component.planList.sortOptions[4].active).toBeFalsy();
    });

    it('should set plan name to ascending when clicked', () => {
      const planNameHeader = headers.children[0];
      click(planNameHeader, fixture);
      const planStatusHeader = headers.children[1];
      click(planStatusHeader, fixture);
      click(planNameHeader, fixture);
      expect(component.planList.sortOptions[0].active).toBeTruthy();
      expect(component.planList.sortOptions[0].sortAsc).toBeTruthy();
    });
  });

  describe('Event emitters', () => {
    it('should emit sort change event a sort header is clicked', () => {
      const spy = spyOn(component, 'onSortChange').and.stub();
      const planStatusHeader = headers.children[1];
      click(planStatusHeader, fixture);
      expect(spy).toHaveBeenCalled();
    });

    it('should emit plan select event when a plan name is clicked', () => {
      const firstPlanName = fixture.debugElement.query(By.css('tbody tr:first-child td a'));
      const spy = spyOn(component, 'onPlanSelect').and.stub();
      click(firstPlanName, fixture);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('1');
    });

    it('should emit plan action event when a plan action is performed', () => {
      const planAction = <IPlanAction>{data: 'test'};
      const spy = spyOn(component, 'onPlanAction').and.stub();
      component.onPlanAction(planAction);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(planAction);
    });
  });

  describe('Rendering Flag Count', () => {
    it('should not render the number of flags when the flags count equals 0', () => {
      const flags = fixture.debugElement.query(By.css('.flags-count'));
      expect(flags).toBeTruthy();
      expect(flags.children).toBeTruthy();
      expect(flags.children.length).toBe(0);
    });

    it('should render the number of flags when the flags count is greater than 0', () => {
      let fixtureWithFlags = TestBed.createComponent(TestPlanListWithFlagsComponent);
      fixtureWithFlags.detectChanges();

      const flags = fixtureWithFlags.debugElement.query(By.css('.flags-count'));
      expect(flags).toBeTruthy();
      expect(flags.children).toBeTruthy();
      expect(flags.children.length).toBe(1);

      const actualFlagsCount = flags.children[0].nativeElement.innerText.trim();
      expect(actualFlagsCount).toBe('3');
    });
  });

  describe('Zero plans present', () => {
    let fixtureWithoutPlans: ComponentFixture<TestPlanListWithoutPlansComponent>;

    beforeEach(() => {
      fixtureWithoutPlans = TestBed.createComponent(TestPlanListWithoutPlansComponent);
      fixtureWithoutPlans.detectChanges();
    });

    afterEach(() => {
      if (fixtureWithoutPlans) {
        fixtureWithoutPlans.destroy();
      }
    });

    it('should render a no plans message when there are 0 plans', () => {
      const message = fixtureWithoutPlans.debugElement.query(By.css('.no-plans-msg'));
      expect(message).toBeTruthy();
      expect(message.nativeElement.innerText.trim()).toBe('There are currently no plans for this customer. Add a plan to get started.');
    });

    it('should not render the add plan message when the user cannot add plans', () => {
      fixtureWithoutPlans.componentInstance.canAddPlan = false;
      fixtureWithoutPlans.detectChanges();

      const message = fixtureWithoutPlans.debugElement.query(By.css('.no-plans-msg'));
      expect(message).toBeTruthy();
      expect(message.nativeElement.innerText.trim()).toBe('There are currently no plans for this customer.');
    });

    it('should emit an add plan event when the \'Add a plan\' link is clicked', () => {
      let newComponent = fixtureWithoutPlans.componentInstance;

      const spy = spyOn(newComponent, 'addPlan').and.stub();
      const anchor = fixtureWithoutPlans.debugElement.query(By.css('.no-plans-heading a'));
      click(anchor, fixtureWithoutPlans);
      expect(spy).toHaveBeenCalled();
    });
  });

  @Component({
    template: `
      <gpr-plan-list [canAddPlan]="true"
                     [isSearchingPlans]="false"
                     [sortOptions]="sortOptions"
                     [plans]="plans"
                     (planSelect)="onPlanSelect($event)"
                     (sortChange)="onSortChange($event)"
                     (planAction)="onPlanAction($event)"></gpr-plan-list>
    `
  })
  class TestPlanListComponent {
    @ViewChild(PlanListComponent) planList;
    public sortOptions: ISortOption[] = PlanDataService.PLAN_SORT_OPTIONS;
    public plans = [{
      completionPercentage: 10,
      coverageId: '31',
      effectiveDate: '2017-01-01',
      flagsCount: 0,
      hasErrors: true,
      lastUpdatedTimestamp: '2016-07-01',
      planId: '1',
      planName: 'My Non-Plat Hyatt Plan',
      status: 'New'
    }];

    public onPlanSelect(e) {

    }

    public onSortChange(e) {

    }

    public onPlanAction(e) {

    }
  }

  @Component({
    template: `
      <gpr-plan-list [isSearchingPlans]="false"
                     [sortOptions]="sortOptions"
                     [plans]="plans"></gpr-plan-list>
    `
  })
  class TestPlanListWithFlagsComponent {
    @ViewChild(PlanListComponent) planList;
    public sortOptions: ISortOption[] = PlanDataService.PLAN_SORT_OPTIONS;
    public plans = [{
      completionPercentage: 10,
      coverageId: '31',
      effectiveDate: '2017-01-01',
      flagsCount: 3,
      hasErrors: true,
      lastUpdatedTimestamp: '2016-07-01',
      planId: '1',
      planName: 'My Non-Plat Hyatt Plan',
      status: 'New'
    }];
  }

  @Component({
    template: `
      <gpr-plan-list [canAddPlan]="canAddPlan"
                     [isSearchingPlans]="false"
                     [sortOptions]="sortOptions"
                     [plans]="plans"
                     (addPlanClick)="addPlan()"></gpr-plan-list>
    `
  })
  class TestPlanListWithoutPlansComponent {
    @ViewChild(PlanListComponent) planList;
    public canAddPlan: boolean = true;
    public sortOptions: ISortOption[] = PlanDataService.PLAN_SORT_OPTIONS;
    public plans = [];

    public addPlan() {
    }
  }
});
