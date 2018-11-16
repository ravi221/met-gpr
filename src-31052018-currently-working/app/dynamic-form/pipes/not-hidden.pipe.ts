import {Pipe, PipeTransform} from '@angular/core';

/**
 * Takes an array and returns the same array omitting any items which
 * have a truthy `isHidden` property.
 *
 * ```typescript
 * myObjects = [{
 *   name: 'Show me!'
 * }, {
 *   name: 'AAAAAAH!  Don\'t show me!'
 *   isHidden: true
 * }, {
 *   name: 'Show me too!'
 * }];
 * ```
 *
 * ```html
 * <div *ngFor="let myObject of myObjects | notHidden">
 *   {{myObject.name}}
 * </div>
 * ```
 */
@Pipe({
  name: 'notHidden'
})
export class NotHiddenPipe implements PipeTransform {

  transform(value: Array<any>, args?: any): any {
    return value ? value.filter(x => x && !x.isHidden) : [];
  }

}
