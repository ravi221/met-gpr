import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SaveUtility} from './save-utility';
import * as configuration from '../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../assets/test/dynamic-form/data-manager.mock.json';
import DataManager from '../../../dynamic-form/classes/data-manager';
import FormConfig from '../../../dynamic-form/config/form-config';
import {Subscription} from 'rxjs/Subscription';
import {INavState} from '../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../assets/test/NavStateHelper';
import {PlanDataEntryService} from '../../plan-data-entry/services/plan-data-entry.service';
import {PlanDataEntryServiceMock} from '../../plan-data-entry/services/plan-data-entry.service.mock';
import {IPlanSection} from '../interfaces/iPlanSection';

describe('Save Utility', () => {
  let service;
  let model: DataManager;
  let config: FormConfig;
  let subscription: Subscription;
  const customerNumber = 1;
  const planStatus = 'In Progress';
  const planId = '123456789';
  let navState: INavState = getNavStateForDataManager(data);
  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [ {provide: PlanDataEntryService, useClass: PlanDataEntryServiceMock }]
    });
    config = new FormConfig(configuration);
    config.activateCategoryById('mockCategory');
    model = config.initializeModel(navState);
    service = TestBed.get(PlanDataEntryService);
  });

  it('should save the data', fakeAsync(() => {
    subscription = SaveUtility.saveData(model, customerNumber, planStatus, planId, service).subscribe( (value) => {
      expect(value).toBeDefined();
      subscription.unsubscribe();
    });
    tick(1000);
  }));

  it('should generate the payload properly', () => {
    const completedFieldCount = 1;
    const completedPercentage = .25;
    const sectionId = 'mockSection';
    const sectionName = 'Mock Section';
    const totalFieldCount = 4;
    const validationIndicator = 'valid';

    const section: IPlanSection = SaveUtility.createPlanSection(completedFieldCount, completedPercentage, sectionId, sectionName, totalFieldCount, validationIndicator);

    expect(section).toBeDefined();
    expect(section.completedFieldCount).toBe(completedFieldCount);
    expect(section.completionPercentage).toBe(completedPercentage);
    expect(section.sectionId).toBe(sectionId);
    expect(section.sectionName).toBe(sectionName);
    expect(section.totalFieldCount).toBe(totalFieldCount);
    expect(section.validationIndicator).toBe(validationIndicator);
  });
});
