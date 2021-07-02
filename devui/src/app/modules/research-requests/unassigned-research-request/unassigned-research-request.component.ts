import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from "../../../shared/services/utils";
import { ExcelService } from "../../../services/excel.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ResearchRequestService } from "../../../services/research-request.service";
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { Constants } from '../../../shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-unassigned-research-request',
  templateUrl: './unassigned-research-request.component.html',
  styleUrls: ['./unassigned-research-request.component.css']
})
export class UnassignedResearchRequestComponent implements OnInit {

  @ViewChild('viewGrid',{static: true}) viewGrid: any;
  cols: any[];
  data: any[] = [];
  selectedData: any[] = [];
  filteredData: any[];
  pageTitle: string;
  keywordSearch: string;
  userId: number;
  loading: boolean;
  columnsToExport: any[] = [];
  filters: any[] = [];
  sortColumn: string;
  selRrCode: string;
  invalidRrClaim: boolean;
  teamName: any = "";
  constructor(private util: AppUtils, private excelSrv: ExcelService, public route: ActivatedRoute,
    private router: Router, private researchRequestService: ResearchRequestService,
    private eclConstantsService: ECLConstantsService, private toastService: ToastMessageService) {

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
    ];
    this.sortColumn = '';
    this.keywordSearch = '';

    this.loading = true;
    this.fetchAllResearchNotAssigned();
  }

  /**
   * Get all unassigned research requests
   */
  private fetchAllResearchNotAssigned(): void {
    this.researchRequestService.getAllResearchRequestsUnassigned().subscribe((response: any) => {
      let allResearchRequests = [];
      response.data.forEach(element => {
        allResearchRequests.push({
          "researchId": element.researchId,
          "researchCode": element.researchCode,
          "jiraId": element.jiraId,
          "description": element.description,
          "daysOld": element.daysOld,
          "requestType": element.requestType,
          "teamName": element.teamName,
          "researchStatus": element.researchStatus,
        });
      });
      this.filteredData = [...allResearchRequests];
      this.loading = false;
    });
  }

  /**
   * Refresh table
   */
  refreshData() {
    this.loading = true;
    this.keywordSearch = '';
    this.selectedData = [];
    this.filters = [];
    this.fetchAllResearchNotAssigned();
    this.loading = false;
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
    this.selRrCode = this.selectedData[0].researchCode;
    if (this.selectedData.length > 1) {
      this.selectedData.shift();
      this.selRrCode = this.selectedData[0].researchCode;
    }
  }
 }

 /**
  * Remove selected Rr on Row unselect
  */
  onRowUnselect(event: any) {
    this.selRrCode = null;
  }

  /**
   * Claim research requests by logged-in user
   */
  claimRequests() {
    this.loading = true;
    if (this.selRrCode) {
      const selRrId = this.selRrCode.split("-")[1];
      const successMessage = `Research Request '${this.selRrCode}' has been claimed successfully.`;
      //set userid and encryptPass in rr obj
      let encryptUserData = JSON.parse(localStorage.getItem('ENCRYPT_USER_DATA'));
      const loggedInUserNm = encryptUserData.username;
      const encryptPass = encryptUserData.password;
      this.researchRequestService.claimResearchRequestUnassigned({ userId: this.userId, rrId: selRrId, loggedInUserNm:
                                  loggedInUserNm, encryptPass: encryptPass }).subscribe(response => {
        if (response.code === Constants.HTTP_OK && response.message === Constants.INVALID_TEAM_MEMBER) {
            this.invalidRrClaim = true;
            this.teamName = response.data;
        } else if (response.code === Constants.HTTP_OK) {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
          this.refreshData();
        } else if (response.code !== Constants.HTTP_OK && response.message === Constants.INTERNAL_SERVER_ERROR) {
          this.toastService.message(Constants.TOAST_SEVERITY_INFO, Constants.RR_CUSTOM_SERVICE_ERROR_MSG, null, Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
      });
    }
  
  }

  /**
     * Method to navigate to Research Request Page
     * @Params to set
     * rrcode, pageTitle to return back, pagepath as in path name to return, request is readonly or not
     * encoding the request json object and passing as a query params
     */
  navigateRequest(rrCode: any) {
    let rrPathParams: string = btoa(JSON.stringify({
      'rrCode': rrCode,
      'navPageTitle': 'Unassigned Request',
      'navPagePath': 'unassigned-research-request',
      'rrReadOnly': true,
      'searchDisable': true,
      'rrButtonsDisable': true
    }));
    this.router.navigate(['research-request'], {
      queryParams: { rrPathParams: rrPathParams }
    });
  }

  okAction() {
    this.invalidRrClaim = false;
  }

  private trackJiraLoggedInUser() {
    let jiraUserLoggedIn = JSON.parse(localStorage.getItem('TRACK_JIRA_USER_LOGIN'));
    if (!jiraUserLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

}
