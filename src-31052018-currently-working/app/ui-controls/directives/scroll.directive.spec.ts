import {ScrollDirective} from './scroll.directive';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {ScrollDirection} from '../enums/scroll-direction';
import {ScrollService} from '../services/scroll.service';

describe('ScrollDirective', () => {
  let component: TestScrollDirectiveComponent;
  let fixture: ComponentFixture<TestScrollDirectiveComponent>;
  let scrollService: ScrollService;
  let scrollDistanceSpy: jasmine.Spy;

  function setScrollDistance(scrollDistance) {
    scrollDistanceSpy.and.returnValue(scrollDistance);
    component.scroll.handleScroll();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestScrollDirectiveComponent, ScrollDirective],
      providers: [ScrollService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestScrollDirectiveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        scrollService = TestBed.get(ScrollService);
        scrollDistanceSpy = spyOn(scrollService, 'getScrollDistance');
        setScrollDistance(30);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should emit scroll NEXT event when scrolling down', () => {
    const spy = spyOn(component, 'onScroll').and.stub();
    setScrollDistance(40);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(ScrollDirection.NEXT);
  });

  it('should not emit scroll PREVIOUS event when scrolling down', () => {
    const spy = spyOn(component, 'onScroll').and.stub();
    setScrollDistance(40);
    expect(spy).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalledWith(ScrollDirection.PREVIOUS);
  });

  it('should emit scroll PREVIOUS event when scrolling up', () => {
    const spy = spyOn(component, 'onScroll').and.stub();
    setScrollDistance(20);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(ScrollDirection.PREVIOUS);
  });

  it('should not emit scroll NEXT event when scrolling up', () => {
    const spy = spyOn(component, 'onScroll').and.stub();
    setScrollDistance(20);
    expect(spy).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalledWith(ScrollDirection.NEXT);
  });

  it('should emit scroll at bottom when at the bottom of the page', () => {
    spyOn(scrollService, 'isNearBottom').and.returnValue(true);
    const spy = spyOn(component, 'onScrollAtBottom').and.stub();
    setScrollDistance(60);
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit scroll at bottom when not at the bottom of the page', () => {
    spyOn(scrollService, 'isNearBottom').and.returnValue(false);
    const spy = spyOn(component, 'onScrollAtBottom').and.stub();
    setScrollDistance(60);
    expect(spy).not.toHaveBeenCalled();
  });


  @Component({
    template: `
      <div class="test-scroll" gprScroll (scrollAtBottom)="onScrollAtBottom()" (scroll)="onScroll($event)">
        Test Content
      </div>
    `
  })
  class TestScrollDirectiveComponent {
    @ViewChild(ScrollDirective) scroll;

    public onScrollAtBottom() {

    }

    public onScroll(scrollDirection: ScrollDirection) {

    }
  }
});
