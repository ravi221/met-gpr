import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PlanCategorySectionListComponent} from './plan-category-section-list.component';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PlanCategoryLabelStyleService} from 'app/plan/services/plan-category-label-style.service';
import {PlanCategorySectionListTemplateComponent} from 'app/plan/components/plan-category-section-list-template/plan-category-section-list-template.component';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('PlanCategorySectionListComponent', () => {
  let component: PlanCategorySectionListComponent;
  let fixture: ComponentFixture<PlanCategorySectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        PlanCategorySectionListComponent,
        PlanCategorySectionListTemplateComponent
      ],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService},
        PlanCategoryLabelStyleService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlanCategorySectionListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
   if (fixture) {
     fixture.destroy();
   }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
