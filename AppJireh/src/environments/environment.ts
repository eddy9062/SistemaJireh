// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  storage_sufix: "jireh_",
  secureStorage: false,
  api_url: 'http://{host}:50000',
  
  host_auth: { host: 'localhost', port: '3000' },
  host_intra_auth: { host: 'localhost', port: '3000' },
  host: { host: 'localhost', port: '3000' },
  /*host_auth: { host: 'vpn1.santaana.com.gt', port: '1818' },
  host_intra_auth: { host: '10.10.2.7', port: '8080' },
  host: { host: 'vpn1.santaana.com.gt', port: '1818' },*/
  
  //host_intra: { host: '192.168.36.13', port: '8080' },
  
  //appUUID: "8356ad22-b619-460b-96a7-68c19938e5c7",
  version: "1.0",
  database: {
    dbKey: 'MIIBIjANBgkqhkiG9w0BAQEFAA'
  },
  databaseName: "jirehdb",
  databaseVersion: 1,
  jwtConfig: {
    allowedDomains: ["santaana.com.gt"],
    disallowedRoutes: ["http://santaana.com.gt"],
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
