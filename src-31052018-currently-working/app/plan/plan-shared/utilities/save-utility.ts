import {IPlanSection} from '../interfaces/iPlanSection';
import {Observable} from 'rxjs/Observable';
import DataManager from '../../../dynamic-form/classes/data-manager';
import {PlanDataEntryService} from '../../plan-data-entry/services/plan-data-entry.service';
import {Subject} from 'rxjs/Subject';
import {DataEntryService} from '../abstract-service/data-entry.service';

/**
 * Contains utility methods for saving data
 */
export class SaveUtility {

  /**
   * Generates the payload for the save call then
   * Calls the save method for plans and returns an observable of the call
   * @param {DataManager} model
   * @param {string} customerNumber
   * @param {string} planStatus
   * @param {string} planId
   * @param {PlanEntryDataService} dataService
   * @returns {Observable<any>}
   */
  public static saveData(model: DataManager, customerNumber: number, planStatus: string, planId: string, dataService: DataEntryService): Observable<any> {
    let sectionsArr = new Array<IPlanSection>();
    model.getCategoryById(model.getActiveCategory()).sections.forEach((section) => {
      sectionsArr.push(SaveUtility.createPlanSection(section.answeredRequiredQuestionCount,
        section.answeredRequiredQuestionCount / section.requiredQuestionCount, section.sectionId,
        section.label, section.requiredQuestionCount, section.state.isValid.toString()));
    });

    let payload = model.toJS();
    payload['customerNumber'] = customerNumber;
    payload['sections'] = sectionsArr;
    payload['status'] = planStatus;
    return dataService.save(planId, payload);
  }

  /**
   * generates plan section interfaces
   * @param {number} completedFieldCount
   * @param {number} completionPercentage
   * @param {string} sectionId
   * @param {string} sectionName
   * @param {number} totalFieldCount
   * @param {string} validationIndicator
   * @returns {IPlanSection}
   * @public
   */
  public static createPlanSection(completedFieldCount: number, completionPercentage: number, sectionId: string, sectionName: string, totalFieldCount: number, validationIndicator: string): IPlanSection {
    let section = {completedFieldCount: completedFieldCount, completionPercentage: completionPercentage, sectionId: sectionId, sectionName: sectionName, totalFieldCount: totalFieldCount, validationIndicator: validationIndicator};
    return section as IPlanSection;
  }
}
