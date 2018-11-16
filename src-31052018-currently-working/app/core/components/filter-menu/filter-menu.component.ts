import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FilterService} from '../../services/filter.service';
import {Subscription} from 'rxjs/Subscription';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

/**
 * Filter menu component that displays the available filter options based on inputs from parent component.
 * The filter menu does not do any actual filtering of data, it simply emits an event with new filtered options.
 */
@Component({
  selector: 'gpr-filter-menu',
  template: `
    <div class="filter-menu">
      <a gprTooltip
         [tooltipContent]="menu"
         [position]="'bottom'"
         [theme]="'white'">FILTERS<i class="material-icons">arrow_drop_down</i>
      </a>
      <gpr-tooltip-content [closeOnClickOff]="false" #menu>
        <ng-content select="filter"></ng-content>
      </gpr-tooltip-content>
    </div>
  `,
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit, OnDestroy {
  /**
   * Emit event when apply button is clicked
   */
  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * A subscription to get filters
   */
  private _filterSubscription: Subscription;

  /**
   * Creates the filter menu component
   * @param {FilterService} _filterService
   * @param {TooltipService} _tooltipService
   */
  constructor(private _filterService: FilterService,
              private _tooltipService: TooltipService) {
  }

  /**
   * On init, subscribe to any changes from the filter service
   */
  ngOnInit() {
    this._filterSubscription = this._filterService.getFilters().subscribe(filters => {
      this.filterChange.emit(filters);
      this._tooltipService.hideAllTooltips();
    });
  }

  /**
   * On destroy, unsubscribe from getting the filters
   */
  ngOnDestroy(): void {
    if (this._filterSubscription) {
      this._filterSubscription.unsubscribe();
    }
  }
}
