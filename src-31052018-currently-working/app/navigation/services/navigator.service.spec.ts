import {TestBed} from '@angular/core/testing';

import {NavigatorService} from './navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {NavigationExtras, Router, UrlTree} from '@angular/router';
import {INavState} from '../interfaces/iNavState';
import {LoadingSpinnerService} from '../../ui-controls/services/loading-spinner.service';

describe('NavigatorService', () => {
  let navigator: NavigatorService;
  let router: Router;
  const customerNumber = 1;
  const planId = '2';
  const categoryId = 'planInfo';
  const massUpdateCategoryId = 'newPlan';
  const sectionId = 'testSection';

  const verifySpy = (spy: jasmine.Spy, routeParams: any[] | string, options: NavigationExtras = undefined) => {
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(routeParams, options);
  };

  const setParam = (key: string, value: any) => {
    navigator['_navigationState'].params.set(key, value);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [NavigatorService, LoadingSpinnerService]
    });
    navigator = TestBed.get(NavigatorService);
    router = TestBed.get(Router);

    navigator['_navigationState'].params = new Map<string, any>();
    setParam('customerNumber', customerNumber);
    setParam('planId', planId);
  });

  describe('Utilities', () => {
    it('should parse a given URL into correct UrlTree', () => {
      const actual = navigator.parseUrl('root/parent/123/children/abc?query=test');
      expect(actual).toEqual(jasmine.any(UrlTree));
      expect(actual.queryParams.query).toEqual('test');
      expect(actual.root.children.primary.segments.length).toEqual(5);
    });

    it('should return the navigation state', () => {
      const navState: INavState = navigator.getNavigationState();
      expect(navState.params.get('customerNumber')).toBe(customerNumber);
      expect(navState.params.get('planId')).toBe(planId);
    });
  });

  describe('Navigation', () => {

    it('should call router to navigate to customer home', () => {
      const spy = spyOn(router, 'navigate').and.stub();
      navigator.goToCustomerHome(customerNumber);
      const routeParams = ['customers', customerNumber];
      verifySpy(spy, routeParams);
    });

    it('should call router to navigate to customer information home', () => {
      const spy = spyOn(router, 'navigate').and.stub();
      navigator.goToCustomerInfoHome(customerNumber);
      const routeParams = ['customers', customerNumber, 'information'];
      verifySpy(spy, routeParams);
    });

    it('should call router to navigate to history home', () => {
      const spy = spyOn(router, 'navigate').and.stub();
      navigator.goToHistoryHome();
      const routeParams = ['customers', customerNumber, 'history'];
      verifySpy(spy, routeParams);
    });

    it('should call router to navigate to search home', () => {
      const spy = spyOn(router, 'navigate').and.stub();
      navigator.goToSearchHome();
      const routeParams = ['/search'];
      verifySpy(spy, routeParams);
    });

    it('should call router to navigate to home', () => {
      const spy = spyOn(router, 'navigate').and.stub();
      navigator.goToHome();
      const routeParams = ['/home'];
      verifySpy(spy, routeParams);
    });

    it('should call router to navigate to a url', () => {
      const spy = spyOn(router, 'navigateByUrl').and.stub();
      const testUrl = 'test/url';
      navigator.goToUrl(testUrl);
      verifySpy(spy, testUrl);
    });

    describe('Plan Home', () => {
      it('should call router to navigate to plan home', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToPlanHome(planId);
        const routeParams = ['customers', customerNumber, 'plans', planId];
        verifySpy(spy, routeParams);
      });

      it('should not call router to navigate to plan home when customer number is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('customerNumber', null);
        navigator.goToPlanHome(planId);
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', undefined);
        navigator.goToPlanHome(planId);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('Mass Update Home', () => {
      it('should call router to navigate to mass update home', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToMassUpdateHome(customerNumber);
        const routeParams = ['customers', customerNumber, 'mass-update'];
        verifySpy(spy, routeParams);
      });
    });

    describe('Mass Update Entry', () => {
      it('should call router to navigate to mass update entry', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToMassUpdateEntry(massUpdateCategoryId);
        const routeParams = ['customers', customerNumber, 'mass-update', 'categories', massUpdateCategoryId ];
        verifySpy(spy, routeParams);
      });

      it('should not call router to navigate to mass update entry when customer number is null or undefined', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('customerNumber', null);
        navigator.goToMassUpdateEntry(massUpdateCategoryId);
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', undefined);
        navigator.goToMassUpdateEntry(massUpdateCategoryId);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('Flags', () => {
      it('should call router to navigate to flag home', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToFlagHome();
        const routeParams = ['customers', customerNumber, 'plans', planId, 'flags'];
        verifySpy(spy, routeParams);
      });

      it('should call router to navigate to flag home when plan id is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('planId', null);
        navigator.goToFlagHome();
        let routeParams = ['customers', customerNumber, 'flags'];
        verifySpy(spy, routeParams);

        setParam('planId', undefined);
        navigator.goToFlagHome();
        routeParams = ['customers', customerNumber, 'flags'];
        verifySpy(spy, routeParams);
      });

      it('should not call router to navigate to flag home when plan id and customer are nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('customerNumber', null);
        setParam('planId', null);
        navigator.goToFlagHome();
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', undefined);
        setParam('planId', undefined);
        navigator.goToFlagHome();
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', null);
        setParam('planId', undefined);
        navigator.goToFlagHome();
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', undefined);
        setParam('planId', null);
        navigator.goToFlagHome();
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('Plan Entry', () => {
      it('should call router to navigate to plan entry', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToPlanEntry(categoryId);
        const routeParams = ['customers', customerNumber, 'plans', planId, 'categories', categoryId];
        verifySpy(spy, routeParams);
      });

      it('should not call router to navigate to plan entry when customer number is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('customerNumber', null);
        navigator.goToPlanEntry(categoryId);
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', undefined);
        navigator.goToPlanEntry(categoryId);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not call router to navigate to plan entry when a plan id is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('planId', null);
        navigator.goToPlanEntry(categoryId);
        expect(spy).not.toHaveBeenCalled();

        setParam('planId', undefined);
        navigator.goToPlanEntry(categoryId);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('Plan Entry - From Nav', () => {
      it('should call router to navigate to plan entry from nav', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToPlanEntryFromNav(customerNumber, planId, categoryId);
        const routeParams = ['customers', customerNumber, 'plans', planId, 'categories', categoryId];
        verifySpy(spy, routeParams);
      });

      it('should not call router to navigate to plan entry from nav when customer number is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        navigator.goToPlanEntryFromNav(null, planId, categoryId);
        expect(spy).not.toHaveBeenCalled();

        navigator.goToPlanEntryFromNav(undefined, planId, categoryId);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not call router to navigate to plan entry from nav when a plan id is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        navigator.goToPlanEntryFromNav(customerNumber, null, categoryId);
        expect(spy).not.toHaveBeenCalled();

        navigator.goToPlanEntryFromNav(customerNumber, undefined, categoryId);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('Plan Entry Section', () => {
      it('should call router to navigate to plan entry section', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToPlanEntrySection(categoryId, sectionId);
        const routeParams = ['customers', customerNumber, 'plans', planId, 'categories', categoryId];
        const options = {queryParams: {sectionId}};
        verifySpy(spy, routeParams, options);
      });

      it('should not call router to navigate to plan entry section when customer number is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('customerNumber', null);
        navigator.goToPlanEntrySection(categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', undefined);
        navigator.goToPlanEntrySection(categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not call router to navigate to plan entry section when plan id is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('planId', null);
        navigator.goToPlanEntrySection(categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();

        setParam('planId', undefined);
        navigator.goToPlanEntrySection(categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('Plan Entry Section - From Nav', () => {
      it('should call router to navigate to plan entry section from nav', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToPlanEntrySectionFromNav(customerNumber, planId, categoryId, sectionId);
        const routeParams = ['customers', customerNumber, 'plans', planId, 'categories', categoryId];
        const options = {queryParams: {sectionId}};
        verifySpy(spy, routeParams, options);
      });

      it('should not call router to navigate to plan entry section from nav when customer number is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        navigator.goToPlanEntrySectionFromNav(null, planId, categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();

        navigator.goToPlanEntrySectionFromNav(undefined, planId, categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not call router to navigate to plan entry section from nav when plan id is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        navigator.goToPlanEntrySectionFromNav(customerNumber, null, categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();

        navigator.goToPlanEntrySectionFromNav(customerNumber, undefined, categoryId, sectionId);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('Plan Error Report', () => {
      it('should call router to navigate to plan error report', () => {
        const spy = spyOn(router, 'navigate').and.stub();
        navigator.goToPlanErrorReport(planId);
        const routeParams = ['customers', customerNumber, 'plans', planId, 'validations'];
        verifySpy(spy, routeParams);
      });

      it('should not call router to navigate plan error report when customer number is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        setParam('customerNumber', null);
        navigator.goToPlanErrorReport(planId);
        expect(spy).not.toHaveBeenCalled();

        setParam('customerNumber', undefined);
        navigator.goToPlanErrorReport(planId);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not call router to navigate plan error report when plan id is nil', () => {
        const spy = spyOn(router, 'navigate').and.stub();

        navigator.goToPlanErrorReport(null);
        expect(spy).not.toHaveBeenCalled();

        navigator.goToPlanErrorReport(undefined);
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('Navigator Subscription', () => {
    it('should subscribe to navigator service', () => {
      const subscriberId = 'test-id';
      navigator.subscribe(subscriberId, () => {
      });

      const subscriptions = navigator['_subscriptions'];
      const subscription = subscriptions.get(subscriberId);
      expect(subscription).toBeTruthy();
    });

    it('should unsubscribe to navigator service', () => {
      const subscriberId = 'test-id';
      navigator.subscribe(subscriberId, () => {
      });

      let subscriptions = navigator['_subscriptions'];
      let subscription = subscriptions.get(subscriberId);
      expect(subscription).toBeTruthy();

      navigator.unsubscribe(subscriberId);
      subscriptions = navigator['_subscriptions'];
      subscription = subscriptions.get(subscriberId);
      expect(subscription).toBeUndefined();
    });

    it('should not unsubscribe to navigator service with an invalid id', () => {
      const subscriberId = 'test-id';
      navigator.subscribe(subscriberId, () => {
      });

      let subscriptions = navigator['_subscriptions'];
      expect(subscriptions.size).toBe(1);

      navigator.unsubscribe('invalid');
      subscriptions = navigator['_subscriptions'];
      expect(subscriptions.size).toBe(1);
    });
  });

});
