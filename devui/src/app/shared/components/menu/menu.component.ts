import {Component, OnInit} from '@angular/core';
import {MenuService} from 'src/app/services/menu.service';
import {Router} from '@angular/router';
import {NgxPermissionsService} from 'ngx-permissions';
import {StorageService} from 'src/app/services/storage.service';
import {PageTitleConstants} from 'src/app/shared/models/page-title-constants';
import {BrowserCacheService} from 'src/app/services/browser-cache.service';
import {storageDrug} from 'src/app/modules/dnb/models/constants/storage.constants';
import {Constants} from 'src/app/shared/models/constants';
import {EclLookupsService} from 'src/app/services/ecl-lookups.service';
import {map} from 'rxjs/operators';
import {OktaAuthService} from '@okta/okta-angular';
import {AuthService} from 'src/app/services/auth.service';
import {UtilsService} from '../../../services/utils.service';

declare let $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems: any;
  _opened: boolean = false;
  _openedSmall: boolean = false;

  toggle: boolean = true;

  sameSimTitle: string = PageTitleConstants.SAME_SIM_INDUSTRY_UPDATE_PROCESS;

  rdaImage = 'assets/img/eclBookIcon.png';
  assetPath: string;
  openDialog: boolean = false;
  rrLoginDialog: boolean = false;
  rrNavReqType: string;
  rrFlowEnabled: boolean = false;
  setUpDialog = {
    header: "",
    container: [
      {value: "ECL", label: "ECL"},
      {
        value: "DNB",
        label: "Drugs & Biological",
      },
    ],
    buttonCancel: false,
    valueButton: "Select",
    valueDefault: "ECL",
  };

  setUpRrDialog = {
    header: '',
    jiraUserName: '',
    password: '',
    buttonCancel: false,
    valueButton: 'Login',
  };

  showRuleMaintenance: boolean = false;
  showIndustryUpdate: boolean = false;
  showJiraLoginFlag: boolean = false;

  isAuthenticated: boolean;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private permissionService: NgxPermissionsService,
    private sotrageService: StorageService,
    private browserCacheService: BrowserCacheService,
    private _utilService: UtilsService,
    private lookupService: EclLookupsService,
    public oktaAuth: OktaAuthService,
    private eclAuthService: AuthService) {
    // subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  async ngOnInit() {
    // get authentication state for immediate use
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (!this.isAuthenticated) // skip initial menu process if okta token is not found
      return;

    this.lookupService.searchNoPromise('VISIBILITY_FLAG', 'SHOW_RULE_MAINTENANCE_MENU', '1').pipe(map(response => {
      return response.find(lu => lu.statusId === 1);
    })).subscribe(response => {
      if (response && response.lookupDesc === '1') {
        this.showRuleMaintenance = true;
      }
    });

    this.lookupService.searchNoPromise('VISIBILITY_FLAG', 'SHOW_INDUSTRY_UPDATE_MENU', '1').pipe(map(response => {
      return response.find(lu => lu.statusId === 1);
    })).subscribe(response => {
      if (response && response.lookupDesc === '1') {
        this.showIndustryUpdate = true;
      }
    });

    this.getMenuPermissions();
    this.menuService.listen().subscribe((res: boolean) => {
      this._opened = res;
      this._openedSmall = !res;
    });

    let is = this;

    $(".sidebar-icon").click(function () {
      if (is.toggle) {
        $(".page-container").addClass("sidebar-collapsed").removeClass("sidebar-collapsed-back");
        $("#router-outlet").css({"margin-left": "50px"});
        $("div[data-toggle='collapse']").not(this).next('span').removeClass('in');
      } else {
        $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
        $("#router-outlet").css({"margin-left": "300px"});
        $("menu a").width(30).height(30);
      }

      if (!$(this).parents().hasClass('collapse show')) {

        $('div').removeClass('show');
      }

      is.toggle = !is.toggle;
    });

    $('#menu').on('click', function () {
      $("#menu a").click(function () {
        if (is.toggle) {
          $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
          $("#router-outlet").css({"margin-left": "300px"});
        }
        is.toggle = true;
      });

    });
    this.populateEnabledRRLinked();
    this.showJiraLoginFlagEnabled();
    this.rrNavReqType = '';
  }

  closeMenu() {
    this.menuService.toogle(false);
  }

  logout() {

    let settingsOpen = this.sotrageService.get("SETTINGS_DASHBOARD_OPEN", false);

    if (settingsOpen != null) {
      if (settingsOpen == "true") {
        return;
      }
    }

    this.permissionService.flushPermissions();
    this.browserCacheService.removeAll();

    this.toggle = true;

    $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
    $("#router-outlet").css({"margin-left": "300px"});
    $("menu a").width(30).height(30);

    this.eclAuthService.signOut();
  }

  openDialogHelp() {
    this.setUpDialog.valueDefault = 'ECL'
    this.openDialog = true;
  }

  openTabSelected(selection: string) {
    this.openDialog = false;
    selection === 'ECL' ? this.menuService.getHelpPage() : this.menuService.getHelpDnb()
  }

  menuActivate(id: string): boolean {
    let isActivate = true;
    if (this.menuItems) {
      for (const menuItem of this.menuItems) {
        if (menuItem.lookupCode === id) {
          isActivate =
            menuItem.lookupDesc.toUpperCase() === "FALSE" ? false : true;
          break;
        }
      }
    }
    return isActivate;
  }

  async getMenuPermissions() {
    await this._utilService
      .getAllLookUps("UI_TOGGLE_MENU_ID")
      .subscribe((response) => {
        this.menuItems = response;
      });
  }

  refreshDrugLibraryFilters(): void {
    this.sotrageService.remove(storageDrug.filterSelectDrug);
    this.sotrageService.remove(storageDrug.filterSelectDrugABC);
    this.sotrageService.remove(storageDrug.filterSelectDrugList);
  }

  refreshApprovalFilters(): void {
    this.sotrageService.remove(storageDrug.filterSelectDrugApproval);
  }

  populateEnabledRRLinked() {
    this.rrFlowEnabled = false;
    this._utilService.getAllLookUps(Constants.RR_FLOW_ENABLED).subscribe((resp) => {
      resp.forEach(value => {
        if (value && value.lookupDesc === 'Y') {
          this.rrFlowEnabled = true;
        }
      });
    });
  }

  getResearchRequestLogin(reqType: string) {
    const jiraUserLoggedIn = JSON.parse(localStorage.getItem('TRACK_JIRA_USER_LOGIN'));
    if (!jiraUserLoggedIn) {
      this.rrLoginDialog = true;
    }
    this.rrNavReqType = reqType;
    this.redirectToResearchRequestPageByJiraLoggedIn(reqType);
  }

  hideRRLoginDialog() {
    this.rrLoginDialog = false;
  }

  private redirectToResearchRequestPageByJiraLoggedIn(reqType: string) {
    const jiraUserLoggedIn = JSON.parse(localStorage.getItem('TRACK_JIRA_USER_LOGIN'));
    if (jiraUserLoggedIn) {
      if (reqType === Constants.NEW_RR_ROUTE_PAGE) {
        this.router.navigate(['/new-research-request']);
      } else if (reqType === Constants.MY_RR_ROUTE_PAGE) {
        this.router.navigate(['/my-research-request']);
      } else if (reqType === Constants.UNASSIGNED_RR_ROUTE_PAGE) {
        this.router.navigate(['/unassigned-research-request']);
      } else if (reqType === Constants.REASSIGNED_RR_ROUTE_PAGE) {
        this.router.navigate(['/reassignment-research-request']);
      } else if (reqType === Constants.REQUEST_SEARCH_ROUTE_PAGE) {
        this.router.navigate(['/search-research-request']);
      }
    }
  }

  showJiraLoginFlagEnabled() {
    this.showJiraLoginFlag = false;
    this._utilService.getAllLookUps(Constants.RR_JIRA_LOGIN_FLAG).subscribe((resp) => {
      resp.forEach(value => {
        if (value && value.lookupDesc === 'Y') {
          this.showJiraLoginFlag = true;
        }
      });
      this.sotrageService.set('SHOW_JIRA_LOGIN_FLAG', this.showJiraLoginFlag, true);
    });
  }
}
