import {Component, OnInit, ViewChild} from '@angular/core';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import DataManager from '../../../dynamic-form/classes/data-manager';
import QuestionConfig from '../../../dynamic-form/config/question-config';
import FormConfig from '../../../dynamic-form/config/form-config';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DynamicQuestionActionsComponent} from './dynamic-question-actions.component';
import {CommentCreateTooltipStubComponent} from '../comment-create-tooltip/comment-create-tooltip.component.stub';
import {HelpTooltipStubComponent} from '../help-tooltip/help-tooltip.component.stub';
import {FlagCreateTooltipStubComponent} from '../flag-create-tooltip/flag-create-tooltip.component.stub';
import {HelpTextEditorStubComponent} from '../help-text-editor/help-text-editor.component.stub';
import {CompletionStatus} from '../../../plan/enums/completion-status';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IComment } from '../../../comment/interfaces/iComment';
import { INavState } from 'app/navigation/interfaces/iNavState';
import { getNavStateForDataManager } from '../../../../assets/test/NavStateHelper';
import { CommentService } from '../../../comment/services/comment.service';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FlagService } from '../../../flag/services/flag.service';
import { NavigatorService } from '../../../navigation/services/navigator.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';
import { HelpDataService } from '../../../plan/services/help-data.service';

describe( 'DynamicQuestionActionsComponent', () => {
  let fixture: ComponentFixture<PopUpContainerTestComponent>;
  let component: DynamicQuestionActionsComponent;
  let parent: PopUpContainerTestComponent;
  let navigatorService: NavigatorService;
  let navState: INavState = getNavStateForDataManager(data);
  let navServiceSpy: jasmine.Spy;

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PopUpContainerTestComponent, DynamicQuestionActionsComponent, FlagCreateTooltipStubComponent, CommentCreateTooltipStubComponent, HelpTooltipStubComponent, HelpTextEditorStubComponent],
      providers: [CommentService, FlagService, NavigatorService, LoadingSpinnerService, HelpDataService]
    }).compileComponents().then( () => {
      fixture = TestBed.createComponent(PopUpContainerTestComponent);
      parent = fixture.componentInstance;
      navigatorService = TestBed.get(NavigatorService);
      navServiceSpy = spyOn(navigatorService, 'getNavigationState').and.callFake(() => <INavState>{data: {customer: {customerNumber: '12345'}, plan: {coverageId: 'test',
      categories: [{
        categoryId: 'mockCategory',
        categoryName: 'Mock Category',
        completionPercentage: 0,
        sections: [{
          completedFieldCount: 0,
          completionPercentage: 0,
          sectionId: 'mockSection',
          sectionName: 'Mock Section',
          totalFieldCount: 1,
          validationIndicator: 'not valid',
          errorCount: 0
        }],
        statusCode: CompletionStatus.IN_PROGRESS,
        validationIndicator: 'not',
        errorCount: 0
      }]}}});
      component = fixture.debugElement.children[0].componentInstance;
      fixture.detectChanges();
    });
  }));

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  @Component({
    selector: 'gpr-test-wrapper',
    template: '<gpr-dynamic-question-actions [config]="config" [model]="model" [questionFlag]="questionFlag" [questionComments]="questionComments"></gpr-dynamic-question-actions>'
  })
  class PopUpContainerTestComponent implements OnInit {
    public config: QuestionConfig;
    public model: DataManager;
    public questionFlag: IFlag = {
      questionId: '1',
      text: 'this is a test',
      lastUpdatedBy: '',
      lastUpdatedByEmail: '',
      lastUpdatedTimestamp: '',
      questionName: 'name',
      questionValue: 'value',
      isResolved: false
    };
    public questionComments: IComment = {
      text: '',
      lastUpdatedBy: '',
      lastUpdatedByEmail: '',
      lastUpdatedByTimestamp: '',
      commentId: 1,
      questionId: '1'
    };
    public plan: IPlan = {
      coverageId: 'test',
      categories: [{
        categoryId: 'mockCategory',
        categoryName: 'Mock Category',
        completionPercentage: 0,
        sections: [{
          completedFieldCount: 0,
          completionPercentage: 0,
          sectionId: 'mockSection',
          sectionName: 'Mock Section',
          totalFieldCount: 1,
          validationIndicator: 'not valid',
          errorCount: 0
        }],
        statusCode: CompletionStatus.IN_PROGRESS,
        validationIndicator: 'not',
        errorCount: 0
      }]
    };
    public customerNumber = '1';
    @ViewChild('DynamicQuestionActionsComponent') popUpContainerComponent: DynamicQuestionActionsComponent;
    ngOnInit() {
      const formConfig = new FormConfig(configuration);
      formConfig.activateCategoryById('mockCategory');
      formConfig.activateSectionById('mockSection');
      this.model = formConfig.initializeModel(navState);
      this.config = formConfig.getQuestion('questionA') as QuestionConfig;
    }
  }
});
