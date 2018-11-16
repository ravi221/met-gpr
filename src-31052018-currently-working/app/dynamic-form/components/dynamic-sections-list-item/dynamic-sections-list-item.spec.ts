import {By} from '@angular/platform-browser';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import FormConfig from '../../config/form-config';
import {DynamicSectionsListItemComponent} from './dynamic-sections-list-item';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import DataManager from '../../classes/data-manager';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';

describe('DynamicFormSectionsListItem', () => {
  let fixture: ComponentFixture<DynamicSectionsListItemComponent>;
  let component: DynamicSectionsListItemComponent;
  let formConfig: FormConfig = new FormConfig(configuration);
  let model: DataManager;
  beforeEach( () => {
    fixture = TestBed.configureTestingModule({
      declarations: [ DynamicSectionsListItemComponent, IconComponent]
      }).createComponent(DynamicSectionsListItemComponent);
    component = fixture.componentInstance;
    let navState: INavState = getNavStateForDataManager(data);
    formConfig.activateCategoryById('mockCategory');
    model = formConfig.initializeModel(navState);
    component.config = formConfig;
    component.section = component.config.getSection('mockSection');
  });

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render the validation error icon when section has errors', () => {
    const sectionConfig = formConfig.getSection('mockSection');
    sectionConfig.state.hasErrors = true;

    fixture.detectChanges();

    const validationIcon = fixture.debugElement.query(By.css('.validation-icon'));
    expect(validationIcon).toBeTruthy();
  });

  it('should render the validation error icon when section has warnings', () => {
    const sectionConfig = formConfig.getSection('mockSection');
    sectionConfig.state.hasErrors = true;
    fixture.detectChanges();

    const validationIcon = fixture.debugElement.query(By.css('.validation-icon'));
    expect(validationIcon).toBeTruthy();
  });

  it('should show the circle check off icon when the section is not complete', () => {
    const sectionConfig = formConfig.getSection('mockSection');
    sectionConfig.answeredRequiredQuestionCount = 0;
    sectionConfig.requiredQuestionCount = 1;

    fixture.detectChanges();
    const circleCheckOffIcon = fixture.debugElement.query(By.css('gpr-icon img'));
    expect(circleCheckOffIcon).toBeTruthy();
    expect(circleCheckOffIcon.nativeElement.src).toContain('circle-check-off-icon');

  });

  it('should show the circle check off icon when the section has validation errors', () => {
    const sectionConfig = formConfig.getSection('mockSection');
    sectionConfig.answeredRequiredQuestionCount = 1;
    sectionConfig.requiredQuestionCount = 1;
    sectionConfig.state.isComplete = false;

    fixture.detectChanges();
    const circleCheckOffIcon = fixture.debugElement.query(By.css('gpr-icon img'));
    expect(circleCheckOffIcon).toBeTruthy();
    expect(circleCheckOffIcon.nativeElement.src).toContain('circle-check-off-icon');
  });

  it('should show the circle check on icon when the section is complete and has no validation errors', () => {
    const sectionConfig = formConfig.getSection('mockSection');
    sectionConfig.answeredRequiredQuestionCount = 1;
    sectionConfig.requiredQuestionCount = 1;
    sectionConfig.state.isComplete = true;

    fixture.detectChanges();
    const circleCheckOnIcon = fixture.debugElement.query(By.css('gpr-icon img'));
    expect(circleCheckOnIcon).toBeTruthy();
    expect(circleCheckOnIcon.nativeElement.src).toContain('circle-check-on-icon');
  });
});
