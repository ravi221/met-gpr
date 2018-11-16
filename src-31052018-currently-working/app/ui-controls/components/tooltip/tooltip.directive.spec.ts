import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TooltipDirective} from './tooltip.directive';
import {TooltipPositionService} from '../../services/tooltip-position.service';
import {TooltipService} from '../../services/tooltip.service';
import {Component, DebugElement, OnInit} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TooltipContentComponent} from './tooltip-content.component';
import {FilterMenuComponent} from 'app/core/components/filter-menu/filter-menu.component';
import {OnDestroy} from '@angular/core/src/metadata/lifecycle_hooks';
import {click} from '../../../../assets/test/TestHelper';
import {HelpDataService} from '../../../plan/services/help-data.service';

describe('TooltipDirective', () => {
  let component: TestTooltipComponent;
  let fixture: ComponentFixture<TestTooltipComponent>;
  let tooltip: DebugElement;
  let tooltipContentElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTooltipComponent, TooltipDirective, TooltipContentComponent],
      providers: [FilterMenuComponent, TooltipPositionService, TooltipService, HelpDataService]
    });
    fixture = TestBed.createComponent(TestTooltipComponent);
    component = fixture.componentInstance;
    tooltip = fixture.debugElement.query(By.css('button'));
    tooltipContentElement = fixture.debugElement.query(By.css('gpr-tooltip-content'));
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should show and then hide the tooltip content using tooltip button', () => {
    click(tooltip, fixture);
    expect(tooltipContentElement.children[0].nativeElement.classList.contains('visible')).toBeTruthy();

    click(tooltip, fixture);
    expect(tooltipContentElement.children[0].nativeElement.classList.contains('visible')).toBeFalsy();
  });

  it('should show the tooltip content and then hide the tooltip content using the X button', () => {
    click(tooltip, fixture);
    expect(tooltipContentElement.children[0].nativeElement.classList.contains('visible')).toBeTruthy();

    const closeButton = tooltipContentElement.query(By.css('.tooltip-close'));
    click(closeButton, fixture);
    expect(tooltipContentElement.children[0].nativeElement.classList.contains('visible')).toBeFalsy();
  });

  it('should render the proper content when tooltip is open', () => {
    click(tooltip, fixture);
    expect(tooltipContentElement.children[0].nativeElement.classList.contains('visible')).toBeTruthy();

    const paragraphElement = tooltipContentElement.query(By.css('p'));
    expect(paragraphElement).toBeTruthy();
    expect(paragraphElement.nativeElement.textContent.trim()).toEqual('Place the contents of the tooltip in here.');
  });

  @Component({
    template: `
      <gpr-tooltip-content #myTooltipContent>
        <p>Place the contents of the tooltip in here.</p>
      </gpr-tooltip-content>
      <button gprTooltip [tooltipContent]="myTooltipContent">Click me to trigger tooltip</button>
    `
  })
  class TestTooltipComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
    }

    ngOnInit() {
    }
  }
});
