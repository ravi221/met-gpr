import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SectionNavRowComponent} from './section-nav-row.component';
import {RouterTestingModule} from '@angular/router/testing';
import {NavSectionRowTemplateComponent} from '../../templates/nav-section-row-template/nav-section-row-template.component';
import {NavigatorService} from '../../../services/navigator.service';
import {Component, ViewChild} from '@angular/core';
import {MockNavigatorService} from '../../../services/navigator.service.mock';

describe('SectionNavRowComponent', () => {
  let component: TestSectionNavRowComponent;
  let fixture: ComponentFixture<TestSectionNavRowComponent>;
  let navigator: NavigatorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SectionNavRowComponent, NavSectionRowTemplateComponent, TestSectionNavRowComponent],
      providers: [{provide: NavigatorService, useClass: MockNavigatorService}]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSectionNavRowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        navigator = TestBed.get(NavigatorService);
      });
  }));

  describe('Navigating', () => {
    it('should not navigate when customer number is nil', () => {
      const spy = spyOn(navigator, 'goToPlanEntrySectionFromNav').and.stub();

      component.customerNumber = null;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.customerNumber = undefined;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not navigate when plan id is nil or empty', () => {
      const spy = spyOn(navigator, 'goToPlanEntrySectionFromNav').and.stub();

      component.planId = null;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.planId = undefined;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.planId = '';
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not navigate when category id is nil or empty', () => {
      const spy = spyOn(navigator, 'goToPlanEntrySectionFromNav').and.stub();

      component.categoryId = null;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.categoryId = undefined;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.categoryId = '';
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not navigate when section is nil', () => {
      const spy = spyOn(navigator, 'goToPlanEntrySectionFromNav').and.stub();

      component.section = null;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.section = undefined;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not navigate when section id is nil or empty', () => {
      const spy = spyOn(navigator, 'goToPlanEntrySectionFromNav').and.stub();

      component.section = {sectionId: '1'};
      component.section.sectionId = null;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.section.sectionId = undefined;
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();

      component.section.sectionId = '';
      fixture.detectChanges();
      component.sectionNavRow.navigate();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should navigate with valid parameters', () => {
      const spy = spyOn(navigator, 'goToPlanEntrySectionFromNav').and.stub();
      component.sectionNavRow.navigate();
      expect(spy).toHaveBeenCalled();
    });
  });

  @Component({
    template: `
      <gpr-section-nav-row [customerNumber]="customerNumber"
                           [categoryId]="categoryId"
                           [section]="section"
                           [planId]="planId"></gpr-section-nav-row>`
  })
  class TestSectionNavRowComponent {
    @ViewChild(SectionNavRowComponent) sectionNavRow;
    customerNumber = 0;
    categoryId = '1';
    section = {sectionId: '1'};
    planId = '3';
  }
});
