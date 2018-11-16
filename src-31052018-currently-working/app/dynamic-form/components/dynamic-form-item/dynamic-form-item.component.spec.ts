import {Component, NgModule, OnInit} from '@angular/core';
import {IFormItemConfig} from '../../config/iFormItemConfig';
import DataManager from '../../classes/data-manager';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import FormConfig from '../../config/form-config';
import {DynamicFormItemComponent} from './dynamic-form-item.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DynamicQuestionComponent} from '../dynamic-question/dynamic-question.component';
import {CommonModule} from '@angular/common';
import {FlagCreateTooltipStubComponent} from '../../../ui-controls/components/flag-create-tooltip/flag-create-tooltip.component.stub';
import {CommentCreateTooltipStubComponent} from '../../../ui-controls/components/comment-create-tooltip/comment-create-tooltip.component.stub';
import {HelpTooltipStubComponent} from '../../../ui-controls/components/help-tooltip/help-tooltip.component.stub';
import {HelpTextEditorStubComponent} from '../../../ui-controls/components/help-text-editor/help-text-editor.component.stub';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {DynamicQuestionActionsStubComponent} from '../../../ui-controls/components/dynamic-question-actions/dynamic-question-actions.component.stub';
import {DropDownControlComponent} from '../../../forms-controls/components/drop-down-control/drop-down-control.component';
import {DropDownComponent} from '../../../forms-controls/components/drop-down/drop-down.component';
import {DynamicFormControlComponent} from '../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {FormControlClassProviderService} from '../../../forms-controls/services/form-control-class-provider.service';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';

describe('DynamicFormItemComponent', ()  => {
  let fixture: ComponentFixture<FactoryWrapperComponent>;
  let component: FactoryWrapperComponent;
  let childComponent: DynamicFormItemComponent;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [FactoryTestModule]
    }) .compileComponents().then( () => {
      fixture = TestBed.createComponent(FactoryWrapperComponent);
      component = fixture.componentInstance;
      childComponent = fixture.debugElement.children[0].componentInstance;
    });
  }));

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create a component', () => {
    expect(childComponent.target).toBeTruthy();
  });

  @Component({
    selector: `gpr-factory-wrapper`,
    template: `<gpr-dynamic-form-item
      [config]="questionConfig"
      [index]="1"
      [model]="model"
      [plan] = "plan"
      [customerNumber] = "1"
      [questionFlag] = "getFlag(questionConfig)"
      [questionComments] = "getComments(questionConfig)"
      (answeredQuestion)="onAnswer($event)">
    </gpr-dynamic-form-item>`
  })
  class FactoryWrapperComponent implements OnInit {
    public questionConfig: IFormItemConfig;
    public model: DataManager;
    public formConfig: FormConfig;
    public plan: IPlan;

    ngOnInit() {
      this.formConfig = new FormConfig(configuration);
      this.formConfig.activateCategoryById('mockCategory');
      this.model = this.formConfig.initializeModel(navState);
      this.questionConfig = this.formConfig.getQuestion('questionA');
      this.plan = {
        coverageId: '1234'
      };
    }

    public getFlagExists(questionConfig) {}
    public getCommentsExists(questionConfig) {}
  }

  @NgModule({
    imports: [CommonModule],
    exports: [DynamicQuestionComponent, DropDownControlComponent],
    declarations: [DynamicQuestionComponent, HelpTextEditorStubComponent, DynamicQuestionActionsStubComponent, FactoryWrapperComponent, DynamicFormItemComponent, DropDownComponent, OutsideClickDirective,
      FlagCreateTooltipStubComponent, CommentCreateTooltipStubComponent, HelpTooltipStubComponent, DynamicFormControlComponent, DropDownControlComponent],
    entryComponents: [DynamicQuestionComponent, DropDownControlComponent],
    providers: [FormControlClassProviderService]
  })
  class FactoryTestModule {}
});
