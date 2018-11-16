import ChoiceConfig from '../../config/choice-config';
import StateConfig from '../../config/state-config';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {DropDownComponent} from './drop-down.component';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';

describe('DropDownComponent', () => {
  let component: TestDropDownComponent;
  let fixture: ComponentFixture<TestDropDownComponent>;
  let element: DebugElement;
  let dropDown: DebugElement;

  function toggleDropDown() {
    dropDown.triggerEventHandler('click', {
      stopPropagation: () => {
      }
    });
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropDownComponent, TestDropDownComponent, OutsideClickDirective]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestDropDownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dropDown = fixture.debugElement.query(By.css('.drop-down-selection'));
      });
  }));

  afterEach(() => {
    element = null;
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Rendering', () => {
    it('should render with the correct number of choices', () => {
      const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.drop-down-list-item'));
      expect(elements).toBeTruthy();
      expect(elements.length).toEqual(4);
    });

    it('should not render with any hidden choices', () => {
      component.choices[0].state = new StateConfig({isHidden: true});
      const expected = component.choices[0].label;
      fixture.detectChanges();
      element = fixture.debugElement.query(By.css('.drop-down-list-item[hidden]'));
      expect(element).toBeTruthy();
      expect(element.nativeElement.textContent.trim()).toEqual(expected);
    });

    it('should render with the proper id', () => {
      element = fixture.debugElement.query(By.css('.drop-down'));
      expect(element).toBeTruthy();
      expect(element.nativeElement.id).toEqual(component.id);
    });

    it('should render with the proper label for each choice', () => {
      const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.drop-down-list-item'));
      elements.forEach((el, key) => {
        const expected = component.choices[key].label;
        expect(el.nativeElement.textContent.trim()).toEqual(expected);
      });
    });
  });

  describe('Disabling', () => {
    it('should disable drop-down when component is disabled', () => {
      component.isDisabled = true;
      fixture.detectChanges();
      element = fixture.debugElement.query(By.css('.drop-down.disabled'));
      expect(element).toBeTruthy();
    });

    it('should disable the choice with disabled state', () => {
      component.choices[0].state = new StateConfig({isDisabled: true});
      const expected = component.choices[0].label;
      fixture.detectChanges();
      element = fixture.debugElement.query(By.css('.drop-down-list-item.disabled'));
      expect(element).toBeTruthy();
      expect(element.nativeElement.textContent.trim()).toEqual(expected);
    });
  });

  describe('Opening/closing', () => {
    it('should toggle the visibility of the drop down the drop down on click', () => {
      expect(component.dropDown.showChoices).toBeFalsy();
      toggleDropDown();
      expect(component.dropDown.showChoices).toBeTruthy();
      toggleDropDown();
      expect(component.dropDown.showChoices).toBeFalsy();
    });

    it('should not toggle the visibility of the drop down when disabled', () => {
      component.isDisabled = true;
      fixture.detectChanges();
      expect(component.dropDown.showChoices).toBeFalsy();
      toggleDropDown();
      expect(component.dropDown.showChoices).toBeFalsy();
    });

    it('should keep the drop down closed when outside clicking', () => {
      expect(component.dropDown.showChoices).toBeFalsy();
      component.dropDown.onOutsideClick();
      expect(component.dropDown.showChoices).toBeFalsy();
    });

    it('should close the drop down on outside click', () => {
      toggleDropDown();
      expect(component.dropDown.showChoices).toBeTruthy();
      component.dropDown.onOutsideClick();
      expect(component.dropDown.showChoices).toBeFalsy();
    });
  });

  describe('Selecting an option', () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(component, 'onChoiceChange').and.stub();
    });

    it('should not emit a change event when drop down is disabled', () => {
      component.isDisabled = true;
      fixture.detectChanges();
      component.dropDown.onChoiceSelected(component.choices[0]);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit a change event when the choice state is undefined', () => {
      const choice = component.choices[0];
      choice.state = undefined;
      fixture.detectChanges();
      component.dropDown.onChoiceSelected(choice);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(choice);
    });

    it('should emit a change event when the choice state is null', () => {
      const choice = component.choices[0];
      component.choices[0].state = null;
      fixture.detectChanges();
      component.dropDown.onChoiceSelected(choice);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(choice);
    });

    it('should not emit a change event when the choice state is disabled', () => {
      component.choices[0].state = new StateConfig({isDisabled: true});
      fixture.detectChanges();
      component.dropDown.onChoiceSelected(component.choices[0]);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit a change event when the choice state is enabled', () => {
      const choice = component.choices[0];
      choice.state = new StateConfig({isDisabled: false});
      fixture.detectChanges();
      component.dropDown.onChoiceSelected(choice);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(choice);
    });
  });

  @Component({
    template: `
      <gpr-drop-down [choices]="choices"
                     [id]="id"
                     [isDisabled]="isDisabled"
                     [value]="value"
                     (choiceChange)="onChoiceChange($event)"></gpr-drop-down>`
  })
  class TestDropDownComponent {
    @ViewChild(DropDownComponent) dropDown;
    public choices: ChoiceConfig[] = mockChoices;
    public id = 'test:id';
    public isDisabled = false;
    public value = 'A';

    public onChoiceChange(e) {

    }
  }
});
