import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {EscapeKeyDirective} from 'app/ui-controls/directives/escape-key.directive';

describe('EscapeKeyDirective', () => {
  let component: TestEscapeKeyDirectiveComponent;
  let fixture: ComponentFixture<TestEscapeKeyDirectiveComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestEscapeKeyDirectiveComponent, EscapeKeyDirective]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestEscapeKeyDirectiveComponent);
        component = fixture.componentInstance;
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should trigger onKeyPress when escape key pressed', () => {
    const spy = spyOn(component, 'onEscapeKeyPress').and.stub();
    const event = new KeyboardEvent('keydown', {'key': 'Escape'});
    document.dispatchEvent(event);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  @Component({
    template: `
      <div gprEscapeKey (escapeKeyPress)="onEscapeKeyPress($event)">
      </div>
    `
  })
  class TestEscapeKeyDirectiveComponent {
    @ViewChild(EscapeKeyDirective) escapeKeyDirective;

    public onEscapeKeyPress($event: KeyboardEvent): void {
    }
  }
});
