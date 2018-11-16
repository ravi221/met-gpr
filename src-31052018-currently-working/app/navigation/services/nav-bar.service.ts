import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {NavContextType} from '../enums/nav-context';

/**
 * Service to help with getting links for the nav bar
 */
@Injectable()
export class NavBarService {

  /**
   * An object to get the available links based on nav context type
   * @private
   */
  private static readonly NAV_LINK_VISIBILITY = {
    [NavContextType.CUSTOMER]: {
      'mainMenu': true,
      'back': false,
      'flags': true,
      'history': true,
      'logout': true,
      'search': true
    },
    [NavContextType.DEFAULT]: {
      'mainMenu': true,
      'back': false,
      'flags': false,
      'history': false,
      'logout': true,
      'search': true
    },
    [NavContextType.FLAGS]: {
      'mainMenu': false,
      'back': true,
      'flags': false,
      'history': false,
      'logout': false,
      'search': false
    },
    [NavContextType.HISTORY]: {
      'mainMenu': false,
      'back': true,
      'flags': true,
      'history': false,
      'logout': true,
      'search': true
    },
    [NavContextType.SEARCH]: {
      'mainMenu': false,
      'back': true,
      'flags': false,
      'history': false,
      'logout': false,
      'search': false
    }
  };

  /**
   * When the nav context is in an invalid state, only show logout
   */
  private static readonly INVALID_STATE = {
    'mainMenu': false,
    'back': false,
    'flags': false,
    'history': false,
    'logout': true,
    'search': false
  };

  /**
   * The default nav link
   */
  public static readonly DEFAULT_NAV_LINK_VISIBILITY = NavBarService.NAV_LINK_VISIBILITY[0];

  /**
   * Gets a list of available nav links based on the nav context
   * @param {NavContextType} navContext
   * @returns {any}
   */
  public getNavLinkVisibility(navContext: NavContextType): any {
    if (isNil(navContext)) {
      return NavBarService.INVALID_STATE;
    }
    return NavBarService.NAV_LINK_VISIBILITY[navContext];
  }
}
