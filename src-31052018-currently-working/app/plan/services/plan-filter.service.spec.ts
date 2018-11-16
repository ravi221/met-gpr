import {PlanFilterService} from './plan-filter.service';
import {ICustomerStructure} from '../../customer/interfaces/iCustomerStructure';

describe('PlanFilterService', () => {
  let service: PlanFilterService  = new PlanFilterService();

  it('should format structure correctly', () => {
    const mockStructures: ICustomerStructure[] = [
      {value: '1', name: 'test', planIds: ['123']}
    ];
    const mockAutoSearchResultItems = service.formatStructure(mockStructures);
    expect(mockAutoSearchResultItems.length).toEqual(1);
    const firstResult = mockAutoSearchResultItems[0];
    const firstStructure = mockStructures[0];
    expect(firstResult.model).toEqual(firstStructure);
    expect(firstResult.title).toEqual(firstStructure.value);
    expect(firstResult.subtitle).toEqual(firstStructure.name);
  });
});
