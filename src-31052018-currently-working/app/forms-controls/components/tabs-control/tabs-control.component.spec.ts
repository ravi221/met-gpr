import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {mockChoices} from '../../../../assets/test/common-objects/dynamic-form-objects.mock';
import {TabsComponent} from '../tabs/tabs.component';
import {TabsControlComponent} from './tabs-control.component';

describe('TabsControlComponent', () => {
  let component: TabsControlComponent;
  let fixture: ComponentFixture<TabsControlComponent>;
  let classProviderService: FormControlClassProviderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsControlComponent, TabsComponent],
      providers: [FormControlClassProviderService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TabsControlComponent);
        component = fixture.componentInstance;
        component.choices = mockChoices;
        component.id = 'myTabs';
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
    it('should have registered to FormControlClassProviderService with \'tabs\' alias', () => {
      const control = classProviderService.getFormControlClass('tabs');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(TabsControlComponent));
    });

    it('should have registered to FormControlClassProviderService with \'tabs-control\' alias', () => {
      const control = classProviderService.getFormControlClass('tabs');
      expect(control).toBeTruthy();
      expect(new control()).toEqual(jasmine.any(TabsControlComponent));
    });
  });
});
