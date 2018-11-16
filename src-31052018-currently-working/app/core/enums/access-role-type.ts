/**
 * The available access roles that a user can have. Roles are managed by IBSE and provided to UI from REST API.
 */
export enum AccessRoleType {
  SUPPORT = 'Support read-only access',
  STANDARD = 'General purpose access',
  SUPER = 'Administrator access',
  KNOWLEDGE = 'Knowledge editor access',
  NOT_FOUND = 'UNKNOWN'
}
