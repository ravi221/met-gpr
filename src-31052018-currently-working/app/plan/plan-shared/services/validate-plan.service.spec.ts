import {Subscription} from 'rxjs/Subscription';
import {ValidatePlanService} from './validate-plan.service';
import * as ppcValidationData from '../../../../assets/test/validations/ppc-validations.mock.json';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {MockUserProfileService} from '../../../core/services/user-profile-service-mock';
import {PageAccessService} from '../../../core/services/page-access.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {LoadingSpinnerService} from '../../../ui-controls/services/loading-spinner.service';
import {IPlan} from '../interfaces/iPlan';
import FormConfig from '../../../dynamic-form/config/form-config';
import {NotificationTypes} from '../../../core/models/notification-types';
import {CompletionStatus} from '../../enums/completion-status';

describe('Validate Plan Service', () => {
  let subscription: Subscription;
  let validatePlanService: ValidatePlanService;
  let httpMock: HttpTestingController;
  let loadingSpinnerService: LoadingSpinnerService;
  describe('Get validation data', () => {

    beforeEach( () => {
      TestBed.configureTestingModule( {
        imports: [HttpClientTestingModule],
        providers: [ValidatePlanService, {provide: UserProfileService, useClass: MockUserProfileService}, PageAccessService, LoadingSpinnerService]
      });
      validatePlanService = TestBed.get(ValidatePlanService);
      httpMock = TestBed.get(HttpTestingController);
      loadingSpinnerService = TestBed.get(LoadingSpinnerService);
    });

    it('should make the correct response', () => {
      const spinnerStartSpy = spyOn(loadingSpinnerService, 'show');
      const spinnerStopSpy = spyOn(loadingSpinnerService, 'hide');
      subscription = validatePlanService.validate('123456789', 'PPC_CI', '0.45').subscribe((response) => {
        expect(response).toBeTruthy();
        expect(spinnerStopSpy).toHaveBeenCalled();
      });

      const method = 'GET';
      const url = `/plans/123456789/validate?ppcModelName=PPC_CI&ppcVersion=0.45`;

      const req = httpMock.expectOne((r) => {
        return r.method === method && r.urlWithParams === url;
      });

      req.flush(ppcValidationData, {status: 200, statusText: 'ok'});
      expect(spinnerStartSpy).toHaveBeenCalled();
    });

    it('should make the correct response', () => {
      subscription = validatePlanService.validate('123456789', 'PPC_CI', '0.45', 'setup').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const method = 'GET';
      const url = `/plans/123456789/validate?categoryId=setup&ppcModelName=PPC_CI&ppcVersion=0.45`;
      const req = httpMock.expectOne((r) => {
        return r.method === method && r.urlWithParams === url;
      });

      req.flush(ppcValidationData, {status: 200, statusText: 'ok'});

    });

    describe('getValidationNotification', () => {
      let plan: IPlan;
      let config: FormConfig;
      beforeEach( () => {
        config = new FormConfig(configuration);
        plan = {
          completionPercentage: 10,
          coverageId: '31',
          effectiveDate: '2017-01-01',
          flagsCount: 0,
          lastUpdatedTimestamp: '2016-07-01',
          planId: '1111131',
          planName: 'My Non-Plat Hyatt Plan',
          categories: [{
            categoryId: 'mockCategory',
            categoryName: 'Mock Category',
            completionPercentage: 50,
            statusCode: CompletionStatus.IN_PROGRESS,
            validationIndicator: null,
            errorCount: 0,
            sections: [{
              completedFieldCount: 1,
              completionPercentage: 33,
              sectionId: 'mockSection',
              sectionName: 'Mock Section',
              totalFieldCount: 3,
              validationIndicator: 'Yes',
              errorCount: 0
            }]
          }]
        };
      });
      describe('validation on entire coverage', () => {
        it('should return a notification with validation errors on the plan level', () => {
          const control = config.getControl('questionA');
          control.state.errors = ['I am an error'];
          const notification = validatePlanService.getValidationNotification(plan, config);
          expect(notification.type).toBe(NotificationTypes.ERROR);
          expect(notification.message).toBe(`There were errors while validating the attributes for ${plan}`);
        });

        it('should return a notification with no errors on the plan level', () => {
          const notification = validatePlanService.getValidationNotification(plan, config);
          expect(notification.type).toBe(NotificationTypes.SUCCESS);
          expect(notification.message).toBe(`Attribute for ${plan.planName} have been successfully validated`);
        });
      });

      describe('validation on sections', () => {
        beforeEach( () => {
          config.activateCategoryById('mockCategory');
          config.activateSectionById('mockSection');
        });
        it('should return a notification with errors on the section level', () => {
          const control = config.getControl('questionA');
          control.state.errors = ['I am an error'];
          const notification = validatePlanService.getValidationNotification(plan, config);
          expect(notification.type).toBe(NotificationTypes.ERROR);
          const activeCategory = plan.categories.find( (category) => category.categoryId === config.activeCategoryId);
          const activeSection = activeCategory.sections.find( (section) => section.sectionId === config.activeSectionId);
          expect(notification.message).toBe(`There were errors while validating the attributes for ${activeSection.sectionName}`);
        });

        it('should return a notification with no errors on the section level', () => {
          const notification = validatePlanService.getValidationNotification(plan, config);
          expect(notification.type).toBe(NotificationTypes.SUCCESS);
          const activeCategory = plan.categories.find( (category) => category.categoryId === config.activeCategoryId);
          const activeSection = activeCategory.sections.find( (section) => section.sectionId === config.activeSectionId);
          expect(notification.message).toBe(`Attributes for the plan section ${activeSection.sectionName} have been successfully validated`);
        });
      });


    });
  });
});
