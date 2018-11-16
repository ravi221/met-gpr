import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { isNil } from 'lodash';

/**
 * Displays flags and comments.
 */
@Component({
  selector: 'gpr-flag-item',
  template: `
    <div class="col-sm-24 col-md-12 col-lg-18 item-container">
      <div class="flag-title"><span class="text-style"><strong>{{flag.questionName}}: </strong> <i>({{flag.questionValue}})</i></span>
      </div>
      <div class="comment-text">{{flag.text}}</div>
      <footer class="item-footer">
        <span class="comment-footer-text"><gpr-email-link [emailAddress]="flag.lastUpdatedByEmail">{{flag.lastUpdatedByEmail}}</gpr-email-link></span>
        <span class="comment-footer-text item-updt-ts">{{flag.lastUpdatedTimestamp}}</span></footer>
    </div>
    <div class="col-sm-24 col-md-12 col-lg-6" *ngIf="!isResolved">
      <div class="pull-right">
        <gpr-icon (click)="onFlagResolve(flag)" class="resolver-img" name="check-off"></gpr-icon>
        <span class="resolve-flag-text">Resolve Flag</span>
      </div>
    </div>
  `,
  styleUrls: ['./flag-item.component.scss']
})
export class FlagItemComponent implements OnInit {
  /**
   * Flag that is displayed in comment
   */
  @Input() flag: IFlag;
  /**
   * Notifies parent component of resolve event
   * @type {EventEmitter<IFlag>}
   */
  @Output() flagResolve: EventEmitter<IFlag> = new EventEmitter();

  /**
   * if flags already resolved
   */
  public isResolved: boolean = false;

  /**
   * Basic no-arg constructor
   */
  constructor() {
  }

   /**
   * On init, setup the flag tooltip
   */
  ngOnInit(): void {
    if (isNil(this.flag.questionValue)) {
      this.flag.questionValue = '';
    }
    if (this.flag.isResolved) {
      this.isResolved = this.flag.isResolved;
    }
  }

  /**
   * Handles resolve events and notifies parent component.
   * @param event
   */
  public onFlagResolve(flag: IFlag): void {
    this.flagResolve.emit(flag);
  }

}
