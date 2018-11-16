import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IPlanAction} from 'app/plan/interfaces/iPlanAction';
import {IPlan} from '../../plan-shared/interfaces/iPlan';
import {ISortOption} from '../../../core/interfaces/iSortOption';

/**
 * A plan list component class that receives a customer number and builds a table of plans for that customer.
 */
@Component({
  selector: 'gpr-plan-list',
  template: `
    <gpr-card>
      <section *ngIf="!isSearchingPlans">
        <table class="table table-condensed table-list" *ngIf="hasLoadedPlans && hasPlans">
          <thead>
          <tr>
            <th *ngFor="let sortOption of sortOptions"
                (click)="applySort(sortOption)"
                class="sort-header"
                [class.active]="sortOption.active">
              <span *ngIf="sortOption.icon" class="sort-label-icon"><gpr-icon [name]="sortOption.icon"></gpr-icon></span>
              <span class="sort-label">{{sortOption.label}}</span>
              <span class="sort-icon">
                <i *ngIf="sortOption.active && sortOption.sortAsc" class="material-icons">arrow_drop_down</i>
                <i *ngIf="sortOption.active && !sortOption.sortAsc" class="material-icons">arrow_drop_up</i>
                <gpr-icon *ngIf="!sortOption.active" [name]="'sort'"></gpr-icon>
            </span>
            </th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let plan of plans">
            <td><a (click)="selectPlan(plan.planId)">{{plan.planName}}</a></td>
            <td class="plan-status">
              <span class="plan-status-msg">{{plan.status}} {{plan.completionPercentage}}%</span>
              <gpr-plan-error-tooltip [errorCount]="plan.errorCount"
                                      [planId]="plan.planId"></gpr-plan-error-tooltip>
            </td>
            <td class="text-muted">{{plan.effectiveDate}}</td>
            <td class="text-muted">{{plan.lastUpdatedTimestamp | date:'MM/dd/yy hh:mm a'}}</td>
            <td class="flags-count">
              <span *ngIf="plan.flagsCount > 0">
                <span class="badge badge-warning">{{plan.flagsCount}}</span>
                </span>
            </td>
            <td>
              <gpr-plan-context-menu [plan]="plan"
                                     (planAction)="onPlanAction($event)"></gpr-plan-context-menu>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="no-plans-msg" *ngIf="hasLoadedPlans && totalPlanCount === 0">
          <gpr-icon class="no-plans-icon" name="plandoc"></gpr-icon>
          <h2 class="no-plans-heading text-muted">
            There are currently no plans for this customer.
            <span *ngIf="canAddPlan"><a (click)="onAddPlanClick()">Add a plan</a> to get started.</span>
          </h2>
        </div>
        <div class="no-plans-msg" *ngIf="hasLoadedPlans && !hasPlans && totalPlanCount > 0">
          <gpr-icon class="no-plans-icon" name="plandoc"></gpr-icon>
          <h2 class="no-plans-heading text-muted">No plans match the current filter criteria</h2>
        </div>
      </section>
      <span class="loading-plans" *ngIf="isSearchingPlans">
        <gpr-loading-icon [show]="true"></gpr-loading-icon>
      </span>
    </gpr-card>
  `,
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnChanges {

  /**
   * Indicates if the user can add a plan
   * @type {boolean}
   */
  @Input() canAddPlan: boolean = false;

  /**
   * Indicates if the UI is loading plans, used when a search is being performed
   * @type {boolean}
   */
  @Input() isSearchingPlans: boolean = true;

  /**
   * The total number of plans, regardless of the current display values
   * @type {number}
   */
  @Input() totalPlanCount: number = 0;

  /**
   * A list of plans to display
   */
  @Input() plans: IPlan[] = [];

  /**
   * Gets a list of options to the sort a plan
   * @type {Array}
   */
  @Input() sortOptions: ISortOption[] = [];

  /**
   * Event emitter for when a customer has 0 plans and selects 'Add a plan'
   * @type {EventEmitter<any>}
   */
  @Output() addPlanClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Event emitter for when a plan is selected.
   * @type {EventEmitter<string>}
   */
  @Output() planSelect: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Event emitter for when a sort action is selected.
   * @type {EventEmitter<ISortOption>}
   */
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();

  /**
   * Event emitter for when a plan action takes place.
   * @type {EventEmitter<IPlanAction>}
   */
  @Output() planAction: EventEmitter<IPlanAction> = new EventEmitter<IPlanAction>();

  /**
   * Indicates if the current plan list has loaded plans and has at least one plan
   * @type {boolean}
   */
  public hasPlans: boolean = false;

  /**
   * Indicates if the plan list has loaded plans
   * @type {boolean}
   */
  public hasLoadedPlans: boolean = false;

  /**
   * The default constructor.
   */
  public constructor() {
  }

  /**
   * On init, subscribe to a given plans observable to get all plans
   */
  ngOnInit(): void {
    this._setupPlans();
  }

  /**
   * On changes, subscribe to get the new plans
   */
  ngOnChanges(changes: SimpleChanges): void {
    const isPlansChange = changes.plans;
    if (isPlansChange) {
      this._setupPlans();
    }
  }

  /**
   * On click, emit event to notify parent the user wants to add a plan
   */
  public onAddPlanClick(): void {
    this.addPlanClick.emit();
  }

  /**
   * Applies the sort when a table header is clicked
   * @param {ISortOption} sortOption
   */
  public applySort(sortOption: ISortOption): void {
    if (sortOption.active) {
      sortOption.sortAsc = !sortOption.sortAsc;
    } else {
      this.sortOptions.forEach((s: ISortOption) => {
        s.active = false;
        s.sortAsc = true;
      });
      sortOption.active = true;
    }
    this.sortChange.emit(sortOption);
  }

  /**
   * Handles the click event of selecting a plan.
   * @param {string} planId: Unique Id of the plan.
   */
  public selectPlan(planId: string): void {
    this.planSelect.emit(planId);
  }

  /**
   * Handles the emitted onPlanAction event from {@link PlanContextMenuComponent}
   * @param {IPlanAction} planAction
   */
  public onPlanAction(planAction: IPlanAction): void {
    this.planAction.emit(planAction);
  }

  /**
   * Subscribes to the plans observable, and gets the plans
   */
  private _setupPlans(): void {
    this.hasPlans = this.plans && this.plans.length > 0;
    this.hasLoadedPlans = true;
  }
}
