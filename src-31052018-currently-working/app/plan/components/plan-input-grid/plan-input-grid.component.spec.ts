import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {DatePickerDefaults} from '../../../ui-controls/services/date-picker-defaults.service';
import {DatePickerStubComponent} from '../../../ui-controls/components/date-picker/date-picker.component.stub';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HelpTooltipStubComponent} from '../../../ui-controls/components/help-tooltip/help-tooltip.component.stub';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {ICoverage} from '../../../core/interfaces/iCoverage';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {IPlanInputTemplate} from 'app/plan/interfaces/iPlanInputTemplate';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {IProduct} from '../../../core/interfaces/iProduct';
import {mockCustomer} from '../../../../assets/test/common-objects/customer.mock';
import {PlanInputGridComponent} from './plan-input-grid.component';
import {PlanInputValidationService} from 'app/plan/services/plan-input-validation.service';
import {PlanModes} from '../../enums/plan-modes';
import {ProductDataService} from 'app/core/services/product-data.service';
import {ProductDropDownComponent} from '../../../core/components/product-drop-down/product-drop-down.component';
import {SortWithComparatorPipe} from '../../../core/pipes/sort-with-comparator.pipe';

describe('PlanInputGridComponent', () => {
  let component: TestPlanInputGridComponent;
  let fixture: ComponentFixture<TestPlanInputGridComponent>;
  let createPlanButton: DebugElement;
  let addNewPlanButton: DebugElement;
  let planTemplate: IPlanInputTemplate;

  function updateFixture() {
    fixture.detectChanges();
    createPlanButton = fixture.debugElement.query(By.css('.btn.btn-primary'));
    addNewPlanButton = fixture.debugElement.query(By.css('.add-another-plan-link'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [
        DatePickerStubComponent,
        HelpTooltipStubComponent,
        IconComponent,
        PlanInputGridComponent,
        ProductDropDownComponent,
        SortWithComparatorPipe,
        TestPlanInputGridComponent,
      ],
      providers: [
        DatePickerDefaults,
        DatePipe,
        PlanInputValidationService,
        ProductDataService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestPlanInputGridComponent);
        component = fixture.componentInstance;
        updateFixture();
      });
  }));

  beforeEach(() => {
    planTemplate = {
      planNamePrefix: '',
      planNameBody: '',
      coverageId: '',
      coverageName: '',
      effectiveDate: '',
      customerNumber: 1,
      ppcModelName: '',
      hasErrors: false,
      errors: [],
      isComplete: false
    };
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Create Plans Button', () => {
    describe('Disabling/enabling', () => {
      it('should enable the create plans button when all rows are completed and valid', () => {
        expect(createPlanButton.nativeElement.disabled).toBeTruthy();

        planTemplate.planNameBody = 'Test';
        planTemplate.planNamePrefix = 'Test';
        planTemplate.effectiveDate = '01/01/2018';
        component.customer.effectiveDate = '01/01/2001';
        component.planInputGrid.planTemplates = [planTemplate];
        fixture.detectChanges();
        component.planInputGrid.validatePlanTemplate(planTemplate);
        updateFixture();

        expect(createPlanButton.nativeElement.disabled).toBeFalsy();
      });

      it('should disable the create plans button when all rows are not completed', () => {
        const firstPlanTemplate = component.planInputGrid.planTemplates[0];
        firstPlanTemplate.planNameBody = '';
        firstPlanTemplate.planNamePrefix = '';
        firstPlanTemplate.effectiveDate = '';
        component.planInputGrid.validatePlanTemplate(firstPlanTemplate);
        updateFixture();
        expect(createPlanButton.nativeElement.disabled).toBeTruthy();
      });

      it('should disable the create plans button when all rows are completed but have errors', () => {
        const firstPlanTemplate = component.planInputGrid.planTemplates[0];
        firstPlanTemplate.planNameBody = 'Test';
        firstPlanTemplate.planNamePrefix = 'Test';
        firstPlanTemplate.effectiveDate = '01/01/2000';
        component.customer.effectiveDate = '01/01/2001';
        component.planInputGrid.validatePlanTemplate(firstPlanTemplate);
        updateFixture();

        expect(createPlanButton.nativeElement.disabled).toBeTruthy();
      });
    });

    describe('Label', () => {
      it('should have the label \'Create Plan\' when creating 1 plan', () => {
        expect(createPlanButton.nativeElement.innerText.trim()).toBe('Create Plan');
      });

      it('should have the label \'Create Plans\' when creating more than 1 plan', () => {
        component.planInputGrid.addBlankRow();
        updateFixture();
        expect(createPlanButton.nativeElement.innerText.trim()).toBe('Create Plans');
      });
    });
  });

  describe('Adding row', () => {
    it('should add a new row', () => {
      let planTemplates = fixture.debugElement.queryAll(By.css('.plan-template'));
      expect(planTemplates).toBeTruthy();
      expect(planTemplates.length).toBe(1);

      click(addNewPlanButton);
      updateFixture();

      planTemplates = fixture.debugElement.queryAll(By.css('.plan-template'));
      expect(planTemplates).toBeTruthy();
      expect(planTemplates.length).toBe(2);
    });
  });

  describe('Removing rows', () => {
    it('should not display a remove row icon when there is one plan template', () => {
      const removeRowIcons = fixture.debugElement.queryAll(By.css('.remove-row-icon'));
      expect(removeRowIcons).toBeTruthy();
      expect(removeRowIcons.length).toBe(0);
    });

    it('should display two remove row icons when there are two plan templates', () => {
      click(addNewPlanButton);
      updateFixture();

      const removeRowIcons = fixture.debugElement.queryAll(By.css('.remove-row-icon'));
      expect(removeRowIcons).toBeTruthy();
      expect(removeRowIcons.length).toBe(2);
    });

    it('should remove a row when the remove icon is clicked', () => {
      click(addNewPlanButton);
      updateFixture();

      let planTemplates = fixture.debugElement.queryAll(By.css('.plan-template'));
      expect(planTemplates).toBeTruthy();
      expect(planTemplates.length).toBe(2);

      const removeRowIcon = fixture.debugElement.query(By.css('.remove-row-icon'));
      click(removeRowIcon);
      updateFixture();

      planTemplates = fixture.debugElement.queryAll(By.css('.plan-template'));
      expect(planTemplates).toBeTruthy();
      expect(planTemplates.length).toBe(1);
    });
  });

  describe('Setting Effective Date', () => {
    it('should correctly set the minimum effective date', () => {
      let expectedDate = new Date(component.customer.effectiveDate);
      expect(component.planInputGrid.minEffectiveDate.toString()).toBe(expectedDate.toString());
    });

    it('should set effective date correctly', () => {
      planTemplate.effectiveDate = '';
      component.planInputGrid.setEffectiveDate({dateString: '01/01/2010'}, planTemplate);
      expect(planTemplate.effectiveDate).toBe('01/01/2010');
    });
  });

  describe('Selecting a coverage', () => {
    it('should set the plan template\'s coverage and product information when selected', () => {
      component.planInputGrid.products = [
        <IProduct>{
          productName: 'Disability',
          coverages: [<ICoverage>{coverageId: '1', coverageName: 'STD', ppcModelName: 'test'}]
        }
      ];
      component.planInputGrid.onCoverageSelection('STD', planTemplate);
      expect(planTemplate.planNamePrefix).toBe('Disability - ');
      expect(planTemplate.coverageId).toBe('1');
      expect(planTemplate.coverageName).toBe('STD');
      expect(planTemplate.ppcModelName).toBe('test');
    });

    it('should not set the plan template\'s coverage and product information with an invalid coverageId', () => {
      planTemplate.planNamePrefix = '';
      planTemplate.coverageId = '';
      planTemplate.coverageName = '';
      planTemplate.ppcModelName = '';

      component.planInputGrid.products = [
        <IProduct>{
          productName: 'Disability',
          coverages: [<ICoverage>{coverageId: '1', coverageName: 'STD', ppcModelName: 'test'}]
        }
      ];
      const invalidCoverageName = 'LTD';
      component.planInputGrid.onCoverageSelection(invalidCoverageName, planTemplate);
      expect(planTemplate.planNamePrefix).toBe('');
      expect(planTemplate.coverageId).toBe('');
      expect(planTemplate.coverageName).toBe('');
      expect(planTemplate.ppcModelName).toBe('');
    });

    it('should reset the plan name prefix when the coverage is unselected', () => {
      planTemplate.planNamePrefix = 'Test value';

      component.planInputGrid.products = [
        <IProduct>{
          productName: 'Disability',
          coverages: [<ICoverage>{coverageId: '1', coverageName: 'Disability - 1', ppcModelName: 'test'}]
        }
      ];
      component.planInputGrid.onCoverageSelection(null, planTemplate);
      expect(planTemplate.planNamePrefix).toBe('');
    });
  });

  it('should emit an event when the create plans button is clicked', () => {
    // Enable button
    planTemplate.planNameBody = 'Test';
    planTemplate.planNamePrefix = 'Test - P';
    planTemplate.effectiveDate = '01/01/2018';
    planTemplate.ppcModelName = 'test ppc model';
    planTemplate.coverageId = '1';
    planTemplate.coverageName = 'STD';
    component.customer.effectiveDate = '01/01/2001';
    component.planInputGrid.planTemplates = [planTemplate];
    fixture.detectChanges();
    component.planInputGrid.validatePlanTemplate(planTemplate);
    updateFixture();

    const spy = spyOn(component, 'onCreatePlans').and.stub();

    // Click create plan
    click(createPlanButton, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith([{
      planNameBody: 'Test',
      planNamePrefix: 'Test - P',
      effectiveDate: '01/01/2018',
      hasErrors: false,
      errors: [],
      isComplete: true,
      customerNumber: 1234,
      ppcModelName: 'test ppc model',
      coverageId: '1',
      coverageName: 'STD'
    }]);
  });

  @Component({
    template: `
      <gpr-plan-input-grid [plans]="plans"
                           [customer]="customer"
                           [planMode]="planMode"
                           (plansCreate)="onCreatePlans($event)">
      </gpr-plan-input-grid>
    `
  })
  class TestPlanInputGridComponent {
    @ViewChild(PlanInputGridComponent) planInputGrid;
    public plans: IPlan[] = [];
    public customer: ICustomer = mockCustomer;
    public planMode: PlanModes = PlanModes.CREATE;

    public onCreatePlans(e) {

    }
  }
});
