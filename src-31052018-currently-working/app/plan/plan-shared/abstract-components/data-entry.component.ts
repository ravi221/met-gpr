import DataManager from '../../../dynamic-form/classes/data-manager';
import {IPlanCategory} from '../interfaces/iPlanCategory';
import {IPlan} from '../interfaces/iPlan';
import {Subscription} from 'rxjs/Subscription';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {Subject} from 'rxjs/Subject';
import {IPlanSection} from '../interfaces/iPlanSection';
import FormConfig from '../../../dynamic-form/config/form-config';
import {LogService} from '../../../core/services/log.service';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {ViewConfigDataService} from '../services/view-config-data.service';
import {ViewChild} from '@angular/core';
import {SaveComponent} from './save-component';

export abstract class DataEntryComponent {

   @ViewChild(SaveComponent) saveComponent: SaveComponent;
  /**
   * The data manager instance that is created from the data model.
   */
  public model: DataManager;
  /**
   * The form configuration instance of the view.
   */
  public config: FormConfig;
  /**
   * The name/text of the plan category that's currently visible.
   */
  public categoryName: string;

  /**
   * The category currently being viewed
   */
  public activeCategory: IPlanCategory;

  /**
   * The section currently being viewed
   */
  public activeSection: IPlanSection;

  /**
   * The customer who owns the plan
   */
  public customer: ICustomer;

  /**
   * The plan object
   */
  public plan: IPlan;

  /**
   * Used to send success or failure messages to the validation component
   * @type {Subject<boolean>}
   */
  public saveSubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Subscription to the view data service observable.
   */
  protected _viewSubscription: Subscription;

  /**
   * Subscription when dynamic form changes category
   */
  protected _categoryChangeSubscription: Subscription;

  /**
   * A subscription to the save method from the save component
   */
  protected _saveUtilitySubscription: Subscription;

  /**
   * Creates the Plan Entry component
   * @param {NavigatorService} _navigator
   * @param {ViewConfigDataService} _viewConfigDataService
   * @param {LogService} _log
   */
  constructor(protected _navigator: NavigatorService,
              protected _viewConfigDataService: ViewConfigDataService,
              protected _log: LogService) {
  }

  /**
   * Called when validating dirty data. Gets a subscription to the save observable from the autosave component and then sends a message to the validation component on success or failure
   */
  public onValidateDirtyData() {
    this._saveUtilitySubscription = this.saveComponent.getSaveObservable().subscribe(() => {
      this.saveSubject.next(true);
      this.config.state.isDirty = false;
    }, (error) => {
      this.saveSubject.next(false);
    });
  }

}
