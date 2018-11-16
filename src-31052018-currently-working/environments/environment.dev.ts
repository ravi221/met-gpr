// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.


/**
 * This is the default environment configuration for the app. It uses the FQDN of the API so we can reach the services when running the application locally (development).
 *
 * NOTE: These settings can be modified during development to point to a specific environment of the REST API if needed.
 *
 * To make development and debugging locally easier, we provide URLs for each environment and are currently using the CORE services endpoint until UI services are operational.
 *
 * @type {{production: boolean; apiUrl: string, headers: {}, startup: ()}
 */
export const environment = {
  production: false,
  apiUrl: 'http://usazebasu019cl.met_intnet.net:35674/GPRUIService/api',
  headers: {
    'System': 'GPR-UI',
    'UserId': '',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-Id': '',
    'skip-auth': 'Yes'
  },
  startup: () => {}
};
