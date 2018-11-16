import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerInformationEntryComponent} from './customer-information-entry.component';
import {BreadcrumbsComponent} from '../../../navigation/components/breadcrumbs/breadcrumbs.component';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BreadcrumbService} from '../../../navigation/services/breadcrumb.service';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('CustomerInformationEntryComponent', () => {
  let component: CustomerInformationEntryComponent;
  let fixture: ComponentFixture<CustomerInformationEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CustomerInformationEntryComponent, BreadcrumbsComponent],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService},
        BreadcrumbService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInformationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
