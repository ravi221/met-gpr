import {MassUpdateQuestionComponent} from './mass-update-question.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import FormConfig from '../../config/form-config';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import {INavState} from '../../../navigation/interfaces/iNavState';
import QuestionConfig from '../../config/question-config';
import DataManager from '../../classes/data-manager';
import {Component, DebugElement, NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DropDownControlComponent} from '../../../forms-controls/components/drop-down-control/drop-down-control.component';
import {DropDownComponent} from '../../../forms-controls/components/drop-down/drop-down.component';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {DynamicFormControlComponent} from '../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {FormControlClassProviderService} from '../../../forms-controls/services/form-control-class-provider.service';
import {By} from '@angular/platform-browser';
import {DataManagerSubscriptionType} from '../../enumerations/data-manager-subscription-type';
import {IObservedModel} from '../../../entity/entity';
import {FormsModule} from '@angular/forms';
import {HelpTooltipStubComponent} from 'app/ui-controls/components/help-tooltip/help-tooltip.component.stub';
import {HelpTextEditorStubComponent} from 'app/ui-controls/components/help-text-editor/help-text-editor.component.stub';
import {LoadingIconComponent} from 'app/ui-controls/components/loading-icon/loading-icon.component';
import {click} from 'assets/test/TestHelper';

describe('MassUpdateQuestionComponent', () => {
  let component: MassUpdateQuestionComponent;
  let fixture: ComponentFixture<MassUpdateTestWrapperComponent>;
  let parentComponent: MassUpdateTestWrapperComponent;
  let formConfig: FormConfig;
  let questionConfig: QuestionConfig;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FactoryTestModule, HttpClientTestingModule, FormsModule]
    })
      .compileComponents().then( () => {
      fixture = TestBed.createComponent(MassUpdateTestWrapperComponent);
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

  it('should check checkbox if checked is true', async(() => {
    component.config.isChecked = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inEl = fixture.debugElement.query(By.css('.mass-update-checkbox'));
      expect(inEl.nativeElement.children[0].checked).toBe(true);
    });
  }));

  it('should check checkbox if checked is false', async(() => {
    component.config.isChecked = false;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inEl = fixture.debugElement.query(By.css('.mass-update-checkbox'));
      expect(inEl.nativeElement.children[0].checked).toBe(false);
    });
  }));

  it('should emit handleCheckboxChange on click event', () => {
    spyOn(component.valueChanged, 'emit');
    component.handleCheckboxChange(null);
    expect(component.valueChanged.emit).toHaveBeenCalled();
  });

  it('should open modal window on click Get more help link', () => {
    const expected = component.config.help.helpUrl;
    const spy = spyOn(component, 'handleOpenHelpWindow').and.stub();
    component.handleOpenHelpWindow(expected);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expected);
  });

  it('should CALL handleSaveHelpText funtion', () => {
    const spy = spyOn(component, 'handleSaveHelpText').and.stub();
    component.handleSaveHelpText();
    expect(spy).toHaveBeenCalled();
  });

  it('should CALL onCancelHelpText funtion', () => {
    const spy = spyOn(component, 'onCancelHelpText').and.stub();
    component.onCancelHelpText();
    expect(spy).toHaveBeenCalled();
  });






  @Component({
    selector: `gpr-test-wrapper`,
    template: `<gpr-mass-update-question [config]="config" [model]="model" [index]="number" [plan]="plan" [customerNumber]="customerNumber"></gpr-mass-update-question>`
  })
  class MassUpdateTestWrapperComponent implements OnInit {
    public config: QuestionConfig;
    public model: DataManager;
    public number = 1;
    public flag = {};
    public comments = {};
    public plan = {};
    ngOnInit() {
      formConfig = new FormConfig(configuration);
      questionConfig = formConfig.categories[0].sections[0].questions[0];
      formConfig.activateCategoryById('mockCategory');
      formConfig.activateSectionById('mockSection');
      this.config = questionConfig;
      this.model = formConfig.initializeModel(navState);
    }
  }

  @NgModule({
    imports: [CommonModule, FormsModule],
    exports: [MassUpdateQuestionComponent, DropDownControlComponent, HelpTooltipStubComponent, HelpTextEditorStubComponent],
    declarations: [MassUpdateQuestionComponent, MassUpdateTestWrapperComponent, DropDownComponent, OutsideClickDirective,
      DynamicFormControlComponent, DropDownControlComponent, HelpTooltipStubComponent, HelpTextEditorStubComponent, LoadingIconComponent],
    entryComponents: [MassUpdateQuestionComponent, DropDownControlComponent, HelpTooltipStubComponent, HelpTextEditorStubComponent],
    providers: [FormControlClassProviderService]
  })
  class FactoryTestModule {}
});
