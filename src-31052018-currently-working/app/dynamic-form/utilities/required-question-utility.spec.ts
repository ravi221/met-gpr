import CategoryConfig from '../config/category-config';
import DataManager from '../classes/data-manager';
import * as configuration from '../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../assets/test/dynamic-form/data-manager.mock.json';
import FormConfig from '../config/form-config';
import {getNavStateForDataManager} from '../../../assets/test/NavStateHelper';
import {INavState} from '../../navigation/interfaces/iNavState';
import {RequiredQuestionUtility} from './required-question-utility';

describe('RequiredQuestionUtility', () => {
  let config: CategoryConfig;
  let formConfig: FormConfig;
  let model: DataManager;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach( () => {
    formConfig = new FormConfig(configuration);
    formConfig.activateCategoryById('mockCategory');
    model = formConfig.initializeModel(navState);
    config = formConfig.getCategory('mockCategory');
  });

  it('should get the correct number of required questions and answered required questions', () => {
    const requiredQuestionConfig = RequiredQuestionUtility.getRequiredQuestionsMap(config, model);
    const section1 = requiredQuestionConfig.get('mockSection');
    const section2 = requiredQuestionConfig.get('mockSection2');

    expect(section1.totalRequiredQuestions).toBe(1);
    expect(section1.answeredRequiredQuestions).toBe(1);

    expect(section2.totalRequiredQuestions).toBe(1);
    expect(section2.answeredRequiredQuestions).toBe(0);
  });
});
