import {Injectable} from '@angular/core';
import {IFilterLink} from '../interfaces/iFilterLink';
import {ICoverage} from '../interfaces/iCoverage';
import {IProduct} from '../interfaces/iProduct';

/**
 * A service to get the filter links to display in the {@link FilterBarComponent}.
 */
@Injectable()
export class FilterLinkService {

  /**
   * Creates the filter link service
   */
  constructor() {
  }

  /**
   * Creates the filter links given an array of products
   * @param {IProduct[]} products
   * @returns {Array<IFilterLink>}
   */
  public getFilterLinksFromProducts(products: IProduct[]): Array<IFilterLink> {
    let filterLinks: IFilterLink[] = products.map((product: IProduct) => {
      let subLinks: IFilterLink[] = product.coverages.map(this._mapCoverage).sort(this._sortByLabel);
      if (subLinks.length === 1) {
        subLinks = [];
      }
      return {
        subLinks,
        label: product.productName,
        active: false,
        filter: product.coverages
      };
    });
    filterLinks.push(this._createNewAllLink());
    return filterLinks.sort(this._sortByLabel);
  }

  /**
   * Creates the all new link, needs to be recreated each time visiting a screen
   * @returns {IFilterLink}
   * @private
   */
  private _createNewAllLink(): IFilterLink {
    return <IFilterLink> {
      label: 'ALL',
      active: true,
      filter: [],
      subLinks: []
    };
  }

  /**
   * Maps a coverage to a filter link
   * @param {ICoverage} coverage
   * @returns {IFilterLink}
   * @private
   */
  private _mapCoverage(coverage: ICoverage): IFilterLink {
    return <IFilterLink> {
      label: coverage.coverageName,
      active: false,
      subLinks: [],
      filter: [coverage]
    };
  }

  /**
   * Sorts the filter links based on the link's label
   * @param {IFilterLink} filterLinkA
   * @param {IFilterLink} filterLinkB
   * @returns {number}
   * @private
   */
  private _sortByLabel(filterLinkA: IFilterLink, filterLinkB: IFilterLink): number {
    return filterLinkA.label.localeCompare(filterLinkB.label);
  }

}
