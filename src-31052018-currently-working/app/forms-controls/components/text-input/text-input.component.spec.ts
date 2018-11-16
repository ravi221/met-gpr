import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {DebugElement} from '@angular/core';
import {TextInputComponent} from './text-input.component';
import {MinAttributeDirective} from '../../directives/min-attribute.directive';
import FormConfig from '../../../dynamic-form/config/form-config';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;
  let classProviderService: FormControlClassProviderService;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextInputComponent, MinAttributeDirective],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TextInputComponent);
        component = fixture.componentInstance;
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
    it('should have registered to FormControlClassProviderService with \'text\' alias', () => {
      const control = classProviderService.getFormControlClass('text');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(TextInputComponent));
    });

    it('should have registered to FormControlClassProviderService with \'number\' alias', () => {
      const control = classProviderService.getFormControlClass('number');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(TextInputComponent));
    });

    it('should have registered to FormControlClassProviderService with \'input\' alias', () => {
      const control = classProviderService.getFormControlClass('input');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(TextInputComponent));
    });

    it('should have registered to FormControlClassProviderService with \'text-input\' alias', () => {
      const control = classProviderService.getFormControlClass('text-input');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(TextInputComponent));
    });
  });


  it('should render with the correct id', () => {
    component.id = 'test id';
    fixture.detectChanges();
    element = fixture.debugElement.children[0];
    expect(element.nativeElement.id).toEqual('test id');
  });

  it('should render with the correct value', () => {
    component.value = 'test value';
    component.ngOnInit();
    fixture.detectChanges();
    element = fixture.debugElement.children[0];
    expect(element.nativeElement.value).toEqual('test value');
  });

  it('should render with empty string value when value is undefined', () => {
    component.value = undefined;
    component.ngOnInit();
    fixture.detectChanges();
    element = fixture.debugElement.children[0];
    expect(element.nativeElement.value).toEqual('');
  });

  it('should render with the correct type', () => {
    component.type = 'number';
    fixture.detectChanges();
    element = fixture.debugElement.children[0];
    expect(element.nativeElement.type).toEqual('number');
  });

  it('should render with disabled attribute when control is disabled', () => {
    component.isDisabled = true;
    fixture.detectChanges();
    element = fixture.debugElement.children[0];
    expect(element.nativeElement.disabled).toBeTruthy();
  });

  describe('onValueChanged', () => {
    let spy;
    beforeEach( () => {
      spy = spyOn(component.valueChanged, 'emit');
      const formConfig = new FormConfig(configuration);
      component.config = formConfig.categories[0].sections[0].questions[1];
    });
    afterEach( () => {
      if (spy) {
        spy = null;
      }
    });
    it('should emit a value when there is no regex', () => {
      component.regex = null;
      fixture.detectChanges();
      component.onValueChanged('test');
      expect(spy).toHaveBeenCalled();
    });

    it('should emit a value when there is a regex and the value passes', () => {
      component.regex = /^\d{3}\.\d{2}$/;
      fixture.detectChanges();
      component.onValueChanged(100.12);
      expect(spy).toHaveBeenCalled();
    });

    describe('regex fails', () => {
      it('should update errors when errors is Nil', () => {
        component.regex = /^\d{3}\.\d{2}$/;
        fixture.detectChanges();
        component.onValueChanged(1.12);
        expect(spy).not.toHaveBeenCalled();
        expect(component.config.control.state.errors.length).toBe(1);
        expect(component.config.control.state.errors[0]).toBe('Invalid Format');
      });

      it('should update when errors has values', () => {
        component.regex = /^\d{3}\.\d{2}$/;
        component.config.control.state.errors = ['test'];
        fixture.detectChanges();
        component.onValueChanged(1.12);
        expect(spy).not.toHaveBeenCalled();
        expect(component.config.control.state.errors.length).toBe(2);
        expect(component.config.control.state.errors[0]).toBe('test');
        expect(component.config.control.state.errors[1]).toBe('Invalid Format');
      });
    });
  });
});
