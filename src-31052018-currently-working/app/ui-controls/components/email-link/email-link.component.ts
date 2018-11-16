import {Component, Input, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';

/**
 * Component used for handling emails.
 */
@Component({
  selector: 'gpr-email-link',
  template: `
    <a class="email-link" [href]="mailToString"><ng-content></ng-content></a>
  `,
})
export class EmailLinkComponent implements OnInit {

  /**
   * The string the contains all the necessary information to open up an email
   */
  public mailToString: string;

  /**
   * The address of the email
   */
  @Input() emailAddress: string;

  /**
   * The subject of the email
   */
  @Input() subject: string;
  /**
   * The body of the email
   */
  @Input() body: string;

  /**
   * Default constructor
   */
  constructor() { }

  /**
   * ngInit
   */
  ngOnInit() {
    this.mailToString = `mailto:${this.emailAddress}`;
    if (!isNullOrUndefined(this.subject)) {
      this.mailToString += '?Subject=' + this.subject;
    }
    if (!isNullOrUndefined(this.body)) {
      this.mailToString += '&body=' + this.body;
    }
  }

}
