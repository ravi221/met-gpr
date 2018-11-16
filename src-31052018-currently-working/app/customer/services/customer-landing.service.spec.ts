import {CustomerLandingService} from './customer-landing.service';
import {TestBed} from '@angular/core/testing';
import {UserProfileService} from '../../core/services/user-profile.service';
import {MockUserProfileService} from '../../core/services/user-profile-service-mock';
import {mockCustomer} from '../../../assets/test/common-objects/customer.mock';
import {ICustomer} from '../interfaces/iCustomer';
import {PageAccessType} from '../../core/enums/page-access-type';
import {CustomerStatus} from '../enums/customer-status';
import {SortOptionsService} from '../../core/services/sort-options.service';
import {ModalService} from '../../ui-controls/services/modal.service';
import {MockModalService} from '../../ui-controls/services/modal.service.mock';
import {PageContextTypes} from '../../core/enums/page-context-types';
import {SortByOption} from '../../core/enums/sort-by-option';

describe('CustomerLandingService', () => {
  let service: CustomerLandingService;
  let customer: ICustomer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerLandingService,
        SortOptionsService,
        {provide: ModalService, useClass: MockModalService},
        {provide: UserProfileService, useClass: MockUserProfileService}
      ]
    });
    service = TestBed.get(CustomerLandingService);
    customer = mockCustomer;
  });

  describe('Can Add Plan', () => {
    it('should return false when customer status is \'CANCELLED\'', () => {
      customer.status = CustomerStatus.CANCELLED;
      expect(service.canAddPlan(customer, PageAccessType.READ_ONLY)).toBeFalsy();
    });

    it('should return false when page access type is \'READ_ONLY\'', () => {
      customer.status = CustomerStatus.APPROVED;
      expect(service.canAddPlan(customer, PageAccessType.READ_ONLY)).toBeFalsy();
    });

    it('should return false when page access type is \'NONE\'', () => {
      customer.status = CustomerStatus.APPROVED;
      expect(service.canAddPlan(customer, PageAccessType.NONE)).toBeFalsy();
    });

    it('should return true for an approved customer and super user access', () => {
      customer.status = CustomerStatus.APPROVED;
      expect(service.canAddPlan(customer, PageAccessType.SUPER_USER)).toBeTruthy();
    });
  });

  describe('Saving user sort preferences', () => {
    it('should call to save user sort preferences', () => {
      const spy = spyOn(TestBed.get(UserProfileService), 'saveUserPreference').and.stub();
      const sortBy = SortByOption.PLAN_NAME;
      const sortAsc = true;
      service.saveUserSortPreference({
        sortBy,
        sortAsc,
        active: true,
        label: 'Test'
      });
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        sortBy,
        sortAsc,
        pageName: PageContextTypes.CUSTOMER_HOME,
        editDisplayCount: 0
      });
    });
  });

  describe('Opening add plan modal', () => {
    it('should call to open the add plan modal', () => {
      const spy = spyOn(TestBed.get(ModalService), 'open').and.stub();
      service.openAddPlanModal(mockCustomer);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Initializing sort options', () => {
    it('should get the initial sort options for the customer landing page', () => {
      const userPreference = {
        pageName: PageContextTypes.CUSTOMER_HOME,
        sortBy: SortByOption.PLAN_NAME,
        sortAsc: false,
        displayCount: 0
      };
      const spy = spyOn(TestBed.get(UserProfileService), 'getUserPreferenceForPage').and.returnValue(userPreference);
      const sortOptions = service.initSortOptions();
      const activeSortOption = sortOptions.find(s => s.active);
      expect(activeSortOption.sortBy).toBe(userPreference.sortBy);
      expect(activeSortOption.sortAsc).toBe(userPreference.sortAsc);
    });
  });
});
