import {ISectionRequiredData} from '../config/isection-required-data';
import DataManager from '../classes/data-manager';
import CategoryConfig from '../config/category-config';
import SectionConfig from '../config/section-config';
import {GroupedQuestionConfig} from '../config/grouped-question-config';
import QuestionConfig from '../config/question-config';
import {IFormItemConfig} from '../config/iFormItemConfig';

/**
 * Used by datamanager to track required questions
 */
export class RequiredQuestionUtility {

  public static getRequiredQuestionsMap(categoryConfig: CategoryConfig, model: DataManager): Map<string, ISectionRequiredData> {
    let requiredQuestionsMap = new Map<string, ISectionRequiredData>();
    categoryConfig.sections.forEach( (section) => {
      const requiredQuestionConfig = this._getRequiredCountForSection(section, model);
      requiredQuestionsMap.set(section.sectionId, requiredQuestionConfig);
    });
    return requiredQuestionsMap;
  }
  /**
   * Creates a requiredQuestionConfig interface
   * @param {number} answeredRequiredQuestions
   * @param {number} totalRequiredQuestions
   * @param {string} sectionId
   * @returns {ISectionRequiredData}
   * @private
   */
  private static _createRequiredQuestionConfig(answeredRequiredQuestions: number, totalRequiredQuestions: number, sectionId: string): ISectionRequiredData {
    return {sectionId, answeredRequiredQuestions, totalRequiredQuestions};
  }

  /**
   * Gets the requried question count for a specific section
   * @param {SectionConfig} section
   * @param {DataManager} model
   * @returns {ISectionRequiredData}
   * @private
   */
  private static _getRequiredCountForSection(section: SectionConfig, model: DataManager): ISectionRequiredData {
    let requiredQuestionConfig = this._createRequiredQuestionConfig(0, 0, section.sectionId);
    requiredQuestionConfig = this._updateRequiredQuestions(section.formItems, requiredQuestionConfig, model);
    return requiredQuestionConfig;
  }

  /**
   * Recursive function to count all required questions
   * @param {IFormItemConfig[]} formItems
   * @param {ISectionRequiredData} requiredQuestionConfig
   * @param {DataManager} model
   * @returns {ISectionRequiredData}
   * @private
   */
  private static _updateRequiredQuestions(formItems: IFormItemConfig[], requiredQuestionConfig: ISectionRequiredData, model: DataManager): ISectionRequiredData {
    formItems.forEach( (formItem) => {
      if (formItem instanceof QuestionConfig) {
        if (formItem.control.state.isRequired) {
          requiredQuestionConfig.totalRequiredQuestions += 1;
          const value = model.getById(formItem.formItemId);
          if (value) {
            requiredQuestionConfig.answeredRequiredQuestions += 1;
          }
        }
      } else if (formItem instanceof GroupedQuestionConfig) {
        requiredQuestionConfig = this._updateRequiredQuestions(formItem.formItems, requiredQuestionConfig, model);
      }
    });
    return requiredQuestionConfig;
  }
}
