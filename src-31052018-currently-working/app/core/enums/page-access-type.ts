/**
 * Contains the different levels of page access. Use the product type in cobination with the user's access to determine these values
 */
export enum PageAccessType {
  READ_ONLY = 'read-only',
  LIMITED_STANDARD_ACCESS = 'limited standard access',
  FULL_STANDARD_ACCESS = 'full standard access',
  SUPER_USER = 'super user',
  KNOWLEDGE_USER = 'knowledge user',
  NONE = 'none'
}
