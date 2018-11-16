import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanNavRowComponent} from './plan-nav-row.component';
import {RouterTestingModule} from '@angular/router/testing';
import {PlansExpansionManager} from '../../../classes/plan-expansion-manager';
import {IPlan} from '../../../../plan/plan-shared/interfaces/iPlan';
import {PlanDataService} from 'app/plan/plan-shared/services/plan-data.service';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {NavRowTemplateComponent} from 'app/navigation/components/templates/nav-row-template/nav-row-template.component';
import {CategoryNavRowComponent} from 'app/navigation/components/plans-nav-menu/category-nav-row/category-nav-row.component';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {NavCategoryRowTemplateComponent} from 'app/navigation/components/templates/nav-category-row-template/nav-category-row-template.component';
import {NavSectionRowTemplateComponent} from 'app/navigation/components/templates/nav-section-row-template/nav-section-row-template.component';
import {SectionNavRowComponent} from 'app/navigation/components/plans-nav-menu/section-nav-row/section-nav-row.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {Observable} from 'rxjs/Observable';
import {MockNavigatorService} from '../../../services/navigator.service.mock';

describe('PlanNavRowComponent', () => {
  let component: PlanNavRowComponent;
  let fixture: ComponentFixture<PlanNavRowComponent>;
  let planDataServiceSpy: jasmine.Spy;
  let navigatorSpy: jasmine.Spy;
  let mockPlan = {
    'planName': 'DentalPlan_P73',
    'planId': '689971516878052651',
    'coverageId': '201000',
    'effectiveDate': '10/05/2017',
    'creationTimestamp': '2018-01-25T06:00:52',
    'lastUpdatedTimestamp': '2018-01-29T12:49:37',
    'completionPercentage': 0,
    'ppcModelName': null,
    'ppcModelVersion': null,
    'categories': [
      {
        'categoryId': 'planInfo',
        'categoryName': 'Plan Info',
        'validationIndicator': 'NOT VALIDATED',
        'statusCode': 'IN-PROGRESS',
        'completionPercentage': 0,
        'sections': [
          {
            'sectionId': 'planDetails',
            'sectionName': 'Plan Details',
            'totalFieldCount': 0,
            'completedFieldCount': 0,
            'completionPercentage': 0,
            'validationIndicator': 'NOT VALIDATED'
          }
        ]
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [
        PlanNavRowComponent,
        NavRowTemplateComponent,
        CategoryNavRowComponent,
        IconComponent,
        NavCategoryRowTemplateComponent,
        NavSectionRowTemplateComponent,
        SectionNavRowComponent
      ],
      providers: [
        PlanDataService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        PagingService,
        ScrollService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlanNavRowComponent);
        component = fixture.componentInstance;
        component.expansionManager = new PlansExpansionManager();
        planDataServiceSpy = spyOn(TestBed.get(PlanDataService), 'getPlanById').and.returnValue(Observable.of(mockPlan));
        navigatorSpy = spyOn(TestBed.get(NavigatorService), 'goToCustomerPlanHome').and.stub();
      });
  }));

  it('should create', () => {
    component.plan = <IPlan>{coverageId: '21', planId: '689971516878052651', productType: 'Dental'};
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not call plan service with null plan', () => {
    component.plan = null;
    fixture.detectChanges();
    expect(planDataServiceSpy).toHaveBeenCalledTimes(0);
  });

  it('should call plan service with valid planid', () => {
    component.plan = <IPlan>{coverageId: '21', planId: '689971516878052651', productType: 'Dental'};
    fixture.detectChanges();
    expect(planDataServiceSpy).toHaveBeenCalledTimes(1);
    expect(component.planDetails).toBe(mockPlan);
  });

  it('should navigate to plan', () => {
    component.customerNumber = 543;
    component.plan = <IPlan>{coverageId: '21', planId: '689971516878052651', productType: 'Dental'};
    fixture.detectChanges();
    component.navigateToPlan('123');
    expect(navigatorSpy).toHaveBeenCalledTimes(1);
    expect(navigatorSpy).toHaveBeenCalledWith('123', 543);
  });
});
