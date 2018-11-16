import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {ISortOption} from '../../interfaces/iSortOption';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';
import {SortMenuComponent} from './sort-menu.component';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

describe('SortMenuComponent', () => {
  let component: TestSortComponent;
  let fixture: ComponentFixture<TestSortComponent>;
  let tooltipService: TooltipService;
  let anchor: DebugElement;
  let firstOption: DebugElement;
  let secondOption: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestSortComponent, SortMenuComponent, TooltipDirective, TooltipContentComponent],
      providers: [TooltipService, TooltipPositionService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSortComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        anchor = fixture.debugElement.query(By.css('.sort-menu > a'));
        firstOption = fixture.debugElement.query(By.css('ul li:first-child a'));
        secondOption = fixture.debugElement.query(By.css('ul li:last-child a'));
        tooltipService = TestBed.get(TooltipService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('sorting with user preferences', () => {
    it('should initialize control as active based on preferences', () => {
      expect(firstOption.classes.active).toBeFalsy();
      expect(secondOption.classes.active).toBeTruthy();
    });

    it('should set sort direction based on user preferences', () => {
      expect(component.sortMenuComponent.activeSortOption.sortAsc).toBeFalsy();
    });
  });

  it('should trigger sortChange event when sort is changed', () => {
    const spy = spyOn(component, 'onSortChange').and.stub();
    click(secondOption, fixture);
    expect(spy).toHaveBeenCalled();
  });

  it('should update active sort option when new sort option is clicked', () => {
    click(secondOption, fixture);
    expect(anchor.nativeElement.innerHTML).toContain('edited');
  });

  it('should close the tooltip once a new sort option is selected', () => {
    const spy = spyOn(tooltipService, 'hideAllTooltips').and.stub();
    click(anchor, fixture);
    click(secondOption, fixture);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the currently selected option to ascending when clicked again', () => {
    const spy = spyOn(component, 'onSortChange').and.stub();
    click(anchor, fixture);
    click(firstOption, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({sortAsc: true, active: true, sortBy: 'newest', label: 'newest'});
  });

  it('should set the newly selected option to sort ascending', () => {
    const spy = spyOn(component, 'onSortChange').and.stub();
    click(anchor, fixture);
    click(secondOption, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({sortAsc: true, active: true, sortBy: 'edited', label: 'edited'});
  });

  @Component({
    template: `
      <gpr-sort-menu [sortOptions]="sortOptions"
                     [sortPreferences]="sortPreferences"
                     (sortChange)="onSortChange($event)"></gpr-sort-menu>
    `
  })
  class TestSortComponent {
    @ViewChild(SortMenuComponent) sortMenuComponent;

    public sortOptions = [
      <ISortOption>{sortBy: 'newest', label: 'newest', sortAsc: true, active: false},
      <ISortOption>{sortBy: 'edited', label: 'edited', sortAsc: true, active: false}
    ];

    public sortPreferences: ISortPreferences = {
      sortBy: 'edited',
      sortAsc: false
    };

    public onSortChange(e) {
    }
  }
});

