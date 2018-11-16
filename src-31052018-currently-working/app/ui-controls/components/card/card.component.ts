import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

/**
 * A generic card component, used to display content
 */
@Component({
  selector: 'gpr-card',
  template: `
    <div class="card">
      <div [hidden]="isLoadingContent">
        <ng-content></ng-content>
      </div>
      <gpr-loading-icon [show]="isLoadingContent"></gpr-loading-icon>
      <div *ngIf="showErrorMessage" class="error">
        <p>An error occurred while processing your request.</p>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  /**
   * An Observable can be passed in to display a loading icon
   */
  @Input() asyncMode: Observable<any>;

  /**
   * Indicates if the content of the card is loading
   * @type {boolean}
   */
  isLoadingContent: boolean = false;

  /**
   * Indicates if to show the error message
   * @type {boolean}
   */
  showErrorMessage: boolean = false;

  /**
   * Default constructor
   */
  constructor() {
  }

  /**
   * On init, conditionally display a loading icon while the data is being retrieved
   */
  ngOnInit() {
    if (this.asyncMode && this.asyncMode instanceof Observable) {
      this.isLoadingContent = true;
      this.asyncMode.subscribe(() => {
        this.isLoadingContent = false;
      }, () => {
        this.isLoadingContent = false;
        this.showErrorMessage = true;
      });
    }
  }
}
