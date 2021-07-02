/**
 * Interceptor used for attaching the Auth Token
 * within headers on every call to external URIs.
 */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StorageService } from 'src/app/services/storage.service';
import { MenuService } from 'src/app/services/menu.service';
import { OktaAuthService } from '@okta/okta-angular';


@Injectable()
export class Ecllnterceptor implements HttpInterceptor {
  isAuthenticated: boolean;

  constructor(private authenticationService: AuthService, private router: Router,
    private messageService: MessageService, private storageService: StorageService,
    private menuService: MenuService, private acivatedRoute: ActivatedRoute,
    private oktaAuth: OktaAuthService,
    private eclAuthService: AuthService) { 

      // subscribe to authentication state changes
      this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
   }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    // delegate to another method to allow async-await features
    return from(this.handle(request, next));

  }

   /**
   * Handles the actual request. 
   * 
   * It validates if the user is authenticated and adds the token as Authorization header
   * to outgoing HTTP requests.
   * 
   * @param request 
   * @param next Next Handler in the Chain of Responsibility pattern implementation
   */
  private async handle(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>>{

    // get Okta Authentication state
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    // Validate if the user is authenticated
    if (!this.isAuthenticated){

      // if not authenticated, sign out and redirect to Okta Dashboard
      console.warn('No valid Authorization Token was found in the browser session, hence redirecting user to login page.');
      this.messageService.add({ key: 'globalToast', severity: 'warn', detail: "No valid Authorization Token was found in your session, we will redirect you to login page." });
      this.setReturnUrl();
      this.close();
      this.eclAuthService.signOut();

    }else{
      // if authenticated

      // Get Access Token and add it to the HTTP Request call as Authorization header
      const oktaAccessToken = this.oktaAuth.getAccessToken();
      if (oktaAccessToken !== null) {
        const bearerHeader = {
          'Authorization': 'Bearer ' + oktaAccessToken,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With'
        };

        if (request.url.includes('version.json')) {
          // avoid browser cache when fetching the UI version resource
          return next.handle(request.clone({
            headers: new HttpHeaders({
              ...bearerHeader,
              'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
              'Pragma': 'no-cache',
              'Expires': '0'
            })
          })).toPromise();
        } else {
          // for any other resource, just include the Okta Access Token in Auth Header
          return next.handle(request.clone({
            headers: new HttpHeaders({ ...bearerHeader })
          })).toPromise();

        }

      }

    }

    // continue with next handler in the chain
    return next.handle(request).toPromise();

  }

  private close() {
    try{
      this.menuService.closeSettings();
    }catch(e){
      // do nothing
    }    
  }

  private setReturnUrl() {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl && returnUrl.includes('item-detail')) {
      localStorage.setItem('returnUrl', returnUrl);
    }
  }

}
