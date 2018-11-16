import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IPPCResponse} from '../interfaces/iPPCResponse';
import {Observable} from 'rxjs/Observable';
import {IPPCValidation} from '../interfaces/iPPCValidation';
import {IPPCResponseSection} from '../interfaces/iPPCResponseSection';
import {IPPCResponseCategory} from '../interfaces/iPPCResponseCategory';
import {PageAccessType} from '../../../core/enums/page-access-type';
import {UserProfile} from '../../../core/models/user-profile';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {PageAccessService} from '../../../core/services/page-access.service';
import {LoadingSpinnerService} from '../../../ui-controls/services/loading-spinner.service';
import {NotificationTypes} from '../../../core/models/notification-types';
import {IPlan} from '../interfaces/iPlan';
import FormConfig from '../../../dynamic-form/config/form-config';
import {INotification} from '../../../core/interfaces/iNotification';

/**
 * Validates plans at the category and section level
 */
@Injectable()
export class ValidatePlanService {

  /**
   * Default question. Used when formItems are  empty
   * @type {{questionId: string; questionLabel: string; questionValue: string; errors: any[]}}
   */
  public readonly DEFAULT_QUESTION: IPPCValidation = {
    questionId: '1',
    questionLabel: 'Default Question',
    questionValue: 'default',
    errors: []
  };

  /**
   * The default section. Put in the array of sections if that array would be empty
   * @type {{sectionLabel: string; sectionId: string; errorCount: number; questions: IPPCValidation[]; totalFieldCount: number; completedFieldCount: number; completionPercentage: number}}
   */
  public readonly DEFAULT_SECTION: IPPCResponseSection = {
    sectionLabel: 'Default Section',
    sectionId: 'defaultSection',
    errorCount: 0,
    questions: [this.DEFAULT_QUESTION],
    totalFieldCount: 0,
    completedFieldCount: 0,
    completionPercentage: 0
  };

  /**
   * The default value for category. Used when the response has no categories
   * @type {{categoryLabel: string; categoryId: string; errorCount: number; sections: IPPCResponseSection[]}}
   */
  public readonly DEFAULT_CATEGORY: IPPCResponseCategory = {
    categoryLabel: 'Default Category',
    categoryId: 'defaultCategory',
    errorCount: 0,
    sections: [this.DEFAULT_SECTION]
  };

  /**
   * The default PPC response. Used when no ppc response is received
   * @type {{errorCount: number; planId: string; customerNumber: string; categories: IPPCResponseCategory[]}}
   */
  public readonly DEFAULT_RESPONSE: IPPCResponse = {
    planName: '',
    errorCount: 0,
    planId: 'default',
    customerNumber: '1',
    categories: [this.DEFAULT_CATEGORY]
  };

  /**
   * Creates the validate plan service
   * @param {HttpClient} _http
   * @param {UserProfileService} _userProfileService
   * @param {PageAccessService} _pageAccessService
   */
  constructor(private  _http: HttpClient,
              private _userProfileService: UserProfileService,
              private _pageAccessService: PageAccessService, private _spinner: LoadingSpinnerService) {
  }

  /**
   * Gets the Validation data for the plan. Conditionally queries based on the active category
   * @param {string} planId
   * @param {string} ppcModelName
   * @param {string} ppcVersion
   * @param {string} categoryId
   * @returns {Observable<IPPCResponse>}
   */
  public validate(planId: string, ppcModelName: string, ppcVersion: string, categoryId?: string): Observable<IPPCResponse> {
    this._spinner.show();
    let categoryParam = '';
    if (categoryId) {
      categoryParam = `categoryId=${categoryId}&`;
    }
    const url = `/plans/${planId}/validate?${categoryParam}ppcModelName=${ppcModelName}&ppcVersion=${ppcVersion}`;
    return this._http.get<IPPCResponse>(url).map((response) => {
      this._spinner.hide();
      if (!response) {
        return this.DEFAULT_RESPONSE;
      } else if (!response.categories) {
        response.categories = [this.DEFAULT_CATEGORY];
        return response;
      } else {
        response.categories.forEach((category) => {
          if (!category.sections) {
            category.sections = [this.DEFAULT_SECTION];
          } else {
            category.sections.forEach((section) => {
              if (!section.questions) {
                section.questions = [this.DEFAULT_QUESTION];
              }
            });
          }
        });
        return response;
      }
    }).catch(this._handleError);
  }

  /**
   * Checks if a user is able to call validate
   * @returns {boolean}
   */
  public canValidatePlan(): boolean {
    const currentUser: UserProfile = this._userProfileService.getCurrentUserProfile();
    const accessType = this._pageAccessService.getAccessType(currentUser.userRoles);
    const accessTypesAbleToValidate = [PageAccessType.FULL_STANDARD_ACCESS, PageAccessType.SUPER_USER, PageAccessType.LIMITED_STANDARD_ACCESS];
    return accessTypesAbleToValidate.includes(accessType);
  }

  public getValidationNotification(plan: IPlan, config: FormConfig): INotification {
    let validationMessage = `There were errors while validating the attributes for ${plan}`;
    let notificationType = NotificationTypes.ERROR;
    if (config.activeCategoryId && config.activeSectionId) {
      const activeCategory = plan.categories.find( (category) => category.categoryId === config.activeCategoryId);
      const activeSection = activeCategory.sections.find( (section) => section.sectionId === config.activeSectionId);
      const activeSectionHasErrors = config.getSection(config.activeSectionId).errorCount > 0;
      if (activeSectionHasErrors) {
        validationMessage = `There were errors while validating the attributes for ${activeSection.sectionName}`;
        notificationType = NotificationTypes.ERROR;
      } else {
        validationMessage = `Attributes for the plan section ${activeSection.sectionName} have been successfully validated`;
        notificationType = NotificationTypes.SUCCESS;
      }
    } else if (config.errorCount === 0) {
      validationMessage = `Attribute for ${plan.planName} have been successfully validated`;
      notificationType = NotificationTypes.SUCCESS;
    }
    return {id: 'validationNotification', type: notificationType, message: validationMessage};
  }

  /**
   * Private method to handle error/caught exceptions from observable.
   * @param error
   * @returns {ErrorObservable}
   */
  private _handleError(error: any) {
    if (this._spinner) {
      this._spinner.hide();
    }
    if (error && error.constructor && error.constructor.name === 'String') {
      return Observable.throw(error);
    }
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An error occurred processing this request.';
    return Observable.throw(errMsg);
  }
}
