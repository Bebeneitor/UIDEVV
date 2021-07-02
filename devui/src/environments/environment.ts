// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  restServiceUrl: "http://localhost:8080/",
  // restServiceUrl: 'https://devecl.cotiviti.com/ecl-core/',
  // Change this variables if you  need test it in your local env
  restServiceSavingsUrl: 'https://devecl.cotiviti.com/cds/',
  restCrossWalkServiceUrl: 'https://devecl.cotiviti.com/cws/',
  industryUpdateServiceUrl: 'https://devecl.cotiviti.com/iuh/',
  referenceDataAcqServiceUrl: 'https://devecl.cotiviti.com/rrs/',
  researchRequestServiceUrl: 'https://devecl.cotiviti.com/rrqs',
  // researchRequestServiceUrl: 'http://localhost:9090',
  mwfReportServiceUrl: 'https://devecl.cotiviti.com/mwf/',
  webCrawlingServiceUrl: 'https://devecl.cotiviti.com/webcrawldds/',
  
  cacheServiceUrl: 'http://localhost:9090/',
  
  cvpDocsServiceUrl: 'http://localhost:9091/cvp-docs/',
  
  // referenceDataAcqServiceUrl: '/rrs/'
  // industryUpdateServiceUrl: 'http://localhost:9090/',
  // restServiceUrl: 'http://localhost:8080/',


  restServiceDnBUrl: "https://devecl.cotiviti.com/",
  
  versionCheckURL: 'version.json',

  // Local Dev Okta configuration: 
  // Use first/second option (depending on the required environment) in order
  //   to avoid depending on a local back-end service providing the Okta config.
  // Use third option
  //   for retrieving configuration from a local ecl-core back-end service.
  // Avoid using any of dev1, dev2, qa1, qa2,... URL, since the Okta
  //   configuration on those will redirect UI nav to the corresponding ECL env.
  oktaUIConfigResource: 'assets/okta-config-localdev.json',
  //oktaUIConfigResource: 'assets/okta-config-localqa.json',
  //oktaUIConfigResource: 'http://localhost:8080/okta-ui-config',

};
