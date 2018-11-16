import StateConfig from '../../config/state-config';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {RadioButtonComponent} from './radio-button.component';

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;
  let classProviderService: FormControlClassProviderService;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RadioButtonComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RadioButtonComponent);
        component = fixture.componentInstance;
        component.choices = mockChoices;
        component.id = 'myRadio';
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
    it('should have registered to FormControlClassProviderService with \'radio\' alias', () => {
      const control = classProviderService.getFormControlClass('radio');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(RadioButtonComponent));
    });

    it('should have registered to FormControlClassProviderService with \'radio-button\' alias', () => {
      const control = classProviderService.getFormControlClass('radio-button');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(RadioButtonComponent));
    });
  });

  it('should render with the correct number of choices', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    expect(elements).toBeTruthy();
    expect(elements.length).toEqual(4);
  });

  it('should not render with any hidden choices', () => {
    component.choices[0].state = new StateConfig({isHidden: true});
    const expected = component.choices[0].label;
    fixture.detectChanges();
    element = fixture.debugElement.query(By.css('.radio-control[hidden]'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent.trim()).toEqual(expected);
  });

  it('should disable all choices when input is disabled', () => {
    component.isDisabled = true;
    fixture.detectChanges();
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    elements.forEach(el => {
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
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    elements.forEach((el, key) => {
      const expected = `${component.id}${component.choices[key].value}`;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.id).toEqual(expected);
    });
  });

  it('should render with the proper label for each choice', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    elements.forEach((el, key) => {
      const expected = `${component.id}${component.choices[key].value}`;
      const label = el.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.htmlFor).toEqual(expected);
      expect(label.nativeElement.textContent.trim()).toEqual(component.choices[key].label);
    });
  });

  it('should render with the proper value for each choice', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.radio-control'));
    elements.forEach((el, key) => {
      const expected = component.choices[key].value;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.value).toEqual(expected);
    });
  });
});
