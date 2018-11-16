import {CookieHelper} from 'app/core/utilities/cookie-helper';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

enum Environment {
  DEV = 'http://usazebasu019cl.met_intnet.net:35674/GPRUIService/api',
  INT = 'http://ustry1basy00acl.met_intnet.net:35674/GPRUIService/api'
}
enum TestUser {
  SUPER_USER = 'AQ707801',
  READONLY_USER = 'AQ707803',
  STANDARD_USER = 'AQ707802',
  KNOWLEDGE_USER = 'AQ707804'
}

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
  // DEV
  apiUrl: 'http://usazebasu019cl.met_intnet.net:35674/GPRUIService/api',
  // INT
  // apiUrl: 'http://ustry1basy00acl.met_intnet.net:35674/GPRUIService/api',
  headers: {
    'System': 'GPR-UI',
    'UserId': '435453',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-Id': '',
    'skip-auth': 'Yes'
  },
  startup: () => {
    CookieHelper.setMetnetId(TestUser.SUPER_USER);
  }
};
