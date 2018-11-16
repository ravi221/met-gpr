import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HelpTooltipComponent} from './help-tooltip.component';
import {Component} from '@angular/core';
import {UIControlsModule} from '../../ui-controls.module';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {HelpDataService} from '../../../plan/services/help-data.service';

describe('HelpTooltipComponent', () => {
  let component: TestHelpTooltipComponent;
  let fixture: ComponentFixture<TestHelpTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UIControlsModule],
      declarations: [TestHelpTooltipComponent],
      providers: [HttpClient, HttpHandler, HelpDataService]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHelpTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  @Component({
    template: `
      <div>
        <gpr-help-tooltip [maxWidth]="300"
                          [theme]="'default'"
                          [position]="'right'"
                          [editable]="false"
                          [displayCloseIcon]="true">Test data
        </gpr-help-tooltip>
      </div>`
  })
  class TestHelpTooltipComponent {

  }
});
