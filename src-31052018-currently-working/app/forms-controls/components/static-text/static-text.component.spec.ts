import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {DebugElement} from '@angular/core';
import {StaticTextComponent} from './static-text.component';

describe('StaticTextComponent', () => {
  let component: StaticTextComponent;
  let fixture: ComponentFixture<StaticTextComponent>;
  let classProviderService: FormControlClassProviderService;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaticTextComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(StaticTextComponent);
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
    it('should have registered to FormControlClassProviderService with \'static\' alias', () => {
      const control = classProviderService.getFormControlClass('static');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(StaticTextComponent));
    });

    it('should have registered to FormControlClassProviderService with \'static-text\' alias', () => {
      const control = classProviderService.getFormControlClass('static-text');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(StaticTextComponent));
    });

    it('should have registered to FormControlClassProviderService with \'fallback\' alias', () => {
      const control = classProviderService.getFormControlClass('fallback');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(StaticTextComponent));
    });

    it('should have registered to FormControlClassProviderService with \'default\' alias', () => {
      const control = classProviderService.getFormControlClass('default');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(StaticTextComponent));
    });
  });

  it('should have registered to FormControlClassProviderService with empty string alias', () => {
    const control = classProviderService.getFormControlClass('');
    expect(control).toBeTruthy();
    expect(new control()).toEqual(jasmine.any(StaticTextComponent));
  });

  it('should render with the correct value', () => {
    component.value = 'test value';
    component.ngOnInit();
    fixture.detectChanges();
    element = fixture.debugElement.children[0];
    expect(element.nativeElement.textContent.trim()).toEqual('test value');
  });
});
