import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/**
 * A service to get the build version from a local json file, supplied by TFS
 */
@Injectable()
export class BuildVersionService {

  /**
   * The default build version
   */
  private static readonly DEFAULT_BUILD_VERSION: string = '-';

  /**
   * Creates the build version service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Gets the build version
   * @returns {Observable<string>}
   */
  public getBuildVersion(): Observable<string> {
    const url = 'assets/build-version.json';
    return this._http.get(url, {headers: {'X-Mock-Request': ''}})
      .map(response => response['buildVersion'])
      .catch(this._handleError);
  }

  /**
   * Returns a default build version in case of error
   * @returns {Observable<string>}
   * @private
   */
  private _handleError(): Observable<string> {
    return Observable.of(BuildVersionService.DEFAULT_BUILD_VERSION);
  }
}
