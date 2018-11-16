import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PlanCategorySectionListTemplateComponent} from './plan-category-section-list-template.component';

describe('PlanCategorySectionListTemplateComponent', () => {
  let component: PlanCategorySectionListTemplateComponent;
  let fixture: ComponentFixture<PlanCategorySectionListTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlanCategorySectionListTemplateComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlanCategorySectionListTemplateComponent);
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
