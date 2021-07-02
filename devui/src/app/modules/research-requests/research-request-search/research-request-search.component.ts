import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { Constants } from 'src/app/shared/models/constants';
import { PageTitleConstants as ptc } from 'src/app/shared/models/page-title-constants';
import { RoutingConstants as rc } from 'src/app/shared/models/routing-constants';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { TeamsService } from 'src/app/services/teams.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';
import { RrUtils } from '../services/rr-utils.component';
import { StorageService } from 'src/app/services/storage.service';
import {AppUtils} from "../../../shared/services/utils";
import {RequestRoutingConst} from "../models/request-routing.constants";
import {RequestConstants} from "../models/request.constants";

@Component({
  selector: 'app-research-request-search',
  templateUrl: './research-request-search.component.html',
  styleUrls: ['./research-request-search.component.css']
})
export class ResearchRequestSearchComponent implements OnInit {

  @ViewChild('rrSearchTable',{static: true}) rrSearchTable: EclTableComponent;

  title = ptc.RESEARCH_REQUEST_SEARCH_TITLE;
  // Options & Inputs
  searchText: string = '';
  rrId: string = '';
  jiraId: string = '';
  teamSupervisors: any[] = [];
  selRequestTypes: number = null;
  selTeams: number = null;
  selClients: number[] = [];
  selRrStatus: number[] = [];
  selAssignee: number = null;

  requestTypes: SelectItem[] = [];
  clients: SelectItem[] = [];
  teams: SelectItem[] = [];
  rrstatus: SelectItem[] = [];
  rrFlowstatus: SelectItem[] = [];
  prstatus: SelectItem[] = [];
  assignees: SelectItem[] = [];

  // disabling
  loadAssignee: boolean = false;

  rrSearchTableModel: EclTableModel;
  searchViewSub: Subscription;
  searchView: Subject<any> = new Subject;
  activateView: boolean = false;
  disabledTeamFieldByPR = false;


  constructor(private researchRequestService: ResearchRequestService, private teamService: TeamsService,
              private router: Router, private toastService: ToastMessageService, private utilsService: UtilsService,
              private rrUtils: RrUtils, private storageService: StorageService, public route: ActivatedRoute,
              private utils: AppUtils) {
  }

  ngOnInit() {
    this.getAllPRStatus();
    if (JSON.parse(localStorage.getItem('SHOW_JIRA_LOGIN_FLAG'))) {
      this.trackJiraLoggedInUser();
    }

    this.route.queryParams.subscribe(params => {
      this.activateView = params['view'];
    });

    this.searchView.pipe(
      debounceTime(600),
      mergeMap(search => of(search).pipe(
        debounceTime(600)
      )),
    ).subscribe(() => this.onViewCheck());

    this.rrSearchTableModel = new EclTableModel();
    this.initTableConfig(this.rrSearchTableModel);
    this.rrSearchTable.loading = false;
    forkJoin([
      this.researchRequestService.getResearchRequestClients(),
      this.utilsService.getAllCIJiraTeams(),
      this.utilsService.getAllLookUps(Constants.RR_WORKFLOW_STATUS),
      this.utilsService.getAllLookUps(Constants.RR_ISSUE_TYPE)]
    ).subscribe(([clients, teams, status, request]) => {
      this.clients = this.rrUtils.convertIntoSelectItemArray(clients.data, 'clientName', 'clientId');
      this.teams = this.rrUtils.convertIntoSelectItemArray(teams.data, 'teamName', 'teamId');
      this.rrFlowstatus = this.rrUtils.convertIntoSelectItemArray(status, 'lookupDesc', 'lookupId', true);
      this.requestTypes = this.rrUtils.convertIntoSelectItemArray(request, 'lookupDesc', 'lookupId');
      this.loadLocalFilterStorage();
      const issueTypeDesc = (this.requestTypes !== null && this.requestTypes.length > 0) ? this.requestTypes.find(v => (v !== undefined && v !== null && v.value === this.selRequestTypes)).label : null;
      if (issueTypeDesc !== undefined && issueTypeDesc !== null && issueTypeDesc === RequestConstants.PROJECT_REQ) {
        this.rrstatus = this.prstatus;
        this.disabledTeamFieldByPR = true;
      } else {
        this.rrstatus = this.rrFlowstatus;
      }
    });
  }

  /**
   * Method to initialize parameters of ecl-table component
   * @param tableModel
   */
  initTableConfig(tableModel: EclTableModel) {
    tableModel.lazy = true;
    tableModel.sortOrder = Constants.ECL_TABLE_ASC_ORDER;
    tableModel.criteriaFilters = this.getJsonRequest();
    tableModel.filterGlobal = false;
    tableModel.export = true;
    tableModel.isFullURL = true;
    tableModel.columns = this.initTableColumns();
  }

  /**
   * Initialize Table Columns of ecl-table component
   * @returns manager columns format.
   */
  initTableColumns() {
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('researchCode', 'ID', '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('jiraId', 'Jira ID', '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('summary', 'Summary', '20%', true, EclColumn.TEXT, true);
    manager.addTextColumn('teamName', 'Team', '20%', true, EclColumn.TEXT, true);
    manager.addTextColumn('client', 'Client', '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('researchStatus', 'Status', '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('assignedTo', 'Assignee', '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('createdBy', 'Reporter', '10%', true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  /**
   * Method to reset search input to blank
   */
  resetCheckInput() {
    this.searchText = '';
    this.rrSearchTableModel.sortBy = '';
    this.rrSearchTable.keywordSearch = '';
    this.rrSearchTable.value = [];
    this.rrId = '';
    this.jiraId = '';
    this.teamSupervisors = [];
    this.selRequestTypes = null;
    this.selTeams = null;
    this.selClients = [];
    this.selRrStatus = [];
    this.selAssignee = null;
    this.rrSearchTable.clearFilters();
    this.rrSearchTable.resetDataTable(false);
    this.rrSearchTable.totalRecords = null;
    this.removeStorage();
  }

  resetPRInput() {
    this.searchText = '';
    this.rrSearchTableModel.sortBy = '';
    this.rrSearchTable.keywordSearch = '';
    this.rrSearchTable.value = [];
    this.rrId = '';
    this.jiraId = '';
    this.selClients = [];
    this.selRrStatus = [];
    this.rrSearchTable.clearFilters();
    this.rrSearchTable.resetDataTable(false);
    this.rrSearchTable.totalRecords = null;
    this.removeStorage();
  }

  /**
   * Method to load data into ecl-table
   */
  onViewCheck() {
    if (this.searchText === null) { this.searchText = '' }
    this.searchText = this.searchText.trim();
    this.rrSearchTableModel.criteriaFilters = this.getJsonRequest();
    this.rrSearchTableModel.url = `${environment.researchRequestServiceUrl}${rc.RESEARCH_REQUEST_URL}/request-search`;
    this.rrSearchTable.keywordSearch = this.searchText;
    if (this.selRequestTypes !== null) {
      this.saveLocalFilterStorage();
      this.rrSearchTable.loadData(null);
    } else {
      if (this.activateView) {
        this.activateView = false;
      } else {
        this.toastService.messageWarning("No Data", "Please select a Request Type Filter", 4000, false);
      }
    }
  }

  loadResearchRequest(event) {
    let rrPathParams;
    let navigationPath;
    if (event.row.requestType === RequestConstants.PROJECT_REQ) {
      rrPathParams = btoa(JSON.stringify({
        'prId' : event.row.researchId,
        'basePath' : rc.SEARCH_RESEARCH_REQUEST,
        'baseTitle' : this.title,
        'rrReadOnly': true,
        'searchDisable': false,
        'rrButtonsDisable': true,
        'backNavigation': 2,
        'issueTypeDesc': RequestConstants.PROJECT_REQ
      }));
      navigationPath = RequestRoutingConst.RR_PROJECT_REQUEST;
    } else {
      rrPathParams = btoa(JSON.stringify({
        'rrCode': event.row.researchCode,
        'navPageTitle': this.title,
        'navPagePath': rc.SEARCH_RESEARCH_REQUEST,
        'rrReadOnly': true,
        'searchDisable': false,
        'rrButtonsDisable': true,
        'backNavigation': 1
      }));
      navigationPath = Constants.RESEARCH_REQUEST_ROUTE;
    }
    this.router.navigate([navigationPath], {
      queryParams: { rrPathParams: rrPathParams }
    });
  }

  /**
   * JSON building string of values.
   * @returns JSON format towards the table filterCriteria
   */
  private getJsonRequest() {
    let json = {};
    json["requestType"] = this.selRequestTypes == 0 ? 0 : this.selRequestTypes;
    json["rrId"] = this.rrId.length == 0 ? '' : this.rrId.toUpperCase();
    json["jiraId"] = this.jiraId.length == 0 ? '' : this.jiraId.toUpperCase();
    json["team"] = !this.selTeams ? [] : [this.selTeams];
    json["client"] = !this.selClients ? [] : this.selClients;
    json["rrStatus"] = !this.selRrStatus ? [] : this.selRrStatus;
    json["assignee"] = !this.selAssignee ? 0 : this.selAssignee;
    json["keyword"] = this.searchText;
    return json;
  }

  /**
   * Getting Research Request Clients
   * @param clientList Selected Client List from the user
   */
  getResearchRequestClients(clientList: SelectItem[]) {
    this.researchRequestService.getResearchRequestClients().subscribe(response => {
      if (response.data !== null && response.data !== undefined) {
        response.data.forEach(client =>
          clientList.push({ label: client.clientName, value: client.clientId }));
      }
    });
  }


  navigateToNewResearchRequest() {
    this.router.navigate(['/new-research-request']);
  }

  /**
   * Checkinging whether teams have single or multiple selection
   * @update teamAssigneeList(all the users in the team with PO,CCA and MD role).
   * @update teamSupervisorsList(all the users in the team with PO role).
   */
  checkTeamSelection() {
    if (this.selTeams) {
      this.loadAssignee = true;
      this.teamService.getUsersFromTeam(this.selTeams).subscribe(response => {
        if (response && response.data && response.data.users) {
          this.teamSupervisors = [];
          this.assignees = [{ label: 'Choose', value: null }];
          response.data.users.forEach(user => {
            this.assignees.push({ label: user.firstName, value: user.userId });
            if (this.assignees && this.assignees === user.userId) {
              this.assignees = user.userId;
            }
            if (user.roles) {
              user.roles.forEach(role => {
                if (role.roleName === Constants.PO_ROLE) {
                  this.teamSupervisors.push({ label: user.firstName, value: user.userId });
                }
              });
            }
            this.loadAssignee = false;
          });
        } else {
          this.loadAssignee = false;
        }
      });
    } else {
      this.selAssignee = null;
      this.assignees = [{ label: 'Choose', value: null }];
    }

  }

  stopEventSubmit(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  private trackJiraLoggedInUser() {
    let jiraUserLoggedIn = JSON.parse(localStorage.getItem('TRACK_JIRA_USER_LOGIN'));
    if (!jiraUserLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Save filters to LocalStorage if not null/undefined/empty array
   */
  saveLocalFilterStorage() {
    if (this.rrId) { this.storageService.set("SEARCH_REQUEST_RR_ID", this.rrId, false); }
    if (this.jiraId) { this.storageService.set("SEARCH_REQUEST_JIRA_ID", this.jiraId, false); }
    if (this.selRequestTypes) { this.storageService.set("SEARCH_REQUEST_TYPE", this.selRequestTypes, false); }
    if (this.selAssignee) { this.storageService.set("SEARCH_REQUEST_TEAMS", this.selAssignee, false); }
    if (this.selTeams) { this.storageService.set("SEARCH_REQUEST_CLIENT", this.selTeams, false); }
    if (this.selClients.length > 0) { this.storageService.set("SEARCH_REQUEST_STATUS", this.selClients, false); }
    if (this.selRrStatus.length > 0) { this.storageService.set("SEARCH_REQUEST_ASSIGNEE", this.selRrStatus, false); }
    if (this.searchText) {this.storageService.set("SEARCH_REQUEST_SEARCH_TEXT", this.searchText, false); }
  }

  /**
   * Load from LocalStorage of the saved filters.
   */
  loadLocalFilterStorage() {
    this.rrId = this.storageService.get("SEARCH_REQUEST_RR_ID", false);
    this.jiraId = this.storageService.get("SEARCH_REQUEST_JIRA_ID", false);
    this.searchText = this.storageService.get("SEARCH_REQUEST_SEARCH_TEXT", false);
    const stringSelRequestTypes: string = this.storageService.get("SEARCH_REQUEST_TYPE", false);
    const stringSelAssignee: string = this.storageService.get("SEARCH_REQUEST_TEAMS", false);
    const stringSelTeams: string = this.storageService.get("SEARCH_REQUEST_CLIENT", false);
    const stringSelClients: string = this.storageService.get("SEARCH_REQUEST_STATUS", false);
    const stringSelRrStatus: string = this.storageService.get("SEARCH_REQUEST_ASSIGNEE", false);
    this.removeStorage();
    this.resetValuesIfNullOrUndefined();
    this.convertStoredValuesFromString(stringSelRequestTypes, stringSelAssignee,
      stringSelTeams, stringSelClients, stringSelRrStatus);
    if (this.activateView) {
      this.onViewCheck();
    }
  }

  /**
   * Converting LocalStorage values into their proper format if not null/undefined
   */
  convertStoredValuesFromString(StrSelReqType: string, StrSelAssignee: string,
    strSelTeams: string, strSelClients: string, strSelRrStatus: string) {
    if (StrSelReqType) { this.selRequestTypes = parseInt(StrSelReqType); }
    if (StrSelAssignee) { this.selAssignee = parseInt(StrSelAssignee); }
    if (strSelTeams) { this.selTeams = parseInt(strSelTeams); this.checkTeamSelection(); }
    if (strSelClients) { this.selClients = this.convertStringArraytoNumArray(strSelClients.split(',')); }
    if (strSelRrStatus) { this.selRrStatus = this.convertStringArraytoNumArray(strSelRrStatus.split(',')); }
  }

  /**
   * Converting String Array into a number Array
   * @param list String Array List
   * @returns number array list
   */
  convertStringArraytoNumArray(list: string[]): number[] {
    return list.map(value => parseInt(value));
  }

  /**
   * Check if Values are null or undefined
   */
  resetValuesIfNullOrUndefined() {
    if (!this.rrId) { this.rrId = '' };
    if (!this.jiraId) { this.jiraId = '' };
    if (!this.searchText) { this.searchText = '' };
    if (!this.selClients) { this.selClients = [] };
    if (!this.selRrStatus) { this.selRrStatus = [] };
  }

  /**
   * Removing Storage values
   */
  removeStorage() {
    this.storageService.remove("SEARCH_REQUEST_RR_ID");
    this.storageService.remove("SEARCH_REQUEST_JIRA_ID");
    this.storageService.remove("SEARCH_REQUEST_TYPE");
    this.storageService.remove("SEARCH_REQUEST_TEAMS");
    this.storageService.remove("SEARCH_REQUEST_CLIENT");
    this.storageService.remove("SEARCH_REQUEST_STATUS");
    this.storageService.remove("SEARCH_REQUEST_ASSIGNEE");
    this.storageService.remove("SEARCH_REQUEST_SEARCH_TEXT");
  }


  /**
   * Based on Request Type Need to provide filter option for Project Request
   * @param issueTypeId
   */
  private selectedIssueType(issueTypeId: number) {
    const issueTypeDesc = this.requestTypes.find(v => v.value === issueTypeId);
    if (issueTypeDesc.label === RequestConstants.PROJECT_REQ) {
      this.disabledTeamFieldByPR = true;
      this.rrstatus = this.prstatus;
    } else {
      this.disabledTeamFieldByPR = false;
      this.rrstatus = this.rrFlowstatus;
      this.resetPRInput();
    }
  }

  private getAllPRStatus() {
    this.utils.getAllLookUps(Constants.RR_PR_WORKFLOW_STATUS, this.prstatus, false);
  }
}



