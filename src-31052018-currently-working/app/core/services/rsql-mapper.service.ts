import {Injectable} from '@angular/core';
import {forOwn, isArray} from 'lodash';
import {RsqlOperators} from '../enums/rsql-operators';

/**
 * Maps a filter object to a rSQL query
 */
@Injectable()
export class RsqlMapperService {

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * Maps a given object to rsql
   * @param objectToMap The object to map to a rsql string
   * @returns {string} The newly create rsql query string
   */
  public mapObjectToRsql(objectToMap: any): string {
    let rsql = '';
    forOwn(objectToMap, (value, key) => {
      if (isArray(value)) {
        rsql += this._createRsqlArray(value, key);
      } else {
        rsql += this._createRsql(value, key, RsqlOperators.EQUAL);
      }
      rsql += RsqlOperators.AND;
    });
    return rsql.substring(0, rsql.length - 1);
  }

  /**
   * Creates the rSql string
   * @param value The value of the property
   * @param {string} key The name for the property
   * @param {RsqlOperators} operator Which operator to use
   * @returns {string} The corresponding rSql string
   * @private
   */
  private _createRsql(value: any, key: string, operator: RsqlOperators): string {
    return `${key}${operator}${value}`;
  }

  /**
   * Creates an rSql string for an array
   * @param {any[]} array The array to join together
   * @param key The name of the array
   * @returns {string} The corresponding rSql string
   * @private
   */
  private _createRsqlArray(array: any[], key): string {
    const value = `(${array.join(',')})`;
    return this._createRsql(value, key, RsqlOperators.IN);
  }
}
