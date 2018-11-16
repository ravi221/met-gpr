import {GroupedQuestionComponent} from './grouped-question.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgModule} from '@angular/core';
import * as data from '../../../../assets/test/dynamic-form/group-question.mock.json';
import * as configuration from '../../../../assets/test/dynamic-form/group-questions-data-manager.mock.json';
import FormConfig from '../../config/form-config';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DynamicFormItemStubComponent} from '../dynamic-form-item/dynamic-form-item.component.stub';
import {DynamicFormControlComponent} from '../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {FormControlClassProviderService} from '../../../forms-controls/services/form-control-class-provider.service';
import {TextInputComponent} from '../../../forms-controls/components/text-input/text-input.component';
import {RadioButtonComponent} from '../../../forms-controls/components/radio-button/radio-button.component';
import {MinAttributeDirective} from '../../../forms-controls/directives/min-attribute.directive';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';



describe( 'GroupedQuestionComponent', () => {
  let fixture: ComponentFixture<GroupedQuestionComponent>;
  let component: GroupedQuestionComponent;
  let formConfig: FormConfig;
  let navState: INavState = getNavStateForDataManager(configuration);

  beforeEach( () => {
    fixture = TestBed.configureTestingModule(({
      imports: [GroupQuestionTestModule],
      declarations: [GroupedQuestionComponent, DynamicFormControlComponent, DynamicFormItemStubComponent],
      providers: [FormControlClassProviderService],
    })).createComponent(GroupedQuestionComponent);
    component = fixture.componentInstance;
    formConfig = new FormConfig(data);
    formConfig.activateCategoryById(formConfig.categories[0].categoryId);
    component.config = formConfig.categories[0].sections[0].groupedQuestions[0];
    component.index = 1;
    component.plan = {};
    component.customerNumber = 2;
  });

  afterEach( () => {
    component.model = null;
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should initialize values' , () => {
    component.model = formConfig.initializeModel(navState);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.values.get('question1')).toBe('Y');
    expect(component.values.get('question2')).toBe(1);
    expect(component.values.get('question3')).toBe('DY');
  });

  it('should have the proper labels', () => {
    component.model = formConfig.initializeModel(navState);
    component.ngOnInit();
    fixture.detectChanges();
    let numberElement = fixture.debugElement.query(By.css('.control-number'));
    let labelElement = fixture.debugElement.query(By.css('.control-label'));
    expect(numberElement.nativeElement.innerText).toBe('1.');
    expect(labelElement.nativeElement.innerText.trim()).toBe(component.config.label);
  });

  it('should mark required questions with an asterisk', () => {
    component.model = formConfig.initializeModel(navState);
    component.ngOnInit();
    fixture.detectChanges();
    component.model.require('question1');
    fixture.detectChanges();
    const labels = fixture.debugElement.queryAll(By.css('.control-label'));
    expect(labels[1].nativeElement.textContent.trim()).toContain(`*`);
  });
  @NgModule({
    imports: [CommonModule],
    exports: [RadioButtonComponent, TextInputComponent],
    declarations: [RadioButtonComponent, TextInputComponent, MinAttributeDirective],
    entryComponents: [RadioButtonComponent, TextInputComponent]
  })
  class GroupQuestionTestModule {}

});
