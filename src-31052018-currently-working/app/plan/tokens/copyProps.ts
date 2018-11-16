import {cloneDeep} from 'lodash';

/**
 * Token function to deep clone an object
 * @param item
 * @returns {any}
 */
export default function copyProps(item: any) {
  return cloneDeep(item);
}
