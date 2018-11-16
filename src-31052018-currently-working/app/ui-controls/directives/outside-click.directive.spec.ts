import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {OutsideClickDirective} from './outside-click.directive';

describe('OutsideClickDirective', () => {
  let component: TestOutsideClickDirectiveComponent;
  let fixture: ComponentFixture<TestOutsideClickDirectiveComponent>;
  let insideButton: DebugElement;
  let outsideButton: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestOutsideClickDirectiveComponent, OutsideClickDirective]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestOutsideClickDirectiveComponent);
        component = fixture.componentInstance;
        insideButton = fixture.debugElement.query(By.css('.inside-btn'));
        outsideButton = fixture.debugElement.query(By.css('.outside-btn'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should trigger outside click without a selector', () => {
    const spy = spyOn(component, 'onOutsideClick').and.stub();
    component.outsideClick.onDocumentClick({target: outsideButton.nativeElement});
    expect(spy).toHaveBeenCalled();
  });

  it('should trigger outside click with a selector', () => {
    component.selector = '.inside-btn';
    fixture.detectChanges();

    const spy = spyOn(component, 'onOutsideClick').and.stub();
    component.outsideClick.onDocumentClick({target: outsideButton.nativeElement});
    expect(spy).toHaveBeenCalled();
  });

  it('should not trigger outside click without a selector', () => {
    const spy = spyOn(component, 'onOutsideClick').and.stub();
    component.outsideClick.onDocumentClick({target: insideButton.nativeElement});
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not trigger outside click with a selector', () => {
    component.selector = '.inside-btn';
    fixture.detectChanges();

    const spy = spyOn(component, 'onOutsideClick').and.stub();
    component.outsideClick.onDocumentClick({target: insideButton.nativeElement});
    expect(spy).not.toHaveBeenCalled();
  });

  @Component({
    template: `
      <div gprOutsideClick [selector]="selector" (outsideClick)="onOutsideClick()">
        <button class="inside-btn">Inside</button>
      </div>
      <button class="outside-btn">Outside</button>
    `
  })
  class TestOutsideClickDirectiveComponent {
    @ViewChild(OutsideClickDirective) outsideClick;
    public selector: string = '';

    public onOutsideClick(): void {
    }
  }
});
