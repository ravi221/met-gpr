import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

/**
 * A service to allow for logging of events.
 * LogService is available as an injectable class, with methods to log different levels of logs to the console.
 * TODO: Perhaps implement a way to log errors server side?
 */
@Injectable()
export class LogService {
  /**
   * Private read-only variable to determine if logging to console should be enabled.
   * @type {boolean}
   * @private
   */
  private readonly _enabled = !environment.production;

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * Outputs a debug level statement to console.
   * @returns {()}
   */
  public get debug() {
    return this._enabled ? console.debug.bind(console) : this._noop;
  }

  /**
   * Outputs an info level statement to console.
   * @returns {()}
   */
  public get info() {
    return this._enabled ? console.info.bind(console) : this._noop;
  }

  /**
   * Outputs a log statement to console.
   * @returns {()}
   */
  public get log() {
    return this._enabled ? console.log.bind(console) : this._noop;
  }

  /**
   * Outputs a warning level statement to console.
   * @returns {()}
   */
  public get warn() {
    return this._enabled ? console.warn.bind(console) : this._noop;
  }

  /**
   * Ouputs an error level statement to console.
   * @returns {()}
   */
  public get error() {
    return this._enabled ? console.error.bind(console) : this._noop;
  }

  /**
   * Private noop method.
   */
  private _noop() {
  }

}
