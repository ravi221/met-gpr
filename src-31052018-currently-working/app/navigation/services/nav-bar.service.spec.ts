import {NavBarService} from './nav-bar.service';
import {NavContextType} from '../enums/nav-context';

describe('NavBarService', () => {
  let service: NavBarService;

  beforeEach(() => {
    service = new NavBarService();
  });

  it('should show main menu, search, and logout when nav context is \'DEFAULT\'', () => {
    const showNavLink = service.getNavLinkVisibility(NavContextType.DEFAULT);
    expect(showNavLink.mainMenu).toBeTruthy();
    expect(showNavLink.back).toBeFalsy();
    expect(showNavLink.flags).toBeFalsy();
    expect(showNavLink.history).toBeFalsy();
    expect(showNavLink.logout).toBeTruthy();
    expect(showNavLink.search).toBeTruthy();
  });

  it('should show main menu, flags, history, search, and logout when nav context is \'CUSTOMER\'', () => {
    const showNavLink = service.getNavLinkVisibility(NavContextType.CUSTOMER);
    expect(showNavLink.mainMenu).toBeTruthy();
    expect(showNavLink.back).toBeFalsy();
    expect(showNavLink.flags).toBeTruthy();
    expect(showNavLink.history).toBeTruthy();
    expect(showNavLink.logout).toBeTruthy();
    expect(showNavLink.search).toBeTruthy();
  });

  it('should show back button when nav context is \'SEARCH\'', () => {
    const showNavLink = service.getNavLinkVisibility(NavContextType.SEARCH);
    expect(showNavLink.mainMenu).toBeFalsy();
    expect(showNavLink.back).toBeTruthy();
    expect(showNavLink.flags).toBeFalsy();
    expect(showNavLink.history).toBeFalsy();
    expect(showNavLink.logout).toBeFalsy();
    expect(showNavLink.search).toBeFalsy();
  });

  it('should show back button when nav context is \'FLAGS\'', () => {
    const showNavLink = service.getNavLinkVisibility(NavContextType.FLAGS);
    expect(showNavLink.mainMenu).toBeFalsy();
    expect(showNavLink.back).toBeTruthy();
    expect(showNavLink.flags).toBeFalsy();
    expect(showNavLink.history).toBeFalsy();
    expect(showNavLink.logout).toBeFalsy();
    expect(showNavLink.search).toBeFalsy();
  });

  it('should show back button when nav context is \'HISTORY\'', () => {
    const showNavLink = service.getNavLinkVisibility(NavContextType.HISTORY);
    expect(showNavLink.mainMenu).toBeFalsy();
    expect(showNavLink.back).toBeTruthy();
    expect(showNavLink.flags).toBeTruthy();
    expect(showNavLink.history).toBeFalsy();
    expect(showNavLink.logout).toBeTruthy();
    expect(showNavLink.search).toBeTruthy();
  });

  it('should show logout when nav context is undefined', () => {
    const showNavLink = service.getNavLinkVisibility(undefined);
    expect(showNavLink.mainMenu).toBeFalsy();
    expect(showNavLink.back).toBeFalsy();
    expect(showNavLink.flags).toBeFalsy();
    expect(showNavLink.history).toBeFalsy();
    expect(showNavLink.logout).toBeTruthy();
    expect(showNavLink.search).toBeFalsy();
  });

  it('should show logout when nav context is null', () => {
    const showNavLink = service.getNavLinkVisibility(null);
    expect(showNavLink.mainMenu).toBeFalsy();
    expect(showNavLink.back).toBeFalsy();
    expect(showNavLink.flags).toBeFalsy();
    expect(showNavLink.history).toBeFalsy();
    expect(showNavLink.logout).toBeTruthy();
    expect(showNavLink.search).toBeFalsy();
  });
});
