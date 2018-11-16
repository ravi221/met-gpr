import {AnimationState} from '../../../ui-controls/animations/AnimationState';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {DebugElement} from '@angular/core';
import {ExpandCollapseIconComponent} from '../../../ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {PlanCategoryLabelStyleService} from 'app/plan/services/plan-category-label-style.service';
import {PlanCategoryListComponent} from './plan-category-list.component';
import {PlanCategorySectionListComponent} from 'app/plan/components/plan-category-section-list/plan-category-section-list.component';
import {PlanCategorySectionListTemplateComponent} from 'app/plan/components/plan-category-section-list-template/plan-category-section-list-template.component';
import {PlanErrorTooltipStubComponent} from '../plan-error-tooltip/plan-error-tooltip.component.stub';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import {ValidatePlanStubComponent} from '../../plan-shared/components/validate-plan/validate-plan.component.stub';

describe('PlanCategoryListComponent', () => {
  let component: PlanCategoryListComponent;
  let fixture: ComponentFixture<PlanCategoryListComponent>;
  let sectionToggleBtn: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [
        ExpandCollapseIconComponent,
        IconComponent,
        PlanCategoryListComponent,
        PlanCategorySectionListComponent,
        PlanCategorySectionListTemplateComponent,
        PlanErrorTooltipStubComponent,
        ValidatePlanStubComponent
      ],
      providers: [
        PlanCategoryLabelStyleService,
        {provide: NavigatorService, useClass: MockNavigatorService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlanCategoryListComponent);
        component = fixture.componentInstance;
        component.categories = {
          categoryId: '1',
          categoryName: '2',
          completionPercentage: 1,
          sections: [{
            sectionId: '1',
            sectionName: '2',
            completionPercentage: 1,
            completedFieldCount: 10,
            totalFieldCount: 11,
            errorCount: 1,
            validationIndicator: null
          }],
          statusCode: null,
          validationIndicator: null,
          errorCount: 1
        };
        fixture.detectChanges();
        sectionToggleBtn = fixture.debugElement.query(By.css('.expand-collapse-icon'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should toggle the visibility of sections', () => {
    expect(component.sectionVisibilityState).toBe(AnimationState.HIDDEN);
    click(sectionToggleBtn, fixture);
    expect(component.sectionVisibilityState).toBe(AnimationState.VISIBLE);
    click(sectionToggleBtn, fixture);
    expect(component.sectionVisibilityState).toBe(AnimationState.HIDDEN);
  });
});
