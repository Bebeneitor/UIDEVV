import { Injectable, Injector } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { NgxPermissionsService } from 'ngx-permissions';
import { map } from 'rxjs/operators';
import { EclLookupsService } from 'src/app/services/ecl-lookups.service';
import { OktaHashBasedAuthGuard } from './okta-hash-based.guard';

declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class SessionFilter extends OktaHashBasedAuthGuard {

  constructor(private router: Router, private permissionService: NgxPermissionsService, private lookupService: EclLookupsService,
    private oktaAuthHash_: OktaAuthService, injectorHash_: Injector) {

    super(oktaAuthHash_, injectorHash_);
    oktaAuthHash_.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
   }

  // All route request pass by here before the page displays
  // We need to implement in the app.routing.module.ts, just add canActivate : [SessionFilter]
  // in all routes
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check if the user is already logged in (Okta), otherwise reject the resource activation
    const oktaGuardCanActivate:boolean = await super.canActivate(route, state);
    if (!oktaGuardCanActivate)
      return false;

    let url = state.url.split('/').slice(1).join('/');
    // This is used for display body background for login
    if (url === 'login' || url === '') {
      $('body').css({ 'background-image': 'url("assets/img/login.jpg")' });
      return true;
    } else {
      $('body').css({ 'background-image': 'unset' });

      if (url === 'access-denied') {
        return true;
      }
    }

    // Indicate that the user dont have sign in
    if (!this.validatePermission(['LOGGED_IN'])) {
      localStorage.setItem('returnUrl', state.url);
      this.router.navigate(['/login']);
      return false;
    }

    // remove the query params from url
    if (url.includes('?')) {
      url = url.split('?')[0];
    }

    // Check if rule prcess should be accesible.
    const ruleMaintenanceVisible = await this.lookupService.searchNoPromise('VISIBILITY_FLAG', 'SHOW_RULE_MAINTENANCE_MENU', '1').pipe(map(response => {
      const showRuleMaintenance = response.find(lu => lu.statusId === 1);
      return (showRuleMaintenance && showRuleMaintenance.lookupDesc === '1');
    })).toPromise();
     // Check if industry update prcess should be accesible.
    const industryUpdateVisible = await this.lookupService.searchNoPromise('VISIBILITY_FLAG', 'SHOW_INDUSTRY_UPDATE_MENU', '1').pipe(map(response => {
      const showIndustryUpdate = response.find(lu => lu.statusId === 1);
      return (showIndustryUpdate && showIndustryUpdate.lookupDesc === '1');
    })).toPromise();
    // This validate permissions for the requested route, this is only for validate user moudle access

    switch (url) {
      case 'home':
        return this.validatePermission(['LOGGED_IN']);
      case 'newIdea':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA', 'ROLE_TA', 'ROLE_OTH', 'ROLE_BSC']);
      case 'savingClientAdoptedRule':
      case 'medicaid-recomend-report':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA']);
      case 'assignmentNewIdea':
        return this.validatePermission(['ROLE_PO', 'ROLE_CCA']);
      case 'reAssignForRuleApproval':
      case 'ruleApproval':
        return this.validatePermission(['ROLE_PO']);
      case 'initiateImpact':
        { //ECL-13477
          if (ruleMaintenanceVisible) {
            return this.validatePermission(['ROLE_PO', 'ROLE_CCA']);
          }
          return false;
        }
      case 'reAssignImpactAnalysis':
      case 'reAssignForRuleUpdateApproval':
      case 'ruleForPOApproval':
        { //ECL-13477
          if (ruleMaintenanceVisible) {
            return this.validatePermission(['ROLE_PO']);
          }
          return false;
        }
      case 'assignForMDApprovalNR':
      case 'mdApprovalPR':
      case 'assignForMDApprovalRM':
      case 'mdApprovalRM':
        return this.validatePermission(['ROLE_MD']);
      case 'ruleForImpactAnalysis':
        { //ECL-13477
          if (ruleMaintenanceVisible) {
            return this.validatePermission(['ROLE_CCA']);
          }
          return false;
        }
      case 'good-ideas':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD']);
      case 'usersSetup':
      case 'same-sim-setup':
        return this.validatePermission(['ROLE_EA', 'ROLE_PO']);
      case 'same-sim':
        { //ECL-16176
          if (industryUpdateVisible) {
            return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA', 'ROLE_TA', 'ROLE_OTH']);
          }
          return false;
        }
      case 'eclRuleCatalogue':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA', 'ROLE_TA', 'ROLE_BSC']);
      case 'ecl-user-authority-setup':
        return this.validatePermission(['ROLE_EA']);
      case 'setupNotification':
        { //ECL-13477
          if (ruleMaintenanceVisible) {
            return this.validatePermission(['ROLE_PO', 'ROLE_MD']);
          }
          return false;
        }
      case 'library-search':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA', 'ROLE_TA', 'ROLE_BSC']);
      case 'cvp-template':
        return this.validatePermission(['ROLE_CVPA', 'ROLE_CVPU']);
      case 'cpe-template':
        return this.validatePermission(['ROLE_CPEA', 'ROLE_CPEU']);
      case 'rule-ingestion':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA', 'ROLE_CVPA', 'ROLE_CVPU', 'ROLE_CPEA', 'ROLE_CPEU']);
      case 'rule-versioning':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_EA']);
      case 'white-paper':
        return this.validatePermission(['LOGGED_IN']);
      case 'savings-for-rule':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA']);
      case 'team-updates-report':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA']);
      case 'ideas-needing-research':
        return this.validatePermission(['ROLE_CCA']);
      case 'jobManager':
        return this.validatePermission(['ROLE_TA']);
      case 'email-notification':
      case 'email-notification-setup':
        return this.validatePermission(['ROLE_TA']);
      case 're-ssign-for-provisional-rules':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD']);
      case 'ecl-lookups':
        return this.validatePermission(['ROLE_TA']);
      case 'reassignment-for-po':
        return this.validatePermission(['ROLE_PO']);
      case 'industryUpdateHistory':
        { //ECL-16176
          if (industryUpdateVisible) {
            return this.validatePermission(['ROLE_EA', 'ROLE_PO', 'ROLE_MD']);
          }
          return false;
        }
      case 'new-research-request':
      case 'my-research-request':
      case 'unassigned-research-request':
      case 'search-research-request':
      case 'research-request':
      case 'reassignment-research-request':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA']);
      case 'research-request-po-approval':
        return this.validatePermission(['ROLE_PO']);
      case 'research-request-peer-approval':
        return this.validatePermission(['ROLE_MD']);
      case 'cure':
        return this.validatePermission(['ROLE_CVPA', 'ROLE_CVPU']);
      case 'repo':
        return this.validatePermission(['ROLE_CPEA', 'ROLE_CPEU']);
        case 'cure-and-repo/cure/module-consulting':
        return this.validatePermission(['ROLE_CVPA','ROLE_CPEA','ROLE_CVPU']);
      case 'cure-and-repo/repo/module-consulting':
        return this.validatePermission(['ROLE_CVPA','ROLE_CPEA','ROLE_CPEU']);
      case 'tagfilter-management':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA', 'ROLE_TA', 'ROLE_BSC']);
      case 'clinical-rules-requirements':
      case 'ancillary-information':
        return this.validatePermission(['ROLE_CVPA', 'ROLE_CVPU', 'ROLE_CVPAP', 'ROLE_CVPE'])
      case 'audit-log':
        return this.validatePermission(['ROLE_CVPA'])
      case 'dnb/select-drug':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA', 'ROLE_DNBADMIN', 'ROLE_BSC', ,'ROLE_DNBVIEWER']);
      case 'dnb/drug-versions':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA', 'ROLE_DNBADMIN','ROLE_DNBVIEWER']);
      case 'dnb/new-version':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA', 'ROLE_DNBADMIN']);
      case 'dnb/compare-versions':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA', 'ROLE_DNBADMIN']);
      case 'dnb/drugs-in-approval-process':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA', 'ROLE_DNBADMIN']);
      case 'dnb/approved-version':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA', 'ROLE_DNBADMIN']);
      case 'dnb/mid-rule-admin':
        return this.validatePermission(['ROLE_DNBADMIN']);
      case 'dnb/template-flags':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA', 'ROLE_DNBADMIN']);
      case 'repo/table-admin-list':
        return this.validatePermission(['ROLE_CPEA']);
      case 'cure/module-admin-list':
        return this.validatePermission(['ROLE_CVPA']);
      case 'web-crawling':
        return this.validatePermission(['ROLE_DNBE', 'ROLE_DNBA']);
      case 'web-crawling/list-all-drugs':
        return this.validatePermission(['ROLE_TA', 'ROLE_DNBE', 'ROLE_DNBA']);
      case 'web-crawling/add-new-drug':
        return this.validatePermission(['ROLE_TA', 'ROLE_DNBE']);
      case 'web-crawling/add-new-biosimilar':
        return this.validatePermission(['ROLE_TA', 'ROLE_DNBE']);
      case 'web-crawling/update-drug':
        return this.validatePermission(['ROLE_TA', 'ROLE_DNBE']);
      case 'web-crawling/user-audit-logs':
        return this.validatePermission(['ROLE_TA']);
      case 'rva-pdg-report':
        return this.validatePermission(['ROLE_PO', 'ROLE_MD', 'ROLE_CCA', 'ROLE_EA']);
      default:
        return this.validatePermission(['LOGGED_IN']);
    }
  }

  // Function for validate loaded permissions in the app.component.ts (loadPermissions function)
  validatePermission(permission: string[]) {

    let hasPermission = false;

    permission.forEach((element) => {
      if (this.permissionService.getPermission(element) != undefined) {
        hasPermission = true;
      }
    });

    if (!hasPermission) {
      return this.accessDenied();
    }

    return hasPermission;
  }

  accessDenied() {
    this.router.navigate(['/access-denied']);
    return false;
  }

}

