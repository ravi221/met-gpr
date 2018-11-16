import {MassUpdateFormComponent} from './mass-update-form.component';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {Component, NgModule, OnInit, SimpleChange} from '@angular/core';
import {By} from '@angular/platform-browser';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import FormConfig from '../../config/form-config';
import DataManager from '../../classes/data-manager';
import {CommonModule} from '@angular/common';
import {DropDownControlComponent} from '../../../forms-controls/components/drop-down-control/drop-down-control.component';
import {MassUpdateQuestionComponent} from '../mass-update-question/mass-update-question.component';
import {TextInputComponent} from '../../../forms-controls/components/text-input/text-input.component';
import {DropDownComponent} from '../../../forms-controls/components/drop-down/drop-down.component';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {DynamicFormControlComponent} from '../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {MinAttributeDirective} from '../../../forms-controls/directives/min-attribute.directive';
import {FormControlClassProviderService} from '../../../forms-controls/services/form-control-class-provider.service';
import {FormsModule} from '@angular/forms';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipHoverDirective} from '../../../ui-controls/components/tooltip/tooltip-hover.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {ModalService} from 'app/ui-controls/services/modal.service';
import {MassUpdateSelectPlanComponent} from 'app/dynamic-form/components/mass-update-select-plan/mass-update-select-plan.component';
import {ModalContainerComponent} from 'app/ui-controls/components/modal/modal-container/modal-container.component';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {ModalBackdropComponent} from 'app/ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import { MassUpdateSelectPlansToolbarComponent } from 'app/plan/mass-update/components/mass-update-select-plans-toolbar/mass-update-select-plans-toolbar.component';
import {HelpTooltipStubComponent} from 'app/ui-controls/components/help-tooltip/help-tooltip.component.stub';
import {HelpTextEditorStubComponent} from 'app/ui-controls/components/help-text-editor/help-text-editor.component.stub';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingIconComponent} from 'app/ui-controls/components/loading-icon/loading-icon.component';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {PageAccessService} from 'app/core/services/page-access.service';
import {DataEntryService} from 'app/plan/plan-shared/abstract-service/data-entry.service';
import {IMassUpdateSelectPlanData} from 'app/plan/mass-update/interfaces/iMassUpdateSelectPlanData';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {MockNavigatorService} from 'app/navigation/services/navigator.service.mock';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {ExpandCollapseIconComponent} from 'app/ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import {CardStubComponent} from 'app/ui-controls/components/card/card.component.stub';
import {click} from 'assets/test/TestHelper';


describe('MassUpdateFormComponent', () => {
  let component: MassUpdateFormComponent;
  let fixture: ComponentFixture<MassUpdateFormTestWrapperComponent>;
  let parent: MassUpdateFormTestWrapperComponent;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FactoryTestModule, FormsModule],
      providers: [
        TooltipPositionService,
        TooltipService,
        ModalService,
        MassUpdateDataService,
        {provide: UserProfileService, useClass: MockUserProfileService},
        {provide: NavigatorService, useClass: MockNavigatorService},
        PageAccessService
      ]
    }).compileComponents().then( () => {
      fixture = TestBed.createComponent(MassUpdateFormTestWrapperComponent);
      parent = fixture.componentInstance;
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
    const questionElements = fixture.debugElement.queryAll(By.css('gpr-mass-update-question'));
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
    const questionElements = fixture.debugElement.queryAll(By.css('gpr-mass-update-question'));
    expect(questionElements).toBeTruthy();
    expect(questionElements.length).toEqual(newSection.questions.length);
  }));

  it('should check checkbox if checked is true', async(() => {
    component.areAllPlansSelected = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inEl = fixture.debugElement.query(By.css('.mass-update-checkbox'));
      expect(inEl.nativeElement.children[0].checked).toBe(true);
    });
  }));

  it('should check checkbox if checked is false', async(() => {
    component.areAllPlansSelected = false;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inEl = fixture.debugElement.query(By.css('.mass-update-checkbox'));
      expect(inEl.nativeElement.children[0].checked).toBe(false);
    });
  }));

  
  it('should check checkbox after the click', () => {
    let changeCheckboxMethod = fixture.debugElement.query(By.css('.mass-update-checkbox'));
    let changeValue = changeCheckboxMethod.nativeElement;
    changeValue.click();
    fixture.detectChanges();
    expect(component.areAllPlansSelected).toBeTruthy();
    
  });

  it('by default selectPlan button should be disabled', () => {
    expect(component.canSelectPlans).toBe(false);
  });

  it('when question checked count is greather than zero, button should enable', () => {
    component.checkedQuestionsCount = 2;
    fixture.detectChanges();
    component.countCheckedQuestions();
    expect(component.canSelectPlans).toBe(false);
  });


  @Component({
    selector: `gpr-test-wrapper`,
    template: `<gpr-mass-update-form [config]="config" [model]="model" [plan]="plan" [customerNumber]="customerNumber"></gpr-mass-update-form>`
  })
  class MassUpdateFormTestWrapperComponent implements OnInit {
    public config: FormConfig;
    public model: DataManager;
    public number = 1;
    public plan = {};
    public customerNumber = 1;
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
    imports: [CommonModule, FormsModule],
    exports: [MassUpdateFormComponent, DropDownControlComponent, MassUpdateQuestionComponent, TextInputComponent, MassUpdateSelectPlanComponent, LoadingIconComponent],
    declarations: [MassUpdateQuestionComponent, MassUpdateFormTestWrapperComponent, DropDownComponent, OutsideClickDirective,
    MassUpdateFormComponent,
    DynamicFormControlComponent,
    DropDownControlComponent,
    MassUpdateFormTestWrapperComponent,
    TextInputComponent,
    MinAttributeDirective,
    TooltipContentComponent, TooltipDirective, TooltipHoverDirective, MassUpdateSelectPlanComponent, ModalContainerComponent, IconComponent, ModalBackdropComponent, MassUpdateSelectPlansToolbarComponent, HelpTooltipStubComponent, HelpTextEditorStubComponent, LoadingIconComponent, ExpandCollapseIconComponent, CardStubComponent],
    entryComponents: [MassUpdateFormComponent, DropDownControlComponent, MassUpdateQuestionComponent, TextInputComponent, MassUpdateSelectPlanComponent, ModalContainerComponent, ModalBackdropComponent, MassUpdateSelectPlansToolbarComponent, LoadingIconComponent],
    providers: [FormControlClassProviderService]
  })
  class FactoryTestModule {}
});
