import {Component, DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MinAttributeDirective} from './min-attribute.directive';

describe('MinAttributeDirective', () => {
  let component: TestMinAttributeDirectiveComponent;
  let fixture: ComponentFixture<TestMinAttributeDirectiveComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestMinAttributeDirectiveComponent, MinAttributeDirective]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestMinAttributeDirectiveComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('input'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should not have the min attribute when type is null', () => {
    let hasMinAttribute = debugElement.nativeElement.getAttribute('min');
    expect(hasMinAttribute).toBeNull();
  });

  it('should not have the min attribute when type is something other than number', () => {
    component.type = 'text';
    fixture.detectChanges();
    let hasMinAttribute = debugElement.nativeElement.getAttribute('min');
    expect(hasMinAttribute).toBeNull();
  });

  it('should have the min attribute when type is number', () => {
    component.type = 'number';
    fixture.detectChanges();
    let hasMinAttribute = debugElement.nativeElement.getAttribute('min');
    expect(hasMinAttribute).toBeDefined();
    expect(hasMinAttribute).toBe('0');
  });

  @Component({
    template: `<input [gprMinAttribute]="type">`
  })
  class TestMinAttributeDirectiveComponent {
    public type: string;
  }
});
