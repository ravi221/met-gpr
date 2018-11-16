import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {IProgress} from '../interfaces/iProgress';
import {ITransaction} from '../interfaces/iTransaction';
import {Observable} from 'rxjs/Observable';
import Timer = NodeJS.Timer;

/**
 * Default settings for progress service.
 * @type {{startSize: number; autoIncrement: boolean}}
 */
const DEFAULT_SETTINGS = {
  startSize: 0,
  autoIncrement: true
};

/**
 * Default progress instance.
 * @type {{totalRequests: number; completedRequests: number; active: boolean; value: number; transactions: any[]}}
 */
const DEFAULT_PROGRESS: IProgress = {
  totalRequests: 0,
  completedRequests: 0,
  active: false,
  value: 0,
  transactions: []
};

/**
 * A service to track the progress of async API calls.
 */
@Injectable()
export class ProgressService {
  /**
   * The default settings for  progress
   * @type {{startSize: number; autoIncrement: boolean}}
   * @private
   */
  private _settings = {...DEFAULT_SETTINGS};

  /**
   * A timeout to track when to update the increment
   */
  private _incrementTimeout: Timer;

  /**
   * The progress object which tracks the number of requests in progress and completed
   */
  private _progress: IProgress;

  /**
   * A subject to watch the progress object
   * @type {Subject<IProgress>}
   * @private
   */
  private _progressSubject: Subject<IProgress> = new Subject<IProgress>();

  /**
   * An observable for external consumers to subscribe to for progress updates.
   * @type {Observable<IProgress>}
   */
  source: Observable<IProgress> = this._progressSubject.asObservable();

  /**
   * Creates the progress service and initializes the default progress.
   */
  constructor() {
    this._resetProgress();
  }

  /**
   * Adds a transaction, which represents a call to API.
   * @param {string} id
   * @param {string} url
   * @param {string} method
   */
  public addTransaction(id: string, url: string, method: string): void {
    const transaction: ITransaction = {id, url, method};
    this._progress.transactions.push(transaction);

    this._progress.totalRequests++;

    if (this._progress.active) {
      this._update(this._progress.completedRequests / this._progress.totalRequests);
    } else {
      this._start();
    }
  }

  /**
   * Removes a transaction, given an id
   * @param {string} id
   */
  public removeTransaction(id: string): void {
    if (id) {
      const index = this._progress.transactions.findIndex(tx => tx.id === id);
      if (index > -1) {
        this._progress.transactions.splice(index, 1);
      }
    }
    this._progress.completedRequests++;

    if (this._progress.totalRequests > this._progress.completedRequests) {
      this._update(this._progress.completedRequests / this._progress.totalRequests);
    } else {
      this._complete();
    }
  }

  /**
   * Starts the progress
   */
  private _start(): void {
    if (this._progress.active) {
      return;
    }
    this._update(this._settings.startSize);
  }

  /**
   * Updates the progress, given a specific value
   * @param {number} value
   */
  private _update(value: number): void {
    this._progress.active = value < 1;
    this._progress.value = value;

    // update subscribers with new percentage
    this._emitProgress();

    if (this._settings.autoIncrement && this._progress.active) {
      clearTimeout(this._incrementTimeout);
      this._incrementTimeout = setTimeout(() => {
        const incremented = this._increment();
        this._update(incremented);
      }, 250);
    }
  }

  /**
   * Finishes the progress
   */
  private _complete(): void {
    clearTimeout(this._incrementTimeout);
    this._update(1);
    this._resetProgress();
  }

  /**
   * Increments the progress amount, and returns its current progress amount
   * @returns {number}
   */
  private _increment(): number {
    if (!this._progress.active) {
      return;
    }

    let random = 0;
    const value = this._progress.value;

    if (value >= 0 && value < 0.25) {
      // start out between 3 - 6% increments
      random = (Math.random() * (5 - 3 + 1) + 3) / 100;
    } else if (value >= 0.25 && value < 0.65) {
      // increment between 0 - 3%
      random = (Math.random() * 3) / 100;
    } else if (value >= 0.65 && value < 0.90) {
      // increment between 0 - 2%
      random = (Math.random() * 2) / 100;
    } else if (value >= 0.90 && value < 0.99) {
      // finally, increment it .5 %
      random = 0.5;
    } else {
      // after 99%, don't increment:
      random = 0;
    }

    const newValue = value + random;

    if (newValue >= this._progress.value) {
      return newValue;
    } else {
      return this._progress.value;
    }
  }

  /**
   * Emits an event to return the progress
   */
  private _emitProgress(): void {
    this._progressSubject.next({...this._progress});
  }

  /**
   * Resets the progress.
   */
  private _resetProgress(): void {
    this._progress = {...DEFAULT_PROGRESS};
  }
}
