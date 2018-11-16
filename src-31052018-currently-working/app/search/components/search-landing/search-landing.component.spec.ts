import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchLandingComponent} from './search-landing.component';
import {SearchModule} from '../../search.module';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthorizationService} from '../../../core/services/authorization.service';

describe('SearchLandingComponent', () => {
  let component: SearchLandingComponent;
  let fixture: ComponentFixture<SearchLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchModule, RouterTestingModule, HttpClientTestingModule],
      providers: [CustomerDataService, AuthorizationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

});
