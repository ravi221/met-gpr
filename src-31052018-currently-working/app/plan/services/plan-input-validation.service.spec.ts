import {PlanInputValidationService} from 'app/plan/services/plan-input-validation.service';
import {IPlanInputTemplate} from '../interfaces/iPlanInputTemplate';

describe('PlanInputValidationService', () => {
  const service: PlanInputValidationService = new PlanInputValidationService();
  let planTemplate: IPlanInputTemplate;

  beforeEach(() => {
    planTemplate = {
      planNamePrefix: '',
      planNameBody: '',
      coverageId: '',
      coverageName: '',
      effectiveDate: '',
      customerNumber: 1,
      ppcModelName: '',
      hasErrors: false,
      errors: [],
      isComplete: false
    };
  });

  describe('Checking for completed fields', () => {
    describe('Plan Name Prefix', () => {
      it('should return false when empty', () => {
        planTemplate.planNamePrefix = '';
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });

      it('should return false when null', () => {
        planTemplate.planNamePrefix = null;
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });

      it('should return false when undefined', () => {
        planTemplate.planNamePrefix = undefined;
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });
    });

    describe('Plan Name Body', () => {
      it('should return false when empty', () => {
        planTemplate.planNamePrefix = '1';
        planTemplate.planNameBody = '';
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });

      it('should return false when null', () => {
        planTemplate.planNamePrefix = '1';
        planTemplate.planNameBody = null;
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });

      it('should return false when undefined', () => {
        planTemplate.planNamePrefix = '1';
        planTemplate.planNameBody = undefined;
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });
    });

    describe('Effective Date', () => {
      it('should return false when empty', () => {
        planTemplate.planNamePrefix = '1';
        planTemplate.planNameBody = '1';
        planTemplate.effectiveDate = '';
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });

      it('should return false when null', () => {
        planTemplate.planNamePrefix = '1';
        planTemplate.planNameBody = '1';
        planTemplate.effectiveDate = null;
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });

      it('should return false when undefined', () => {
        planTemplate.planNamePrefix = '1';
        planTemplate.planNameBody = '1';
        planTemplate.effectiveDate = undefined;
        expect(service.hasCompletedAllFields(planTemplate)).toBeFalsy();
      });
    });
  });

  describe('Getting plan template errors', () => {
    describe('Plan Name Errors', () => {
      it('should return an error when plan name prefix is too short', () => {
        planTemplate.planNamePrefix = '';
        planTemplate.planNameBody = 'body';
        planTemplate.effectiveDate = '01/01/2018';
        const customerEffectiveDate = '01/01/2000';

        const errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);
      });

      it('should return an error when plan name body is too short', () => {
        planTemplate.planNamePrefix = 'prefix';
        planTemplate.planNameBody = '';
        planTemplate.effectiveDate = '01/01/2018';
        const customerEffectiveDate = '01/01/2000';

        const errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);
      });

      it('should return an error when plan name prefix is nil', () => {
        planTemplate.planNamePrefix = null;
        planTemplate.planNameBody = 'body';
        planTemplate.effectiveDate = '01/01/2018';
        const customerEffectiveDate = '01/01/2000';

        let errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);

        planTemplate.planNamePrefix = undefined;
        errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);
      });

      it('should return an error when plan name body is nil', () => {
        planTemplate.planNamePrefix = 'prefix';
        planTemplate.planNameBody = null;
        planTemplate.effectiveDate = '01/01/2018';
        const customerEffectiveDate = '01/01/2000';

        let errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);

        planTemplate.planNameBody = undefined;
        errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);
      });


    });

    describe('Effective Date Errors', () => {
      it('should return an error when effective date is not 10 characters', () => {
        planTemplate.planNamePrefix = 'prefix';
        planTemplate.planNameBody = 'body';
        planTemplate.effectiveDate = '01/01/208';
        const customerEffectiveDate = '01/01/2000';

        const errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);
      });

      it('should return an error when effective date is less than the customer effective date', () => {
        planTemplate.planNamePrefix = 'prefix';
        planTemplate.planNameBody = 'body';
        planTemplate.effectiveDate = '01/01/2000';
        const customerEffectiveDate = '01/01/2001';

        const errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(1);
      });
      it('should not return an error when effective date is equal to the customer effective date', () => {
        planTemplate.planNamePrefix = 'prefix';
        planTemplate.planNameBody = 'body';
        planTemplate.effectiveDate = '01/01/2000';
        const customerEffectiveDate = '01/01/2000';

        const errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
        expect(errors.length).toBe(0);
      });
    });

    it('should return no errors when plan name prefix, plan name body, and effective date are valid', () => {
      planTemplate.planNamePrefix = 'prefix';
      planTemplate.planNameBody = 'body';
      planTemplate.effectiveDate = '01/01/2018';
      const customerEffectiveDate = '01/01/2001';

      const errors = service.getPlanTemplateErrors(planTemplate, customerEffectiveDate);
      expect(errors.length).toBe(0);
    });

  });

});
