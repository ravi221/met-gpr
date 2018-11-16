import {Component, Injectable, Type} from '@angular/core';
import {CustomerStatus} from '../enums/customer-status';
import {ICustomer} from '../interfaces/iCustomer';
import {ISortOption} from '../../core/interfaces/iSortOption';
import {IUserPreference} from '../../core/interfaces/iUserPreference';
import {ModalRef} from '../../ui-controls/classes/modal-references';
import {ModalService} from '../../ui-controls/services/modal.service';
import {Observable} from 'rxjs/Observable';
import {PageAccessType} from '../../core/enums/page-access-type';
import {PageContextTypes} from '../../core/enums/page-context-types';
import {PlanCreateComponent} from '../../plan/components/plan-create/plan-create.component';
import {SortOptionsService} from '../../core/services/sort-options.service';
import {UserProfileService} from '../../core/services/user-profile.service';

/**
 * A service to help with the {@link CustomerLandingComponent}
 */
@Injectable()
export class CustomerLandingService {

  /**
   * Customer statuses that are not allowed for creating a new plan
   * @type {[CustomerStatus]}
   */
  private static readonly DISALLOWED_CUSTOMER_STATUSES: CustomerStatus[] = [
    CustomerStatus.CANCELLED
  ];

  /**
   * Customer statuses that are not allowed for creating a new plan
   * @type {[CustomerStatus]}
   */
  private static readonly DISALLOWED_PAGE_ACCESS_TYPES: PageAccessType[] = [
    PageAccessType.READ_ONLY,
    PageAccessType.NONE
  ];

  /**
   * Creates the customer landing service
   * @param {ModalService} _modalService
   * @param {SortOptionsService} _sortOptionsService
   * @param {UserProfileService} _userProfileService
   */
  constructor(private _modalService: ModalService,
              private _sortOptionsService: SortOptionsService,
              private _userProfileService: UserProfileService) {
  }

  /**
   * Indicates if the user is able to add a plan
   * @param {ICustomer} customer
   * @param {PageAccessType} pageAccessType
   * @returns {boolean}
   */
  public canAddPlan(customer: ICustomer, pageAccessType: PageAccessType): boolean {
    const status = customer.status;
    const hasDisallowedStatus = CustomerLandingService.DISALLOWED_CUSTOMER_STATUSES.includes(status);
    if (hasDisallowedStatus) {
      return false;
    }

    const hasDisallowedPageAccess = CustomerLandingService.DISALLOWED_PAGE_ACCESS_TYPES.includes(pageAccessType);
    return !hasDisallowedPageAccess;
  }

  /**
   * Initializes the sort options for the {@link CustomerLandingComponent}
   */
  public initSortOptions(): ISortOption[] {
    const userPreference = this._userProfileService.getUserPreferenceForPage(PageContextTypes.CUSTOMER_HOME);
    const sortOptions = this._sortOptionsService.getSortOptionsByPage(PageContextTypes.CUSTOMER_HOME);
    sortOptions.forEach((sortOption: ISortOption) => {
      sortOption.sortAsc = true;
      sortOption.active = false;
    });
    const activeSortOption = sortOptions.find((sortOption: ISortOption) => {
      return sortOption.sortBy === userPreference.sortBy;
    });
    activeSortOption.active = true;
    activeSortOption.sortAsc = userPreference.sortAsc;
    return sortOptions;
  }

  /**
   * Opens the add plan modal
   * @param {ICustomer} customer
   * @returns {ActiveModalRef}
   */
  public openAddPlanModal(customer: ICustomer): ModalRef {
    const componentType: Type<Component> = PlanCreateComponent as Type<Component>;
    const inputs: Map<string, any> = new Map<string, any>();
    inputs.set('customer', customer);
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'lg',
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'plan-create-container',
      title: 'Plan Set Up'
    });
  }

  /**
   * Saves a user's sort preference
   * @param {ISortOption} sortOption
   * @returns {Observable<void>}
   */
  public saveUserSortPreference(sortOption: ISortOption): Observable<void> {
    const userPreference: IUserPreference = {
      sortBy: sortOption.sortBy,
      sortAsc: sortOption.sortAsc,
      pageName: PageContextTypes.CUSTOMER_HOME,
      editDisplayCount: 0
    };
    return this._userProfileService.saveUserPreference(userPreference);
  }
}
