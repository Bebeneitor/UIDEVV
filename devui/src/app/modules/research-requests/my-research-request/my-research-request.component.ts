import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { ActivatedRoute, Router } from "@angular/router";
import { ResearchRequestService } from "../../../services/research-request.service";
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { ExcelService } from "../../../services/excel.service";
import { Constants } from '../../../shared/models/constants';

const MY_RESEARCH_REQUEST = "My Research Requests";

@Component({
  selector: 'app-my-research-request',
  templateUrl: './my-research-request.component.html',
  styleUrls: ['./my-research-request.component.css']
})
export class MyResearchRequestComponent implements OnInit {
  @ViewChild('viewGrid',{static: true}) viewGrid;
  cols: any[];
  data: any[] = [];
  filteredData: any[];
  pageTitle: string;
  keywordSearch: string;
  userId: number;
  loading: boolean;
  columnsToExport: any[] = [];
  filters: any[] = [];
  sortColumn: string;
  myRequestFilterInd: string = '0';
  loggedUserName: string;


  constructor(private util: AppUtils, private excelSrv: ExcelService, public route: ActivatedRoute,
    private router: Router, private researchRequestService: ResearchRequestService,
    private eclConstantsService: ECLConstantsService) { }

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
      { field: 'jiraId', header: 'JIRA ID', width: '10%' },
      { field: 'summary', header: 'Summary', width: '25%' },
      { field: 'daysOld', header: 'Days Old', width: '5%' },
      { field: 'requestType', header: 'Request Type', width: '10%' },
      { field: 'teamName', header: 'Team', width: '15%' },
      { field: 'researchStatus', header: 'Status', width: '10%' },
      { field: 'createdBy', header: 'Reporter', width: '15%' }
    ];

    this.sortColumn = '';
    this.keywordSearch = '';
    this.loading = true;
    this.filterMyRequestDataByInd();
    this.columnsToExport = [];
    this.loggedUserName = this.util.getLoggedUserName();
  }
  /**
   * Get all my research requests
   */
  private fetchAllMyResearchRequests(myRequestInd?: string): void {
    this.researchRequestService.getMyResearchRequests(this.userId, myRequestInd).subscribe((response: any) => {
      let allResearchRequests = [];
      response.data.forEach(element => {
        allResearchRequests.push({
          "researchCode": element.researchCode,
          "jiraId": element.jiraId,
          "summary": element.description,
          "daysOld": element.daysOld,
          "requestType": element.requestType,
          "teamName": element.teamName,
          "researchStatus": element.researchStatus,
          "createdBy": element.createdBy,
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
    this.filters = [];
    this.myRequestFilterInd = '0';
    this.fetchAllMyResearchRequests(this.myRequestFilterInd);
    this.loading = false;
  }

  /**
   * Method to navigate to Research Request Page
   * @Params to set
   * rrcode, pageTitle to return back, pagepath as in path name to return, request is readonly or not
   * encoding the request json object and passing as a query params
   */
  navigateRequest(rr: any) {
    let rrPathParams;
    let navigationPath;
    if (rr.researchStatus === Constants.RR_WORKFLOW_STATUS_DRAFT) {
      rrPathParams = btoa(JSON.stringify({
        'rrCode': rr.researchCode
      }));
      navigationPath = Constants.NEW_RESEARCH_REQUEST_ROUTE;

    } else {
      rrPathParams = btoa(JSON.stringify({
        'rrCode': rr.researchCode,
        'navPageTitle': 'My Requests',
        'navPagePath': Constants.MY_RESEARCH_REQUEST_ROUTE,
        'rrReadOnly': true,
        'rrButtonsDisable': false
      }));
      navigationPath = Constants.RESEARCH_REQUEST_ROUTE;
    }

    this.router.navigate([navigationPath], {
      queryParams: { rrPathParams: rrPathParams }
    });
  }

  /**
   * This method is used to filter the MyRequestData
   * based on radio option as a Assigned and initiated request
   * Assigned = 0 and Initiated = 1 value set in html to read.
  */
  filterMyRequestDataByInd() {
    this.fetchAllMyResearchRequests(this.myRequestFilterInd);
  }

  private trackJiraLoggedInUser() {
    let jiraUserLoggedIn = JSON.parse(localStorage.getItem('TRACK_JIRA_USER_LOGIN'));
    if (!jiraUserLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

}
