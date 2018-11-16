import {FilterLinkService} from './filter-link.service';
import {IProduct} from '../interfaces/iProduct';

describe('FilterLinkService', () => {
  let service: FilterLinkService = new FilterLinkService();
  const mockProducts: IProduct[] = [
    {
      productName: 'Voluntary',
      coverages: [
        {
          coverageId: '24',
          coverageName: 'Critical Illness',
        },
        {
          coverageId: '25',
          coverageName: 'Critical Illness 2',
        }
      ]
    },
    {
      productName: 'Life',
      coverages: [
        {
          coverageId: '41',
          coverageName: 'Test Life',
        },
        {
          coverageId: '42',
          coverageName: 'A Test Life 2',
        }
      ]
    },
    {
      productName: 'Vision',
      coverages: [
        {
          coverageId: '00',
          coverageName: 'Test Vision',
        }
      ]
    }
  ];

  describe('All Link', () => {
    it('should create ALL filter link', () => {
      const filterLinks = service.getFilterLinksFromProducts(mockProducts);
      const allLink = filterLinks[0];
      expect(allLink).toBeTruthy();
      expect(allLink.label).toBe('ALL');
    });

    it('should always set ALL filter link as active', () => {
      let filterLinks = service.getFilterLinksFromProducts(mockProducts);
      const otherFilterLink = filterLinks[1];
      otherFilterLink.active = true;
      let allFilterLink = filterLinks[0];
      allFilterLink.active = false;

      filterLinks = service.getFilterLinksFromProducts(mockProducts);
      allFilterLink = filterLinks[0];
      expect(allFilterLink).toBeTruthy();
    });
  });

  describe('Product Filter Links', () => {

    it('should create Voluntary filter link', () => {
      const filterLinks = service.getFilterLinksFromProducts(mockProducts);
      const voluntaryLink = filterLinks[3];
      expect(voluntaryLink).toBeTruthy();
      expect(voluntaryLink.label).toBe('Voluntary');
      expect(voluntaryLink.subLinks).toBeTruthy();
      expect(voluntaryLink.subLinks.length).toBe(2);
    });

    it('should alphabetize filter links', () => {
      const filterLinks = service.getFilterLinksFromProducts(mockProducts);
      const labels = filterLinks.map(f => f.label);
      for (let i = 0; i < labels.length - 1; i++) {
        expect(labels[i].localeCompare(labels[i + 1])).toBe(-1);
      }
    });

    it('should alphabetize filter sub links', () => {
      const lifeLink = service.getFilterLinksFromProducts(mockProducts)[1];
      const labels = lifeLink.subLinks.map(f => f.label);
      for (let i = 0; i < labels.length - 1; i++) {
        expect(labels[i].localeCompare(labels[i + 1])).toBe(-1);
      }
    });

    it('should not create sub links when there is only one sub link', () => {
      const visionLink = service.getFilterLinksFromProducts(mockProducts)[2];
      expect(visionLink.subLinks).toBeTruthy();
      expect(visionLink.subLinks.length).toEqual(0);
    });
  });
});

