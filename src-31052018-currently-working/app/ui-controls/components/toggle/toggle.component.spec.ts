import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Component, DebugElement, ViewChild} from '@angular/core';
import {ToggleComponent} from './toggle.component';
import {Subscription} from 'rxjs/Subscription';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {IconComponent} from '../icon/icon.component';

describe('ToggleComponent', () => {
  let component: TestToggleComponent;
  let fixture: ComponentFixture<TestToggleComponent>;
  let subscription: Subscription;
  let toggleBtn: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleComponent, TestToggleComponent, IconComponent]
    })
      .compileComponents()
      .then(() => {
      fixture = TestBed.createComponent(TestToggleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      toggleBtn = fixture.debugElement.query(By.css('.toggle span'));
    });
  }));

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Toggling', () => {
    it('should by default have the toggle off', () => {
      expect(component.toggle.buttonState).toEqual('off');
    });

    it('should emit an event when the toggle button is clicked', (done) => {
      subscription = component.toggle.toggle.subscribe(isToggled => {
        expect(isToggled).toBeTruthy();
        done();
      });
      click(toggleBtn);
    });

    it('should toggle between on and off states when clicked', () => {
      expect(component.toggle.buttonState).toEqual('off');

      click(toggleBtn, fixture);
      expect(component.toggle.buttonState).toEqual('on');

      click(toggleBtn, fixture);
      expect(component.toggle.buttonState).toEqual('off');
    });
  });

  describe('Label', () => {
    it('should have a label when length is greater than 0 characters', () => {
      component.label = '';
      fixture.detectChanges();
      expect(component.toggle.hasLabel).toBeFalsy();

      component.label = 'Test Label';
      fixture.detectChanges();
      expect(component.toggle.hasLabel).toBeTruthy();
    });

    it('should not have a label when null', () => {
      expect(component.toggle.hasLabel).toBeTruthy();

      component.label = null;
      fixture.detectChanges();
      expect(component.toggle.hasLabel).toBeFalsy();
    });

    it('should not have a label when undefined', () => {
      expect(component.toggle.hasLabel).toBeTruthy();

      component.label = undefined;
      fixture.detectChanges();
      expect(component.toggle.hasLabel).toBeFalsy();
    });

    it('should not have a label when length is 0 characters', () => {
      expect(component.toggle.hasLabel).toBeTruthy();

      component.label = '';
      fixture.detectChanges();
      expect(component.toggle.hasLabel).toBeFalsy();
    });
  });

  @Component({
    template: '<gpr-toggle [label]="label" (toggle)="onToggle($event)"></gpr-toggle>'
  })
  class TestToggleComponent {
    @ViewChild(ToggleComponent) toggle;
    public label: string = 'Test';

    public onToggle(isToggled: boolean) {
    }
  }
});
