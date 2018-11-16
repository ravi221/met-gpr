import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MassUpdateEntryComponent} from './mass-update-entry.component';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {BreadcrumbsStubComponent} from '../../../../navigation/components/breadcrumbs/breadcrumbs.component.stub';
import {NavigatorService} from '../../../../navigation/services/navigator.service';
import {LogService} from 'app/core/services/log.service';
import {ViewConfigDataService} from 'app/plan/plan-shared/services/view-config-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DynamicSectionsListStubComponent} from 'app/dynamic-form/components/dynamic-sections-list/dynamic-sections-list.component.stub';
import {CardStubComponent} from 'app/ui-controls/components/card/card.component.stub';
import {MockNavigatorService} from '../../../../navigation/services/navigator.service.mock';
import {ModalContainerComponent} from '../../../../ui-controls/components/modal/modal-container/modal-container.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {ModalBackdropComponent} from '../../../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {LoadingSpinnerService} from '../../../../ui-controls/services/loading-spinner.service';
import {MassUpdateFormStubComponent} from '../../../../dynamic-form/components/mass-update-fom/mass-update-form.component.stub';
import {MassUpdateSaveStubComponent} from '../mass-update-save/mass-update-save.component.stub';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {MockUserProfileService} from '../../../../core/services/user-profile-service-mock';
import {PageAccessService} from '../../../../core/services/page-access.service';
import { FlagCardStubComponent } from 'app/flag/components/flag-card/flag-card.component.stub';

describe('MassUpdateEntryComponent', () => {
  let component: MassUpdateEntryComponent;
  let fixture: ComponentFixture<MassUpdateEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TestModule
      ],
      declarations: [
        MassUpdateEntryComponent,
        BreadcrumbsStubComponent,
        FlagCardStubComponent,
        CardStubComponent,
        MassUpdateSaveStubComponent,
        MassUpdateFormStubComponent
      ],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService},
        {provide: UserProfileService, useClass: MockUserProfileService},
        ViewConfigDataService,
        LogService,
        MassUpdateDataService,
        LoadingSpinnerService,
        PageAccessService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassUpdateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  @NgModule({
    imports: [CommonModule],
    declarations: [ModalContainerComponent, ModalBackdropComponent, IconComponent],
    entryComponents: [ModalContainerComponent, ModalBackdropComponent],
    exports: [ModalContainerComponent, ModalBackdropComponent]
  })
  class TestModule {}
});
