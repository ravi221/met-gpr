import {Injectable} from '@angular/core';
import {GroupedQuestionConfig} from '../config/grouped-question-config';
import DataManager from '../classes/data-manager';
import {fill} from 'lodash';
/**
 * A service that performs operations on a table
 */
@Injectable()
export class DynamicFormTableService {

  /**
   * Initializes data in the table
   * @param {number} rowCount
   * @returns {number[]}
   */
  public initializeTable(rowCount: number): number[] {
    return fill(Array(rowCount), null);
  }

  /**
   * Adds a row to the table
   * @param {any[]} questions
   * @returns {number[] | string[]}
   */
  public addRow(questions: any[]): number[] | string[] {
    questions.push(null);
    return questions;
  }

  /**
   * Removes a row
   * @param {number} index
   * @param {number[] | string[]} questions
   * @returns {number[] | string[]}
   */
  public removeRow(index: number, questions: number[] | string[]): number[] | string[] {
      if (index === 0 ) {
        questions.shift();
      } else {
        questions.splice(index, 1);
      }
      return questions;
  }

  /**
   * Returns which rows are empty
   * @param {GroupedQuestionConfig} config
   * @param {DataManager} model
   * @param {number[]} rows
   * @returns {number[]}
   */
  public getEmptyRows(config: GroupedQuestionConfig, model: DataManager, rows: number[]): number[] {
    let emptyRows: number[] = [];
    for (let i = 0; i < rows.length; i++) {
      if (this.isRowEmpty(i, config, model)) {
        emptyRows.push(i);
      }
    }
    return emptyRows;
  }

  /**
   * Checks if a single row would be empty
   * @param {number} index
   * @param {GroupedQuestionConfig} config
   * @param {DataManager} model
   * @returns {boolean}
   */
  public isRowEmpty(index: number, config: GroupedQuestionConfig, model: DataManager): boolean {
    let isEmpty = true;
    config.questions.forEach( (question) => {
      const value = model.getById(question.formItemId);
      if ( value && value[index] && value[index] !== '') {
        isEmpty = false;
      }
    });
    return isEmpty;
  }
}
