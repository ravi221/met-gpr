import {Component, Input} from '@angular/core';

@Component({selector: 'gpr-snack-bar', template: `    <div class="snack-bar" [hidden]="!show">
    <ng-content></ng-content>
  </div>`})
export class SnackBarStubComponent {
  @Input() show = false;
  @Input() autoHide = true;
}
