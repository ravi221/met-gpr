import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerInformationLandingComponent} from './customer-information-landing.component';
import {RouterTestingModule} from '@angular/router/testing';
import {BreadcrumbsComponent} from '../../../navigation/components/breadcrumbs/breadcrumbs.component';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {BreadcrumbService} from '../../../navigation/services/breadcrumb.service';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('CustomerInformationLandingComponent', () => {
  let component: CustomerInformationLandingComponent;
  let fixture: ComponentFixture<CustomerInformationLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CustomerInformationLandingComponent, BreadcrumbsComponent],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService},
        BreadcrumbService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInformationLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
