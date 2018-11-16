import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {DropDownControlComponent} from './drop-down-control.component';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {DropDownComponent} from '../drop-down/drop-down.component';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';

describe('DropDownControlComponent', () => {
  let component: DropDownControlComponent;
  let fixture: ComponentFixture<DropDownControlComponent>;
  let classProviderService: FormControlClassProviderService;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropDownControlComponent, DropDownComponent, OutsideClickDirective],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DropDownControlComponent);
        component = fixture.componentInstance;
        component.choices = mockChoices;
        component.id = 'myDropdown';
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
    it('should have registered to FormControlClassProviderService with \'drop-down\' alias', () => {
      const control = classProviderService.getFormControlClass('drop-down');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(DropDownControlComponent));
    });

    it('should have registered to FormControlClassProviderService with \'select\' alias', () => {
      const control = classProviderService.getFormControlClass('select');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(DropDownControlComponent));
    });
  });
});
