import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import CategoryConfig from 'app/dynamic-form/config/category-config';
import FormConfig from 'app/dynamic-form/config/form-config';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {PageAccessService} from '../../../core/services/page-access.service';
import {DataEntryService} from '../../plan-shared/abstract-service/data-entry.service';
import {IMassUpdateSelectPlanData} from 'app/plan/mass-update/interfaces/iMassUpdateSelectPlanData';
import {IMassUpdateSelectPlanRequest} from 'app/plan/mass-update/interfaces/iMassUpdateSelectPlanRequest';
import QuestionConfig from 'app/dynamic-form/config/question-config';
import {IMassUpdateCheckedPlansResponse} from 'app/plan/mass-update/interfaces/iMassUpdateCheckedPlansResponse';
import {isNil} from 'lodash';
import {ResponseCodes} from 'app/core/enums/response-codes';

/**
 * Mass update data service is to retrieve category information using ppcmodelname, ppcversion and categoryId.
 */
@Injectable()
export class MassUpdateDataService extends DataEntryService {

   /**
    * Indicates the list of selected question ids
	*/
   public questions: QuestionConfig[] = [];

   /**
    * Indicates the list questionIds
	*/
   public questionIds: string[] = [];

   /**
    * Indicates the list of selected question ids
	*/
   public productResponse: IMassUpdateCheckedPlansResponse[] = [];

   /**
    * Storing the index of selected mass update category and using that to display update selected plans response on particulr category label
	*/
   public selectedCategoryIndex: number;

  /**
   * Creates the mass update data service
   * @param {HttpClient} _http
   */
  constructor( _http: HttpClient,  _userProfileService: UserProfileService,  _pageAccessService: PageAccessService) {
    super(_http, _userProfileService, _pageAccessService);
  }

  /**
   * Fetches a view configuration for a mass category.
   * @param {string} ppcModelName: The coverage id to look up the view metadata by.
   * @param {string} ppcVersion: The version fo the model
   * @param {string} categoryId: unique category id.
   * @returns {Observable<CategoryConfig>}
   */
  public getViewByMassCategory(ppcModelName: string, ppcVersion: number, categoryId: string): Observable<FormConfig> {
    const url = `/metadata/${ppcModelName}/${ppcVersion}`;
    return this._http.get<any>(url)
      .map((response) => <FormConfig>response)
      .catch(this._handleError);
  }
  /**
   * Updates a plan by it's unique id.
   * @param {string} planId: The unique id of the plan.
   * @param {any} payload: The plan data to update.
   * @returns {Observable<any>}
   */
  public save(planId: string, payload: any): Observable<any> {
    // TODO add route for MUT
    const url = `this is where the route for MUT goes`;
    return this._http.put(url, payload)
      .map((response: any) => {
        return response;
      })
      .catch(this._handleError);
  }

  /**
   * Fetches selected plans for mass update
   */
  public getSelectedPlans_old(customerNumber: number): Observable<any> {
    const url = `/customers/${customerNumber}/plans/mut`;
    this.questions.filter((question) => {
     const questionIndex = this.questionIds.indexOf(question.label);
     if (question.isChecked && questionIndex === -1) {
       this.questionIds.push(question.label);
     }
    });
    const categoryId = 'newPlan';
    let payload = {
      'questionIds': this.questionIds,
      'mutCategoryID' : 'newPlan'
    };
    // return this._http.get(`/assets/test/mass-update/mut-select-plan.json`, {headers: {'X-Mock-Request': ''}})
    return this._http.post(url, payload)
    .map((response: IMassUpdateSelectPlanData) => {
        return response;
    }).catch(this._handleError);
  }

  public getSelectedPlanNames(): Observable<any> {
    return this._http.get(`/assets/test/mass-update/mut-selected-plans.json`, {headers: {'X-Mock-Request': ''}})
    .map((response: any) => {
      this.productResponse = response;
    });
  }
  
  
  
  public getSelectedPlans(customerNumber: number): Observable<IMassUpdateSelectPlanData> {
    this.questions.filter((question) => {
     const questionIndex = this.questionIds.indexOf(question.label);
     if (question.isChecked && questionIndex === -1) {
       this.questionIds.push(question.label);
     }
    });
	const categoryId = 'newPlan';
    const url = `/customers/${customerNumber}/plans/mut`;
    let payload = {
      questionIds: ["typeofBusiness","originalPlanEffectiveDate","multiProductPremiumDiscount"],
      mutCategoryID: 'newPlan'
    };
    return this._http.post(url, payload)
      .map((response: IMassUpdateSelectPlanData) => {
        return response;
      }).catch(this._handleError);
  }
  
  
  
  

  public isCategorySelected(): number {
    return this.selectedCategoryIndex;
  }
  public getCategorySelectedIndex(categorySelectedIndex: number): void {
    this.selectedCategoryIndex = categorySelectedIndex;
  }
   
  /**
   * Method checks if response from service was valid
   * @param response response to validate
   */
  private _isSuccessfulResponse(response: any): boolean {
    if (!isNil(response)) {
      if (!isNil(response.headers) && response.headers.get('Content-Type') === 'application/pdf' &&
        response.status === 200) {
        return true;
      } else if (!isNil(response.responseMessage) &&
        response.responseMessage.toUpperCase() === ResponseCodes.SUCCESS) {
        return true;
      } else if (!isNil(response.responseCode) &&
        response.responseCode.toUpperCase() === ResponseCodes.SUCCESS) {
        return true;
      }
    }
    return false;
  }
}
