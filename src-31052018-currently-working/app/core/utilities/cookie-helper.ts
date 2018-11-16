/**
 * Class to abstract cookie CRUD operations
 */
export class CookieHelper {

  /**
   * The cookie name for storing the metnet id
   * @type {string}
   * @private
   */
  private static _metnetCookieName = 'metnetId';

  /**
   * Method used to retrieve metnet cookie
   */
  public static getMetnetId(): string {
    return CookieHelper.getCookie(CookieHelper._metnetCookieName);
  }

  /**
   * Method used to store metnetId in cookie
   * @param name metnetId to store in cookie
   */
  public static setMetnetId(name: string): void {
    CookieHelper.setCookie(CookieHelper._metnetCookieName, name);
  }

  /**
   * Method used to delete metnet cookie
   */
  public static deleteMetnetId(): void {
    CookieHelper.deleteCookie(CookieHelper._metnetCookieName);
  }

  /**
   * Method used to delete a cookie
   * @param name Cookie to delete
   */
  public static deleteCookie(name: string): void {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  /**
   * Method to retrieve cookie
   * @param name Name of cookie to return
   */
  public static getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;
    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  /**
   * Method used to create a cookie
   * @param name Name of cookie
   * @param value Value to store in cookie
   * @param expireDays Days in future to expire the cookie
   * @param path Path to store cookie
   */
  public static setCookie(name: string, value: string, expireDays?: number, path: string = '') {
    let d = new Date();
    if (expireDays) {
      d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    } else {
      d.setTime(d.getTime() + 3600000);
    }
    let expires = `expires=${d.toUTCString()}`;
    let cpath = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }
}
