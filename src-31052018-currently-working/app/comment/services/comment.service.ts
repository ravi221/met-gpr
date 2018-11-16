import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpResponse, HttpParams} from '@angular/common/http';
import { FlagService } from 'app/flag/services/flag.service';
import { ICommentsRequest } from '../interfaces/iCommentsRequest';
import { ICommentsResponse } from '../interfaces/iCommentsResponse';
import { ISummaryFlagsResponse } from '../../flag/interfaces/iSummaryFlagsResponse';
import { ISummaryFlagsRequest } from 'app/flag/interfaces/iSummaryFlagsRequest';
import { PageAccessType } from 'app/core/enums/page-access-type';

/**
 * FlagService calls backend to retrieve list of plans and flags.
 */
@Injectable()
export class CommentService {

  /**
   * Customer statuses that are not allowed for creating a new flag/comment
   * @type {[CustomerStatus]}
   */
  private static readonly DISALLOWED_PAGE_ACCESS_TYPES: PageAccessType[] = [
    PageAccessType.READ_ONLY
  ];

  /**
   * Creates the comment service
   * @param {HttpClient} _http
   * @param {FlagService} _flagService
   */
  constructor(private _http: HttpClient,
              private _flagService: FlagService) {
  }

  /**
   * posts to create a new comment
   * @param commentRequest
   */
  public createComment(commentRequest: ICommentsRequest) {
    const url = '/comments/';
    return this._http.post(url, commentRequest)
      .map((response: HttpResponse<any>) => {
        if (!(response['responseCode'] === 'SUCCESS')) {
          return this._handleError(response.statusText);
        }
        const body = response;
        return body;
      }).catch(this._handleError);
  }

    public fetchSectionComments(commentRequest: ICommentsRequest): Observable<ICommentsResponse> {
      const url = `/comments/`;
      const params: HttpParams = this._mapCommentsRequestParams(commentRequest);
      return this._http.get(url, {params})
        .map((response: ICommentsResponse) => {
          return <ICommentsResponse>{
            comments: response.comments
          };
        }).catch(this._handleError);
    }

    /**
   * Maps the comment request object to http params
   * @returns {HttpParams}
   */
  private _mapCommentsRequestParams(commentRequest: ICommentsRequest): HttpParams {

    let httpParams = new HttpParams()
      .set('planId', `${commentRequest.planId}`);

    if (commentRequest.questionId) {
      httpParams = httpParams.set('questionId', commentRequest.questionId);
    }

    if (commentRequest.categoryId) {
      httpParams = httpParams.set('categoryId', commentRequest.categoryId);
    }

    if (commentRequest.sectionId) {
      httpParams = httpParams.set('sectionId', commentRequest.sectionId);
    }

    return httpParams;
  }

  /**
   * Indicates if the user is able to add a plan
   * @param {PageAccessType} pageAccessType
   * @returns {boolean}
   */
  public canAddFlagComment(pageAccessType: PageAccessType): boolean {
    const canAddCommentAndFlag = CommentService.DISALLOWED_PAGE_ACCESS_TYPES.includes(pageAccessType);
    return !canAddCommentAndFlag;
  }


  /**
   * error handling
   * @param error
   */
  private _handleError(error: any): Observable<any> {
    if (error && error.constructor && error.constructor.name === 'String') {
      return Observable.throw(error);
    }
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'An unidentified error occurred. Time to debug!';
    return Observable.throw(errMsg);
  }
}
