import {Component, DebugElement, OnInit, ViewChild} from '@angular/core';
import {LoadingSpinnerService} from '../../../../ui-controls/services/loading-spinner.service';
import DataManager from '../../../../dynamic-form/classes/data-manager';
import {ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {getNavStateForDataManager} from '../../../../../assets/test/NavStateHelper';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {INavState} from '../../../../navigation/interfaces/iNavState';
import {By} from '@angular/platform-browser';
import {SnackBarStubComponent} from '../../../../ui-controls/components/snack-bar/snack-bar.component.stub';
import {PageAccessService} from '../../../../core/services/page-access.service';
import {MockUserProfileService} from '../../../../core/services/user-profile-service-mock';
import FormConfig from '../../../../dynamic-form/config/form-config';
import Spy = jasmine.Spy;
import {MassUpdateSaveComponent} from './mass-update-save.component';
import * as configuration from '../../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../../assets/test/dynamic-form/data-manager.mock.json';
import {MassUpdateDataServiceMock} from '../../services/mass-update-data.service.mock';
import {MassUpdateDataService} from '../../services/mass-update-data.service';

describe('MassUpdateSaveComponent', () => {
  let component: MassUpdateWrapperComponent;
  let fixture: ComponentFixture<MassUpdateWrapperComponent>;
  let massUpdateSaveComponent: MassUpdateSaveComponent;
  let debugElement: DebugElement;
  let spy: Spy;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach(()  => {
    TestBed.configureTestingModule({
      declarations: [MassUpdateSaveComponent, SnackBarStubComponent, MassUpdateWrapperComponent],
      providers: [{provide: MassUpdateDataService, useClass: MassUpdateDataServiceMock}, {provide: UserProfileService, useClass: MockUserProfileService},
        PageAccessService, LoadingSpinnerService]
    });
    fixture = TestBed.createComponent(MassUpdateWrapperComponent);
    component = fixture.componentInstance;
    massUpdateSaveComponent = component.saveComponent;
    fixture.detectChanges();
  });

  afterEach( () => {
    fixture.destroy();
    spy = null;
  });

  it('should be created', () => {
    expect(massUpdateSaveComponent).toBeTruthy();
    expect(massUpdateSaveComponent.planId).toBe('123456789');
    expect(massUpdateSaveComponent.planStatus).toBe('In Progress');
    expect(massUpdateSaveComponent.customerNumber).toBe(1);
  });

  it('should call save and update the display message', fakeAsync(() => {
    massUpdateSaveComponent.save();
    tick(1000);
    fixture.detectChanges();
    debugElement = fixture.debugElement;
    const materialIcons = debugElement.query(By.css('.material-icons'));
    expect(massUpdateSaveComponent.message.icon).toBe('done');
    expect(materialIcons.nativeElement.textContent).toBe('done');
    discardPeriodicTasks();
  }));

  @Component({selector: `gpr-gpr-mass-update-save`, template: `<gpr-mass-update-save [model]="model"
                                                                         [customerNumber] = "customerNumber"
                                                                         [planStatus]="status"
                                                                         [planId]="planId"></gpr-mass-update-save>`})
  class MassUpdateWrapperComponent implements OnInit {
    public config: FormConfig = new FormConfig(configuration);
    public model: DataManager;
    public customerNumber: number = 1;
    public status: string = 'In Progress';
    public planId: string = '123456789';
    @ViewChild(MassUpdateSaveComponent) saveComponent: MassUpdateSaveComponent;

    ngOnInit() {
      this.config.activateCategoryById('mockCategory');
      this.model = this.config.initializeModel(navState);
    }
  }
});
