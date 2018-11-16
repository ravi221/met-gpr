import {Injectable} from '@angular/core';
import {IPlanInputTemplate} from 'app/plan/interfaces/iPlanInputTemplate';
import {isNil} from 'lodash';

/**
 * This service is used to validate the fields on the plan input page
 */
@Injectable()
export class PlanInputValidationService {

  /**
   * A regular expression to validate the plan name
   * @type {RegExp}
   */
  private static readonly VALIDATE_PLAN_NAME_REGEX: RegExp = new RegExp(`^[^"]*$`);

  /**
   * An error message for showing an invalid plan name
   * @type {string}
   */
  private static readonly INVALID_PLAN_NAME = 'The plan name contains invalid characters. Invalid characters include: "';

  /**
   * An error message for showing an invalid date
   * @type {string}
   */
  private static readonly INVALID_DATE = 'The date you have entered is invalid, please use the calendar to select a valid date';

  /**
   * Gets a list of errors for a plan template
   * @param {IPlanInputTemplate} planTemplate
   * @param {string} customerEffectiveDate
   * @returns {string[]}
   */
  public getPlanTemplateErrors(planTemplate: IPlanInputTemplate, customerEffectiveDate: string): string[] {
    let errors: string[] = [];
    const hasValidPlanName = this._hasValidPlanName(planTemplate);
    if (!hasValidPlanName) {
      errors.push(PlanInputValidationService.INVALID_PLAN_NAME);
    }

    const hasValidEffectiveDate = this._hasValidEffectiveDate(planTemplate.effectiveDate, customerEffectiveDate);
    if (!hasValidEffectiveDate) {
      errors.push(PlanInputValidationService.INVALID_DATE);
    }
    return errors;
  }

  /**
   * Checks to see if all fields are filled in before validating
   * @param {IPlanInputTemplate} planTemplate
   * @returns {boolean}
   */
  public hasCompletedAllFields(planTemplate: IPlanInputTemplate): boolean {
    const planNamePrefix = planTemplate.planNamePrefix;
    if (!planNamePrefix) {
      return false;
    }

    const planNameBody = planTemplate.planNameBody;
    if (!planNameBody) {
      return false;
    }

    const effectiveDate = planTemplate.effectiveDate;
    return !!effectiveDate;
  }

  /**
   * Validates the effective date for a plan template
   * @param {string} effectiveDate
   * @param {string} customerEffectiveDate
   * @returns {boolean}
   */
  private _hasValidEffectiveDate(effectiveDate: string = '', customerEffectiveDate: string = ''): boolean {
    const hasValidEffectiveDateLength = effectiveDate.length === 10;
    if (!hasValidEffectiveDateLength) {
      return false;
    }
    const effectiveDateObj = new Date(effectiveDate);
    const customerEffectiveDateObj = new Date(customerEffectiveDate);
    return effectiveDateObj >= customerEffectiveDateObj;
  }

  /**
   * Validates that the plan name prefix and body
   * @param {IPlanInputTemplate} planTemplate
   * @returns {boolean}
   * @private
   */
  private _hasValidPlanName(planTemplate: IPlanInputTemplate): boolean {
    const planNamePrefix = planTemplate.planNamePrefix;
    const isPlanNamePrefixEmpty = isNil(planNamePrefix) || planNamePrefix.length === 0;
    if (isPlanNamePrefixEmpty) {
      return false;
    }

    const planNameBody = planTemplate.planNameBody;
    const isPlanNameBodyEmpty = isNil(planNameBody) || planNameBody.length === 0;
    if (isPlanNameBodyEmpty) {
      return false;
    }

    return this._hasValidPlanNameBody(planNameBody);
  }

  /**
   * Checks if the plan name prefix has an invalid character
   * @param {string} planNameBody
   * @returns {boolean}
   * @private
   */
  private _hasValidPlanNameBody(planNameBody: string): boolean {
    return PlanInputValidationService.VALIDATE_PLAN_NAME_REGEX.test(planNameBody);
  }
}
