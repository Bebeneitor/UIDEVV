import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AppComponent } from "src/app/app.component";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";
import { Constants } from "src/app/shared/models/constants";
import { AppUtils } from "src/app/shared/services/utils";
import { UtilsService } from "src/app/services/utils.service";
import { OktaAuthService } from "@okta/okta-angular";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { DnbAuthService } from "../dnb/services/dnb-auth.service";
import { storageGeneral } from "../dnb/models/constants/storage.constants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  dataUser: any = {
    userId: 0,
    email: "",
  };

  isAuthenticated: boolean;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private app: AppComponent,
    private authService: AuthService,
    private storageService: StorageService,
    private util: AppUtils,
    private utilsService: UtilsService,
    private oktaAuth: OktaAuthService,
    private loadingSpinnerService: LoadingSpinnerService,
    private dnbAuthService: DnbAuthService
  ) {
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
  }

  async ngOnInit() {
    this.storageService.remove("PARENT_NAVIGATION");

    this.loadingSpinnerService.setDisplayMessage("Signing in...");
    this.loadingSpinnerService.isLoading.next(true);

    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // if user already authenticated, redirect to home
    if (this.isAuthenticated) {
      this.afterOktaLogin();
    }
  }

  /**
   * Check if is in login page
   */
  isLogin() {
    return this.app.isLogin;
  }

  oktaLogin() {
    // redirect to Okta-hosted widget login

    this.oktaAuth.signInWithRedirect();
  }

  /**
   * Performs the required steps after successful login (Okta):
   *  1) Validates and Retrieves User Details from DB by username
   *  2) Get Redis Cache URL config by environment
   *  3) Authenticate against D&B services
   *  4) Redirect Home
   *
   */
  afterOktaLogin() {
    // retrieve User Details from ECL DB
    this.retrieveUserDetails().then((res: any) => {
      if (!res.code) {
        // get Redis URL set by environment from ECL Lookups (Service <-- DB)
        this.utilsService.getCacheUrl().subscribe((response: any) => {
          Constants.redisCacheUrl = response.data;
        });

        this.dnbAuthService
          .getDnbPermissions(this.dataUser.userName)
          .subscribe((response) => {
            this.storageService.set(
              storageGeneral.dnbPermissions,
              response,
              true
            );
          });

        this.redirectHome();
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
          life: 2000,
          closable: false,
        });
      }
    });
  }

  /**
   * Get all user data from backend
   */
  retrieveUserDetails() {
    return new Promise(async (resolve, reject) => {
      const eclUsername = await this.authService.getUserNameFromAuth();

      this.authService.validateUser(eclUsername).subscribe((res: any) => {
        if (res !== null) {
          this.dataUser = res.data;
          this.dataUser["email"] = res.data.userName;

          //Store last login date in all widgets
          if (res.data.lastDayLogin != undefined && res.data.lastDayLogin != null) {

            let loginDate = new Date(res.data.lastDayLogin.split(".")[0]);

            this.storageService.set("DATES_IDEAS_GENERATED_START", { date: loginDate }, true);
            this.storageService.set("DATES_MY_CONTRIBUTIONS_START", { date: loginDate }, true);
            this.storageService.set("DATES_RULES_IMPLEMENTED_START", { date: loginDate }, true);
            this.storageService.set("DATES_TOP_TEN_START", { date: loginDate }, true);
            this.storageService.set("DATES_UPDATED_RULES_START", { date: loginDate }, true);
            this.storageService.set("DATES_NEW_RULES_START", { date: loginDate }, true);
            this.storageService.set("DATES_DEPRECATED_RULES_START", { date: loginDate }, true);
          }

          resolve(true);
        } else {
          resolve(false);
        }
      }, (errorReason: any) => {
        // stop spinner
        this.loadingSpinnerService.isLoading.next(false);
        this.authService.goToOktaHomeDelay(3000);
        throw new Error("Error while signing into ECL: " + errorReason);
      });
    })
  }

  /**
   * Redirect to home page after login validations, if there is an existing URL to be
   * redirected it will take and navigate to that URL.
   *
   * @memberof LoginComponent
   */
   redirectHome() {

    //Load user data in session, maybe in the future we need to put in session and validate token
    //for protect the user session (session.filter.ts) because now only validate if the userSession
    //variable exists in session
    this.storageService.set("userSession", this.dataUser, true);

    //Call loadPermissions function
    this.app.loadPermissions().then(res => {
      // Redirect to home page

      this.app.isUserLoggedIn = true;
      this.app.isLogin = false;

      this.util.getAllCategoriesWidgets([]).then(response => {

        // stop Signing in spinner
        this.loadingSpinnerService.isLoading.next(false);

        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          localStorage.removeItem("returnUrl");
        } else {
          this.router.navigate(["/home"]);
        }
      });

    });
  }

}
