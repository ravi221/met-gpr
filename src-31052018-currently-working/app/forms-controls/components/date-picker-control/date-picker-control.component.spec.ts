import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {DatePickerControlComponent} from './date-picker-control.component';
import {DatePickerComponent} from '../../../ui-controls/components/date-picker/date-picker.component';
import {FormsModule} from '@angular/forms';
import {DatePickerDefaults} from '../../../ui-controls/services/date-picker-defaults.service';
import {DatePipe} from '@angular/common';

describe('DatePickerControlComponent', () => {
  let component: DatePickerControlComponent;
  let fixture: ComponentFixture<DatePickerControlComponent>;
  let classProviderService: FormControlClassProviderService;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerControlComponent, DatePickerComponent],
      providers: [FormControlClassProviderService, DatePickerDefaults, DatePipe],
      imports: [FormsModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DatePickerControlComponent);
        component = fixture.componentInstance;
        component.choices = mockChoices;
        component.id = 'myDatePicker';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Registering control', () => {
    it('should have registered to FormControlClassProviderService with \'date-picker\' alias', () => {
      const control = classProviderService.getFormControlClass('date-picker');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(DatePickerControlComponent));
    });
    it('should have registered to FormControlClassProviderService with \'date\' alias', () => {
      const control = classProviderService.getFormControlClass('date');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(DatePickerControlComponent));
    });
  });
});
