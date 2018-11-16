import StateConfig from '../../config/state-config';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component, DebugElement} from '@angular/core';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {TabsWithRadioComponent} from './tabs-with-radio.component';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';

describe('TabsWithRadioComponent', () => {
  let component: TestTabsWithRadioComponent;
  let fixture: ComponentFixture<TestTabsWithRadioComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsWithRadioComponent, TestTabsWithRadioComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestTabsWithRadioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    element = null;
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render with the correct number of choices', () => {
    const tabElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    expect(tabElements).toBeTruthy();
    expect(tabElements.length).toEqual(3);

    const radioElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    expect(radioElements).toBeTruthy();
    expect(radioElements.length).toEqual(1);
  });

  it('should not render with any hidden choices', () => {
    component.choices[0].state = new StateConfig({isHidden: true});
    const expected = component.choices[0].label;
    fixture.detectChanges();
    element = fixture.debugElement.query(By.css('.tab-control[hidden]'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent.trim()).toEqual(expected);
  });

  it('should disable all choices when input is disabled', () => {
    component.isDisabled = true;
    fixture.detectChanges();
    const inputs: DebugElement[] = fixture.debugElement.queryAll(By.css('input'));
    inputs.forEach(input => {
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

    function verifyId(el, key) {
      const expected = `${component.id}${component.choices[key].value}`;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.id).toEqual(expected);
    }

    const tabElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    const radioElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    const allElements: DebugElement[] = [...tabElements, ...radioElements];
    allElements.forEach(verifyId);
  });

  it('should render with the proper label for each choice', () => {

    function verifyLabel(el, key) {
      const expected = `${component.id}${component.choices[key].value}`;
      const label = el.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.htmlFor).toEqual(expected);
      expect(label.nativeElement.textContent.trim()).toEqual(component.choices[key].label);
    }

    const tabElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    const radioElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    const allElements: DebugElement[] = [...tabElements, ...radioElements];
    allElements.forEach(verifyLabel);
  });

  it('should render with the proper value for each choice', () => {

    function verifyValue(el, key) {
      const expected = component.choices[key].value;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.value).toEqual(expected);
    }

    const tabElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    const radioElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    const allElements: DebugElement[] = [...tabElements, ...radioElements];
    allElements.forEach(verifyValue);
  });

  @Component({
    template: `
        <gpr-tabs-with-radio [id]="id"
                             [isDisabled]="isDisabled"
                             [value]="value"
                             [choices]="choices"></gpr-tabs-with-radio>
    `
  })
  class TestTabsWithRadioComponent {
    choices = mockChoices;
    isDisabled = false;
    id = 'tabs-with-other';
    value = 'A';
  }
});
