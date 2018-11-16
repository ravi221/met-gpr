import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification.service';
import {LogService} from './log.service';
import {Guid} from '../utilities/guid';
import {ProgressService} from '../../ui-controls/services/progress.service';
import {environment} from '../../../environments/environment';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {NotificationTypes} from '../models/notification-types';
import {CookieHelper} from '../utilities/cookie-helper';
import {isNil, cloneDeep} from 'lodash';
import {LoadingSpinnerService} from '../../ui-controls/services/loading-spinner.service';

/**
 * An interceptor class that implements the {@link HttpInterceptor} interface to process outgoing requests and incoming responses.
 *
 * Since the original request is immutable, we perform a clone on the request as we modify it.
 *
 */
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  /**
   * Creates the http interceptor service
   * @param {LoadingSpinnerService} _loadingSpinnerService
   * @param {LogService} _log
   * @param {NotificationService} _notificationService
   * @param {ProgressService} _progressService
   */
  constructor(private _loadingSpinnerService: LoadingSpinnerService,
              private _log: LogService,
              private _notificationService: NotificationService,
              private _progressService: ProgressService) {
  }

  /**
   * Interceptor method to process the request and response of all HTTP calls that uses the {@link HttpClient} class.
   *
   * We use this to append default headers to the request prior to calling the backend and process the response for progress notification, error handling, etc.
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.headers.has('X-Mock-Request') ? request.url : `${environment.apiUrl}${request.url}`;
    const requestId = this.createRequestId(request);
    const headers = this.getRequestHeaders(requestId, request);
    const cloneRequest = request.clone({url: url, setHeaders: headers});
    return next
      .handle(cloneRequest)
      .do(event => {
        if (event instanceof HttpResponse) {
          this.completeRequest(requestId);
          this.afterRequest(event);
        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.completeRequest(requestId);
          this.onError(error);
        }
      });
  }

  /**
   * Creates the request id and adds a transaction to the progress service
   * @param {HttpRequest<any>} request
   * @returns {string}
   */
  private createRequestId(request: HttpRequest<any>): string {
    const requestId = Guid.create();
    this._progressService.addTransaction(requestId, request.url, request.method);
    return requestId;
  }

  /**
   * Gets the request headers to add to the outgoing request, these headers must be kept in sync with
   * the allowable headers inside of web.xml
   * If any headers are already set, then they will not be modified.
   * Right now only 'Content-Type' and 'Accept' are being checked.
   *
   * TODO: Need to add proper tokens and userId in request
   * @param {string} requestId
   * @param {HttpRequest<any>} request
   * @returns {{}}
   */
  getRequestHeaders(requestId: string, request?: HttpRequest<any>): {} {
    let headers = cloneDeep(environment.headers);
    if (!isNil(request)) {
      if (request.headers.has('Content-Type') &&
          !isNil(request.headers.get('Content-Type'))) {
            headers['Content-Type'] = request.headers.get('Content-Type');
      }
      if (request.headers.has('Accept') &&
          !isNil(request.headers.get('Accept'))) {
            headers['Accept'] = request.headers.get('Accept');
      }
    }
    headers['UserId'] = CookieHelper.getMetnetId();
    headers['X-Request-Id'] = requestId;
    return headers;
  }

  /**
   * Post-flight method to notify the progress service that transaction has ended.
   *
   * TODO: This needs refinement. Perhaps inject {@link AuthService} and update roles for current user?
   *
   * @param {string} requestId
   * @param {HttpResponse<any>} response
   */
  private afterRequest(response: HttpResponse<any>): void {
  }

  /**
   * Completes the request
   * @param {string} requestId
   */
  private completeRequest(requestId: string) {
    this._progressService.removeTransaction(requestId);
  }

  /**
   * Handles the rejected response of a HTTP request and adds a notification to notification service.
   * @param error
   */
  private onError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      // TODO: Redirect to logout?
      this._notificationService.addNotification(NotificationTypes.ERROR, 'Invalid authentication');
    }

    const errorMessage = this.buildErrorMessage(error);
    this._notificationService.addNotification(NotificationTypes.ERROR, errorMessage);
    this._loadingSpinnerService.hide();
    this._log.error(`API returned an error: ${errorMessage}`);
  }

  /**
   * Builds the error message given the error
   * @param error
   * @returns {string}
   */
  private buildErrorMessage(error: HttpErrorResponse): string {
    if (error && error.error && error.error.error) {
      const err = error.error.error;
      const code = err.code;
      const message = err.errors ? err.errors[0] : err.description;
      return `Error Code ${code} - ${message}`;
    }
    return `An unidentified error occurred while processing your request.`;
  }
}
