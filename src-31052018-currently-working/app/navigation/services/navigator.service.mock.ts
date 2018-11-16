import {INavState} from '../interfaces/iNavState';
import {NavContextType} from '../enums/nav-context';
import {NavigationExtras} from '@angular/router';

/**
 * A mock router class
 */
export class MockRouter {
  // navigate = jasmine.createSpy('navigate');
}
/**
 * Stub of the navigator service
 */
export class MockNavigatorService {
  public subscribe(subscriberId: string, handler: any): INavState {
    return {
      context: NavContextType.DEFAULT,
      url: 'url',
      params: null,
      data: null
    };
  }

  public unsubscribe(subscriberId: string): void {
  }

  public goToCustomerHome(customerNumber: number, options?: NavigationExtras): void {
  }

  public goToCustomerInfoHome(customerNumber: number, options?: NavigationExtras): void {
  }

  public goToMassUpdateHome(customerNumber: number, options?: NavigationExtras): void {
  }

  public goToPlanHome(planId: string, options?: NavigationExtras): void {

  }

  public goToCustomerPlanHome(planId: string, customerNumber: number, options?: NavigationExtras): void {

  }

  public goToFlagHome(options?: NavigationExtras): void {

  }

  public goToPlanEntry(categoryId: string, options?: NavigationExtras): void {

  }

  public goToMassUpdateEntry(categoryId: string, options?: NavigationExtras): void {

  }

  public goToPlanEntryFromNav(customerNumber: number, planId: string, categoryId: string, options?: NavigationExtras): void {

  }

  public goToPlanEntrySection(categoryId: string, sectionId: string, options?: NavigationExtras): void {

  }

  public goToPlanEntrySectionFromNav(customerNumber: number, planId: string, categoryId: string, sectionId: string, options?: NavigationExtras): void {

  }

  public goToPlanErrorReport(planId: string, options?: NavigationExtras): void {

  }

  public goToHistoryHome(options?: NavigationExtras): void {

  }

  public goToSearchHome(options?: NavigationExtras): void {
  }

  public goToHome(options?: NavigationExtras): void {
  }


  public getNavigationState(): INavState {
    return null;
  }

  public goToUrl(url: string, options?: NavigationExtras): void {

  }

  public parseUrl(url: string): void {
  }

}
