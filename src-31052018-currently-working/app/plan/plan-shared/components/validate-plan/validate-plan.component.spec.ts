import {click} from '../../../../../assets/test/TestHelper';
import {Component, DebugElement, OnInit, ViewChild} from '@angular/core';
import * as configuration from '../../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../../assets/test/dynamic-form/data-manager.mock.json';
import FormConfig from '../../../../dynamic-form/config/form-config';
import {Subject} from 'rxjs/Subject';
import {IPlan} from '../../interfaces/iPlan';
import {ValidatePlanComponent} from './validate-plan.component';
import {async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ValidatePlanService} from '../../services/validate-plan.service';
import {ValidatePlanMockService} from '../../services/validate-plan.service.mock';
import {By} from '@angular/platform-browser';
import {CompletionStatus} from '../../../enums/completion-status';
import DataManager from '../../../../dynamic-form/classes/data-manager';
import {MockUserProfileService} from '../../../../core/services/user-profile-service-mock';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {PageAccessService} from '../../../../core/services/page-access.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {INavState} from '../../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../../assets/test/NavStateHelper';

describe('ValidatePlanComponent', () => {

  let wrapperComponent: ValidatePlanTestWrapperComponent;
  let component: ValidatePlanComponent;
  let fixture: ComponentFixture<ValidatePlanTestWrapperComponent>;
  let validateBtn: DebugElement;
  let navState: INavState = getNavStateForDataManager(data);
  beforeEach( async(() => {
    TestBed.configureTestingModule(  {
      declarations: [ValidatePlanComponent, ValidatePlanTestWrapperComponent],
      providers: [{provide: ValidatePlanService, useClass: ValidatePlanMockService}, {provide: UserProfileService, useClass: MockUserProfileService}, PageAccessService, NotificationService],
    }).compileComponents().then( () => {
      fixture = TestBed.createComponent(ValidatePlanTestWrapperComponent);
      wrapperComponent = fixture.componentInstance;
      component = fixture.debugElement.children[0].componentInstance;
      validateBtn = fixture.debugElement.query(By.css('.btn.btn-secondary'));
      fixture.detectChanges();
    });
  }));

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Validate button', () => {
    it('Should be disabled when isValidateButton is false', () => {
      component.isValidateDisabled = false;
      fixture.detectChanges();
      expect(validateBtn).toBeTruthy();
      expect(validateBtn.nativeElement.disabled).toBeFalsy();
    });

    it('Should not be disabled when isValidateButton is true', () => {
      component.isValidateDisabled = true;
      fixture.detectChanges();
      expect(validateBtn).toBeTruthy();
      expect(validateBtn.nativeElement.disabled).toBeTruthy();
    });

    it('Should be clickable', fakeAsync(() => {
      const spy = spyOn(component, 'validate');
      click(validateBtn, fixture);
      expect(spy).toHaveBeenCalled();
      discardPeriodicTasks();
    }));
  });

  describe('Saving on dirty data', () => {
    it('should emit an event', () => {
      const spy = spyOn(wrapperComponent, 'testSaveDirtyData');
     component.saveDirtyData.emit();
     expect(spy).toHaveBeenCalled();
    });
  });
  @Component({
    selector: `gpr-validate-plan-test-wrapper`,
    template: `<gpr-validate-plan [plan]="plan" [config]="config" [saveSubject] = "saveSubject" (saveDirtyData)="testSaveDirtyData()"></gpr-validate-plan>`
  })

  class ValidatePlanTestWrapperComponent implements OnInit {

    @ViewChild(ValidatePlanComponent) validatePlanComponent: ValidatePlanComponent;
    public plan: IPlan =  {
      planId: '1234',
      planName: 'Plan1',
      effectiveDate: '12/1/2015',
      ppcModelName: 'testModel',
      ppcModelVersion: '1',
      categories: [{
        categoryId: 'mockCategory',
        categoryName: 'Mock Category',
        completionPercentage: 50,
        sections: [],
        statusCode: CompletionStatus.IN_PROGRESS,
        validationIndicator: 'IN progress',
        errorCount: 0
      }]
    };
    public config: FormConfig = new FormConfig(configuration);
    public saveSubject: Subject<boolean> = new Subject<boolean>();
    public model: DataManager;

    ngOnInit() {
      this.config.activateCategoryById('mockCategory');
      this.config.activateSectionById('mockSection');
       this.model = this.config.initializeModel(navState);
    }

    public testSaveDirtyData(): void {
      this.saveSubject.next(true);
    }
  }
});

