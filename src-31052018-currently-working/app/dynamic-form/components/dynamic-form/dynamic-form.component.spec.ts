import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import {DynamicFormComponent} from './dynamic-form.component';
import FormConfig from '../../config/form-config';
import {Component, NgModule, OnInit, SimpleChange} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HelpDataService} from '../../../plan/services/help-data.service';
import {NotificationService} from 'app/core/services/notification.service';
import {CommonModule} from '@angular/common';
import {DynamicQuestionComponent} from '../dynamic-question/dynamic-question.component';
import {DynamicQuestionActionsStubComponent} from '../../../ui-controls/components/dynamic-question-actions/dynamic-question-actions.component.stub';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {DynamicFormItemComponent} from '../dynamic-form-item/dynamic-form-item.component';
import DataManager from '../../classes/data-manager';
import {By} from '@angular/platform-browser';
import {DropDownControlComponent} from '../../../forms-controls/components/drop-down-control/drop-down-control.component';
import {TextInputComponent} from '../../../forms-controls/components/text-input/text-input.component';
import {DropDownComponent} from '../../../forms-controls/components/drop-down/drop-down.component';
import {DynamicFormControlComponent} from '../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {MinAttributeDirective} from '../../../forms-controls/directives/min-attribute.directive';
import {FormControlClassProviderService} from '../../../forms-controls/services/form-control-class-provider.service';
import { FlagService } from '../../../flag/services/flag.service';
import { CommentService } from '../../../comment/services/comment.service';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';
import { NavigatorService } from 'app/navigation/services/navigator.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingSpinnerService } from '../../../ui-controls/services/loading-spinner.service';


describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormTestWrapperComponent>;
  let parent: DynamicFormTestWrapperComponent;
  let navigatorService: NavigatorService;
  let navState: INavState = getNavStateForDataManager(data);
  let navServiceSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FactoryTestModule, HttpClientTestingModule, RouterTestingModule],
      providers: [NavigatorService, HelpDataService, NotificationService, FlagService, CommentService, LoadingSpinnerService]
    }).compileComponents().then( () => {
      fixture = TestBed.createComponent(DynamicFormTestWrapperComponent);
      parent = fixture.componentInstance;
      navigatorService = TestBed.get(NavigatorService);
      navServiceSpy = spyOn(navigatorService, 'getNavigationState').and.callFake(() => <INavState>{data: {customer: {customerNumber: '12345'}, plan: {planName: 'Plan 1', planId: '1'}}});
      component = fixture.debugElement.children[0].componentInstance;
      fixture.detectChanges();
    });
  }));

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render the correct section header title', () => {
    const expected = component.config.categories[0].sections[0].label;
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    fixture.detectChanges();
    const headerElement = fixture.debugElement.query(By.css('h3'));
    expect(headerElement).toBeTruthy();
    expect(headerElement.nativeElement.textContent.trim()).toEqual(expected);
  });

  it('should render the correct number of question elements for the active section', () => {
    const expected = component.config.categories[0].sections[0].questions.length;
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    fixture.detectChanges();
    const questionElements = fixture.debugElement.queryAll(By.css('gpr-dynamic-question'));
    expect(questionElements).toBeTruthy();
    expect(questionElements.length).toEqual(expected);
  });

  it('should render newly activated section header once section has been activated', fakeAsync(() => {
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    const newSection = component.config.categories[0].sections[1];
    parent.config.activateSectionById(newSection.sectionId);
    tick();
    fixture.detectChanges();
    const headerElement = fixture.debugElement.query(By.css('h3'));
    expect(headerElement).toBeTruthy();
    expect(headerElement.nativeElement.textContent.trim()).toEqual(newSection.label);
  }));

  it('should render newly activated section questions once section has been activated', fakeAsync(() => {
    component.ngOnChanges({config: new SimpleChange(null, component.config, false)});
    const newSection = component.config.categories[0].sections[1];
    parent.config.activateSectionById(newSection.sectionId);
    tick();
    fixture.detectChanges();
    const questionElements = fixture.debugElement.queryAll(By.css('gpr-dynamic-question'));
    expect(questionElements).toBeTruthy();
    expect(questionElements.length).toEqual(newSection.questions.length);
  }));

  @Component({
    selector: `gpr-test-wrapper`,
    template: `<gpr-dynamic-form [config]="config" [model]="model" [plan]="plan" [customerNumber]="customerNumber"></gpr-dynamic-form>`
  })
  class DynamicFormTestWrapperComponent implements OnInit {
    public config: FormConfig;
    public model: DataManager;
    public number = 1;
    ngOnInit() {
      this.config = new FormConfig(configuration);
      this.config.activateCategoryById('mockCategory');
      this.config.activateSectionById('mockSection');
      this.model = this.config.initializeModel(navState);
    }

    public onAnswer(event): void {

    }
  }
  @NgModule({
    imports: [CommonModule],
    exports: [DynamicFormComponent, DropDownControlComponent, DynamicQuestionComponent, TextInputComponent],
    declarations: [DynamicQuestionComponent, DynamicQuestionActionsStubComponent, DynamicFormTestWrapperComponent, DropDownComponent, OutsideClickDirective,
      DynamicFormControlComponent, DropDownControlComponent, DynamicFormComponent, DynamicFormItemComponent, TextInputComponent, MinAttributeDirective],
    entryComponents: [DynamicFormComponent, DropDownControlComponent, DynamicQuestionComponent, TextInputComponent],
    providers: [FormControlClassProviderService]
  })
  class FactoryTestModule {}
});
