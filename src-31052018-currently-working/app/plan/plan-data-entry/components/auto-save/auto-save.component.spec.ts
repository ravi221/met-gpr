import {ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick} from '@angular/core/testing';
import * as configuration from '../../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../../assets/test/dynamic-form/data-manager.mock.json';
import {AutoSaveComponent} from './auto-save.component';
import {PlanDataEntryServiceMock} from '../../services/plan-data-entry.service.mock';
import {PlanDataEntryService} from '../../services/plan-data-entry.service';
import {Component, DebugElement, NgModule, OnInit, ViewChild} from '@angular/core';
import FormConfig from '../../../../dynamic-form/config/form-config';
import DataManager from '../../../../dynamic-form/classes/data-manager';
import {By} from '@angular/platform-browser';
import {SnackBarStubComponent} from '../../../../ui-controls/components/snack-bar/snack-bar.component.stub';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {MockUserProfileService} from '../../../../core/services/user-profile-service-mock';
import {PageAccessService} from '../../../../core/services/page-access.service';
import {ModalService} from '../../../../ui-controls/services/modal.service';
import {ModalContainerComponent} from '../../../../ui-controls/components/modal/modal-container/modal-container.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {CommonModule} from '@angular/common';
import {ModalBackdropComponent} from '../../../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {LoadingSpinnerService} from '../../../../ui-controls/services/loading-spinner.service';
import {MockModalService} from '../../../../ui-controls/services/modal.service.mock';
import Spy = jasmine.Spy;
import {ConfirmDialogComponent} from '../../../../ui-controls/components/modal/confirm-dialog/confirm-dialog.component';
import {INavState} from '../../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../../assets/test/NavStateHelper';

describe('AutoSaveComponent', () => {
  let component: AutoSaveWrapperComponent;
  let fixture: ComponentFixture<AutoSaveWrapperComponent>;
  let autoSaveComponent: AutoSaveComponent;
  let debugElement: DebugElement;
  let modalService: ModalService;
  let spy: Spy;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach(()  => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [AutoSaveComponent, SnackBarStubComponent, AutoSaveWrapperComponent],
      providers: [{provide: PlanDataEntryService, useClass: PlanDataEntryServiceMock}, {provide: UserProfileService, useClass: MockUserProfileService},
        PageAccessService, {provide: ModalService, useClass: MockModalService}, LoadingSpinnerService]
    });
      fixture = TestBed.createComponent(AutoSaveWrapperComponent);
      component = fixture.componentInstance;
      autoSaveComponent = component.autoSaveComponent;
      fixture.detectChanges();
  });

  afterEach( () => {
    fixture.destroy();
    spy = null;
  });

  it('should be created', () => {
    expect(autoSaveComponent).toBeTruthy();
    expect(autoSaveComponent.planId).toBe('123456789');
    expect(autoSaveComponent.planStatus).toBe('In Progress');
    expect(autoSaveComponent.customerNumber).toBe(1);
  });

  it('should call save and update the display message', fakeAsync(() => {
    autoSaveComponent.save();
    tick(1000);
    fixture.detectChanges();
    debugElement = fixture.debugElement;
    const materialIcons = debugElement.query(By.css('.material-icons'));
    expect(autoSaveComponent.message.icon).toBe('done');
    expect(materialIcons.nativeElement.textContent).toBe('done');
    discardPeriodicTasks();
  }));

  it('should return an observable', fakeAsync(() => {
    const observable = autoSaveComponent.getSaveObservable();
    expect(observable).toBeDefined();
    tick(1000);
    discardPeriodicTasks();
  }));

  it('should not call the open method of the modal service when data is not dirty', () => {
    modalService = TestBed.get(ModalService);
    spy = spyOn(modalService, 'open').and.stub();
    autoSaveComponent.openSaveModal();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the open method of the modal service when data is dirty', () => {
    modalService = TestBed.get(ModalService);
    component.config.state.isDirty = true;
    fixture.detectChanges();
    spy = spyOn(modalService, 'open').and.callThrough();
    autoSaveComponent.openSaveModal();
    expect(spy).toHaveBeenCalled();
  });
  @Component({selector: `gpr-auto-save-wrapper`, template: `<gpr-auto-save [model]="model"
                                                                         [customerNumber] = "customerNumber"
                                                                         [planStatus]="status"
                                                                         [planId]="planId"></gpr-auto-save>`})
  class AutoSaveWrapperComponent implements OnInit {
    public config: FormConfig = new FormConfig(configuration);
    public model: DataManager;
    public customerNumber: number = 1;
    public status: string = 'In Progress';
    public planId: string = '123456789';
    @ViewChild(AutoSaveComponent) autoSaveComponent: AutoSaveComponent;

    ngOnInit() {
      this.config.activateCategoryById('mockCategory');
      this.model = this.config.initializeModel(navState);
    }
  }

  @NgModule({
    imports: [CommonModule],
    exports: [ModalContainerComponent, ModalBackdropComponent, ConfirmDialogComponent],
    declarations: [ModalContainerComponent, ModalBackdropComponent, ConfirmDialogComponent, IconComponent],
    entryComponents: [ModalContainerComponent, ModalBackdropComponent, ConfirmDialogComponent],
  })
  class TestModule {}
});

