import {AddRemoveListComponent} from '../add-remove-list/add-remove-list.component';
import {AddRemoveListControlComponent} from './add-remove-list-control.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {ReactiveFormsModule} from '@angular/forms';

describe('AddRemoveListControlComponent', () => {
  let component: AddRemoveListControlComponent;
  let fixture: ComponentFixture<AddRemoveListControlComponent>;
  let classProviderService: FormControlClassProviderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddRemoveListControlComponent, AddRemoveListComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddRemoveListControlComponent);
        component = fixture.componentInstance;
        component.choices = mockChoices;
        component.id = 'addRemoveList';
        fixture.detectChanges();
        classProviderService = TestBed.get(FormControlClassProviderService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Registering control', () => {
    it('should have registered to FormControlClassProviderService with \'add-remove-list\' alias', () => {
      const control = classProviderService.getFormControlClass('add-remove-list');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(AddRemoveListControlComponent));
    });
  });
});
