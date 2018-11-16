import {Pipe, PipeTransform} from '@angular/core';

/**
 * Takes in a map of objects and returns an array of those objects and the key as the id property of each object.
 * This pipe is useful for when you have a data structure that's not a collection but need to use iterator directives such as *ngFor which only supports collections.
 * For example, to repeat a map of persons using ngFor:
 *
 * In the component:
 *
 * ```typescript
 * myPersons: Map<string, any> = {'1': { name: 'Bob'}, '2': {name: 'Nick'}};
 * ```
 *
 * In the template:
 *
 * ```html
 * <div *ngFor="let person of myPersons | values">
 *   {{person}}
 * </div>
 * ```
 */
@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return Object.keys(value).map(key => {
      return {...{id: key}, ...value[key]};
    });
  }
}
