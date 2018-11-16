import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {PlanEntryNavigationButtonComponent} from './plan-entry-navigation-button.component';
import {IPlanCategory} from '../../interfaces/iPlanCategory';
import {IPlanSection} from '../../interfaces/iPlanSection';
import {IPlan} from '../../interfaces/iPlan';
import {PlanEntryNavigationDirection} from '../../../enums/plan-entry-navigation-direction';
import {EventEmitter} from '@angular/core';
import {IPlanEntryNavigate} from 'app/plan/plan-shared/interfaces/iPlanEntryNavigate';
import {Subscription} from 'rxjs/Subscription';

describe('PlanEntryNavigationButtonComponent', () => {
  let component: PlanEntryNavigationButtonComponent;
  let fixture: ComponentFixture<PlanEntryNavigationButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanEntryNavigationButtonComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlanEntryNavigationButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Testing invalid inputs', () => {
    it('Should not display when plan is null', () => {
      component.plan = null;
      component.currentCategory = <IPlanCategory>{sections: []};
      component.currentSection = <IPlanSection>{sectionId: 'testSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(previousButton).toBeNull();
      expect(nextButton).toBeNull();
    });
    it('Should not display when plan category is null', () => {
      component.plan = <IPlan>{};
      component.currentCategory = <IPlanCategory>{sections: []};
      component.currentSection = <IPlanSection>{sectionId: 'testSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(previousButton).toBeNull();
      expect(nextButton).toBeNull();
    });
    it('Should not display when plan category is empty', () => {
      component.plan = <IPlan>{categories: []};
      component.currentCategory = <IPlanCategory>{sections: []};
      component.currentSection = <IPlanSection>{sectionId: 'testSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(previousButton).toBeNull();
      expect(nextButton).toBeNull();
    });
    it('Should not display when currentCategory is null', () => {
      component.plan = <IPlan>{categories: [<IPlanCategory>{categoryId: 'testCategory'}]};
      component.currentCategory = null;
      component.currentSection = <IPlanSection>{sectionId: 'testSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(previousButton).toBeNull();
      expect(nextButton).toBeNull();
    });
    it('Should not display when currentSection is null', () => {
      component.plan = <IPlan>{categories: [<IPlanCategory>{categoryId: 'testCategory'}]};
      component.currentCategory = <IPlanCategory>{categoryId: 'testCategory'};
      component.currentSection = null;
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(previousButton).toBeNull();
      expect(nextButton).toBeNull();
    });
  });

  describe('Testing Previous Button', () => {
    it('Should not be visible when on the first section of first category', () => {
      component.direction = PlanEntryNavigationDirection.PREVIOUS;
      component.plan = <IPlan>{
        categories: [
          <IPlanCategory>{
            categoryId: 'currentCategory'
          }
        ]
      };
      component.currentCategory = <IPlanCategory>{
        categoryId: 'currentCategory', sections: [
          <IPlanSection>{
            sectionId: 'currentSection', sectionName: 'Current Section'
          }]
      };
      component.currentSection = <IPlanSection>{sectionId: 'currentSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(nextButton).toBeNull();
      expect(previousButton).toBeNull();
    });
    it('Should display \'Previous Section\' on previous button when previous section exists', () => {
      component.direction = PlanEntryNavigationDirection.PREVIOUS;
      component.plan = <IPlan>{categories: [<IPlanCategory>{}, <IPlanCategory>{categoryId: 'currentCategory'}]};
      component.currentCategory = <IPlanCategory>{
        categoryId: 'currentCategory', sections: [
          <IPlanSection>{
            sectionId: 'previousSection', sectionName: 'Previous Section'
          },
          <IPlanSection>{
            sectionId: 'currentSection', sectionName: 'Current Section'
          }]
      };
      component.currentSection = <IPlanSection>{sectionId: 'currentSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous a'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(nextButton).toBeNull();
      expect(previousButton).toBeDefined();
      expect(previousButton.nativeElement.title).toContain('Previous Section');
    });
    it('Should display \'Previous Category\' on previous button when previous category exists and on first section', () => {
      component.direction = PlanEntryNavigationDirection.PREVIOUS;
      component.plan = <IPlan>{
        categories: [<IPlanCategory>{
          categoryId: 'previousCategory',
          categoryName: 'Previous Category',
          sections: [<IPlanSection>{
            sectionId: 'previousCategorySection'
          }]
        }, <IPlanCategory>{categoryId: 'currentCategory'}]
      };
      component.currentCategory = <IPlanCategory>{
        categoryId: 'currentCategory', sections: [
          <IPlanSection>{
            sectionId: 'currentSection', sectionName: 'Current Section'
          }]
      };
      component.currentSection = <IPlanSection>{sectionId: 'currentSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous a'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(nextButton).toBeNull();
      expect(previousButton).toBeDefined();
      expect(previousButton.nativeElement.title).toContain('Previous Category');
    });
  });
  describe('Testing Next Button', () => {
    it('Should not be visible when on the last section of last category', () => {
      component.direction = PlanEntryNavigationDirection.NEXT;
      component.plan = <IPlan>{
        categories: [
          <IPlanCategory>{
            categoryId: 'testCategory'
          }
        ]
      };
      component.currentCategory = <IPlanCategory>{
        categoryId: 'testCategory', sections: [
          <IPlanSection>{
            sectionId: 'previous', sectionName: 'Previous Section'
          }]
      };
      component.currentSection = <IPlanSection>{sectionId: 'previous'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(nextButton).toBeNull();
      expect(previousButton).toBeNull();
    });
    it('Should display \'Next Section\' on next button when next section exists', () => {
      component.direction = PlanEntryNavigationDirection.NEXT;
      component.plan = <IPlan>{categories: [<IPlanCategory>{categoryId: 'currentCategory'}, <IPlanCategory>{categoryId: 'nextCategory'}]};
      component.currentCategory = <IPlanCategory>{
        categoryId: 'currentCategory', sections: [
          <IPlanSection>{
            sectionId: 'currentSection', sectionName: 'Current Section'
          },
          <IPlanSection>{
            sectionId: 'nextSection', sectionName: 'Next Section'
          }]
      };
      component.currentSection = <IPlanSection>{sectionId: 'currentSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(previousButton).toBeNull();
      expect(nextButton).toBeDefined();
      expect(nextButton.nativeElement.title).toContain('Next Section');
    });
    it('Should display \'Next Category\' on next button when next category exists and on last section', () => {
      component.direction = PlanEntryNavigationDirection.NEXT;
      component.plan = <IPlan>{
        categories: [<IPlanCategory>{categoryId: 'currentCategory'},
        <IPlanCategory>{
          categoryId: 'nextCategory',
          categoryName: 'Next Category',
          sections: [<IPlanSection>{
            sectionId: 'nextCategorySection'
          }]
        }]
      };
      component.currentCategory = <IPlanCategory>{
        categoryId: 'currentCategory', sections: [
          <IPlanSection>{
            sectionId: 'currentSection', sectionName: 'Current Section'
          }]
      };
      component.currentSection = <IPlanSection>{sectionId: 'currentSection'};
      component.ngOnChanges({});
      fixture.detectChanges();
      const previousButton = fixture.debugElement.query(By.css('.previous'));
      const nextButton = fixture.debugElement.query(By.css('.next'));
      expect(previousButton).toBeNull();
      expect(nextButton).toBeDefined();
      expect(nextButton.nativeElement.title).toContain('Next Category');
    });
  });
  describe('Testing emitter', () => {
    let subscription: Subscription;
    let currentCategory: IPlanCategory = <IPlanCategory>{
      categoryId: 'currentCategory', sections: [
        <IPlanSection>{
          sectionId: 'currentSection', sectionName: 'Current Section'
        },
        <IPlanSection>{
          sectionId: 'nextSection', sectionName: 'Next Section'
        }]
    };
    let currentPlan: IPlan = <IPlan>{categories: [<IPlanCategory>{categoryId: 'currentCategory'}, <IPlanCategory>{categoryId: 'nextCategory'}]};
    let currentSection: IPlanSection = <IPlanSection>{sectionId: 'currentSection'};
    afterEach(() => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    });
    it('should emit when button clicked', (done) => {
      subscription = component.navigate.subscribe((result: IPlanEntryNavigate) => {
        expect(result).toBeDefined();
        expect(result.newCategoryId).toBeNull();
        expect(result.newSectionId).toBe('nextSection');
        done();
      });
      component.direction = PlanEntryNavigationDirection.NEXT;
      component.plan = currentPlan;
      component.currentCategory = currentCategory;
      component.currentSection = currentSection;
      component.ngOnChanges({});
      fixture.detectChanges();
      component.onNavigate();
    });
  });
});
