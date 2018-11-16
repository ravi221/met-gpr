/**
 * This is the environment configuration for our deployed application.
 *
 * Since our application is hosted on the same domain as the REST APIs, it is not required to have the full API URL as the root of our API calls.
 *
 * This eliminates the need for the UI to be aware of which environment it is currently deployed on and the API URL that it needs to communicate with.
 *
 * @type {{production: boolean; apiUrl: string, headers: {}, startup: ()}
 */
export const environment = {
  production: true,
  apiUrl: 'GPRUIService/api',
  headers: {
    'System': 'GPR-UI',
    'UserId': '',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-Id': ''
  },
  startup: () => {}
};
