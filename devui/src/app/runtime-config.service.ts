import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { OktaConfig } from '@okta/okta-angular';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from "./shared/models/routing-constants";

/**
 * Interface holding dinamic configuration.
 * Additional attributes can be added as required.
 */
export interface IAppConfig {
    
    oidc: OktaConfig;

}

/**
 * 
 * This service is used to load dinamically configuration
 * during the application initialization.
 * 
 * Initially is being used for loading Okta configuration
 * per environment, relying in a back-end REST API
 * that returns the corresponding config values.
 * 
 * For implementing this, we will use it on primary module (app.module.ts)
 * as a dependency for the APP_INITIALIZER, so that dynamic configuration
 * can be loaded whenever the user loads the Single Application Page (SPA)
 * on its browser. Hence, decoupling this process from the build (CI).
 * 
 * @author cesar.martinez
 * @since April 14th 2021
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class RuntimeConfigService {
    public appConfig: IAppConfig;
    
    /**
     * Use HttpBackend in constructor, instead of HttpClient,
     * in this way the service is not intercepted by Interceptors
     * and can issue the request even before Interceptors are loaded.
     * 
     * https://stackoverflow.com/a/49013534/6118500
     */
    private httpClient: HttpClient;

    constructor( handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
    }

    load() {

        // resource / back-end environment (dev, qa, uat, prod)
        const jsonConfigUri = environment.oktaUIConfigResource;

        return this.httpClient.get(jsonConfigUri)
            .pipe(
                map((returnedConfig: IAppConfig) => {
                    this.appConfig = returnedConfig;
                })
            )
            .toPromise();
    }

    public getOktaConfigAsVar(){

        const oktaConfig = {
          issuer: this.appConfig.oidc.issuer,
          redirectUri: this.appConfig.oidc.redirectUri,
          clientId: this.appConfig.oidc.clientId,
          scopes: this.appConfig.oidc.scopes,
          postLogoutRedirectUri: this.appConfig.oidc.postLogoutRedirectUri,
          
          // static attributes
          pkce: true,
          responseMode: "query",
          tokenManager: {
            autoRenew: true
          }
          
        };

        return oktaConfig;
    }

}