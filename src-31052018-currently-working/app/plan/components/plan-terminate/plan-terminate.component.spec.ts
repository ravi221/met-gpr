import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanTerminateComponent} from './plan-terminate.component';
import {DatePickerComponent} from 'app/ui-controls/components/date-picker/date-picker.component';
import {FormsModule} from '@angular/forms';
import {DatePickerDefaults} from '../../../ui-controls/services/date-picker-defaults.service';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {By} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import {IDatePickerOutput} from '../../../ui-controls/interfaces/iDatePickerOutput';

describe('PlanTerminateComponent', () => {
  let component: PlanTerminateComponent;
  let fixture: ComponentFixture<PlanTerminateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanTerminateComponent, DatePickerComponent],
      imports: [FormsModule],
      providers: [DatePickerDefaults, ActiveModalRef, DatePipe]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(PlanTerminateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));
  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Close modal tests', () => {
    it('should not close if date is null', () => {
      const spy = spyOn(TestBed.get(ActiveModalRef), 'close').and.stub();
      const dtOutput = <IDatePickerOutput>{
        dateString: 'asdaf'
      };
      component.onDateSelected(null);
      fixture.detectChanges();
      component.closeModal();
      expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should not close if date is empty', () => {
      const spy = spyOn(TestBed.get(ActiveModalRef), 'close').and.stub();
      const dtOutput = <IDatePickerOutput>{
        dateString: ''
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      component.closeModal();
      expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should not close if date is invalid', () => {
      const spy = spyOn(TestBed.get(ActiveModalRef), 'close').and.stub();
      const dtOutput = <IDatePickerOutput>{
        dateString: '3/12'
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      component.closeModal();
      expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should close if date is valid', () => {
      const date = new Date(Date.now()).toLocaleString();
      const spy = spyOn(TestBed.get(ActiveModalRef), 'close').and.stub();
      const dtOutput = <IDatePickerOutput>{
        dateString: date
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      component.closeModal();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        terminationDate: date
      });
    });
  });
  describe('ValidateDate method tests', () => {
    it('should return false for null date', () => {
      const result = component.validateDate(null);
      expect(result).toBeFalsy();
      expect(component.warningMessage).toBeNull();
      expect(component.errorMessage).not.toBeNull();
    });
    it('should return false for empty date', () => {
      const result = component.validateDate('');
      expect(result).toBeFalsy();
      expect(component.warningMessage).toBeNull();
      expect(component.errorMessage).not.toBeNull();
    });
    it('should return false for partial', () => {
      const result = component.validateDate('3/3');
      expect(result).toBeFalsy();
      expect(component.warningMessage).toBeNull();
      expect(component.errorMessage).not.toBeNull();
    });
    it('should return true for date more than 90 days from today, but still have error message', () => {
      const result = component.validateDate('03/03/2000');
      expect(result).toBeTruthy();
      expect(component.errorMessage).toBeNull();
      expect(component.warningMessage).not.toBeNull();
    });
    it('should return true for today', () => {
      const result = component.validateDate(new Date(Date.now()).toLocaleString());
      expect(result).toBeTruthy();
      expect(component.warningMessage).toBeNull();
      expect(component.errorMessage).toBeNull();
    });
  });
  describe('Error message tests', () => {
    it('should display \'Please enter a date\' when date entered is null', () => {
      component.onDateSelected(null);
      fixture.detectChanges();
      let errorMessage = fixture.debugElement.query(By.css('.error'));
      expect(errorMessage.nativeElement.innerText).toContain('Please enter a date');
    });
    it('should display \'Please enter a date\' when date entered is empty', () => {
      const dtOutput = <IDatePickerOutput>{
        dateString: ''
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      let errorMessage = fixture.debugElement.query(By.css('.error'));
      expect(errorMessage.nativeElement.innerText).toContain('Please enter a date');
    });
    it('should display \'Incorrect date/format\' when date entered is invalid', () => {
      const dtOutput = <IDatePickerOutput>{
        dateString: 'asdaf'
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      let errorMessage = fixture.debugElement.query(By.css('.error'));
      expect(errorMessage.nativeElement.innerText).toContain('Incorrect date/format');
    });
    it('should display \'Incorrect date/format\' when date entered is partial', () => {
      const dtOutput = <IDatePickerOutput>{
        dateString: '03/'
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      let errorMessage = fixture.debugElement.query(By.css('.error'));
      expect(errorMessage.nativeElement.innerText).toContain('Incorrect date/format');
    });
    it('should display \'You have entered a termination date 90 days prior to today\' when date entered is prior to today', () => {
      const dtOutput = <IDatePickerOutput>{
        dateString: '03/03/1999'
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      let errorMessage = fixture.debugElement.query(By.css('.warning'));
      expect(errorMessage.nativeElement.innerText).toContain('You have entered a termination date 90 days prior to today');
    });
    it('should not display anything when date entered correctly', () => {
      const dtOutput = <IDatePickerOutput>{
        dateString: new Date(Date.now()).toLocaleString()
      };
      component.onDateSelected(dtOutput);
      fixture.detectChanges();
      let errorMessage = fixture.debugElement.query(By.css('.error'));
      expect(errorMessage).toBeNull();
    });
  });
});
