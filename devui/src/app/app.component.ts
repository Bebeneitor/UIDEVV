import { Component, OnInit, AfterContentInit, HostListener } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { environment } from '../environments/environment';
import { PermissionsService } from './services/permissions.service';
import { ConfirmationService } from 'primeng/api';
import { StorageService } from './services/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './services/menu.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { PrintService } from './services/print.service';
import { TeamsService } from './services/teams.service';
import { EclLookupsService } from './services/ecl-lookups.service';
import { map } from 'rxjs/operators';
import { VersionCheckService } from './services/version-check.service';
import { OktaAuthService } from '@okta/okta-angular';


declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterContentInit {

  // Variable for define if the menu and header will be show to user
  isLogin: boolean;
  isUserLoggedIn: boolean;
  currentUser: any;
  message: string;
  interval: any;
  toggle = true;
  blinkInterval: any = undefined;
  hostName: string;

  oldTitle: string = 'Cotiviti | ECL';
  newTitle: string = 'Your ECL session will Expire Soon';
  printDisplay = false;

  // okta auth
  isAuthenticated: boolean;

  constructor(private permissionsService: NgxPermissionsService,
    private permissions: PermissionsService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService,
    private location: Location,
    private title: Title,
    private lookupService: EclLookupsService,
    private teamsService: TeamsService,
    private checkVersionService: VersionCheckService,
    private oktaAuth: OktaAuthService) {

    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.isLogin = true;
        }
      }
    });
  }

  async ngOnInit() {

    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // if not authenticated, skip the rest of steps
    if (!this.isAuthenticated)
      return;

    document.getElementById('showPrint').style.display = 'none';
    let is = this;

    $(window).focus(function () {

      if (is.blinkInterval) {
        clearInterval(is.blinkInterval);

        is.title.setTitle(is.oldTitle);
        $('link[rel="icon"]').attr('href', environment.restServiceUrl + 'favicon.png');

        is.blinkInterval = undefined;

      }
    });

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.checkVersionService.initVersionCheck(environment.versionCheckURL);
 
  }

  ngAfterContentInit() {
    let uriHref = window.location.href;
    let arrPath = uriHref.split('/');
    let path = arrPath[arrPath.length - 1];

    // Only for login and access denied the page don't show the menu and header
    // If you need this functionality in other pages please add below
    if (path === 'login' || path === '' || path === 'access-denied'
      // exclude also okta callback url, to avoid loading menu.component.ts in this stage
      || uriHref.includes(this.oktaAuth.getOktaConfig().redirectUri)
      ) { 
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }

    const hash = window.location.hash.substring(2, window.location.hash.length);
    if (hash.includes('item-detail')) {
      localStorage.setItem('returnUrl', hash);
    }

    // This code will be execute if the user refresh the page with F5 for load the permissions again
    if (this.storageService.exists('userSession') 
      && this.isAuthenticated) {
      this.loadPermissions();
    } else {
      this.currentUser = null;
    }
  }

  setUserLoggedIn(val) {
    this.isUserLoggedIn = val;
  }

  /**
   * Get roles for user
   */
  getUserRoles() {
    let roles = '';

    if (this.currentUser != null) {
      this.currentUser.roles.forEach(element => {
        roles += element.roleName + ',';
      });

      if (roles != '') {
        roles = roles.substring(0, roles.length - 1);
      }
    }

    return roles;
  }

  /**
   * Load permission list from backend and load in NGX component and in storage
   */
  loadPermissions() {
    return new Promise((resolve, reject) => {

      // Get the session info
      if (this.storageService.exists('userSession')
          && this.isAuthenticated) {
        this.currentUser = this.storageService.get('userSession', true);
        
        

        // Here, call backend web service for retrieve the permissions array, provide the user email (session.email)
        this.permissions.getPermissions(this.currentUser.userId).subscribe((response: any) => {
          const roles = [];
          const functionalities = [];
          const elements = [];

          let isDefaultUser = response.length == 1 && response[0].role.roleName.toUpperCase() == 'OTH';

          for (let i = 0; i < response.length; i++) {

            if(!isDefaultUser && response[i].role.roleName.toUpperCase() == 'OTH') {
              continue;
            }

            roles.push('ROLE_' + response[i].role.roleName.toUpperCase());

            for (let j = 0; j < response[i].functionalities.length; j++) {
              // This is the generic permission
              functionalities.push(response[i].functionalities[j].functionality.functionalityName.toUpperCase());

              // This is the pemission that indicate if is read or write permission _0 READ _1 WRITE
              functionalities.push(response[i].functionalities[j].functionality.functionalityName.toUpperCase() + '_' + response[i].functionalities[j].readWriteAccess);
            }
          }
          //--- for pdg users ---
          this.lookupService.searchNoPromise('VISIBILITY_FLAG', 'SHOW_PDG_TEMPLATE_TAB', '1').pipe(map(response => {
            return response.find(lu => lu.statusId === 1);
          })).subscribe(response => {
            if (response && response.lookupDesc === '1') {
              this.storageService.set('showPdgMedicaid', true, false);

              this.teamsService.getTeamsFromUser(this.currentUser.userId).subscribe((data: any) => {
                let teams: any[] = data.data;
                if (teams && teams.length == 1 && teams[0].teamName === 'PDG-Medicaid') {
                  this.storageService.set('pdgMedicaidUser', true, false);
                } else {
                  this.storageService.set('pdgMedicaidUser', false, false);
                }
              });

              let ccaPoCount: number = roles.filter(item => item === "ROLE_CCA" || item === "ROLE_PO").length;
              if (roles.some(item => item === "ROLE_MD") && ccaPoCount === 0) {
                this.storageService.set('onlyMd', true, false);
              } else {
                this.storageService.set('onlyMd', false, false);
              }
            } else {
              this.storageService.set('showPdgMedicaid', false, false);
            }

          });
        //---- for pdg users ---

          let permissions = this.removeDuplicates(roles.concat(functionalities.concat(elements)));

          // Custom ROLE that defines if the user is logged in and its roles have been loaded
          // This is a front-end local permission for validate that.
          permissions.push('LOGGED_IN');

          // Load permissions in component
          this.permissionsService.loadPermissions(permissions);

          resolve();

        });
      }
    });
  }

  removeDuplicates(arr) {
    let unique = {};
    arr.forEach(function (i) {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

  @HostListener('window:keydown.alt.s', ['$event'])
  keyDown(e: KeyboardEvent) {
    if (this.isUserLoggedIn && this.router.url !== '/home') {
      this.confirmationService.confirm({
        message: `You are about to navigate to the Dashboard. (All unsaved data will be lost!)`,
        key: 'navigate',
        accept: () => {
          this.router.navigateByUrl('home');
        }
      });
    }
  }

  blink(msg: string) {

    let is = this;
    let isOldTitle = true;

    this.blinkInterval = setInterval(function () {
      is.title.setTitle(isOldTitle ? is.oldTitle : is.newTitle);

      if (isOldTitle) {
        $('link[rel="icon"]').attr('href', environment.restServiceUrl + 'favicon.png');
      } else {
        $('link[rel="icon"]').attr('href', environment.restServiceUrl + 'assets/img/favicon-alert.png');
      }

      isOldTitle = !isOldTitle;
    }, 700);

  }

  setPrintDisplay(value) {
    if (value === true) {
      document.getElementById('showPrint').style.display = 'block'
      document.getElementById('showRouter').style.display = 'none'
    } else {
      document.getElementById('showPrint').style.display = 'none'
      document.getElementById('showRouter').style.display = 'block'
    }
  }
}

