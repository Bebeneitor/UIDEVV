import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { DnbAuthService } from '../dnb/services/dnb-auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  return: string = "";
  user: any = {
    email: "",
    password: ""
  };

  dataUser: any = {
    userId: 0,
    email: ""
  };

  constructor(
    private messageService: MessageService,
    private router: Router,
    private app: AppComponent,
    private authService: AuthService,
    private storageService: StorageService,
    private util: AppUtils,
    private dnbAuthService: DnbAuthService
  ) { }

  ngOnInit() {
    this.storageService.remove("PARENT_NAVIGATION");
  }

  /**
   * Check if is in login page
   */
  isLogin() {
    return this.app.isLogin;
  }

  /**
   * Check user credentials
   */
  validateLogin() {
    return new Promise((resolve, reject) => {
      this.authService.login(this.user.email, this.user.password).subscribe((resAuth: any) => {
        let token = resAuth.Authorization;
        if (token == null || token == undefined) {
          resolve(resAuth);
        } else {

          this.storageService.set('Authorization', token, true);

          this.retrieveUserDetails().then(res => {
            resolve(res);
          });
        }
      });
    });
  }

  /**
   * Get all user data from backend
   */
  retrieveUserDetails() {
    return new Promise((resolve, reject) => {
      this.authService.validateUser(this.user.email, this.user.password).subscribe((res: any) => {
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
      });
    })
  }

  /**
   * Validate login (Click button)
   */
  login() {
    //Form validations
    if (this.user.email === "") {
      this.messageService.add({ severity: 'error', summary: 'No Data', detail: 'User email is empty!', life: 2000, closable: false });
      return;
    }

    if (this.user.password === "") {
      this.messageService.add({ severity: 'error', summary: 'No Data', detail: 'User password is empty!', life: 2000, closable: false });
      return;
    }

    //Here, call web service for validate user credentials, this code will be removed
    //when the service is working

    this.validateLogin().then((res: any) => {
      if (!res.code) {
        this.doLogin();
        this.dnbAuth();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message, life: 2000, closable: false });
      }
    });
  }

  /**
   * Redirect to home page after login validations, if there is an existing URL to be
   * redirected it will take and navigate to that URL.
   *
   * @memberof LoginComponent
   */
  doLogin() {

    //Load user data in session, maybe in the future we need to put in session and validate token
    //for protect the user session (session.filter.ts) because now only validate if the userSession
    //variable exists in session
    this.storageService.set("userSession", this.dataUser, true);

    //Call loadPermissions function
    this.app.loadPermissions().then(res => {
      // Redirect to home page
      const returnUrl = localStorage.getItem("returnUrl");

      this.app.isUserLoggedIn = true;
      this.app.isLogin = false;

      this.util.getAllCategoriesWidgets([]).then(response => {
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          localStorage.removeItem("returnUrl");
        } else {
          this.router.navigate(["/home"]);
        }
      });

    });
  }

  dnbAuth() {
    this.dnbAuthService
      .getDnbAuthToken(this.user.email, this.user.password)
      .subscribe((response) => {
        this.storageService.set("dnbToken", response.token, false);
      });
  }
}
