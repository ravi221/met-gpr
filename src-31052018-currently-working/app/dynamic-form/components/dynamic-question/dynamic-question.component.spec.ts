import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import DataManager from '../../classes/data-manager';
import FormConfig from '../../config/form-config';
import QuestionConfig from '../../config/question-config';
import {DataManagerSubscriptionType} from '../../enumerations/data-manager-subscription-type';
import {NotificationService} from 'app/core/services/notification.service';
import {PageAccessType} from '../../../core/enums/page-access-type';
import {DynamicQuestionActionsStubComponent} from '../../../ui-controls/components/dynamic-question-actions/dynamic-question-actions.component.stub';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {CommonModule} from '@angular/common';
import {DynamicQuestionComponent} from './dynamic-question.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpHandler} from '@angular/common/http';
import {Component, DebugElement, NgModule, OnInit} from '@angular/core';
import {By} from '@angular/platform-browser';
import {IObservedModel} from '../../../entity/entity';
import {DynamicFormControlComponent} from '../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {DropDownControlComponent} from '../../../forms-controls/components/drop-down-control/drop-down-control.component';
import {DropDownComponent} from '../../../forms-controls/components/drop-down/drop-down.component';
import {FormControlClassProviderService} from '../../../forms-controls/services/form-control-class-provider.service';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';
import {LoadingIconComponent} from 'app/ui-controls/components/loading-icon/loading-icon.component';

describe('DynamicQuestionComponent', () => {
  let component: DynamicQuestionComponent;
  let fixture: ComponentFixture<DynamicQuestionTestWrapperComponent>;
  let parentComponent: DynamicQuestionTestWrapperComponent;
  let formConfig: FormConfig;
  let questionConfig: QuestionConfig;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FactoryTestModule],
      providers: [HttpHandler, NotificationService]
    })
      .compileComponents().then( () => {
      fixture = TestBed.createComponent(DynamicQuestionTestWrapperComponent);
      parentComponent = fixture.componentInstance;
      component = fixture.debugElement.children[0].componentInstance;
      fixture.detectChanges();
    });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render the correct question label', () => {
    const expected = component.config.label;
    component.config.control.state.isRequired = false;
    fixture.detectChanges();
    const labelElement: DebugElement = fixture.debugElement.query(By.css('.control-label'));
    expect(labelElement).toBeTruthy();
    expect(labelElement.nativeElement.textContent.trim()).toContain(expected);
  });

  it('should render a * next to question label for a required question', () => {
    component.config.control.state.isRequired = true;
    fixture.detectChanges();
    const labelElement: DebugElement = fixture.debugElement.query(By.css('.control-label'));
    expect(labelElement).toBeTruthy();
    const spanElement: DebugElement = labelElement.query(By.css('span'));
    expect(spanElement).toBeTruthy();
    expect(spanElement.nativeElement.hidden).toBeFalsy();
  });

  it('should render the correct ordinal index number of the question', () => {
    component.index = 10;
    fixture.detectChanges();
    const labelElement: DebugElement = fixture.debugElement.query(By.css('.control-number'));
    expect(labelElement).toBeTruthy();
    expect(labelElement.nativeElement.textContent.trim()).toEqual('10.');
  });

  it('should render an instance of gpr-dynamic-form-control component', () => {
    const componentElement: DebugElement = fixture.debugElement.query(By.css('gpr-dynamic-form-control'));
    expect(componentElement).toBeTruthy();
    expect(componentElement.componentInstance).toEqual(jasmine.any(DynamicFormControlComponent));
  });

  it('should apply hidden attribute to control group when question is hidden', () => {
    component.config.control.state.isHidden = true;
    fixture.detectChanges();
    const groupElement: DebugElement = fixture.debugElement.query(By.css('.control-group'));
    expect(groupElement).toBeTruthy();
    expect(groupElement.nativeElement.hidden).toBeTruthy();
  });

  it('should apply disabled attribute to control group when question is disabled', () => {
    component.config.control.state.isDisabled = true;
    fixture.detectChanges();
    const groupElement: DebugElement = fixture.debugElement.query(By.css('.control-group'));
    expect(groupElement).toBeTruthy();
    expect(groupElement.nativeElement.disabled).toBeTruthy();
  });

  it('should apply \'has-errors\' class when question has error state', () => {
    component.config.control.state.hasErrors = true;
    fixture.detectChanges();
    const groupElement: DebugElement = fixture.debugElement.query(By.css('.control-group'));
    expect(groupElement).toBeTruthy();
    expect(groupElement.nativeElement.classList.contains('has-errors')).toBeTruthy();
  });

  it('should render validation messages when question has error messages', () => {
    component.config.control.state.errors = ['This is an error test message', 'This is yet another error message'];
    fixture.detectChanges();
    const errorElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.control-errors'));
    expect(errorElements).toBeTruthy();
    expect(errorElements.length).toEqual(2);
  });

  it('should apply \'has-errors\' class when question has warning state', () => {
    component.config.control.state.hasWarnings = true;
    fixture.detectChanges();
    const groupElement: DebugElement = fixture.debugElement.query(By.css('.control-group'));
    expect(groupElement).toBeTruthy();
    expect(groupElement.nativeElement.classList.contains('has-errors')).toBeTruthy();
  });

  it('should render validation messages when question has warning messages', () => {
    component.config.control.state.warnings = ['This is an warning test message', 'This is yet another warning message'];
    fixture.detectChanges();
    const errorElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.control-errors'));
    expect(errorElements).toBeTruthy();
    expect(errorElements.length).toEqual(2);
  });

  it('should update the value when model has been updated', () => {
    const expected = 2;
    component.model.subscribe( `${DataManagerSubscriptionType.VIEW_MODEL}:${component.config.formItemId}`, (observed: IObservedModel) => {
      expect(observed.currentValue).toBe(expected);
    });
    component.onValueChanged({id: component.config.formItemId, value: expected});
  });

  @Component({
    selector: `gpr-test-wrapper`,
    template: `<gpr-dynamic-question [config]="config" [model]="model" [index]="number" [questionFlag]="questionFlag" [questionComments]="questionComments" [plan]="plan" [customerNumber]="customerNumber"></gpr-dynamic-question>`
  })
  class DynamicQuestionTestWrapperComponent implements OnInit {
    public config: QuestionConfig;
    public model: DataManager;
    public number = 1;
    public questionFlag = {};
    public questoinComments = {};
    public plan = {};
    ngOnInit() {
      formConfig = new FormConfig(configuration);
      questionConfig = formConfig.categories[0].sections[0].questions[0];
      this.config = questionConfig;
      formConfig.activateCategoryById('mockCategory');
      formConfig.activateSectionById('mockSection');
      this.model = formConfig.initializeModel(navState);
    }

    public onAnswer(event): void {

    }
  }

  @NgModule({
    imports: [CommonModule],
    exports: [DynamicQuestionComponent, DropDownControlComponent],
    declarations: [DynamicQuestionComponent, DynamicQuestionActionsStubComponent, DynamicQuestionTestWrapperComponent, DropDownComponent, OutsideClickDirective,
      DynamicFormControlComponent, DropDownControlComponent, LoadingIconComponent],
    entryComponents: [DynamicQuestionComponent, DropDownControlComponent],
    providers: [FormControlClassProviderService]
  })
  class FactoryTestModule {}
});
