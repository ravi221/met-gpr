import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DynamicQuestionActionsStubComponent} from '../../../../ui-controls/components/dynamic-question-actions/dynamic-question-actions.component.stub';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GroupedOtherComponent} from './grouped-other.component';
import * as config from '../../../../../assets/test/dynamic-form/grouped-other.mock.json';
import * as data from '../../../../../assets/test/dynamic-form/grouped-other-model.mock.json';
import * as formConfig from '../../../../../assets/test/dynamic-form/group-question.mock.json';
import {GroupedQuestionConfig} from '../../../config/grouped-question-config';
import {onChildUpdate} from '../../../../../assets/test/dynamic-form/onChildUpdate.mock';
import DataManager from '../../../classes/data-manager';
import FormConfig from '../../../config/form-config';
import {DynamicFormControlComponent} from '../../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {FormControlClassProviderService} from '../../../../forms-controls/services/form-control-class-provider.service';
import {RadioButtonComponent} from '../../../../forms-controls/components/radio-button/radio-button.component';
import {TextInputComponent} from '../../../../forms-controls/components/text-input/text-input.component';
import {MinAttributeDirective} from '../../../../forms-controls/directives/min-attribute.directive';
import {INavState} from '../../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../../assets/test/NavStateHelper';
import {FormControl} from '../../../../forms-controls/components/form-control';
import {CheckboxComponent} from '../../../../forms-controls/components/checkbox/checkbox.component';
import Spy = jasmine.Spy;
import {By} from '@angular/platform-browser';

describe('GroupedOtherComponent', () => {
  let fixture: ComponentFixture<GroupedOtherComponent>;
  let component: GroupedOtherComponent;
  let formConfiguration: FormConfig = new FormConfig(formConfig);
  let navState: INavState = getNavStateForDataManager(data);
  let control: FormControl;
  let spy: Spy;

  beforeEach( () => {
    fixture = TestBed.configureTestingModule(({
      imports: [GroupedOtherTestingModule],
      declarations: [GroupedOtherComponent, DynamicFormControlComponent, DynamicQuestionActionsStubComponent],
      providers: [FormControlClassProviderService],
    })).createComponent(GroupedOtherComponent);

    component = fixture.componentInstance;
    component.index = 1;
    component.plan = {};
    component.customerNumber = 2;
    component.config = new GroupedQuestionConfig(config, onChildUpdate);
    formConfiguration.activateCategoryById('mockCategory');
    component.model = new DataManager(formConfiguration, navState);
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create the component, set the values, and disable the text box', () => {
    expect(component.primaryQuestion).toBeTruthy();
    expect(component.textBox).toBeTruthy();

    expect(component.primaryQuestionValue).toBe('Y');
    expect(component.textBoxValue).toBe('');

    expect(component.textBox.control.state.isRequired).toBeFalsy();
  });

  it('should call onTextBoxChange when entering values into the text box', () => {
    spy = spyOn(component, 'onTextBoxChange').and.callThrough();
    const textBox = fixture.debugElement.query(By.css('gpr-text-input'));
    const textBoxComponent = textBox.componentInstance;
    textBoxComponent.value = 'Test';
    textBoxComponent.onValueChanged();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });


  describe('Changing Radio Button Values', () => {

    beforeEach( () => {
      control = new RadioButtonComponent();
      control.type = 'radio';
    });

    it('should not call setById when question.value is null', () => {
      spy = spyOn(component.model, 'setById' ).and.callThrough();
      control.value = null;
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call setById when question.value is undefined', () => {
      spy = spyOn(component.model, 'setById' ).and.callThrough();
      control.value = undefined;
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should show the textbox when other is set in the radio button', () => {
      control.value = 'Other';
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(component.textBox.control.state.isHidden).toBeFalsy();
      expect(component.textBox.control.state.isRequired).toBeTruthy();
    });
    it('should hide the textbox when the radio button value is not Other', () => {
      control.value = 'notOther';
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(component.textBox.control.state.isHidden).toBeTruthy();
      expect(component.textBox.control.state.isRequired).toBeFalsy();
    });
  });
  describe('Changing Checkbox Values', () => {

    beforeEach( () => {
      control = new CheckboxComponent();
      control.type = 'checkbox';
    });

    it('should not call setById when question.value is null', () => {
      spy = spyOn(component.model, 'setById' ).and.callThrough();
      control.value = null;
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call setById when question.value is undefined', () => {
      spy = spyOn(component.model, 'setById' ).and.callThrough();
      control.value = undefined;
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
    it('should show the textbox when other is contained in the checkbox', () => {
      control.value = ['Other'];
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(component.textBox.control.state.isHidden).toBeFalsy();
      expect(component.textBox.control.state.isRequired).toBeTruthy();
    });
    it('should hide the textbox when other is not contained in the checkbox', () => {
      control.value = ['notOther'];
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(component.textBox.control.state.isHidden).toBeTruthy();
      expect(component.textBox.control.state.isRequired).toBeFalsy();
    });

    it('should hide the textbox when no values are checked', () => {
      control.value = [];
      component.onValueChanged(control);
      fixture.detectChanges();
      expect(component.textBox.control.state.isHidden).toBeTruthy();
      expect(component.textBox.control.state.isRequired).toBeFalsy();
    });
  });


  @NgModule({
    imports: [CommonModule],
    exports: [RadioButtonComponent, TextInputComponent],
    declarations: [RadioButtonComponent, TextInputComponent, MinAttributeDirective],
    entryComponents: [RadioButtonComponent, TextInputComponent]
  })
  class GroupedOtherTestingModule {}
});
