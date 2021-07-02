import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoutingConstants } from '../shared/models/routing-constants';
import { OktaAuthService } from '@okta/okta-angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, 
    private storageService: StorageService,
    private oktaAuth: OktaAuthService) { }

  validateUser(user) {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.USERS_URL + "/" + RoutingConstants.VALIDATE_USER_URL, { "userName": user});
  }

  public getLoggedUser() {
    return this.storageService.get("userSession", true);
  }

  public hasLoggedUserRoleByPropertyAndValue(property: string, value: string): boolean {
    const user = this.getLoggedUser();
    let userHasRole: boolean = false;

    const roles: any[] = user.roles;
    if (roles) {
      const role = roles.filter(role => {
        return role[property] === value;
      });

      if (role && role.length > 0) {
        userHasRole = true;
      }
    }

    return userHasRole;
  }

  /**
   *
   * Signs user out of ECL, removes ECL and Okta data from Local Storage.
   * 
   * If keepSSO is true: only signs the user out of ECL and redirects to Okta Home Page, 
   * the user will be able to navigate to other applications registered in Okta (including ECL again).
   * 
   * If keepSSO is false: sign the user out of ECL and Okta. Full Sign-out.
   *
   * @param keepSSO Determines if the Single Sign On (SSO) must be kept after Signing user out of the application. True by default.
   */
   public signOut(keepSSO: boolean = true): void{
    if (keepSSO){
      // Sign users out of the ECL application by ending their local session. 
      // This signs the user out of the Okta ECL app, but doesn't sign the user out of Okta tenant.
      this.oktaAuth.tokenManager.clear();
		  this.storageService.removeAll();
		  this.goToOktaHome();
    } else{
      // Application Logout (no SSO) - remove all Okta Tokens and Cookies from browser, so that no SSO is performed
      this.oktaAuth.signOut().then(() => {
        this.storageService.removeAll();
      });
    }
  }

  /**
   * Redirects current browser window to Okta Post Logout Redirect URI
   * configured. Usually the Okta Dashboard corresponding to the environment.
   */
  public goToOktaHome(): void{
    const oktaUrlPostLogout =  this.oktaAuth.getOktaConfig().postLogoutRedirectUri;
    window.location.href=oktaUrlPostLogout;
  }

  /**
   * After a specified milliseconds delay, it redirects current browser window 
   * to Okta Post Logout Redirect URI configured. 
   * Usually the Okta Dashboard corresponding to the environment.
   * @param ms Delay in milliseconds.
   */
  public goToOktaHomeDelay(ms: number): void{
    setTimeout(() => {
      this.goToOktaHome();
    }, ms);
  }

  /**
   * Returns the username from the authorization token.
   * 
   * Get the value from the token claims, scope: email
   * 
   * Once the primary email is obtained, we remove the domain part.
   * 
   * @returns the username present in the authorization token
   */
  public async getUserNameFromAuth(): Promise<string> {
    const userClaims = await this.oktaAuth.getUser();

    const email = userClaims.email;
    const eclUsername = email.substring(0, email.lastIndexOf("@"));

    return eclUsername;
  }

}
