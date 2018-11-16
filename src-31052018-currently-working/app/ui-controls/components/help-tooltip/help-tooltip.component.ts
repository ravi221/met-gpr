import {Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {TooltipContentComponent} from '../tooltip/tooltip-content.component';
import {HelpDataService} from '../../../plan/services/help-data.service';
import {Subscription} from 'rxjs/Subscription';

/**
 * Creates a help tooltip for the user, which displays a question icon, and when clicked, displays the
 * help tooltip
 */
@Component({
  selector: 'gpr-help-tooltip',
  template: `
    <div class="help-tooltip">
      <gpr-tooltip-content name="editor" #questionTooltipContent>
        <table class="help-table-content">
          <tr>
            <div *ngIf="editable">
              <td>
                <div class="icon-24x24">
                  <a gprTooltip
                     [showArrow]="false"
                     [displayCloseIcon]="false"
                     [tooltipContent]="editorpanel"
                     [position]="'bottom'"
                     [maxWidth]=550
                     [theme]="theme">
                    <i class="material-icons">mode_edit</i>
                  </a>
                  <gpr-tooltip-content #editorpanel>
                    <ng-content select="tooltip-editor"></ng-content>
                  </gpr-tooltip-content>
                </div>
              </td>
            </div>
            <td>
                <span class="help-tooltip-content">
          <ng-content></ng-content>
                </span>
            </td>
          </tr>
        </table>
      </gpr-tooltip-content>
      <gpr-icon class="icon-24x24" name="question-tooltip"
                gprTooltip
                [tooltipContent]="questionTooltipContent"
                [position]="position"
                [theme]="theme"
                [displayCloseIcon]="displayCloseIcon"
                [maxWidth]="maxWidth">
      </gpr-icon>
    </div>
  `,
  styleUrls: ['./help-tooltip.component.scss']
})
export class HelpTooltipComponent implements OnDestroy {


  /**
   * The position of the tooltip
   */
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * The theme of the tooltip
   */
  @Input() theme: 'default' | 'white' = 'white';

  /**
   * Boolean if to display the close 'X' button or not
   */
  @Input() displayCloseIcon = false;

  /**
   * Max width for popup box
   */
  @Input() maxWidth?: number;

  /**
   * Editable help text
   */
  @Input() editable: boolean = false;

  @ViewChild('editorpanel') toolTipContentComponet: TooltipContentComponent;


  /**
   * A subscription to the validation service
   */
  private _helpSubscription: Subscription;

  /**
   * Creates the help tooltip component
   * @param {HelpDataService} _helpDataService
   */
  constructor(private _helpDataService: HelpDataService) {
  }

  /**
   * handles the close button click for the help text editor.
   */
  public closeHelpTextEditor(): void {

    this.toolTipContentComponet.closeTooltip();
  }

  /**
   * @param helpText {IHelpText}
   */
  public saveHelpTextEditor(helpText): void {
    this._helpSubscription =  this._helpDataService.updateHelpText(helpText).take(1).subscribe();
    this.toolTipContentComponet.closeTooltip();
  }


  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    if (this._helpSubscription) {
      this._helpSubscription.unsubscribe();
    }
  }
}
