import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterMenuComponent} from './filter-menu.component';
import {FilterService} from '../../services/filter.service';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {Component} from '@angular/core';

describe('FilterMenuComponent', () => {
  let component: TestFilterMenuComponent;
  let fixture: ComponentFixture<TestFilterMenuComponent>;
  let service: FilterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFilterMenuComponent, FilterMenuComponent, TooltipContentComponent, TooltipDirective],
      providers: [
        FilterService,
        TooltipService,
        TooltipPositionService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestFilterMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = TestBed.get(FilterService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should trigger apply event emitter when apply button is clicked', () => {
    const spy = spyOn(component, 'onFilterChange').and.stub();
    const newFilter = {data: 1};
    service.setFilters(newFilter);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(newFilter);
  });

  it('should close the tooltip when the filters change', () => {
    const spy = spyOn(TestBed.get(TooltipService), 'hideAllTooltips').and.stub();
    service.setFilters(null);
    expect(spy).toHaveBeenCalled();
  });

  @Component({
    template: `<gpr-filter-menu (filterChange)="onFilterChange($event)"></gpr-filter-menu>`
  })
  class TestFilterMenuComponent {
    public onFilterChange(e) {

    }
  }
});
