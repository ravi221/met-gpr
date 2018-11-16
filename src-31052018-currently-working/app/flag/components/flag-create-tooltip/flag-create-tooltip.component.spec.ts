import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlagCreateTooltipComponent} from './flag-create-tooltip.component';
import {TooltipContentComponent} from 'app/ui-controls/components/tooltip/tooltip-content.component';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {TooltipDirective} from 'app/ui-controls/components/tooltip/tooltip.directive';
import {TooltipService} from 'app/ui-controls/services/tooltip.service';
import {TooltipPositionService} from 'app/ui-controls/services/tooltip-position.service';
import { CommentService } from '../../../comment/services/comment.service';

describe('FlagCreateToolTipComponent', () => {
  let component: FlagCreateTooltipComponent;
  let fixture: ComponentFixture<FlagCreateTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlagCreateTooltipComponent, TooltipContentComponent, IconComponent, TooltipDirective],
      providers: [TooltipService, TooltipPositionService, CommentService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagCreateTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Flag create tooltip should be created', () => {
    expect(component).toBeTruthy();
  });
});
