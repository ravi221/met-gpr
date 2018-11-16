import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ScrollToTopComponent} from './scroll-to-top.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ScrollService} from '../../services/scroll.service';
import {click} from '../../../../assets/test/TestHelper';

describe('ScrollToTopComponent', () => {
  let component: TestScrollToTopComponent;
  let fixture: ComponentFixture<TestScrollToTopComponent>;
  let scrollService: ScrollService;
  let scrollToTopBtn: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollToTopComponent, TestScrollToTopComponent],
      providers: [ScrollService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestScrollToTopComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        scrollToTopBtn = fixture.debugElement.query(By.css('button'));
        scrollService = TestBed.get(ScrollService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should by default not display the scroll to top button', () => {
    expect(component.scrollToTopComponent.scrollThreshold).toBe(10);
    expect(component.scrollToTopComponent.displayScrollToTop).toBeFalsy();
  });

  it('should check to display the scroll distance', fakeAsync(() => {
    const spy = spyOn(scrollService, 'getScrollDistance').and.returnValue(30);
    component.scrollToTopComponent.onWindowScroll();
    tick(5000);
    expect(spy).toHaveBeenCalled();
  }));

  it('should call scroll to top fn once scroll to top button is clicked', () => {
    const spy = spyOn(component.scrollToTopComponent, 'scrollToTop').and.callThrough();
    click(scrollToTopBtn, fixture);
    expect(spy).toHaveBeenCalled();
  });

  @Component({
    selector: 'gpr-test-scroll-to-top',
    template: `
      <div>
        <gpr-scroll-to-top [scrollThreshold]="10"></gpr-scroll-to-top>
      </div>
    `,
    styles: ['div { height: 1000px; }']
  })
  class TestScrollToTopComponent {
    @ViewChild(ScrollToTopComponent) scrollToTopComponent;
  }
});
