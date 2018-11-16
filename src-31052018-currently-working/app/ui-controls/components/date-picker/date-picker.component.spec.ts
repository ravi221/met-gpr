import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {DatePickerComponent} from './date-picker.component';
import {DatePickerDefaults} from 'app/ui-controls/services/date-picker-defaults.service';
import {DatePipe} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IDatePickerOutput} from '../../interfaces/iDatePickerOutput';

describe('DatePickerComponent', () => {
  let component: TestDatePickerComponent;
  let fixture: ComponentFixture<TestDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerComponent, TestDatePickerComponent],
      imports: [FormsModule],
      providers: [DatePickerDefaults, DatePipe, TestDatePickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });
  describe('DatePicker input tests', () => {
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      inputElement = fixture.nativeElement.querySelector('.gpr-date-picker');
    });
    it('should emit', (done) => {
      const spy = spyOn(component, 'setDatePartial').and.callThrough();
      const date = '01/01/2018';
      sendInput(date).then(() => {
        expect(spy).toHaveBeenCalled();
        expect(component.value).toBe(date);
        done();
      });
    });

    it('should set isInvalidDate to true', () => {
      const spy = spyOn(component, 'setDatePartial').and.callThrough();
      const date = '01/888/2018';
      component.datePicker.checkValue(date);
      expect(spy).toHaveBeenCalled();
      expect(component.datePicker.isInvalidDate).toBeTruthy();
      expect(component.value).toBe('');
    });
    it('should set isInvalidDate to false', () => {
      const spy = spyOn(component, 'setDatePartial').and.callThrough();
      const date = '01/01/2018';
      component.datePicker.checkValue(date);
      expect(spy).toHaveBeenCalled();
      expect(component.datePicker.isInvalidDate).toBeFalsy();
      expect(component.value).toBe(date);
    });
    it('should set isInvalidDate to true when required and value is null', () => {
      const spy = spyOn(component, 'setDatePartial').and.callThrough();
      component.requiredField = true;
      fixture.detectChanges();
      component.datePicker.checkValue(null);
      expect(spy).toHaveBeenCalled();
      expect(component.datePicker.isInvalidDate).toBeTruthy();
    });
    it('should set isInvalidDate to true when required and value is blank', () => {
      const spy = spyOn(component, 'setDatePartial').and.callThrough();
      component.requiredField = true;
      fixture.detectChanges();
      component.datePicker.checkValue('');
      expect(spy).toHaveBeenCalled();
      expect(component.datePicker.isInvalidDate).toBeTruthy();
    });

    function sendInput(text: string) {
      inputElement.value = text;
      inputElement.dispatchEvent(new Event('input'));
      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      return fixture.whenStable();
    }
  });

  @Component({
    template: `
      <gpr-date-picker [shouldAllowInput]="true"
                       (dateChanged)="setDatePartial($event)"
                       [initialValue]="initialValue"
                       [required]="requiredField">
      </gpr-date-picker>
    `
  })
  class TestDatePickerComponent implements OnInit, OnDestroy {
    @ViewChild(DatePickerComponent) datePicker;
    public value: string;
    public initalValue: Date;
    public flatPickerOutput: IDatePickerOutput;
    public requiredField: boolean = false;

    ngOnDestroy(): void {
    }

    ngOnInit() {
    }

    public setDatePartial(date: IDatePickerOutput) {
      this.value = date.dateString;
    }
  }
});
