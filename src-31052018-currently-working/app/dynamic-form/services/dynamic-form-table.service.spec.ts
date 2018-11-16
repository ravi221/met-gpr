import {TestBed} from '@angular/core/testing';
import {DynamicFormTableService} from './dynamic-form-table.service';
import DataManager from '../classes/data-manager';
import {GroupedQuestionConfig} from '../config/grouped-question-config';
import * as config from '../../../assets/test/dynamic-form/table-formConfig.mock.json';
import * as data from '../../../assets/test/dynamic-form/table-model.mock.json';
import FormConfig from '../config/form-config';
import {INavState} from '../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../assets/test/NavStateHelper';

describe('DynamicFormTableService', () => {
  let tableService: DynamicFormTableService;
  let model: DataManager;
  let formConfig: FormConfig;
  let groupConfig: GroupedQuestionConfig;
  let rows: any[];
  let rowCount: number;
  let columnDataMap: Map<string, any>;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicFormTableService]
    });
    rowCount = 1;
    tableService = TestBed.get(DynamicFormTableService);
    formConfig = new FormConfig(config);
    formConfig.activateCategoryById(formConfig.categories[0].categoryId);
    model = formConfig.initializeModel(navState);
    groupConfig = formConfig.categories[0].sections[0].formItems[0] as GroupedQuestionConfig;
    columnDataMap = new Map<string, any[]>();
    groupConfig.questions.forEach((question) => {
      let dataArray: any[] = model.getById(question.formItemId);
      if (!dataArray) {
        dataArray = [null];
      }
      rowCount = dataArray.length > rowCount ? dataArray.length : rowCount;
      columnDataMap.set(question.formItemId, dataArray);
      model.setById(question.formItemId, dataArray);
    });
    rows = tableService.initializeTable(rowCount);
  });

  it('should create the correct number of rows', () => {
    expect(rows.length).toBe(2);
  });

  it('should add a row', () => {
    rows = tableService.addRow(groupConfig.questions);
    expect(rows.length).toBe(3);
  });

  describe('removeRow', () => {
    it('should remove the second row', () => {
      rows = tableService.removeRow(1, rows);
      expect(rows.length).toBe(1);
    });
    it('should remove the first row', () => {
      rows = tableService.removeRow(0, rows);
      expect(rows.length).toBe(1);
    });
  });

  describe('isEmptyRow', () => {
    it('should return true when the row is not empty', () => {
      const shouldBeFalse = tableService.isRowEmpty(0, groupConfig, model);
      expect(shouldBeFalse).toBeFalsy();
    });
    it('should return true when the row is empty', () => {
      rows = tableService.addRow(rows);
      const shouldBeTrue = tableService.isRowEmpty(2, groupConfig, model);
      expect(shouldBeTrue).toBeTruthy();
    });
  });
  describe('getEmptyRows', () => {
    it('should return an empty array when no rows are empty', () => {
      const emptyArr = tableService.getEmptyRows(groupConfig, model, rows);
      expect(emptyArr.length).toBe(0);
    });

    it('should return an array when rows are empty with the index of the empty rows', () => {
      rows = tableService.addRow(rows);
      const emptyRows = tableService.getEmptyRows(groupConfig, model, rows);
      expect(emptyRows.length).toBe(1);
      expect(emptyRows[0]).toBe(2);
    });
  });

});
