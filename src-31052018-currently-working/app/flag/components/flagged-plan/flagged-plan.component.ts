import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import { IFlaggedPlan } from '../../interfaces/iFlaggedPlan';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { FlagService } from 'app/flag/services/flag.service';

/**
 * This component represents a plan and all its containing flags for a given customer. It has the ability to resolve a
 * flag. When that occurs the FlagService will be called to update the Plan.
 */
@Component({
  selector: 'gpr-flagged-plan',
  template: `
    <gpr-card class="flagged-plan-container">
      <div class="card-title mt-16"><a (click)="selectPlan(plan.planId)">{{plan.planName}}</a></div>
      <gpr-card *ngIf="flags.length > 0" >
        <div class="flag-item-container" *ngFor="let flag of flags">
          <gpr-flag-item [flag]="flag" (flagResolve)="onFlagResolve($event)"></gpr-flag-item>
        </div>
      </gpr-card>
    </gpr-card>
  `,
  styleUrls: ['./flagged-plan.component.scss']
})
export class FlaggedPlanComponent implements OnInit {

  /**
   * A Plan and its list of summaries and its list of flags
   */
  @Input() plan: IFlaggedPlan;

  /**
   * When a resolve is emitted it cascades up to f;ag landing page.
   * @type {EventEmitter<any>}
   */
  @Output() flagResolve: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitter for when a plan is selected.
   * @type {EventEmitter<string>}
   */
  @Output() planSelect: EventEmitter<string> = new EventEmitter<string>();

  /**
   *  Flags associated with a plan
   */
  public flags: IFlag[];

  /**
   *  Flag associated with a plan
   */
  public flag: IFlag = <IFlag>{};

  /**
   * Default constructor for FlagItemComponent
   */
  constructor(private _flagService: FlagService) {
  }

  /**
   *  Method that handles the initializing of FlagItem.
   */
  ngOnInit() {
    this.flags = this.getFlags(this.plan);
  }

  /**
   *
   * gets the flags list
   */
  public getFlags(plan: IFlaggedPlan): IFlag[] {
    return this.plan.flags;
  }

  /**
   * Handles resolve events and notifies parent component.
   * @param event
   */
  public onFlagResolve(event: IFlag): void {
    this.flagResolve.emit(event);
  }

  /**
   * Handles the click event of selecting a plan.
   * @param {string} planId: Unique Id of the plan.
   */
  public selectPlan(planId: string): void {
    this.planSelect.emit(planId);
  }
}



