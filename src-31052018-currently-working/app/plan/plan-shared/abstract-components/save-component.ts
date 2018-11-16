import DataManager from '../../../dynamic-form/classes/data-manager';
import {Input, OnChanges, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {PlanDataEntryService} from '../../plan-data-entry/services/plan-data-entry.service';
import {LoadingSpinnerService} from '../../../ui-controls/services/loading-spinner.service';
import StateConfig from '../../../forms-controls/config/state-config';
import {DataManagerSubscriptionType} from '../../../dynamic-form/enumerations/data-manager-subscription-type';
import {Locales} from '../../../core/enums/locales';
import {IAutoSaveMessage} from '../../plan-data-entry/interfaces/iAutoSaveMessage';
import {SaveUtility} from '../utilities/save-utility';
import {Observable} from 'rxjs/Observable';
import {DataEntryService} from '../abstract-service/data-entry.service';

/**
 * A generic class for save components. Extend this class to create a new component for saving data
 */
export abstract class SaveComponent implements OnInit, OnChanges {

  /**
   * Receives {@link DataManager} instance as model to subscribe to.
   */
  @Input() model: DataManager;

  /**
   * Receives the customer number for the plan
   */
  @Input() customerNumber: number;

  /**
   * receives the status of th plan
   */
  @Input() planStatus: string;

  /**
   * Receives the id of the plan
   */
  @Input() planId: string;


  /**
   * Indicator to autohide snackbar.
   * @type {boolean}
   */
  public autoHide = false;

  /**
   * Checks if save should be disabled
   * @type {boolean}
   */
  public isSaveDisabled: boolean = true;

  /**
   * Object that holds the current icon and message to display on the snackbar.
   */
  public message: IAutoSaveMessage = {
    icon: '',
    text: ''
  };

  /**
   * The form subscription.
   */
  protected _formSub: Subscription;

  /**
   * The subscription to section change.
   */
  protected _sectionSub: Subscription;

  /**
   * Subscription to the plan data service for saving
   */
  protected _saveServiceSubscription: Subscription;

  /**
   * indicates if the form is dirty. False by default
   * @type {boolean}
   * @private
   */
  protected _isDirty: boolean = false;

  /**
   * Formatting for date strings. Used with notifications
   * @type {{month: string; day: string; hour: string; minute: string; hour12: boolean}}
   * @private
   */
  protected readonly _DATE_OPTIONS: any = {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true};

  /**
   * Get instance of the data entry service and the loading psinner service
   * @param {PlanDataEntryService} _dataService
   * @param {LoadingSpinnerService} _loadingSpinnerService
   */
  constructor(protected _dataService: DataEntryService, protected _loadingSpinnerService: LoadingSpinnerService) {
  }

  /**
   * Call to set up save
   */
  ngOnInit() {
    this._setUpSave();
  }

  /**
   * On change, subscribe to the new form and section
   * @param $event
   */
  ngOnChanges($event) {
    if ($event.model && $event.model.currentValue) {
      this._formSub = this.model.subscribe(DataManagerSubscriptionType.FORM, (newState: StateConfig) => this.onFormChange(newState));
      this._sectionSub = this.model.subscribe(DataManagerSubscriptionType.SECTION, (sectionId: string) => this.onSectionChange(sectionId));
    }
  }

  /**
   * Handles the click event of save button.
   * Calls subscribes to the saveData method of the SaveUtility
   */
  public save(): void {
    if (this.model.isValid()) {
      this._saveServiceSubscription = this.getSaveObservable().subscribe( () => {
        const currentDate = new Date();
        this.message.text = `Saved at ${currentDate.toLocaleDateString(Locales.US, this._DATE_OPTIONS)}`;
        this.message.icon = 'done';
      }, () => {
        this.message.text = `Save failed`;
        this.message.icon = 'warning';
      });
    }
  }

  /**
   * Returns a subscription to the saveData method of the SaveUtility
   * @returns {Observable<any>}
   */
  public getSaveObservable(): Observable<any> {
    return SaveUtility.saveData(this.model, this.customerNumber, this.planStatus, this.planId, this._dataService);
  }

  /**
   * Sets up the save component. Override this method to add functionality to ngOnInit
   */
  protected _setUpSave(): void {
    if (this._dataService.canSave()) {
      this.isSaveDisabled = false;
    }
  }

  /**
   * Handles the observed event of the form subscription.
   * @param {StateConfig} newState
   */
  protected onFormChange(newState: StateConfig): void {
    this._isDirty = newState.isDirty;
  }

  /**
   * Handles the observed event of the section subscription.
   *
   * @param {string} sectionId
   */
  protected onSectionChange(sectionId: string): void {
    if (this._isDirty) {
      this.save();
    }
  }
}
