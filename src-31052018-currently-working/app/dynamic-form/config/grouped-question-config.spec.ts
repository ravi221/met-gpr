import {GroupedQuestionConfig} from './grouped-question-config';
import * as config from '../../../assets/test/dynamic-form/grouped-question-count.mock.json';
import * as groupedOtherConfig from '../../../assets/test/dynamic-form/grouped-other.mock.json';
import {onChildUpdate} from '../../../assets/test/dynamic-form/onChildUpdate.mock';
describe('GroupedQuestionConfig', () => {

  let groupConfig: GroupedQuestionConfig;

  it('should return the correct number of questions', () => {
    groupConfig = new GroupedQuestionConfig(config, onChildUpdate);
    const questionCount = groupConfig.getQuestionCount();
    expect(questionCount).toBe(5);
  });

  it('should count groupings that aren\'t vertical groupings as one question', () => {
    groupConfig = new GroupedQuestionConfig(groupedOtherConfig, onChildUpdate);
    const questionCount = groupConfig.getQuestionCount();
    expect(questionCount).toBe(1);
  });
});
