import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {DebugElement} from '@angular/core';
import StateConfig from '../../config/state-config';
import {By} from '@angular/platform-browser';
import {CheckboxComponent} from './checkbox.component';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let classProviderService: FormControlClassProviderService;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckboxComponent);
        component = fixture.componentInstance;
        component.choices = mockChoices;
        component.id = 'myCheckbox';
        fixture.detectChanges();
        classProviderService = TestBed.get(FormControlClassProviderService);
      });
  }));

  afterEach(() => {
    element = null;
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Registering control', () => {
    it('should have registered to FormControlClassProviderService with \'checkbox\' alias', () => {
      const control = classProviderService.getFormControlClass('checkbox');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(CheckboxComponent));
    });
  });

  it('should render with the correct number of choices', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.checkbox-control'));
    expect(elements).toBeTruthy();
    expect(elements.length).toEqual(4);
  });

  it('should not render with any hidden choices', () => {
    component.choices[0].state = new StateConfig({isHidden: true});
    const expected = component.choices[0].label;
    fixture.detectChanges();
    element = fixture.debugElement.query(By.css('.checkbox-control[hidden]'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent.trim()).toEqual(expected);
  });

  it('should disable all choices when input is disabled', () => {
    component.isDisabled = true;
    fixture.detectChanges();
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.checkbox-control'));
    elements.forEach((el) => {
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.disabled).toBeTruthy();
    });
  });

  it('should disable the choice with disabled state', () => {
    component.choices[0].state = new StateConfig({isDisabled: true});
    const expected = component.choices[0].label;
    fixture.detectChanges();
    element = fixture.debugElement.query(By.css('input[disabled]'));
    expect(element).toBeTruthy();
    expect(element.parent.nativeElement.textContent.trim()).toEqual(expected);
  });

  it('should render with the proper ids for each choice', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.checkbox-control'));
    elements.forEach((el, key) => {
      const expected = `${component.id}${component.choices[key].value}`;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.id).toEqual(expected);
    });
  });

  it('should render with the proper label for each choice', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.checkbox-control'));
    elements.forEach((el, key) => {
      const expected = `${component.id}${component.choices[key].value}`;
      const label = el.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.htmlFor).toEqual(expected);
      expect(label.nativeElement.textContent.trim()).toEqual(component.choices[key].label);
    });
  });

  it('should render with the proper value for each choice', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.checkbox-control'));
    elements.forEach((el, key) => {
      const expected = component.choices[key].value;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.value).toEqual(expected);
    });
  });
});
