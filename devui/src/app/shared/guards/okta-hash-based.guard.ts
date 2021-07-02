/**
 * This is a customized Guard component for Okta integration
 * with a hash-based strategy routing.
 * 
 * Original OktaAuthGuard class available on @okta/okta-angular lib 
 * does not support Hash-based strategy on Routing.
 * If hash-based strategy is not needed for the app, 
 * you can use the regular OktaAuthGuard to protect app components.
 * 
 * For further information regarding okta callback with Hash routing 
 * refer to below references: 
 * 
 * 1) https://github.com/okta/okta-auth-js#handling-the-callback-with-hash-routing
 * 2) https://github.com/okta/okta-oidc-js/issues/672
 * 3) https://github.com/okta/okta-oidc-js/issues/672
 * 
 * @author Cesar Martinez
 * @since 02/21/2021
*/

import {
    Injectable,
    Injector
} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import {
    OktaAuthGuard,
    OktaAuthService
} from '@okta/okta-angular';


@Injectable()
export class OktaHashBasedAuthGuard extends OktaAuthGuard {
    private OKTA_STORAGE_VAR_ID_TOKEN: string = 'idToken';
    private OKTA_STORAGE_VAR_ACCESS_TOKEN: string = 'accessToken';
    private OKTA_STORAGE_VAR_REFRESH_TOKEN: string = 'refreshToken';
    private OKTA_CALLBACK_URL_PARAM_CODE_KEY: string = 'code';
    private OKTA_CALLBACK_URL_PARAM_STATE_KEY: string = 'state';
    public isAuthenticated: boolean;

    constructor(private oktaAuthHash: OktaAuthService, private injectorHash: Injector) {

        super(oktaAuthHash, injectorHash);

        this.oktaAuthHash.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);

    }

    /**
     * Gateway for protected route. Returns true if there is a valid accessToken,
     * otherwise it will cache the route and start the login flow.
     * @param route
     *  @param state
     */
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        this.isAuthenticated = await this.oktaAuthHash.isAuthenticated();
        if (this.isAuthenticated) {
            return true;
        }

        const isCallbackRedirectFromOkta: boolean = this.isCallbackRedirectFromOkta();

        const isIdTokenPresent:boolean = await this.isTokenPresent(this.OKTA_STORAGE_VAR_ID_TOKEN);
        const isAccessTokenPresent:boolean = await this.isTokenPresent(this.OKTA_STORAGE_VAR_ACCESS_TOKEN);

        // verify if any of both Tokens is NOT present in storage and the call is a redirect from okta after login
        if (  (!isIdTokenPresent || !isAccessTokenPresent)
            &&  
            isCallbackRedirectFromOkta ) {
            // store tokens
            this.storeTokensFromRedirect();
        }

        // reproduce regular flow for OktaAuthGuard
        return super.canActivate(route, state);
    }

    /**
     * Call the parseFromURL method that:
     *  does a call to Okta /token endpoint to get the ID and Access Tokens,
     *  internal Okta API gets those from URL query parameters (window.location)
     *  when having PKCE and query responseMode configured.
     * 
     * Once retrieved, this method stores the Tokens manually into LocalStorage
     * through the Okta API (Token Manager).
     */
    private async storeTokensFromRedirect(): Promise<void> {

        return this.oktaAuthHash.token.parseFromUrl().then(tokens => { // manage token or tokens 
            if (tokens.tokens.idToken) {
                this.oktaAuthHash.tokenManager.add(this.OKTA_STORAGE_VAR_ID_TOKEN, tokens.tokens.idToken);
            }
            if (tokens.tokens.accessToken) {
                this.oktaAuthHash.tokenManager.add(this.OKTA_STORAGE_VAR_ACCESS_TOKEN, tokens.tokens.accessToken);
            }
            if (tokens.tokens.refreshToken) {
                this.oktaAuthHash.tokenManager.add(this.OKTA_STORAGE_VAR_REFRESH_TOKEN, tokens.tokens.refreshToken);
            }
        }).catch(error => {
            console.error('Error while writing tokens from Okta:' + error);
        });


    }

    /**
     * Verifies if an Okta Token is present in Local Storage.
     * 
     * @param tokenKey Could be any of "idToken" or "accessToken".
     * @returns if the okta token is present
     */
    private async isTokenPresent(tokenKey: string): Promise<boolean> {
        const idToken = await this.oktaAuthHash.tokenManager.get(tokenKey);

        if (idToken){
            return true;
        } else
            return false;

    }

    /**
     * Verifies if navigation URL (prior to be routed by Angular) 
     * is a callback from Okta.
     * 
     * @returns true if, based on the navigation URL and queries, this is a callback from Okta
     */
    private isCallbackRedirectFromOkta(): boolean{
        const url: string = window.location.toString();
        const query: string = window.location.search;

        return url.includes(this.oktaAuthHash.options.redirectUri)
                    && query
                    && query.includes(this.OKTA_CALLBACK_URL_PARAM_CODE_KEY)
                    && query.includes(this.OKTA_CALLBACK_URL_PARAM_STATE_KEY);
    }

}