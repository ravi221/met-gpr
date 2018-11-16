import {TemplateRef, Component, Type} from '@angular/core';

/**
 * Provides the possible types of content to be used when invoking a new modal.
 */
export type ModalContentType = string | TemplateRef<any> | Type<Component>;
