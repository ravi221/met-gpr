import {animate, state, style, transition, trigger} from '@angular/animations';
import {AnimationState} from './AnimationState';

/**
 * Creates the slide in and out component
 * @type {AnimationTriggerMetadata}
 */
export const slideInOut = trigger('slideInOut', [
  state('void', style({transform: 'translate3d(0, -105%, 0)', opacity: 0})),
  state(AnimationState.VISIBLE, style({transform: 'translate3d(0, 0, 0)', opacity: 1})),
  state(AnimationState.HIDDEN, style({transform: 'translate3d(0, -105%, 0)', opacity: 0})),
  transition(`${AnimationState.VISIBLE} <=> ${AnimationState.HIDDEN}`, animate('200ms ease-in-out')),
]);
