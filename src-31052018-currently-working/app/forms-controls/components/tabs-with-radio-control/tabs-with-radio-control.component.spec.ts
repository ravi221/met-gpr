import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {TabsWithRadioComponent} from '../tabs-with-radio/tabs-with-radio.component';
import {TabsWithRadioControlComponent} from './tabs-with-radio-control.component';

describe('TabsWithRadioControlComponent', () => {
  let component: TabsWithRadioControlComponent;
  let fixture: ComponentFixture<TabsWithRadioControlComponent>;
  let classProviderService: FormControlClassProviderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsWithRadioComponent, TabsWithRadioControlComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TabsWithRadioControlComponent);
        component = fixture.componentInstance;
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
    it('should have registered to FormControlClassProviderService with \'tabs-with-radio\' alias', () => {
      const control = classProviderService.getFormControlClass('tabs-with-radio');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(TabsWithRadioControlComponent));
    });
  });
});
