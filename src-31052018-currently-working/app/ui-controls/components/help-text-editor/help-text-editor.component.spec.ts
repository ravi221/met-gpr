import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HelpTextEditorComponent} from './help-text-editor.component';
import {UIControlsModule} from '../../ui-controls.module';
import {DebugElement} from '@angular/core';
import QuestionConfig from '../../../dynamic-form/config/question-config';
import FormConfig from '../../../dynamic-form/config/form-config';
import DataManager from '../../../dynamic-form/classes/data-manager';

import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import * as user from '../../../../assets/test/user/user-profile.mock.json';
import {By} from '@angular/platform-browser';
import {UserProfile} from '../../../core/models/user-profile';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';

describe('HelpTextEditorComponent', () => {
  let component: HelpTextEditorComponent;
  let questionConfig: QuestionConfig;
  let formConfig: FormConfig;
   let fixture: ComponentFixture<HelpTextEditorComponent>;
  let dataManager: DataManager;
  let navState: INavState = getNavStateForDataManager(data);
  const userProfile = new UserProfile(user);


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UIControlsModule]
    })
      .compileComponents();
    formConfig = new FormConfig(configuration);
    questionConfig = formConfig.categories[0].sections[0].questions[0];
    formConfig.activateCategoryById(formConfig.categories[0].categoryId);
    dataManager = formConfig.initializeModel(navState);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTextEditorComponent);
    component = fixture.componentInstance;
    component.config = questionConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    const labelElement: DebugElement = fixture.debugElement.query(By.css('.text-editor-label'));
    expect(labelElement).toBeTruthy();
    const textEditorElement: DebugElement = fixture.debugElement.query(By.css('.text-editor'));
    expect(textEditorElement).toBeTruthy();
    const buttonElement: DebugElement = fixture.debugElement.query(By.css('.btn-tertiary'));
    expect(buttonElement).toBeTruthy();
  });
});
