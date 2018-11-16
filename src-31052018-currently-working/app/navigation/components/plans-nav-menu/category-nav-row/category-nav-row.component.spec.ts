import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CategoryNavRowComponent} from './category-nav-row.component';
import {PlansExpansionManager} from '../../../classes/plan-expansion-manager';
import {IPlanCategory} from '../../../../plan/plan-shared/interfaces/iPlanCategory';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {NavCategoryRowTemplateComponent} from '../../templates/nav-category-row-template/nav-category-row-template.component';
import {SectionNavRowComponent} from '../section-nav-row/section-nav-row.component';
import {NavSectionRowTemplateComponent} from '../../templates/nav-section-row-template/nav-section-row-template.component';
import {MockNavigatorService} from '../../../services/navigator.service.mock';

describe('CategoryNavRowComponent', () => {
  let component: CategoryNavRowComponent;
  let fixture: ComponentFixture<CategoryNavRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CategoryNavRowComponent,
        NavCategoryRowTemplateComponent,
        SectionNavRowComponent,
        NavSectionRowTemplateComponent
      ],
      providers: [{provide: NavigatorService, useClass: MockNavigatorService}]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CategoryNavRowComponent);
        component = fixture.componentInstance;
        component.expansionManager = new PlansExpansionManager();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should not set category unique id without required fields. none', () => {
    fixture.detectChanges();
    expect(component.categoryUniqueId).toBeUndefined();
  });

  it('should not set category unique id without required fields. no category', () => {
    component.planId = '1234';
    fixture.detectChanges();
    expect(component.categoryUniqueId).toBeUndefined();
  });

  it('should not set category unique id without required fields. no category id', () => {
    component.planId = '1234';
    component.category = <IPlanCategory>{categoryId: null};
    fixture.detectChanges();
    expect(component.categoryUniqueId).toBeUndefined();
  });

  it('should set category unique id with required fields', () => {
    component.planId = '1234';
    component.category = <IPlanCategory>{categoryId: '5678'};
    fixture.detectChanges();
    expect(component.categoryUniqueId).toBeDefined();
    expect(component.categoryUniqueId).toBe(component.planId + '-' + component.category.categoryId);
  });
});
