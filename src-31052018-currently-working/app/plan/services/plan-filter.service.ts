import {IAutoSearchResultItem} from '../../ui-controls/interfaces/iAutoSearchResultItem';
import {ICustomerStructure} from '../../customer/interfaces/iCustomerStructure';

/**
 * A service to help formatting and getting data for the {@link PlanFilterComponent}
 */
export class PlanFilterService {

  /**
   * Formats structure objects to an auto search result items
   * @param {ICustomerStructure[]} structures
   * @returns {Array<IAutoSearchResultItem>}
   */
  public formatStructure(structures: ICustomerStructure[]): IAutoSearchResultItem[] {
    return structures.map(structure => {
      return {title: structure.value, subtitle: structure.name, model: structure};
    });
  }
}
