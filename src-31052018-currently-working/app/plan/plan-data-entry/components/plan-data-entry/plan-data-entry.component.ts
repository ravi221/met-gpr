import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LogService} from '../../../../core/services/log.service';
import {Subscription} from 'rxjs/Subscription';
import {NavigatorService} from '../../../../navigation/services/navigator.service';
import {INavState} from '../../../../navigation/interfaces/iNavState';
import DataManager from '../../../../dynamic-form/classes/data-manager';
import {SubscriptionManager} from '../../../../core/utilities/subscription-manager';
import {AutoSaveComponent} from '../auto-save/auto-save.component';
import {ViewConfigDataService} from '../../../plan-shared/services/view-config-data.service';
import {Router} from '@angular/router';
import {IPlanEntryNavigate} from '../../../plan-shared/interfaces/iPlanEntryNavigate';
import {isNil} from 'lodash';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {Observable} from 'rxjs/Observable';
import {ICanComponentDeactivate} from '../../../../routing/interfaces/iCanComponentDeactivate';
import {DataEntryComponent} from '../../../plan-shared/abstract-components/data-entry.component';

/**
 * A plan data entry component class that allows a user to enter data for a particular plan.
 * This component leverages the {@link DynamicFormModule} to render out the attributes from view metadata.
 * For state management and rules execution, the component leverages the {@link DataManager} class.
 */
@Component({
  template: `
    <gpr-breadcrumbs></gpr-breadcrumbs>
    <div class="banner">
      <h4>{{categoryName}}</h4>
    </div>
    <div class="row">
      <div class="col-md-6">
        <gpr-dynamic-sections-list [config]="config" [model]="model"></gpr-dynamic-sections-list>
        <gpr-flag-card [customer]="customer"
                       [planId]="plan?.planId"
                       [categoryId]="categoryId"></gpr-flag-card>
      </div>
      <div class="col-md-18">
        <gpr-card>
          <div class="card">
            <gpr-dynamic-form
              [config]="config"
              [model]="model"
              [customerNumber]="customer?.customerNumber"
              [plan]="plan">
            </gpr-dynamic-form>
            <div *ngIf="config" class="row controls">
              <div class="pull-left">
                <gpr-plan-entry-navigation-button (navigate)="onNavigate($event)" [plan]="plan"
                                                  [currentCategory]="activeCategory"
                                                  [currentSection]="activeSection"
                                                  [direction]="'previous'"></gpr-plan-entry-navigation-button>
              </div>
              <div class="pull-right">
                <div class="pull-left">
                  <gpr-validate-plan [plan]="plan" [config]="config" [saveSubject]="saveSubject"
                                     (saveDirtyData)="onValidateDirtyData()"></gpr-validate-plan>
                </div>
                <div class="pull-left">
                  <gpr-plan-entry-navigation-button (navigate)="onNavigate($event)" [plan]="plan"
                                                    [currentCategory]="activeCategory"
                                                    [currentSection]="activeSection"
                                                    [direction]="'next'"></gpr-plan-entry-navigation-button>
                </div>
              </div>
            </div>
          </div>
        </gpr-card>
      </div>
      <gpr-auto-save [model]="model"
                     [customerNumber]="customer?.customerNumber"
                     [planStatus]="plan?.status"
                     [planId]="plan?.planId"></gpr-auto-save>
    </div>`,
  styleUrls: ['./plan-data-entry.component.scss']
})
export class PlanDataEntryComponent extends DataEntryComponent implements OnInit, OnDestroy, ICanComponentDeactivate {

  /**
   * A view of the autosave component. Used to call save when validating dirty data
   */
  @ViewChild(AutoSaveComponent) saveComponent: AutoSaveComponent;

  /**
   * category Id
   */
  public categoryId: string;

  /**
   * Subscription when dynamic form changes section
   */
  private _sectionChangeSubscription: Subscription;

  /**
   * Creates the Plan Entry component
   * @param {NavigatorService} _navigator
   * @param {ViewConfigDataService} _viewConfigDataService
   * @param {LogService} _log
   */
  constructor(_navigator: NavigatorService,
              _viewConfigDataService: ViewConfigDataService,
              _log: LogService,
              private router: Router,
              private _scrollService: ScrollService) {
    super(_navigator, _viewConfigDataService, _log);
  }

  /**
   * On init, subscribe to the navigation state
   */
  ngOnInit() {
    const navState = this._navigator.getNavigationState();
    this.categoryId = navState.data.planCategoryData.categoryId;
    this._initViewConfig(navState);
  }

  /**
   * On destroy, unsubscribe from any subscriptions
   */
  ngOnDestroy() {
    this.model.deleteSubscriptions();
    const subscriptions: Subscription[] = [this._viewSubscription, this._saveUtilitySubscription, this._sectionChangeSubscription, this._categoryChangeSubscription];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * Determines if all required fields for the view exist
   */
  private _canRenderView(navState: INavState): boolean {
    if (isNil(navState)) {
      return false;
    }

    const data = navState.data;
    if (isNil(data)) {
      return false;
    }

    return !isNil(data.customer) && !isNil(data.plan) && !isNil(data.formConfig);
  }

  /**
   * Overrides the canDeactivate method. Calls the save modal if data is dirty
   */
  public canDeactivate(): Observable<boolean> | boolean {
    return this.saveComponent.openSaveModal();
  }

  public onNavigate(nav: IPlanEntryNavigate): void {
    if (isNil(nav)) {
      return;
    }
    if (isNil(nav.newCategoryId) && isNil(nav.newSectionId)) {
      const sub = this._navigator.goToPlanHome(this.plan.planId).subscribe(() => {
        if (sub) {
          sub.unsubscribe();
        }
        this._scrollService.scrollToTop();
      });
    } else if (!isNil(nav.newSectionId)) {
      this.config.activateSectionById(nav.newSectionId);
      this._scrollService.scrollToTop();
    } else if (!isNil(nav.newCategoryId)) {
      const sub = this._navigator.goToPlanEntry(nav.newCategoryId).subscribe(() => {
        if (sub) {
          sub.unsubscribe();
        }
        this._scrollService.scrollToTop();
      });
    }
  }

  /**
   * Initialization method that takes in the current navState and fetches the corresponding view configuration.
   * Once view configuration is resolved, class variables are then initialized for UI to render.
   *
   * NOTE: We currently expect that only one category of the view configuration is returned as per the current design of the UI.
   *
   */
  private _initViewConfig(navState: INavState): void {
    if (!this._canRenderView(navState)) {
      return;
    }
    const snapshot = this.router.parseUrl(navState.url);
    let activeSectionId = '';
    if (snapshot.queryParams && snapshot.queryParams.sectionId) {
      activeSectionId = snapshot.queryParams.sectionId;
    }
    if (navState.params) {
      this.categoryId = navState.params.get('categoryId');
    }
    const data = navState.data;
    this.plan = data.plan;
    this.customer = data.customer;
    this.config = data.formConfig;
    this.config.activateCategoryById(this.categoryId);
    this.model = this.config.initializeModel(navState);
    this.categoryName = this.config.getCategory(this.categoryId).label;
    this.activeCategory = this.plan.categories.find((category) => category.categoryId === this.config.activeCategoryId);
    this.activeCategory.sections.forEach((section) => {
      const currentSection = this.config.getCategory(this.categoryId).sections.find((sectionToFind) => sectionToFind.sectionId === section.sectionId);
      currentSection.state.hasErrors = section.errorCount > 0;
      currentSection.state.isComplete = section.validationIndicator === 'Y';
    });
    if (!activeSectionId || activeSectionId === '') {
      activeSectionId = this.config.getCategory(this.categoryId).sections[0].sectionId;
    }
    this.activeSection = this.activeCategory.sections.find((sectionToFind) => sectionToFind.sectionId === activeSectionId);
    this.config.activateSectionById(activeSectionId);
    this._sectionChangeSubscription = this.config.onSectionChange.subscribe((newSectionId: string) => {
      this.activeSection = this.activeCategory.sections.find((sectionToFind) => sectionToFind.sectionId === newSectionId);
    });
    this._categoryChangeSubscription = this.config.onCategoryChange.subscribe((newCategoryId: string) => {
      this.activeCategory = this.plan.categories.find((category) => category.categoryId === newCategoryId);
    });
  }
}
