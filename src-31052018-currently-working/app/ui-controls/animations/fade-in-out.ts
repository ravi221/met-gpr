import {animate, state, style, transition, trigger} from '@angular/animations';
import {AnimationState} from './AnimationState';

/**
 * Creates the fade in and out animation
 * @type {AnimationTriggerMetadata}
 */
export const fadeInOut = trigger('fadeInOut', [
  state('void', style({opacity: '0', position: 'relative', top: '-10px', height: '0px'})),
  state(AnimationState.VISIBLE, style({opacity: '1', position: 'relative', top: '0', height: '*', overflow: 'visible'})),
  state(AnimationState.HIDDEN, style({opacity: '0', position: 'relative', top: '-10px', height: '0px', overflow: 'hidden'})),
  transition(`${AnimationState.VISIBLE} <=> ${AnimationState.HIDDEN}`, animate('200ms ease-in-out')),
]);

/**
 * Creates the fade in and out animation for only opacity
 * @type {AnimationTriggerMetadata}
 */
export const fadeInOutLoadingSpinner = trigger('fadeInOutLoadingSpinner', [
  state('void', style({opacity: '0', 'pointer-events': 'none'})),
  state(AnimationState.VISIBLE, style({opacity: '1', 'pointer-events': 'auto'})),
  state(AnimationState.HIDDEN, style({opacity: '0', 'pointer-events': 'none'})),
  transition(`${AnimationState.VISIBLE} <=> ${AnimationState.HIDDEN}`, animate('250ms ease-in-out')),
]);
