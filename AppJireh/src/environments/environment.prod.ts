export const environment = {
  production: false,
  storage_sufix: "jireh_",
  secureStorage: false,
  api_url: 'http://{host}:50000',
  
  host_auth: { host: 'localhost', port: '3000' },
  host_intra_auth: { host: 'localhost', port: '3000' },
  host: { host: 'localhost', port: '3000' },
  
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
