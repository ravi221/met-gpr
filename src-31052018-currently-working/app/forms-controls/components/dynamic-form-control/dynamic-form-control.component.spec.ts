import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicFormControlComponent} from './dynamic-form-control.component';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';

describe('DynamicFormControlComponent', () => {
  let component: DynamicFormControlComponent;
  let fixture: ComponentFixture<DynamicFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormControlComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DynamicFormControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should not create a dynamic form control when the type is null', () => {
    const spy = spyOn(component.container, 'createComponent').and.stub();
    component.type = null;
    component.ngOnInit();
    expect(spy).not.toHaveBeenCalled();
  });
});
