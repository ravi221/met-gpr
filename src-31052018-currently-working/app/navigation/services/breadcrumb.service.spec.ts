import {BreadcrumbService} from './breadcrumb.service';
import {INavState} from '../interfaces/iNavState';
import {NavContextType} from '../enums/nav-context';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService = new BreadcrumbService();
  let navState: INavState;
  const customerName = 'Test Customer';
  const planName = 'Test Plan';

  it('should create empty breadcrumbs when nav state is nil', () => {
    let breadcrumbs = service.getBreadcrumbsFromNavState(null);
    expect(breadcrumbs.length).toBe(0);

    breadcrumbs = service.getBreadcrumbsFromNavState(undefined);
    expect(breadcrumbs.length).toBe(0);
  });

  it('should create breadcrumbs for home state', () => {
    navState = {
      context: NavContextType.DEFAULT,
      data: null,
      params: {},
      url: ''
    };
    const breadcrumbs = service.getBreadcrumbsFromNavState(navState);
    expect(breadcrumbs.length).toBe(1);

    const breadcrumb = breadcrumbs[0];
    expect(breadcrumb.label).toBe('Home');
    expect(breadcrumb.path).toBe('/');
  });

  it('should create breadcrumbs for customer home', () => {
    navState = {
      context: NavContextType.DEFAULT,
      data: null,
      params: {},
      url: '/customers/1'
    };
    const breadcrumbs = service.getBreadcrumbsFromNavState(navState);
    expect(breadcrumbs.length).toBe(1);

    const breadcrumb = breadcrumbs[0];
    expect(breadcrumb.label).toBe('Home');
    expect(breadcrumb.path).toBe('/');
  });

  it('should create bread crumbs for plan home page', () => {
    navState = {
      context: NavContextType.CUSTOMER,
      data: {customer: {customerName}},
      params: {},
      url: '/customers/1/plans/2'
    };
    const breadcrumbs = service.getBreadcrumbsFromNavState(navState);
    expect(breadcrumbs.length).toBe(2);

    let breadcrumb = breadcrumbs[0];
    expect(breadcrumb.label).toBe('Home');
    expect(breadcrumb.path).toBe('/');

    breadcrumb = breadcrumbs[1];
    expect(breadcrumb.label).toBe(customerName);
    expect(breadcrumb.path).toBe('customers/1');
  });

  it('should create bread crumbs for plan entry page', () => {
    navState = {
      context: NavContextType.CUSTOMER,
      data: {customer: {customerName}, plan: {planName}},
      params: {},
      url: '/customers/1/plans/2/categories/planInfo'
    };
    const breadcrumbs = service.getBreadcrumbsFromNavState(navState);
    expect(breadcrumbs.length).toBe(3);

    let breadcrumb = breadcrumbs[0];
    expect(breadcrumb.label).toBe('Home');
    expect(breadcrumb.path).toBe('/');

    breadcrumb = breadcrumbs[1];
    expect(breadcrumb.label).toBe(customerName);
    expect(breadcrumb.path).toBe('customers/1');

    breadcrumb = breadcrumbs[2];
    expect(breadcrumb.label).toBe(planName);
    expect(breadcrumb.path).toBe('customers/1/plans/2');
  });

  it('should create bread crumbs for flags home page for a customer', () => {
    navState = {
      context: NavContextType.CUSTOMER,
      data: {customer: {customerName}, plan: {planName}},
      params: {},
      url: '/customers/1/flags'
    };
    const breadcrumbs = service.getBreadcrumbsFromNavState(navState);
    expect(breadcrumbs.length).toBe(2);

    let breadcrumb = breadcrumbs[0];
    expect(breadcrumb.label).toBe('Home');
    expect(breadcrumb.path).toBe('/');

    breadcrumb = breadcrumbs[1];
    expect(breadcrumb.label).toBe(customerName);
    expect(breadcrumb.path).toBe('customers/1');
  });

  it('should create bread crumbs for flags home page for a plan', () => {
    navState = {
      context: NavContextType.CUSTOMER,
      data: {customer: {customerName}, plan: {planName}},
      params: {},
      url: '/customers/1/plans/2/flags'
    };
    const breadcrumbs = service.getBreadcrumbsFromNavState(navState);
    expect(breadcrumbs.length).toBe(3);

    let breadcrumb = breadcrumbs[0];
    expect(breadcrumb.label).toBe('Home');
    expect(breadcrumb.path).toBe('/');

    breadcrumb = breadcrumbs[1];
    expect(breadcrumb.label).toBe(customerName);
    expect(breadcrumb.path).toBe('customers/1');

    breadcrumb = breadcrumbs[2];
    expect(breadcrumb.label).toBe(planName);
    expect(breadcrumb.path).toBe('customers/1/plans/2');
  });

});
