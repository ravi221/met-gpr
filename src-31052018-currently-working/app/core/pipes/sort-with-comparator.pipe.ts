import {Pipe, PipeTransform} from '@angular/core';

/**
 * Takes an array and returns the same array sorted by some comparator function.
 * For example, to display a list of words in alphabetical order, you could do:
 *
 * In the component:
 *
 * ```typescript
 * myComparatorFunction = (first, second) => first > second ? 1 : -1;
 * myWords: Array<string> = ['Banana', 'Cat', 'Apple'];
 * ```
 *
 * In the template:
 *
 * ```html
 * <div *ngFor="let word of myWords | sortWithComparator: myComparatorFunction">
 *   {{word}}
 * </div>
 * ```
 */
@Pipe({
  name: 'sortWithComparator'
})
export class SortWithComparatorPipe implements PipeTransform {
  public transform(array: any[], comparator: (first: any, second: any) => number, reverse = false): any[] {
    if (!array) {
      return array;
    }
    const shallowArrayCopy = array.slice(0);
    if (reverse) {
      return shallowArrayCopy.sort((first, second) => (-1 * comparator(first, second)));
    } else {
      return shallowArrayCopy.sort(comparator);
    }
  }
}
