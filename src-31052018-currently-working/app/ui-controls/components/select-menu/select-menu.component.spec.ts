import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Component, DebugElement, ViewChild} from '@angular/core';
import {SelectMenuComponent} from './select-menu.component';
import {Subscription} from 'rxjs/Subscription';
import {By} from '@angular/platform-browser';
import ChoiceConfig from '../../../forms-controls/config/choice-config';

describe('SelectMenuComponent', () => {
  let component: TestSelectMenuComponent;
  let fixture: ComponentFixture<TestSelectMenuComponent>;
  let subscription: Subscription;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectMenuComponent, TestSelectMenuComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSelectMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
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

  describe('Select', () => {
    it('should by default select the first value', () => {
      expect(component.select.activeChoice).toEqual(component.selectOptions[0]);
    });

    it('should render with the proper label for each choice', () => {
      const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('option'));
      expect(elements).toBeTruthy();
      expect(elements.length).toEqual(3);
      elements.forEach((el, key) => {
        const expected = component.selectOptions[key].label;
        expect(el.nativeElement.textContent.trim()).toEqual(expected);
      });
    });

    it('should render with the proper value for each choice', () => {
      const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('option'));
      expect(elements).toBeTruthy();
      expect(elements.length).toEqual(3);
      elements.forEach((el, key) => {
        const expected = component.selectOptions[key].value;
        expect(el.nativeElement.value).toEqual(expected);
      });
    });
  });

  describe('Label', () => {
    it('should have a label', () => {
      const label = fixture.debugElement.query(By.css('.select-label'));
      expect(label.nativeElement.innerText).toContain('Test Label');
    });
  });

  @Component({
    template: '<gpr-select-menu [label]="label" [selectChoices]="selectOptions" (choiceChange)="choiceChanged($event)"></gpr-select-menu>'
  })
  class TestSelectMenuComponent {
    @ViewChild(SelectMenuComponent) select;
    public label: string = 'Test Label';
    public activeChoice: ChoiceConfig;
    public selectOptions: ChoiceConfig[] = [
      <ChoiceConfig> {value: '5', label: '5'},
      <ChoiceConfig> {value: '15', label: '15'},
      <ChoiceConfig> {value: '25', label: '25'}];

    public choiceChanged(choice: ChoiceConfig): void {
    }
  }
});
