import StateConfig from '../../config/state-config';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {TabsComponent} from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TabsComponent);
        component = fixture.componentInstance;
        component.choices = mockChoices;
        component.id = 'myTabs';
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
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    expect(elements).toBeTruthy();
    expect(elements.length).toEqual(4);
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
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
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
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    elements.forEach((el, key) => {
      const expected = `${component.id}${component.choices[key].value}`;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.id).toEqual(expected);
    });
  });

  it('should render with the proper label for each choice', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    elements.forEach((el, key) => {
      const expected = `${component.id}${component.choices[key].value}`;
      const label = el.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.htmlFor).toEqual(expected);
      expect(label.nativeElement.textContent.trim()).toEqual(component.choices[key].label);
    });
  });

  it('should render with the proper value for each choice', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.tab-control'));
    elements.forEach((el, key) => {
      const expected = component.choices[key].value;
      const input = el.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.value).toEqual(expected);
    });
  });

  describe('Emitting change events', () => {
    it('should not emit a change event when the entire control is disabled', () => {
      const spy = spyOn(component.choiceChange, 'emit').and.stub();
      component.isDisabled = true;
      component.choices[0].state.isDisabled = false;
      fixture.detectChanges();

      component.onChoiceChange(component.choices[0]);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit a change event when the specific choice is disabled', () => {
      const spy = spyOn(component.choiceChange, 'emit').and.stub();
      component.isDisabled = false;
      component.choices[0].state.isDisabled = true;
      fixture.detectChanges();

      component.onChoiceChange(component.choices[0]);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit a change event when the entire control is enabled and the choice state is enabled', () => {
      const spy = spyOn(component.choiceChange, 'emit').and.stub();
      component.isDisabled = false;
      component.choices[0].state.isDisabled = false;
      fixture.detectChanges();

      component.onChoiceChange(component.choices[0]);
      expect(spy).toHaveBeenCalled();
    });
  });
});
