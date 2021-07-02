import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { TeamsService } from 'src/app/services/teams.service'
import {ToastMessageService} from "../../../services/toast-message.service";


@Component({
  selector: 'app-reassignment-research-request',
  templateUrl: './reassignment-research-request.component.html',
  styleUrls: ['./reassignment-research-request.component.css']
})
export class ReassignmentResearchRequestComponent implements OnInit {

  @ViewChild('viewGrid',{static: true}) viewGrid: any;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  cols: any[];
  data: any[] = [];
  selectedData: any[] = [];
  selData: any[] = [];
  filteredData: any[];
  pageTitle: string;
  keywordSearch: string;
  userId: number;
  loading: boolean;
  columnsToExport: any[] = [];
  filters: any[] = [];
  sortColumn: string;

  comments: any[] = [];
  users: any[] = [{ label: "Search for User", value: null }];
  teams: any[]  = [];

  selectedTeam: string = "";
  selectedUser: string = "";
  selectedComment: string = "";
  disabled: boolean;
  activeRuleCode: string;
  userRole: string;


  constructor(private util: AppUtils, private utilService: UtilsService, private excelSrv: ExcelService, public route: ActivatedRoute,
    private router: Router, private researchRequestService: ResearchRequestService, private eclConstantsService: ECLConstantsService,
    private teamsService: TeamsService, private toastService: ToastMessageService) {

  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('SHOW_JIRA_LOGIN_FLAG'))) {
      this.trackJiraLoggedInUser();
    }
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
      this.userId = this.util.getLoggedUserId();
    });
    this.cols = [
      { field: 'researchCode', header: 'Request ID', width: '10%' },
      { field: 'jiraId', header: 'Jira ID', width: '10%' },
      { field: 'description', header: 'Summary', width: '25%' },
      { field: 'daysOld', header: 'Days Old', width: '8%' },
      { field: 'requestType', header: 'Request Type', width: '10%' },
      { field: 'teamName', header: 'Team', width: '10%' },
      { field: 'researchStatus', header: 'Status', width: '10%' },
      { field: 'firstName', header: 'Assigned To', width: '10%' }
    ];
    this.sortColumn = 'daysOld';
    this.keywordSearch = '';
    this.fetchAllMyResearchRequests();
    this.loading = true;

    this.getAllReassignComments();
    this.getAllJiraTeams();
  }

  /**
     * Get all my research requests
     */
  private fetchAllMyResearchRequests(): void {
    this.researchRequestService.getReassignementResearchRequests(this.userId).subscribe((response: any) => {
      let allResearchRequests = [];
      response.data.forEach(element => {
        allResearchRequests.push({
          "researchCode": element.researchCode,
          "jiraId": element.jiraId,
          "description": element.description,
          "daysOld": element.daysOld,
          "requestType": element.requestType,
          "teamName": element.teamName,
          "researchStatus": element.researchStatus,
          "createdBy": element.createdBy,
          "firstName": element.assignedTo,
          "teamId": element.teamId
        });
      });

      this.filteredData = [...allResearchRequests];
      /**Sort data by researchId field */
      this.filteredData.sort((a, b) => (a.daysOld > b.daysOld) ? -1 : 1);
      this.loading = false;
    });
  }

  private getAllJiraTeams(): void {
    this.utilService.getAllCIJiraTeams().subscribe(teams => {
      teams.data.forEach(team => {
        this.teams.push({ label: team['teamName'], value: team['teamId']})
      })
    })
  }

  /**
  * This method to fetch all the available reassign workflow comments by loopup type RULE_REASSIGN_WORKFLOW_COMMENT
  */
  private getAllReassignComments() {
    this.comments = [];
    this.comments = [{ label: "Select Comment", value: null }];
    this.utilService.getAllLookUps(Constants.RULE_REASSIGN_WORKFLOW_COMMENT).subscribe(response => {
      if (response !== null && response.length > 0) {
        response.forEach(lookUpObj => {
          this.comments.push({ label: lookUpObj.lookupDesc, value: lookUpObj.lookupDesc });
        });
      }
    });
  }

   /* Method to fetch all the users of the team selected .
    * based of given user role
    @input userRole
    @input teamId
    */
    private getTeamMembersList(userRole: string, teamId: number): void {
      if (teamId) {
        this.teamsService.getUsersFromTeam(teamId).subscribe((response: any) => {
          if (response !== null && response !== undefined) {
            if (response.data.users) {
              this.users = [{ label: "Search for User", value: null }];
              response.data.users.forEach(user => {
                if (user.roles) {
                  user.roles.forEach(role => {
                    if (role.roleName === userRole) {
                      this.users.push({ label: user.firstName, value: user.userId });
                    }
                  });
                }
              });
            }
          }
        });
      }
    }

  private onTeamSelection(event: any): void {
    this.selectedTeam = "";
    this.selectedComment = "";
    this.users = [];
    if (event.value) {
      this.selectedTeam = event.value;
      this.getTeamMembersList(this.userRole, event.value)
    }
  }

  /**
   * Refresh table
   */
  refreshData() {
    this.loading = true;
    this.keywordSearch = '';
    this.selectedData = [];
    this.filters = [];
    this.loading = false;
    this.users = [];

  }

  /**
   * Reset keyword search
   * @param viewGrid
   */
  resethDataTable(viewGrid) {
    this.loading = true;
    this.keywordSearch = '';
    this.loading = false;
  }

  onRowSelect(event: any) {
    if (this.selectedData) {
      this.userRole = "";
      this.selectedUser = "";
      this.selectedTeam = "";
      this.activeRuleCode = this.selectedData[0].researchCode;
      if (this.selectedData.length <= 1) {
        this.selectedTeam = this.selectedData[0].teamId;
        if (event.data.researchStatus === Constants.PENDING_ASSISTANCE) {
          this.userRole = Constants.PO_ROLE;
          this.getTeamMembersList(Constants.PO_ROLE, this.selectedData[0].teamId);
        } else if (event.data.researchStatus === Constants.ASSISTANCE_COMPLETED
          || event.data.researchStatus === Constants.IN_PROGRESS
          || event.data.researchStatus === Constants.SEND_BACK_RESEARCH
          || event.data.researchStatus === Constants.NOT_STARTED) {
          this.userRole = Constants.CCA_ROLE;
          this.getTeamMembersList(Constants.CCA_ROLE, this.selectedData[0].teamId);
        }
      } else {
        this.selectedData.shift();
        this.activeRuleCode = this.selectedData[0].researchCode;
      }
    }
  }

  /**
   * onRowUnselect remove activeRuleCode.
   */
  onRowUnselect() {
    this.activeRuleCode = null;
  }

  /**
    * ReAssign RR
    */
  reassignRR() {
    let requestBody: any;
    //set userid and encryptPass in rr obj
    let encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
    const loggedInUserNm = encryptUserData.username;
    const encryptPass = encryptUserData.password;
    requestBody = { "rrId": this.selectedData[0].researchCode.split('-')[1], "userId": this.selectedUser,
                    "teamId": this.selectedTeam, "loggedInUserNm": loggedInUserNm, "encryptPass": encryptPass };
    this.researchRequestService.reasignResearchRequest(requestBody).subscribe(response => {
      if (response.code !== Constants.HTTP_OK && response.message === Constants.INTERNAL_SERVER_ERROR) {
        this.toastService.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
      } else if (response.code === Constants.HTTP_OK) {
        this.fetchAllMyResearchRequests();
        this.refreshData();
      }
    });
  }

  /**
   * Method to navigate to Research Request Page
   * @Params to set
   * rrcode, pageTitle to return back, pagepath as in path name to return, request is readonly or not
   * encoding the request json object and passing as a query params
   */
  navigateRequest(rr: any) {
    let rrPathParams;
    rrPathParams = btoa(JSON.stringify({
      'rrCode': rr.researchCode,
      'navPageTitle': 'My Requests',
      'navPagePath': Constants.MY_RESEARCH_REQUEST_ROUTE,
      'rrReadOnly': true,
      'searchDisable': true,
      'rrButtonsDisable': true,
      'navPageFrom': Constants.RR_NAVIGATE_PAGE_FROM
    }));

    this.router.navigate([Constants.RESEARCH_REQUEST_ROUTE], {
      queryParams: { rrPathParams: rrPathParams }
    });
  }

  private trackJiraLoggedInUser() {
    let jiraUserLoggedIn = JSON.parse(localStorage.getItem('TRACK_JIRA_USER_LOGIN'));
    if (!jiraUserLoggedIn) {
      this.router.navigate(['/home']);
    }
  }
}
