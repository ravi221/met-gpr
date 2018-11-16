import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, ViewChild} from '@angular/core';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {PlanErrorTooltipComponent} from './plan-error-tooltip.component';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

describe('PlanErrorTooltipComponent', () => {
  let component: TestPlanErrorTooltipComponent;
  let fixture: ComponentFixture<TestPlanErrorTooltipComponent>;
  let navigator: NavigatorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestPlanErrorTooltipComponent,
        PlanErrorTooltipComponent,
        TooltipContentComponent,
        TooltipDirective,
        IconComponent
      ],
      providers: [
        TooltipService,
        TooltipPositionService,
        {provide: NavigatorService, useClass: MockNavigatorService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestPlanErrorTooltipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        navigator = TestBed.get(NavigatorService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should set the error tooltip values correctly', () => {
    const errorMessage = fixture.debugElement.query(By.css('.plan-error-msg'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.innerHTML).toBe('1 Error');

    const errorReportLink = fixture.debugElement.query(By.css('.plan-error-link'));
    expect(errorReportLink).toBeTruthy();
    expect(errorReportLink.nativeElement.innerHTML.trim()).toBe('View Error Report');
  });

  it('should display \'2 Errors\' when the error count is 2', () => {
    component.errorCount = 2;
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(By.css('.plan-error-msg'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.innerHTML).toBe('2 Errors');
  });

  it('should not display the tooltip when error count is 0', () => {
    component.errorCount = 0;
    fixture.detectChanges();
    const tooltip = fixture.debugElement.query(By.css('.plan-error-tooltip'));
    expect(tooltip).toBeNull();
  });

  it('should not display the tooltip when error count is null', () => {
    component.errorCount = null;
    fixture.detectChanges();
    const tooltip = fixture.debugElement.query(By.css('.plan-error-tooltip'));
    expect(tooltip).toBeNull();
  });

  it('should not display the tooltip when error count is undefined', () => {
    component.errorCount = undefined;
    fixture.detectChanges();
    const tooltip = fixture.debugElement.query(By.css('.plan-error-tooltip'));
    expect(tooltip).toBeNull();
  });

  it('should call navigator service when the error report is clicked', () => {
    const spy = spyOn(navigator, 'goToPlanErrorReport').and.stub();
    const errorReportLink = fixture.debugElement.query(By.css('.plan-error-link'));
    click(errorReportLink);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('123');
  });

  @Component({
    template: `
      <gpr-plan-error-tooltip [planId]="planId"
                              [errorCount]="errorCount"></gpr-plan-error-tooltip>`
  })
  class TestPlanErrorTooltipComponent {
    @ViewChild(PlanErrorTooltipComponent) planErrorTooltip;
    public planId: string = '123';
    public errorCount: number = 1;
  }
});
