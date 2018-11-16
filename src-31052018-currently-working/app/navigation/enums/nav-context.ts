/**
 * Defines the allowed context types that each route can be configured with.
 * Used by {@link NavigatorService} to keep the context configured for a given route.
 */
export enum NavContextType {
  CUSTOMER = 'customer',
  DEFAULT = 'default',
  FLAGS = 'flags',
  HISTORY = 'history',
  SEARCH = 'search'
}
