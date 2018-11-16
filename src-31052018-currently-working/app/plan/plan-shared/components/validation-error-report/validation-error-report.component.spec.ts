import * as validations from '../../../../../assets/test/validations/ppc-validations.mock.json';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CardComponent} from '../../../../ui-controls/components/card/card.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {LoadingIconComponent} from '../../../../ui-controls/components/loading-icon/loading-icon.component';
import {MockNavigatorService} from '../../../../navigation/services/navigator.service.mock';
import {NavigatorService} from '../../../../navigation/services/navigator.service';
import {ValidationErrorReportComponent} from './validation-error-report.component';

describe('ValidationErrorReportComponent', () => {
  let component: ValidationErrorReportComponent;
  let fixture: ComponentFixture<ValidationErrorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationErrorReportComponent, IconComponent, CardComponent, LoadingIconComponent],
      providers: [{provide: NavigatorService, useClass: MockNavigatorService}]
    })
      .compileComponents()
      .then(() => {
        spyOn(TestBed.get(NavigatorService), 'getNavigationState').and.returnValue({
          data: {
            ppcResponse: JSON.parse(JSON.stringify(validations))
          }});
        fixture = TestBed.createComponent(ValidationErrorReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should correctly set the title to be \'4 errors in Example Plan Name\'', () => {
    const title = fixture.debugElement.query(By.css('.validation-error-title'));
    expect(title.nativeElement.innerText.trim()).toBe('4 errors in Example Plan Name');
  });

  describe('Error Categories', () => {
    it('should display two error categories', () => {
      const categories = fixture.debugElement.queryAll(By.css('.validation-category-error'));
      expect(categories).toBeTruthy();
      expect(categories.length).toBe(2);
    });

    it('should correctly display the first category name', () => {
      const categories = fixture.debugElement.queryAll(By.css('.validation-category-error'));
      const firstCategoryName = categories[0].query(By.css('.error-label'));
      expect(firstCategoryName.nativeElement.innerText.trim()).toBe('Setup');
    });
  });

  describe('Error Sections', () => {
    it('should display three error sections', () => {
      const sections = fixture.debugElement.queryAll(By.css('.validation-section-error'));
      expect(sections).toBeTruthy();
      expect(sections.length).toBe(3);
    });

    it('should correctly display the first section name', () => {
      const sections = fixture.debugElement.queryAll(By.css('.validation-section-error'));
      const firstSectionName = sections[0].query(By.css('.error-label'));
      expect(firstSectionName.nativeElement.innerText.trim()).toBe('Plan Details');
    });
  });

  describe('Error Questions', () => {
    it('should display 12 error questions', () => {
      const questions = fixture.debugElement.queryAll(By.css('.validation-question-error'));
      expect(questions).toBeTruthy();
      expect(questions.length).toBe(12);
    });

    it('should correctly display the first question name', () => {
      const questions = fixture.debugElement.queryAll(By.css('.validation-question-error'));
      const firstQuestionName = questions[0].query(By.css('.question-label'));
      expect(firstQuestionName.nativeElement.innerText.trim()).toBe('Plan Name: (Filled Out)');
    });

    it('should show \'(No Selection)\' for questions without a question value', () => {
      const questions = fixture.debugElement.queryAll(By.css('.validation-question-error'));
      const secondQuestionName = questions[1].query(By.css('.question-label'));
      expect(secondQuestionName.nativeElement.innerText.trim()).toBe('PD Code: (No Selection)');
    });
  });

});
