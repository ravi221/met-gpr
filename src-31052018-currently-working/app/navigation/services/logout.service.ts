import {EventEmitter, Injectable, Output} from '@angular/core';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {LogoutStates} from '../enums/logout-states';
import {CookieHelper} from '../../core/utilities/cookie-helper';

/**
 * An injectable login service, provides user logout and Session timeout
 */
@Injectable()
export class LogoutService {

  /**
   * The label to confirm logging out
   * @type {string}
   */
  static readonly LOGOUT_LABEL = 'Logout';

  /**
   * The label to cancel logging out
   * @type {string}
   */
  static readonly LOGOUT_CANCEL_LABEL = 'Dismiss';

  /**
   * The number of seconds before a user is prompted to logout, defaulted to 15 minutes
   * @type {number}
   */
  static readonly TIMEOUT_DURATION_SECONDS: number = 900;

  /**
   * The number of seconds before a user is logged out automatically if there is not ack for the timeout. defaulted to 10 minutes
   * @type {number}
   */
  static readonly IDLE_DURATION_SECONDS: number = 600;

  /** Number of seconds before before warning countdown shout starts default 5 minutes
   * @type {number}
   */
  static readonly IDLE_SHOUT_START_SECONDS: number = 300;

  /**
   * The countdown variable used to track how many seconds until logout
   */
  static countdown: number;

  /**
   * Indicates if the user is timed out
   * @type {boolean}
   * @private
   */
  private _isTimedOut: boolean = false;

  /**
   * Output decorator to handle user timeout
   * @type {EventEmitter<any>}
   */
  @Output() onTimeout: EventEmitter<string> = new EventEmitter();

  /**
   * An output event when the user is idle
   * @type {EventEmitter<any>}
   */
  @Output() onIdleWarning: EventEmitter<string> = new EventEmitter();

  /**
   * Creates the logout service
   * @param {Idle} _idle
   */
  constructor(private _idle: Idle) {
    this.initializeIdleTimer();
  }

  /**
   * Function to return idle timer status
   */
  public isUserIdleTimerRunning(): boolean {
    return this._idle.isRunning();
  }

  /**
   * Redirects the browser to the logout page
   */
  public logoutUser(): void {
    this._idle.stop();
    localStorage.clear();
    CookieHelper.deleteMetnetId();
    // window.location.href = '/public/logoff.htm' + '#/?t=' + new Date().getTime();
  }

  /**
   * Restart the idle timer.
   */
  public restartUserTimeout(): void {
    this._isTimedOut = false;
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this._idle.watch();
  }

  /**
   * Gets the log out modal options based on the type of logout, either triggered by the user, or by the application
   * due to timeout
   * @param {LogoutStates} logoutState
   */
  public getLogoutOptions(logoutState: LogoutStates): Map<string, string> {
    const isLogoutTriggeredByUser = logoutState === LogoutStates.BY_USER;
    if (isLogoutTriggeredByUser) {
      return new Map<string, string>()
        .set('confirmLabel', LogoutService.LOGOUT_LABEL)
        .set('cancelLabel', LogoutService.LOGOUT_CANCEL_LABEL)
        .set('question', 'Do you want to Logout?')
        .set('title', 'GPR Confirm Logout');
    }
    const question = `The system has been idle for more than ${LogoutService.TIMEOUT_DURATION_SECONDS / 60} minutes. Do you want to logout from the application?`;
    return new Map<string, string>()
      .set('confirmLabel', LogoutService.LOGOUT_LABEL)
      .set('cancelLabel', LogoutService.LOGOUT_CANCEL_LABEL)
      .set('question', question)
      .set('title', 'GPR User Session Timeout');
  }

  /**
   * Sets up the idle timer
   * Emits a timout event when the user is idle for  TIMEOUT_DURATION_SECONDS
   * If the no user action is  detected  for IDLE_DURATION_SECONDS after timeout is emitted the user is automatically loged out.
   */
  private initializeIdleTimer(): void {
    this._idle.setIdle(LogoutService.TIMEOUT_DURATION_SECONDS);
    this._idle.setTimeout(LogoutService.IDLE_DURATION_SECONDS);
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    /* Emit timeout event when the user idle timer expires*/
    this._idle.onIdleStart.subscribe(() => {
      if (!this._isTimedOut) {
        this._isTimedOut = true;
        this._idle.clearInterrupts();
        this.onTimeout.emit('User Timed out');
      }
    });

    /* Force logout user if no user response is deteceted after Idle warning */
    this._idle.onTimeout.subscribe(() => {
      this.logoutUser();
    });

    this._idle.onTimeoutWarning.subscribe((countdown) => {
      /* Start emitting final count down shout*/
      if (countdown <= LogoutService.IDLE_SHOUT_START_SECONDS) {
        this.onIdleWarning.emit(countdown);
      }
    });
    this._idle.watch();
  }
}
