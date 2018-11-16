import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlagCreateTooltipComponent} from './flag-create-tooltip.component';
import {TooltipContentComponent} from 'app/ui-controls/components/tooltip/tooltip-content.component';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {TooltipDirective} from 'app/ui-controls/components/tooltip/tooltip.directive';
import {TooltipService} from 'app/ui-controls/services/tooltip.service';
import {TooltipPositionService} from 'app/ui-controls/services/tooltip-position.service';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NotificationService} from 'app/core/services/notification.service';
import { FlagService } from '../../../flag/services/flag.service';
import { CommentService } from '../../../comment/services/comment.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigatorService } from '../../../navigation/services/navigator.service';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';

describe('FlagCreateToolTipComponent', () => {
  let component: FlagCreateTooltipComponent;
  let fixture: ComponentFixture<FlagCreateTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [FlagCreateTooltipComponent, TooltipContentComponent, IconComponent, TooltipDirective],
      providers: [TooltipService, TooltipPositionService, NotificationService,
        FlagService, CommentService, NavigatorService, LoadingSpinnerService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagCreateTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Flag create tooltip should be created', () => {
    expect(component).toBeTruthy();
  });
});
