import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, MenuItem } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { environment } from '../../../../environments/environment';
import { SettingsDasbhoardComponent } from '../settings-dasbhoard/settings-dasbhoard.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { BrowserCacheService } from 'src/app/services/browser-cache.service';
import { OktaAuthService } from '@okta/okta-angular';
import { AuthService } from 'src/app/services/auth.service';

declare let $: any;
let component: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DialogService]
})
export class HeaderComponent implements OnInit {

  @ViewChild('menu',{static: true}) menu;


  items: MenuItem[];

  modalOpen: boolean = false;

  isAuthenticated: boolean;

  constructor(private app: AppComponent,
    public dialogService: DialogService,
    private permissionService: NgxPermissionsService,
    private storageService: StorageService,
    private router: Router,
    private borwserCacheService: BrowserCacheService,
    private oktaAuth: OktaAuthService,
    private eclAuthService: AuthService) {
      // subscribe to authentication state changes
      this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  async ngOnInit() {
    // get authentication state for immediate use
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    this.items = [
      /*{ label: 'Profile Settings', icon: 'fa fa-user' },*/
      { label: 'Dashboard Settings', icon: 'fa fa-cog', command: this.openSettings },
      { label: 'Log out', icon: 'fa fa-lock', command: this.logout }
    ];

    component = this;
  }

  /**\
   * Open modal for configue dashboard settings
   */
  openSettings() {

    component.modalOpen = true;
    component.storageService.set("SETTINGS_DASHBOARD_OPEN", true, false);

    const ref = component.dialogService.open(SettingsDasbhoardComponent, {
      header: 'Dashboard Settings',
      width: '70%',
      closable: false,
      data: {
        tab: 'widgets'
      }
    });

    ref.onClose.subscribe((response: any) => {
      component.modalOpen = false;
      component.storageService.set("SETTINGS_DASHBOARD_OPEN", false, false);
    });
  }

  /**
   * Do logout in the system
   */
  logout() {
    component.permissionService.flushPermissions();

    component.borwserCacheService.removeAll();

    $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
    $("#router-outlet").css({ "margin-left": "300px" });
    $("menu a").width(30).height(30);

    component.eclAuthService.signOut();
  }

  /**
   * Get name for user logged
   */
  getUserLogged() {
    return this.app.currentUser != null ? this.app.currentUser.firstName : "Not Logged";
  }

  /**
   * change toogle status in menu
   * @param event
   */
  toogleMenu(event) {
    if (!component.modalOpen) {
      this.menu.toggle(event)
    }
  }
}
