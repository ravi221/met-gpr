import {INavState} from '../../app/navigation/interfaces/iNavState';
import {PageAccessType} from '../../app/core/enums/page-access-type';
import {NavContextType} from '../../app/navigation/enums/nav-context';

export function getNavStateForDataManager(data: any): INavState {
  const navState: INavState = {
    context: NavContextType.DEFAULT,
    url: null,
    params: null,
    data: {
      planCategoryData: data,
      pageAccessType: PageAccessType.SUPER_USER,
      customer: null
    }
  };
  return navState;
}
