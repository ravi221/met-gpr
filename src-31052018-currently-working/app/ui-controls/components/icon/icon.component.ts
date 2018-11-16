import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';

/**
 * This component acts as a abstraction around the process of accessing the
 * correct file on the server for an icon so that other places in the code
 * do not have to be aware of the implementation.
 *
 * ```html
 * <gpr-icon [name]="'flag'" [state]="'on'"></gpr-icon>
 * ```
 *
 * The code above will insert the icon 'content/img/flag-on.svg'
 */
@Component({
  selector: 'gpr-icon',
  template: `
    <img [class]="iconSize" *ngIf="fileName" [src]="imgSource">
  `,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnChanges {
  /**
   * The name of the icon file
   */
  @Input() name: string;

  /**
   * An optional string representing the state of the icon.  In the current
   * implementation, this will be represented as a suffix in the icon file name.
   */
  @Input() state: string;

  /**
   * An optional string to size the icon
   */
  @Input() iconSize: 'default' | 'large' = 'default';

  /**
   * The name of the file to access - updated whenever the name or state changes.
   */
  public fileName: string;

  /**
   * The source of the image
   */
  public imgSource: string;

  /**
   * On changes, update the file of the icon
   */
  ngOnChanges(): void {
    if (this.name && this.state) {
      this.fileName = `${this.name}-${this.state}-icon`;
    } else if (this.name) {
      this.fileName = `${this.name}-icon`;
    } else {
      this.fileName = null;
    }
    this.imgSource = `content/img/${this.fileName}.svg`;
  }
}
