import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { TeamsService } from 'src/app/services/teams.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants as con } from 'src/app/shared/models/constants';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';
import { AppUtils } from 'src/app/shared/services/utils';
import { RequestConstants as reqCon } from '../../models/request.constants';
import { RrUtils } from '../../services/rr-utils.component';

@Component({
  selector: 'rr-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css', '../shared-request-style.css']
})
export class DetailsComponent implements OnInit {

  constructor(private utils: AppUtils, private rrUtils: RrUtils, private rrService: ResearchRequestService,
    private teamService: TeamsService) { }

  request: any;

  @Input() set setRequest(value) {
    if (value && value.projectRequestId) {
      this.loadRequestDetails(value);
    } else {
      this.rrUtils.getResearchRequestClients(this.clientList).then(() => {
        this.request = value;
        this.loadPreSelectedValues();
        this.populateClientAndPayers(value);
        if (this.request.researchRequestId) {
          this.getTeamMembersList();
        }
      })
    }
  }
  @Input() readOnly;
  @Input() pageSetup;

  // OPTION LIST
  lobList: SelectItem[] = [];
  issueList: SelectItem[] = [];
  policyList: SelectItem[] = [];
  attachCatList: SelectItem[] = [];
  SDPriorityList: SelectItem[] = [];
  eLLComList: SelectItem[] = [];
  QAReasonList: SelectItem[] = [];
  payerStatusList: SelectItem[] = [];
  clientList: SelectItem[] = [];
  payerList: SelectItem[] = [];
  superPayerList: SelectItem[] = [];
  projectCatList: SelectItem[] = [];
  sourceList: SelectItem[] = [{ label: 'None', value: null }];
  attachmentCategoryList: SelectItem[] = [{ label: "Choose", value: null }];
  teamSupervisors: SelectItem[] = [];
  teamAssigneeList: SelectItem[] = [];
  teamsList: SelectItem[] = [];
  policyTypeList: SelectItem[] = [];


  // TOOLTIP
  superPayerSelToolTip: string;
  selPayListToolTip: string;
  lobTooltip: string;
  clientToolTip: string;
  dropDownStyles: any = { 'width': '100%', 'max-width': '100%', 'border': '1px solid #31006F' };

  // BOOLEANS
  hoverEdit: boolean;
  isClient: boolean = false;


  ngOnInit() {
    this.loadOptionLists()
  }

  loadOptionLists() {
    this.utils.getAllLobsValue(this.lobList, false);
    this.utils.getAllLookUps(con.RR_ISSUE_TYPE, this.issueList, false);
    this.utils.getAllLookUps(con.RR_PAYER_STATUS, this.payerStatusList, false);
    if (this.pageSetup === reqCon.REQUEST_PAGE) {
      this.utils.getAllLookUps(con.RR_ATTACHMENT_CATEGORIES, this.attachCatList, false);
      this.utils.getAllLookUps(con.RR_POLICY_TYPE, this.policyList, false);
      this.utils.getAllLookUps(con.RR_ELL_COMMITTEE_REVIEW, this.eLLComList, false);
      this.utils.getAllLookUps(con.RR_ELL_QA_RESULT_REASON, this.QAReasonList, false);
      this.utils.getAllCIJiraTeams(this.teamsList, false);
    } else {
      this.utils.getAllLookUps(con.RR_PROJECT_REQUEST_CATEGORY, this.projectCatList, false);
      this.utils.getAllLookUps(con.RR_SOURCE, this.sourceList, false);
    }
  }

  loadRequestDetails(request: ResearchRequestDto) {
    this.rrUtils.getResearchRequestClients(this.clientList).then(value => {
      this.request = request;
      this.loadPreSelectedValues();
      this.populateClientAndPayers(request);
    });
  }

  loadPreSelectedValues() {
    if (this.projectCatList.length > 0) {
      this.request.projectCategoryId = this.findCotivitiInternal();
    }
    if (this.issueList != null && this.issueList.length > 0 && this.pageSetup === reqCon.PROJECT_PAGE) {
      this.issueList = this.issueList.filter(item => item.label == reqCon.PROJECT_REQ);
      this.request.issueType = this.issueList[0].value;
    } else {
      if (this.issueList != null && this.issueList.length > 0) {
        this.issueList = this.issueList.filter(item => item.label === 'Policy Research Request')
      }
    }
  }

  findCotivitiInternal() {
    const item = this.projectCatList.find(item => item.label === 'Cotiviti Internal Request');
    return item.value;
  }

  /** Populate Client and Payers based on Request Object
   * @param request Request Object
   */
  populateClientAndPayers(request: ResearchRequestDto) {
    if (request && request.clientSelected != null && request.clientSelected.length > 0) {
      this.isClient = false;
      this.rrService.getRRSuperPayersByClient(request.clientSelected).subscribe((resp: BaseResponse) => {
        if (resp.data !== null && resp.data !== undefined) {
          this.superPayerList = [];
          resp.data.forEach(superPayer => {
            this.superPayerList.push({ label: superPayer.description, value: superPayer.rrPayerId })
          });
          this.setSuperPayersToolTip();
        }
      });
      this.populatePayersByPayerStatus(request);
    } else {
      this.isClient = true;
      this.payerList = [];
      this.superPayerList = [];
      this.request.clientSelected = [];
      this.request.superPayersSelected = [];
      this.request.selectedPayerList = [];
    }
  }

  /** Popluate based on SuperPayers and Client
   * @param request Request Object
   */
  populatePayersByPayerStatus(request: ResearchRequestDto) {
    const { selectedPayerStatus, clientSelected } = request;
    if (selectedPayerStatus != null && clientSelected != null) {
      let selPayerOpts: number[] = [];
      const showAllPayers = this.payerStatusList.find(vl => vl.label === 'Show All Payers');
      const showActivePayers = this.payerStatusList.find(vl => vl.label === 'Show Active Payers');

      if (selectedPayerStatus === showActivePayers.value) {
        selPayerOpts.push(showActivePayers.value);
      } else {
        selPayerOpts.push(showActivePayers.value);
        selPayerOpts.push(showAllPayers.value);
      }
      this.rrService.getRRPayersByClientAndStatus(clientSelected, selPayerOpts).subscribe((resp: BaseResponse) => {
        if (resp.data !== null && resp.data !== undefined) {
          this.payerList = [];
          resp.data.forEach(payer => {
            this.payerList.push({ label: payer.description, value: payer.rrPayerId })
          });
          this.setPayersToolTip();
        }
      });
    }
  }

  /* Method to fetch all the users of the team selected .
   * @update teamAssigneeList(all the users in the team with PO,CCA and MD role).
   * @update teamSupervisorsList(all the users in the team with PO role).
   */
  getTeamMembersList() {
    if (this.request.team) {
      this.teamService.getUsersFromTeam(this.request.team).subscribe(resp => {
        if (resp !== null && resp !== undefined) {
          if (resp.data.users) {
            this.teamSupervisors = [];
            this.teamAssigneeList = [];
            resp.data.users.forEach(user => {
              this.teamAssigneeList.push({ label: user.firstName, value: user.userId });
              if (user.roles) {
                user.roles.forEach(role => {
                  if (role.roleName === con.PO_ROLE) {
                    this.teamSupervisors.push({ label: user.firstName, value: user.userId });
                  }
                });
              }
            });
          }
        }
      });
    }
  }

  setSuperPayersToolTip() {
    if (this.request.superPayersSelected) {
      this.superPayerSelToolTip = this.setToolTip(this.request.superPayersSelected, this.superPayerList);
    }
  }

  setPayersToolTip() {
    if (this.request.selectedPayerList) {
      this.selPayListToolTip = this.setToolTip(this.request.selectedPayerList, this.payerList);
    }
  }

  setLineOfBusinessToolTip() {
    if (this.request.lineOfBusiness) {
      this.lobTooltip = this.setToolTip(this.request.lineOfBusiness, this.lobList);
    }
  }

  setClientToolTip() {
    if (this.request.clientSelected) {
      this.clientToolTip = this.setToolTip(this.request.clientSelected, this.clientList);
    }
  }

  /**
   * Set tooltip for option list to show.
   * @param rrList - Which list that tooltip will select from
   * @param optionList - Compare against to already selected ones.
   * @returns joined string list
   */
  setToolTip(rrList: any[], optionList: any[]): string {
    let setArray: string[] = [];
    if (rrList != null && rrList.length > 0) {
      optionList.forEach(p => {
        rrList.forEach(ps => {
          if (p.value === ps) {
            setArray.push(p.label);
          }
        });
      });
      return setArray.join();
    } else {
      return '';
    }
  }

  /**
   * This is used for to open external url for added link
   * @param externalUrl
   */
  redirectToUrl(externalUrl: string): void {
    if (externalUrl) {
      window.open(externalUrl, '_blank');
    }
  }

  changeLinkHover(value) {
    this.hoverEdit = value;
  }

  openNewWindowTab() {
    window.open(this.request.lnLink, "_blank");
  }

}
