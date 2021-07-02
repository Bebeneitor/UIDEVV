import { Component, Input, OnInit } from '@angular/core';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { IssueLinkResearchRequest } from 'src/app/modules/research-requests/models/interface/issue-link-interface';
import { SelectItem } from 'primeng/api';
import { Constants as con } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { RequestConstants as reqCon } from '../../models/request.constants';
import { Router } from '@angular/router';
import { RequestRoutingConst } from '../../models/request-routing.constants';

@Component({
  selector: 'rr-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css', '../shared-request-style.css']
})
export class IssueComponent implements OnInit {
  request: any;
  issueList: IssueLinkResearchRequest[] = [];
  rrStatusList: SelectItem[] = [];
  @Input() pageSetup: number;
  @Input() rrCode: string;
  @Input() set setRequest(value: any) {
    if (value && value.projectRequestId && this.pageSetup === reqCon.PROJECT_PAGE) {
      this.getProjectCloneIssueLinks(value.projectRequestId);
    } else if (value && value.researchRequestId && this.pageSetup === reqCon.REQUEST_PAGE) {
      this.getResearchCloneIssueLinks(value.researchRequestId);
    }
  }


  constructor(private rrService: ResearchRequestService, private utils: AppUtils, private router: Router) { }

  ngOnInit() {
    this.utils.getAllLookUps(con.RR_WORKFLOW_STATUS, this.rrStatusList, false);
  }

  /**
   * Method to gather all the clone links by ID of the request.
   * @param id Request Id
   */
  getResearchCloneIssueLinks(id: number) {
    if (id != null) {
      this.rrService.getResearchCloneIssueLink(id).subscribe(({ data }) => {
        this.loadIssueData(data);
      });
    }
  }

  /**
   * Method to gather all the clone links by ID of the request.
   * @param id Project Id
   */
  getProjectCloneIssueLinks(id: number) {
    if (id != null) {
      this.rrService.getProjectCloneIssueLink(id).subscribe(({ data }) => {
        this.loadIssueData(data);
      });
    }
  }

  /**
   * Grabs the data from the response and updates the issue List
   * @param data Response Object
   */
  loadIssueData(data) {
    if (data && data.length > 0) {
      this.issueList = this.setIssueList(data);
    } else if (data) {
      const arrayData = [data];
      this.issueList = this.setIssueList(arrayData);
    }
  }

  /**
   * Setting Issue List for the component. It will convert status and relation indictor
   * @param data Raw IssueList
   * @returns converted IssueList
   */
  private setIssueList(data: any) {
    return data.map(issue => {
      issue.relationInd = this.updateRelationInd(issue.relationInd);
      return issue;
    }).sort((a, b) => a.relationInd.localeCompare(b.relationInd));
  }

  /**
   * Method to update relation Indictor to full string representation.
   * @param relationInd Character shorten version
   * @returns  Full string version of relationInd
   */
  private updateRelationInd(relationInd: string) {
    switch (relationInd) {
      case (reqCon.PARENT):
        return 'Clones'
      case (reqCon.CHILD):
        return 'Is Clone By'
      case ('PR'):
        if (this.pageSetup === reqCon.PROJECT_PAGE) {
          return 'Is related to'
        } else {
          return 'relates to'
        }
      default:
    }
  }

  /**
 * navigation
 * @param rrCode Used to reload the page
 * @param rrId used to reload the page
 * @param status Determine if it New RR or Just RR
 */
  issueNavigation(code: string, id: number, status: string) {
    if (code.includes('RR')) { // RESEARCH REQUEST
      if (status !== 'Draft') {
        const rrPathParams = btoa(JSON.stringify({
          'rrCode': code,
          'navPageTitle': 'My Requests',
          'navPagePath': con.MY_RESEARCH_REQUEST_ROUTE,
          'rrReadOnly': true,
          'searchDisable': false,
          'rrButtonsDisable': true
        }));
        this.router.navigated = false;
        this.router.navigate([con.RESEARCH_REQUEST_ROUTE], {
          queryParams: { rrPathParams: rrPathParams }
        });
      } else {
        const rrPathParams = btoa(JSON.stringify({
          'rrCode': code
        }));
        this.router.navigate([con.NEW_RESEARCH_REQUEST_ROUTE], {
          queryParams: { rrPathParams: rrPathParams }
        });
      }
    } else { // PROJECT REQUEST
      const rrPathParams = btoa(JSON.stringify({
        'rrCode': this.rrCode,
        'prId': id,
        'baseTitle': 'My Requests',
        'secondaryTitle': 'New Project Request',
        'basePath': con.MY_RESEARCH_REQUEST_ROUTE,
        'secondaryPath': con.RESEARCH_REQUEST_ROUTE,
        'readOnly': true,
        'rrButtonsDisable': false
      }));
      this.router.navigate([RequestRoutingConst.RR_PROJECT_REQUEST], {
        queryParams: { rrPathParams: rrPathParams }
      });
    }
  }

}
