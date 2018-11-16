import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AutoSearchComponent} from '../../../ui-controls/components/auto-search/auto-search.component';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, ViewChild} from '@angular/core';
import {CustomerStructureDataService} from '../../../customer/services/customer-structure-data.service';
import {FilterService} from '../../../core/services/filter.service';
import {FormsModule} from '@angular/forms';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {Observable} from 'rxjs/Observable';
import {PlanFilterComponent} from './plan-filter.component';
import {PlanFilterContextTypes} from '../../enums/plan-filter-context';
import {PlanFilterService} from '../../services/plan-filter.service';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {ViewConfigDataService} from '../../plan-shared/services/view-config-data.service';
import {ICustomerStructure} from '../../../customer/interfaces/iCustomerStructure';

describe('PlanFilterComponent', () => {
  let component: TestPlanFilterComponent;
  let planFilter: PlanFilterComponent;
  let fixture: ComponentFixture<TestPlanFilterComponent>;
  let filterService: FilterService;

  const planIds = ['1'];
  const structure: ICustomerStructure = {
    value: '1',
    name: 'The name',
    planIds
  };

  class CustomerStructureDataServiceStub {
    getStructure() {
      return Observable.of([structure]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        TestPlanFilterComponent,
        PlanFilterComponent,
        AutoSearchComponent,
        TooltipDirective,
        TooltipContentComponent
      ],
      providers: [
        TooltipService,
        TooltipPositionService,
        ViewConfigDataService,
        FilterService,
        PlanFilterService,
        {provide: CustomerStructureDataService, useClass: CustomerStructureDataServiceStub}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestPlanFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        planFilter = component.planFilter;
        filterService = TestBed.get(FilterService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Toggling AutoSearchComponents', () => {
    it('should hide the report, sub code, and claim branch searches by default', () => {
      expect(planFilter.showAutoSearch.report).toBeFalsy();
      expect(planFilter.showAutoSearch.subCode).toBeFalsy();
      expect(planFilter.showAutoSearch.claimBranch).toBeFalsy();
    });

    it('should show the report search and hide the sub code and claim branch searches when an experience is selected', () => {
      planFilter.onExperienceSelected(structure);

      expect(planFilter.showAutoSearch.report).toBeTruthy();
      expect(planFilter.showAutoSearch.subCode).toBeFalsy();
      expect(planFilter.showAutoSearch.claimBranch).toBeFalsy();
    });

    it('should show the report and sub code search and hide claim branch search when a report is selected', () => {
      planFilter.onExperienceSelected(structure);
      planFilter.onReportSelected(structure);

      expect(planFilter.showAutoSearch.report).toBeTruthy();
      expect(planFilter.showAutoSearch.subCode).toBeTruthy();
      expect(planFilter.showAutoSearch.claimBranch).toBeFalsy();
    });

    it('should show all searches when an experience, report, and sub code are selected', () => {

      planFilter.onExperienceSelected(structure);
      planFilter.onReportSelected(structure);
      planFilter.onSubCodeSelected(structure);

      expect(planFilter.showAutoSearch.report).toBeTruthy();
      expect(planFilter.showAutoSearch.subCode).toBeTruthy();
      expect(planFilter.showAutoSearch.claimBranch).toBeTruthy();
    });
  });

  describe('Updating filters', () => {
    it('should update planIds when the experience is changed', () => {
      expect(planFilter.filter.planIds).toBeNull();

      planFilter.onExperienceSelected(structure);
      expect(planFilter.filter.planIds.length).toBe(planIds.length);
    });

    it('should update planIds when the report is changed', () => {
      expect(planFilter.filter.planIds).toBeNull();

      planFilter.onReportSelected(structure);
      expect(planFilter.filter.planIds.length).toBe(planIds.length);
    });

    it('should update planIds when the sub code is changed', () => {
      expect(planFilter.filter.planIds).toBeNull();

      planFilter.onSubCodeSelected(structure);
      expect(planFilter.filter.planIds.length).toBe(planIds.length);
    });

    it('should update planIds when the claim branch is changed', () => {
      expect(planFilter.filter.planIds).toBeNull();

      planFilter.onClaimBranchSelected(structure);
      expect(planFilter.filter.planIds.length).toBe(planIds.length);
    });
  });

  describe('Applying Filters', () => {
    it('should clear out the plan filters when the \'Cancel\' button is clicked', () => {
      planFilter.onExperienceSelected(structure);

      const spy = spyOn(filterService, 'setFilters').and.stub();

      let cancelBtn = fixture.debugElement.query(By.css('.btn.btn-tertiary'));
      click(cancelBtn, fixture);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        planIds: null,
        planName: null,
        context: PlanFilterContextTypes.CUSTOMER_HOME_PAGE
      });
    });

    it('should apply the plan filters when the \'Apply Filters\' button is clicked', () => {
      planFilter.onExperienceSelected(structure);

      const spy = spyOn(filterService, 'setFilters').and.stub();
      let applyBtn = fixture.debugElement.query(By.css('.btn.btn-secondary'));
      click(applyBtn, fixture);


      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        planIds: planIds,
        planName: null,
        context: PlanFilterContextTypes.CUSTOMER_HOME_PAGE
      });
    });
  });


  @Component({
    template: `
      <gpr-plan-filter [customer]='customer'></gpr-plan-filter>`
  })
  class TestPlanFilterComponent {
    @ViewChild(PlanFilterComponent) planFilter;

    customer = <ICustomer> {customerNumber: 1};
  }
});
