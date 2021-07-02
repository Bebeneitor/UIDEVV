import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { AppUtils } from "../../../shared/services/utils";
import { DialogService } from 'primeng/api';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { UsersService } from "../../../services/users.service";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReturnDialogComponent } from "../../rule-creation/new-idea-research/components/return-dialog/return-dialog.component";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import {Constants as consts} from 'src/app/shared/models/constants';
import { ImpactRuleApproval } from 'src/app/shared/models/impact-rule-approval';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import {ResearchRequestService} from '../../../services/research-request.service';
import { ResearchRequestSearchedRuleDto } from 'src/app/shared/models/dto/research-request-searched-rule-dto';

const LIST_OF_RULES_FOR_IMPACT_ANALYSIS = 'List of Rules for Impact Analysis';
const RULES_FOR_PO_APPROVAL = 'Policy Owner Approval';
const RETURN_TO_RESEARCH_ANALYST = "Return to Research Analyst";
const PEER_REVIEWER_APPROVAL_NEEDED = "Peer Reviewer Approval Needed";
const MEDICAL_DIRECTOR_APPROVAL_NEEDED = "Peer Reviewer Approval Needed";
const NEW_VERSION_PENDING_APPROVAL = "New Version Pending Approval";
const EXIST_VERSION_PENDING_APPROVAL = "Existing Version Pending Approval";
const APPROVED = "Approved";
const PO_APPROVAL_PENDING_SUBMISSION = "PO Approval Pending Submission";
const PO_APPROVAL_PENDING_SUBMISSION_ID = 284;
const PO_MD_APPROVAL_PENDING_SUBMISSION = "PO-PR Approval Pending Submission";
const PO_MD_APPROVAL_PENDING_SUBMISSION_ID = 285;
const PO_RETURN_TO_RA_PENDING_SUBMISSION = "PO Return to CCA Pending Submission";
const PO_RETURN_TO_RA_PENDING_SUBMISSION_ID = 286;
const PO_SAVE_MESSAGE = "Policy Owner Approval Details Saved Successfully";
const PO_SUBMIT_MESSAGE = "Policy Owner Approval Details Submitted Successfully";
const SEARCH_BY_APPROVAL_STATUS = "Search by Approval Status";
const RETIRE_RULE_PENDING_APPROVAL = consts.RETIRE_RULE_PENDING_APPROVAL;
const PO_RETIRE_APPROVAL_PENDING_SUBMISSION = consts.PO_RETIRE_APPROVAL_PENDING_SUBMISSION;
const RETIRE_PENDING_APPROVAL = consts.RETIRE_PENDING_APPROVAL;
const PO_SAVE_RETIRED_MESSAGE = consts.PO_SAVE_RETIRED_MESSAGE;
const RETIRED_RULE = 'Retired Rule';

const ASSIGNED_TAB_ID = 0;
const RETURNED_TAB_ID = 1;

@Component({
  selector: 'app-rule-for-impact-analysis',
  templateUrl: './rule-for-impact-analysis.component.html',
  styleUrls: ['./rule-for-impact-analysis.component.css'],
  providers: [ConfirmationService]
})
export class RuleForImpactAnalysisComponent implements OnInit {

  @ViewChild('viewGrid',{static: false}) viewGrid: any;
  @ViewChild('assignedTableLRIA',{static: false}) assignedTableLRIA: EclTableComponent;
  @ViewChild('returnedTableLRIA',{static: false}) returnedTableLRIA: EclTableComponent;
  @ViewChild('approvalMaintenance',{static: false}) approvalMaintenance: EclTableComponent;

  setFilter: string;
  tabIndex: number;
  assignedTableConfigInLRIA: EclTableModel = null;
  returnedTableConfigInLRIA: EclTableModel = null;
  policyOnwerApprovalTableConfig      : EclTableModel = null;
  serviceUrlLRIA: string = "";

  ruleStatus: number;
  pageTitle: string;
  keywordSearch: string;
  userId: number;

  comments: any[] = [{ label: "Select Comment", value: null }];
  users: any[] = [{ label: "Search for Analyst", value: null }];
  allIdea: any[];
  cols: any[];
  loading: boolean;
  selectedRules: any[] = [];
  IdeaSaveModal: boolean = false;
  modalSaveBtn: boolean = false;
  modalSubmitBtn: boolean = false;
  saveDisplay: boolean = false;
  filteredIdeas: any[];
  validStatusDropDown: any[];
  /*  variables for assigned tab in list or rules for impact analysis  */
  selectedAssignedRules: any[] = [];

  /*  variables for Returned tab in list or rules for impact analysis  */
  selectedReturnedRules: any[] = [];

  /* flag values to display rule approval or list of rules for impact analysis in rule maintenance */
  ruleApprovalMaintenance: boolean = false;
  impactAnalysisRules: boolean = false;

  selectedUser: String = "";

  /** To hold values returned from Rule Details Screen */
  resFromRuleDetails: any[] = [];

  selectedRuleIds: any[] = [];
  ruleResponseSearchDto: ResearchRequestSearchedRuleDto;

  validStatusDW = [
    { label: SEARCH_BY_APPROVAL_STATUS, value: null },
    { label: EXIST_VERSION_PENDING_APPROVAL, value: EXIST_VERSION_PENDING_APPROVAL },
    { label: NEW_VERSION_PENDING_APPROVAL, value: NEW_VERSION_PENDING_APPROVAL },
    { label: APPROVED, value: PO_APPROVAL_PENDING_SUBMISSION },
    { label: PEER_REVIEWER_APPROVAL_NEEDED, value: PO_MD_APPROVAL_PENDING_SUBMISSION },
    { label: RETURN_TO_RESEARCH_ANALYST, value: PO_RETURN_TO_RA_PENDING_SUBMISSION },
    { label: RETIRE_PENDING_APPROVAL, value: RETIRE_PENDING_APPROVAL },
  ];

  constructor(private ruleService: RuleInfoService, private http: HttpClient, private utils: AppUtils,
    public route: ActivatedRoute, private router: Router, private dialogService: DialogService,
    private eclConstants: ECLConstantsService, private usersService: UsersService, private confirmationService: ConfirmationService,
    private messageService: MessageService, private rrService: ResearchRequestService) { }

  ngOnInit() {
    this.cols = [];
    this.keywordSearch = '';
    this.serviceUrlLRIA = RoutingConstants.RULES_URL + "/" + RoutingConstants.IMPACTED_URL;

    this.route.data.subscribe(params => {
      this.ruleStatus = params['ruleStatus'];
      this.pageTitle = params['pageTitle'];
      this.userId = this.utils.getLoggedUserId();
    });

    this.route.queryParams.subscribe(params => {
      if(params['filter']) {
        this.setFilter = params['filter'];
      }
    });

    this.getAllUsers();
    this.usersService.getUserInfo(this.userId).subscribe((user: any) => {
      if ((this.pageTitle === LIST_OF_RULES_FOR_IMPACT_ANALYSIS && !this.usersService.checkUserPermission(user, this.eclConstants.USERS_CLINICAL_CONTENT_ANALYST)) ||
        (this.pageTitle === RULES_FOR_PO_APPROVAL && !this.usersService.checkUserPermission(user, this.eclConstants.USERS_POLICY_OWNER_ROLE)))
        return;
    });

    if (this.pageTitle == LIST_OF_RULES_FOR_IMPACT_ANALYSIS) {
      this.assignedTableConfigInLRIA = new EclTableModel();
      this.returnedTableConfigInLRIA = new EclTableModel();
      this.initializeTableConfigLRIA(this.assignedTableConfigInLRIA, consts.ASSIGNED_TAB);
      this.initializeTableConfigLRIA(this.returnedTableConfigInLRIA, consts.RETURNED_TAB);

      this.selectTab();
      this.ruleApprovalMaintenance = false;
      this.impactAnalysisRules = true;

    }
    else if (this.pageTitle == RULES_FOR_PO_APPROVAL) {
      this.policyOnwerApprovalTableConfig = new EclTableModel();
      this.initializeTableConfigPolicyOwnerApproval(this.policyOnwerApprovalTableConfig);

      this.ruleApprovalMaintenance = true;
      this.impactAnalysisRules = false;


    }
  }

  /**
  * This method to set the RR rule filter for Assigned Tab
  */
  researchRequestRuleIdFilter(){
    if(this.setFilter) {
      this.assignedTableLRIA.keywordSearch = this.setFilter;
      this.assignedTableLRIA.search();
    }
  }

    /**
     * If the service call ends remove the blocked screen.
     * @param event that ecl table fires when the call starts or ends
     */
    onServiceCall(event) {
      if (event.action === consts.ECL_TABLE_END_SERVICE_CALL) {
         //RR rule filter logic
         if(this.tabIndex === ASSIGNED_TAB_ID && this.setFilter) {
           this.researchRequestRuleIdFilter();
           this.setFilter = null;
         }

      }
    }


  /**
   * This method is for set the options for dropdown according with the editorial type.
   * @param event
   */
  assingReviewStatus(event: any){//execute after ecl-table is loaded.
    if (event.action === consts.ECL_TABLE_END_SERVICE_CALL){

      this.approvalMaintenance.value.forEach(d => {

          this.validStatusDropDown =[];

          if (d.ruleImpactedInd !== null && d.ruleImpactedInd === consts.YES && d.ruleImpactType == 'Editorial') {
            this.validStatusDropDown = [
              { label: EXIST_VERSION_PENDING_APPROVAL, value: EXIST_VERSION_PENDING_APPROVAL },
              { label: APPROVED, value: APPROVED },
              { label: PEER_REVIEWER_APPROVAL_NEEDED, value: MEDICAL_DIRECTOR_APPROVAL_NEEDED },
              { label: RETURN_TO_RESEARCH_ANALYST, value: RETURN_TO_RESEARCH_ANALYST },
            ];
          } else if (d.ruleImpactedInd !== null && d.ruleImpactedInd === consts.YES && d.ruleImpactType == 'Logical') {
            this.validStatusDropDown = [
              { label: EXIST_VERSION_PENDING_APPROVAL, value: EXIST_VERSION_PENDING_APPROVAL },
              { label: NEW_VERSION_PENDING_APPROVAL, value: NEW_VERSION_PENDING_APPROVAL },
              { label: APPROVED, value: APPROVED },
              { label: PEER_REVIEWER_APPROVAL_NEEDED, value: MEDICAL_DIRECTOR_APPROVAL_NEEDED },
              { label: RETURN_TO_RESEARCH_ANALYST, value: RETURN_TO_RESEARCH_ANALYST },
            ];
          } else if (d.ruleImpactedInd !== null && d.ruleImpactedInd === consts.NO) {
            this.validStatusDropDown = [];
          } else {
            this.validStatusDropDown = [
              { label: RETIRE_PENDING_APPROVAL, value: RETIRE_PENDING_APPROVAL },
              { label: APPROVED, value: APPROVED },
              { label: PEER_REVIEWER_APPROVAL_NEEDED, value: MEDICAL_DIRECTOR_APPROVAL_NEEDED },
              { label: RETURN_TO_RESEARCH_ANALYST, value: RETURN_TO_RESEARCH_ANALYST },
            ];
          }

          d.validStatusDropDown = this.validStatusDropDown;
          d.workflowStatus = this.getRuleStatus(d.workflowStatus);//assing value to dropdown.

      })

      this.approvalMaintenance.fillCustomFilterOptions('workflowStatus',this.validStatusDW);

    }

  }

  /**
 * Function used for reviewing request parameter
 * it is used only by List of Rules for Impact Analysis screen.
 */
  private selectTab() {
    this.tabIndex = 0;
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === consts.ASSIGNED_TAB) {
        this.tabIndex = ASSIGNED_TAB_ID;
      } else if (params['tab'] === consts.RETURNED_TAB) {
        this.tabIndex = RETURNED_TAB_ID;
      } else {
        this.tabIndex = ASSIGNED_TAB_ID;
      }
    });
  }

  /**
  * Function used for initialize ecl-table,
  * it is used only by List of Rules for Impact Analysis screen.
  */
  private initializeTableConfigLRIA(table: EclTableModel, tabStatus: string) {
    table.url = this.serviceUrlLRIA + "/" + tabStatus + "?userId=" + this.userId + "&pageName=" + RoutingConstants.LIST_OF_RULES_IMPACT_ANALYSIS;
    table.columns = this.initializeTableColumnsLRIA();
    table.lazy = true;
    table.sortOrder = 1;
    table.checkBoxSelection = true;
    table.excelFileName = this.pageTitle + "-" + tabStatus;
  }

  /**
   * Function used for initialize ecl-table,
   * it is used only by List of Rules for Policy Owner Screen.
   */
  private initializeTableConfigPolicyOwnerApproval(table: EclTableModel){
    table.url = RoutingConstants.RULES_URL + "/" + RoutingConstants.IMPACTED_URL + "?userId=" + this.userId + "&pageName=" + RoutingConstants.IMPACTED_POLICY_OWNER_APPROVAL;
    table.columns = this.initializeTableColumnsPolicyOwnerApproval();
    table.lazy = true;
    table.sortOrder = 1;
    table.checkBoxSelection = true;
    table.excelFileName = this.pageTitle + "-" + "Approval-status";
  }

  /**
  * Function used for initialize table colums in ecl-table,
  * it is used only by List of Rules for Impact Analysis screen.
  */
  private initializeTableColumnsLRIA(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumnWithIcon('ruleCode', 'Library Rule ID',           '15%', true, EclColumn.TEXT, true, 'left', 'researchRequestRuleIndicator', consts.RESEARCH_REQUEST_INDICATOR_CLASS);
    manager.addTextColumn('ruleName', 'Rule Name',                         '25%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactedInd', 'Rule Impacted?',             '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactAnalysis', 'Rule Impact Description', '20%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactType', 'Impact Type',                 '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('workflowStatus', 'Approval Status',             '20%', true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  /**
  * Function used for initialize table colums in ecl-table,
  * it is used only by List of Rules for Policy Onwer Approval screen.
  */
  private initializeTableColumnsPolicyOwnerApproval(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumnWithIcon('ruleCode', 'Library Rule ID',null, true, EclColumn.TEXT, true, 'left', 'researchRequestRuleIndicator', consts.RESEARCH_REQUEST_INDICATOR_CLASS);
    manager.addTextColumn('ruleName', 'Rule Name',null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactAnalysis', 'Rule Impact Description', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactType', 'Impact Type',null, true, EclColumn.TEXT, true);
    manager.addDropDownColumn('workflowStatus', 'Approval Status',null, true, EclColumn.DROPDOWN, null, null, false, 'validStatusDropDown');
    manager.addInputColumn('reviewComments', 'Comments',null, true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  /**
  * Function used to show the Provisional Dialog (it is to rule navegation in ecl-table),
  * it is used only by List of Rules for Impact Analysis screen.
  */
  showRuleDialog(rowData: any) {
    let draftRuleId = 0;
    let ruleResponseIndicator: boolean = false;
    let rrId: string = '';
    this.getRuleResponseIndicator(rowData.ruleId).then((res: any) => {
      if (res && res.ruleResponseIndicator && res.ruleResponseIndicator !== undefined) {
        ruleResponseIndicator = (res.ruleResponseIndicator === 'Y') ? true : false;
        rrId = res.ruleCode;
      }
    });
    this.ruleService.getRulesByParentId(rowData.ruleId).subscribe((response: any) => {
      response.data.forEach(rule => {
        if (rule.ruleStatusId.ruleStatusId === this.eclConstants.RULE_STATUS_IMPACTED)
          draftRuleId = rule.ruleId;
      });
      const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: draftRuleId > 0 ? draftRuleId : rowData.ruleId,
          ruleReview: true,
          provisionalRuleCreation: false,
          reviewStatus: this.getReviewStatus(rowData),
          fromMaintenanceProcess: true,
          workFlowStatusId: rowData.workflowStatusId,
          reviewComments: this.returnReviewComments(rowData),
          readWrite: true,
          pageTitle: this.pageTitle,
          approvalStatus: rowData.approvalStatus,
          ruleResponseInd: ruleResponseIndicator,
          researchRequestId: rrId,
          hideMyRequestLink: true
        },
        showHeader: !ruleResponseIndicator,
        header: 'Library Rule Details',
        width: '80%',
        height: '92%',
        closeOnEscape: false,
        closable: false,
        contentStyle: {
          'max-height': '92%',
          'overflow': 'auto',
          'padding-top': '0',
          'padding-bottom': '0',
          'border': 'none' }
      });

      ref.onClose.subscribe((ri: any) => {
        this.refreshDataTableLRIA();
      });
    });
  }

  async getRuleResponseIndicator(ruleId: number) {
    this.ruleResponseSearchDto = new ResearchRequestSearchedRuleDto();
    return new Promise((resolve, reject) => {
      this.rrService.getRuleResponseIndicator(ruleId).subscribe((resp: any) => {
        if (resp.data !== null && resp.data !== undefined && resp.data !== {}) {
          this.ruleResponseSearchDto = resp.data;
        }
        resolve(this.ruleResponseSearchDto);
      });
    });
  }

  /**
  * Function used to select and unselect elements in ecl-table,
  * it is used only by List of Rules for Impact Analysis screen.
  */
  setSelectRecord(event: any) {
    if (this.tabIndex === ASSIGNED_TAB_ID) {
      this.selectedAssignedRules = event;
    } else if (this.tabIndex === RETURNED_TAB_ID) {
      this.selectedReturnedRules = event;
    }
  }

  /**
  * Function used to select and unselect elements in ecl-table,
  * it is used only by List of Rules for Impact Analysis screen.
  */
  setSelectRecordForPO(event: any) {
    this.selectedRules = event;
  }

  /**
  * Function to navigate to dashboard screen,
  * it is used by Policy Owner Approval and List of Rules for Impact Analysis screens.
  */
  private navigateHome() {
    this.router.navigate(['/home']);
  }

  /**
  * Function used to refresh ecl-table when any tab has changed,
  * it is used only by List of Rules for Impact Analysis screen.
  */
  handleTabViewChange(event: any) {
    this.tabIndex = event.index;
    this.refreshDataTableLRIA();
  }

  /**
  * Function used to reset data table (no ecl-table),
  * it is used only by Policy Owner Approval screen.
  */
  resethDataTable(viewGrid: any) {
    this.loading = true;
    this.keywordSearch = "";
    viewGrid.selection = [];
    this.selectedRules = [];
    this.loading = false;
    this.resFromRuleDetails = [];
  }

  /**
  * Function used to refresh ecl-table,
  * it is used only by List of Rules for Impact Analysis screen.
  */
  refreshDataTableLRIA() {
    this.selectedAssignedRules = [];
    this.selectedReturnedRules = [];
    if (this.tabIndex === ASSIGNED_TAB_ID) {
      if(this.assignedTableLRIA){
        this.assignedTableLRIA.selectedRecords = [];
        this.assignedTableLRIA.savedSelRecords = [];
        this.assignedTableLRIA.resetDataTable();
      }
    } else if (this.tabIndex === RETURNED_TAB_ID) {
      if(this.returnedTableLRIA){
        this.returnedTableLRIA.selectedRecords = [];
        this.returnedTableLRIA.savedSelRecords = [];
        this.returnedTableLRIA.resetDataTable();
      }
    } else {
      // PO Approval screen
      if (this.approvalMaintenance) {
        this.approvalMaintenance.selectedRecords = [];
        this.approvalMaintenance.savedSelRecords = [];
        this.approvalMaintenance.resetDataTable();
      }
    }
  }


  /**
  * Function used to refresh ecl-table,
  * it is used only by List of Rules for Impact Analysis screen.
  */
 refreshDataTableLPOApproval() {
  this.selectedRules = [];
  this.approvalMaintenance.selectedRecords = [];
  this.approvalMaintenance.resetDataTable();
}




  /**
  * Function used to get users information,
  * it is used by Policy Owner Approval and List of Rules for Impact Analysis screens.
  */
  private getAllUsers(): void {
    this.utils.getAllUsers(this.users);
  }


  /**
  * Function used to fill table (no ecl-table),
  * it is used only by Policy Owner Approval screen.
  */
  private fetchAllRules(ruleStatus): void {
    this.loading = true;
    let pageName = RoutingConstants.IMPACTED_POLICY_OWNER_APPROVAL;

    this.ruleService.getImpactedRulesForUsers(this.userId, pageName).subscribe((response: any) => {
      this.allIdea = [];

      response.data.forEach(element => {
        this.allIdea.push({
          "ruleId": element.ruleId,
          "ruleCode": element.ruleCode,
          "ruleName": element.ruleName,
          "totalRefs": element.totalRefs,
          "refReview": element.ruleId,
          "ruleImpacted": element.ruleImpactedInd,
          "impactAnalysis": element.ruleImpactAnalysis,
          "changeNotes": '',
          "impactType": element.ruleImpactType,
          "daysOld": element.daysOld,
          "ruleStatus": element.workflowStatus,
          "approvalStatus": this.getRuleStatus(element.workflowStatus),
          "changedAddNotes": element.ruleChangeAddNotes,
          "workflowStatusId": element.workflowStatusId,
          "changedModNotes": element.ruleChangeModNotes,
          "changedDelNotes": element.ruleChangeDelNotes,
          "comments": element.reviewComments,
          "returnedStatus": element.returnedStatus,
          "validStatus": ''
        });
      });
      this.filteredIdeas = this.allIdea;
      this.getFilteredRulesByStatus();
      this.loading = false;
      this.filteredIdeas.forEach(d => {
        if (d.ruleImpacted !== null && d.ruleImpacted === consts.YES && d.impactType == 'Editorial') {
          d.validStatus = [
            { label: EXIST_VERSION_PENDING_APPROVAL, value: EXIST_VERSION_PENDING_APPROVAL },
            { label: APPROVED, value: APPROVED },
            { label: PEER_REVIEWER_APPROVAL_NEEDED, value: MEDICAL_DIRECTOR_APPROVAL_NEEDED },
            { label: RETURN_TO_RESEARCH_ANALYST, value: RETURN_TO_RESEARCH_ANALYST },
          ];
        } else if (d.ruleImpacted !== null && d.ruleImpacted === consts.YES && d.impactType == 'Logical') {
          d.validStatus = [
            { label: NEW_VERSION_PENDING_APPROVAL, value: NEW_VERSION_PENDING_APPROVAL },
            { label: APPROVED, value: APPROVED },
            { label: PEER_REVIEWER_APPROVAL_NEEDED, value: MEDICAL_DIRECTOR_APPROVAL_NEEDED },
            { label: RETURN_TO_RESEARCH_ANALYST, value: RETURN_TO_RESEARCH_ANALYST },
          ];
        } else if (d.ruleImpacted !== null && d.ruleImpacted === consts.NO) {
          d.validStatus = [];
        } else {
          d.validStatus = [
            { label: RETIRE_PENDING_APPROVAL, value: RETIRE_PENDING_APPROVAL },
            { label: APPROVED, value: APPROVED },
            { label: PEER_REVIEWER_APPROVAL_NEEDED, value: MEDICAL_DIRECTOR_APPROVAL_NEEDED },
            { label: RETURN_TO_RESEARCH_ANALYST, value: RETURN_TO_RESEARCH_ANALYST },
          ];
        }
      });
    });
  }

  /**
  *  Function used to filter data table (no ecl-table),
  * it is used only by Policy Owner Approval screen.
  */
  private getFilteredRulesByStatus() {
    this.filteredIdeas = this.filteredIdeas.filter(rule =>
      rule.ruleStatus === EXIST_VERSION_PENDING_APPROVAL ||
      rule.ruleStatus === NEW_VERSION_PENDING_APPROVAL ||
      rule.ruleStatus === PO_APPROVAL_PENDING_SUBMISSION ||
      rule.ruleStatus === PO_MD_APPROVAL_PENDING_SUBMISSION ||
      rule.ruleStatus === PO_RETURN_TO_RA_PENDING_SUBMISSION ||
      rule.ruleStatus === RETIRE_RULE_PENDING_APPROVAL ||
      rule.ruleStatus === PO_RETIRE_APPROVAL_PENDING_SUBMISSION
    );
  }


  /**
  * Function used to show Provisional Dialog (it is to navegation with no ecl-table),
  * it is used only by Policy Owner Approval screen.
  */
  showProvisionalDialog(rowInfo, viewGrid) {
    let draftRuleId = 0;
    this.ruleService.getRulesByParentId(rowInfo.ruleId).subscribe((response: any) => {
      response.data.forEach(rule => {
        if (rule.ruleStatusId.ruleStatusId === this.eclConstants.RULE_STATUS_IMPACTED)
          draftRuleId = rule.ruleId;
      });
      const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: draftRuleId > 0 ? draftRuleId : rowInfo.ruleId,
          ruleReview: true,
          provisionalRuleCreation: false,
          reviewStatus: this.getReviewStatus(rowInfo),
          fromMaintenanceProcess: true,
          workFlowStatusId: rowInfo.workflowStatusId,
          reviewComments: this.returnReviewComments(rowInfo),
          readWrite: true,
          pageTitle: this.pageTitle,
          approvalStatus: rowInfo.approvalStatus
        },
        header: 'Library Rule Details',
        width: '80%',
        height: '92%',
        closeOnEscape: false,
        closable: false,
          contentStyle: {
          'max-height': '92%',
          'overflow': 'auto',
          'padding-top': '0',
          'padding-bottom': '0',
          'border': 'none',
          'padding-left': '0',
          'padding-right': '0'}
      });

      ref.onClose.subscribe((ri: any) => {
        let first = viewGrid.first;
        this.fetchAllRules(this.ruleStatus);
        setTimeout(() => { viewGrid.first = first }, 500);
      });
    })
  }

  /**
  * Function to show, or hide, save and return buttons,
  * it is used only by Policy Owner Approval screen.
  */
  showHideBtn() {
    return !(this.pageTitle === LIST_OF_RULES_FOR_IMPACT_ANALYSIS);
  }

  /**
  * Function used to confirm message for exit button,
  * it is used by Policy Owner Approval and List of Rules for Impact Analysis screens.
  */
  exit() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will be lost. Are you sure you want to Exit?',
      header: 'Exit',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.navigateHome();
      }
    });
  }

  /**
  * Function to return selected Rules,
  * it is only to Policy Owner Approval screen.
  */
  showReturnDialog() {
    this.selectedRuleIds = this.selectedRules.map(rule => {
      return ({
        ruleId: rule.ruleId,
      });
    });
    const ret = this.dialogService.open(ReturnDialogComponent, {
      data: {
        selectedRulesIds: this.selectedRuleIds,
        stageId: this.ruleStatus
      },
      header: 'Reassignment RM Policy Owner Return',
      contentStyle: { "max-height": "80%", "overflow": "auto" }
    })
  };

  /**
  *  Function to return the review comments based on the page title and rule status,
  *  it is used by Policy Owner Approval and List of Rules for Impact Analysis screens.
  */
  private returnReviewComments(rowInfo: any) {
    let comment: any;
    if ((this.pageTitle == LIST_OF_RULES_FOR_IMPACT_ANALYSIS) && (rowInfo.workflowStatus === RETURN_TO_RESEARCH_ANALYST || !rowInfo.workflowStatus)) {
      comment = "";
    } else {
      if (this.pageTitle == LIST_OF_RULES_FOR_IMPACT_ANALYSIS || this.pageTitle === RULES_FOR_PO_APPROVAL) {
        comment = rowInfo.reviewComments;
      } else {
        comment = rowInfo.comments;
      }
    }
    return comment;
  }

  /**
  * Function used to get the RuleStatus,
  * it is used only by List of Rules for Impact Analysis screen.
  */
 getRuleStatus(workflowStatus: any, actionVal?: string, impactedType?: string) {
    if (workflowStatus === PO_APPROVAL_PENDING_SUBMISSION) {
      return APPROVED;
    } else if (workflowStatus === PO_MD_APPROVAL_PENDING_SUBMISSION) {
      return MEDICAL_DIRECTOR_APPROVAL_NEEDED;
    } else if (workflowStatus === PO_RETURN_TO_RA_PENDING_SUBMISSION) {
      return RETURN_TO_RESEARCH_ANALYST;
    } else if (workflowStatus === RETIRE_RULE_PENDING_APPROVAL || workflowStatus === PO_RETIRE_APPROVAL_PENDING_SUBMISSION) {
      return RETIRE_PENDING_APPROVAL;
    }

    if (actionVal === "save") {
      if (impactedType == null) {
        if (workflowStatus === APPROVED) {
          return PO_APPROVAL_PENDING_SUBMISSION;
        } else if (workflowStatus === MEDICAL_DIRECTOR_APPROVAL_NEEDED) {
          return PO_MD_APPROVAL_PENDING_SUBMISSION;
        } else if (workflowStatus === RETURN_TO_RESEARCH_ANALYST) {
          return PO_RETURN_TO_RA_PENDING_SUBMISSION;
        }
      } else if (workflowStatus === APPROVED)
        return PO_APPROVAL_PENDING_SUBMISSION;
      else if (workflowStatus === MEDICAL_DIRECTOR_APPROVAL_NEEDED)
        return PO_MD_APPROVAL_PENDING_SUBMISSION;
      else if (workflowStatus === RETURN_TO_RESEARCH_ANALYST)
        return PO_RETURN_TO_RA_PENDING_SUBMISSION;
    } else {
      if (impactedType == null && actionVal === 'submit') {
        if (workflowStatus === APPROVED) {
          return RETIRED_RULE;
        } else if (workflowStatus === RETURN_TO_RESEARCH_ANALYST) {
          return RETURN_TO_RESEARCH_ANALYST;
        } else if (workflowStatus === MEDICAL_DIRECTOR_APPROVAL_NEEDED) {
          return MEDICAL_DIRECTOR_APPROVAL_NEEDED;
        }
      } else {
        return workflowStatus;
      }
    }
  }

  /**
  *  Function used to save rules selected,
  *  it is used only by Policy Owner Approval screen.
  */
  save() {
    if (!this.validateSelectedRows() ) {
      this.IdeaSaveModal = true;
      this.modalSaveBtn = true;
      this.modalSubmitBtn = false;
    } else {
      this.saveSubmit("save");
    }
  }

  /**
  * Function to validate selected rows,
  * it is used only by Policy Owner Approval screen.
  */
  private validateSelectedRows() {
    let res: boolean = true;
    this.selectedRules.forEach(d => {
      let approvalStatus = this.getRuleStatus(d.workflowStatus);
      if (approvalStatus === undefined || approvalStatus.length < 0 || approvalStatus === EXIST_VERSION_PENDING_APPROVAL || approvalStatus === NEW_VERSION_PENDING_APPROVAL  || approvalStatus === RETIRE_PENDING_APPROVAL ) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: d.ruleCode + " : Please select an Approval Status.", life: 3000, closable: true });
        res = false;
      }
      if ((this.IdeaSaveModal) && (approvalStatus == RETURN_TO_RESEARCH_ANALYST || approvalStatus == MEDICAL_DIRECTOR_APPROVAL_NEEDED) && (d.reviewComments == null || d.reviewComments.trim() == "")) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: d.ruleCode + " : For 'Return to Research Analysis' or 'Peer Reviewer Approval Needed' status a comment should be provided" + '.', life: 3000, closable: true });
        res = false;
      }
    });
    return res;
  }

  /**
   * This method is used to submit
   * it is used by Policy Owner Approval and List of Rules for Impact Analysis screens.
   */
  submit() {
    if (this.selectedRules || this.selectedAssignedRules || this.selectedReturnedRules) {
      let validRowsSelected = false;
      this.IdeaSaveModal = true;
      this.modalSaveBtn = false;
      this.modalSubmitBtn = true;
      if (this.pageTitle == RULES_FOR_PO_APPROVAL) {
        validRowsSelected = this.validateSelectedRows();
      } else if (this.pageTitle == LIST_OF_RULES_FOR_IMPACT_ANALYSIS) {
        validRowsSelected = true;
      }
      if (validRowsSelected) {
        this.IdeaSaveModal = false;
        this.saveSubmit("submit");
      }
    } else
      this.messageService.add({ severity: 'success', summary: 'Warn', detail: " Please select any checkbox to Submit", life: 3000, closable: false });
  }


  /**
  * This method is used to save or submit,
  * it is used by Policy Owner Approval and List of Rules for Impact Analysis screens.
  */
  saveSubmit(actionVal: any) {

    let requestBody: ImpactRuleApproval;
    let selectedRules: any[] = [];
    if (this.pageTitle === RULES_FOR_PO_APPROVAL) {
      selectedRules = this.selectedRules.map(rule => {
        return ({
          ruleId: rule.ruleId,
          status: this.getRuleStatus(this.getRuleStatus(rule.workflowStatus), actionVal, rule.ruleImpactType),
          comments: rule.reviewComments,
          returnedStatus: false
        });
      });
    } else if ((this.pageTitle === LIST_OF_RULES_FOR_IMPACT_ANALYSIS)) {
      if (this.selectedAssignedRules.length > 0) {
        selectedRules = this.selectedAssignedRules.map(rule => {
          return this.requestBodyUpdate(rule);
        });
      }
      else {
        selectedRules = this.selectedReturnedRules.map(rule => {
          return ({
            ruleId: rule.ruleId,
            status: rule.workflowStatus,
            returnedStatus: true
          });
        });
      }
    }

    requestBody = {
      selectedIdeas: selectedRules,
      stageId: this.ruleStatus,
      action: actionVal,
      userId: this.userId
    };

    this.ruleService.saveImpactRuleApproval(requestBody).subscribe(response => {
      this.loading = true;
      if (response && this.pageTitle == LIST_OF_RULES_FOR_IMPACT_ANALYSIS) {
        this.messageService.add({ severity: 'success', summary: 'Info', detail: "Research Analyst Approval Details Saved Successfully", life: 3000, closable: false });
        if (this.selectedAssignedRules.length > 0) {
          this.selectedAssignedRules.forEach(rule => {
            this.displayUpdateMessage(rule);
          });
        }
        if (this.selectedReturnedRules.length > 0) {
          this.selectedReturnedRules.forEach(rule => {
            this.displayUpdateMessage(rule);
          });
        }
        this.refreshDataTableLRIA();
      } else if (response && this.pageTitle == RULES_FOR_PO_APPROVAL) {
        if (actionVal === "submit") {
          if (this.selectedRules.length > 0) {
            this.selectedRules.forEach(rule => {
              if (rule.workflowStatus === APPROVED && rule.ruleImpactType === consts.LR_EDITORIAL) {
                this.messageService.add({ severity: 'success', summary: 'Info', detail: `Rule ${rule.ruleCode} has been updated successfully.`, life: 3000, closable: true });
              } else if (rule.workflowStatus === APPROVED && rule.ruleImpactType === consts.LR_LOGICAL) {
                this.ruleService.getRuleLatestVersion(rule.ruleId).subscribe(resp => {
                  this.messageService.add({ severity: 'success', summary: 'Info', detail: `New Rule Verison ${resp.data} has been created for Rule ${rule.ruleCode}.`, life: 3000, closable: true });
                });
              } else if (rule.workflowStatus === APPROVED && rule.ruleImpactType === null) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Info',
                  detail: `Retired Rule ${rule.ruleCode} has been submitted Successfully`,
                  life: 3000,
                  closable: false
                });
              } else {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Info',
                  detail: PO_SUBMIT_MESSAGE,
                  life: 3000,
                  closable: false
                });
              }
              this.refreshDataTableLPOApproval();
            });
          }
        } else {
          if (this.selectedRules.length > 0) {
            this.selectedRules.forEach(retiredRule => {
              if (retiredRule.ruleImpactType === null && retiredRule.ruleStatus && retiredRule.ruleStatus === PO_RETIRE_APPROVAL_PENDING_SUBMISSION) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Info',
                  detail: PO_SAVE_RETIRED_MESSAGE,
                  life: 3000,
                  closable: false
                });
              }
              else {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Info',
                  detail: PO_SAVE_MESSAGE,
                  life: 3000,
                  closable: false
                });
              }
            });
          }
          this.refreshDataTableLPOApproval();
        }

      }

      this.selectedUser = null;
      this.loading = false;
      this.selectedRules = null;
    });
  }

  /**
   * RequestBodyUpdate for when submiting the rule determine if pending approval for PO
   * then reviewComment will be wiped. If approved then reviewComments will be shown
   * @param rule
   */
  private requestBodyUpdate(rule) {
    if (rule.workflowStatus === consts.EXISTING_VERSION_PENDING_SUBMISSION) {
      return {
        ruleId: rule.ruleId,
        status: rule.workflowStatus,
        returnedStatus: false
      }
    } else {
      return {
        ruleId: rule.ruleId,
        status: rule.workflowStatus,
        comments: rule.reviewComments,
        returnedStatus: false
      }
    }
  }

/**
 * This function is used to review the status (this is related with navegation service),
 * it is used by Policy Owner Approval and List of Rules for Impact Analysis screens.
 */
  private getReviewStatus(rowInfo: any): any {
    if (this.pageTitle === LIST_OF_RULES_FOR_IMPACT_ANALYSIS) {
      let ret = [{label:'Select', value: consts.DEFAULT_STATUS_LIST_OF_RULES_FOR_IMPACT_ANALYSIS }];
      this.ruleService.getValidApprovalStatus(rowInfo.ruleId, this.userId).subscribe((resp: any) => {
        let appStat: any[] = resp.data;
        appStat.forEach(stat => {
          ret.push({ label: stat.description, value: stat.id });
        });
      })
      return ret;
    }
    else {
      let appStatus = [
        { label: "Select", value: "" },
        { label: APPROVED, value: PO_APPROVAL_PENDING_SUBMISSION_ID },
        { label: PEER_REVIEWER_APPROVAL_NEEDED, value: PO_MD_APPROVAL_PENDING_SUBMISSION_ID },
        { label: RETURN_TO_RESEARCH_ANALYST, value: PO_RETURN_TO_RA_PENDING_SUBMISSION_ID }];

      return appStatus;
    }
  }


  /**
  * Method to select the rows in the current page (no ecl-table)
  * it is used only by Policy Owner Approval screen.
  */
  selectCurrentPageRuleApproval(viewGrid: any) {
    let selectedData = this.selectedRules;
    this.selectedRules = selectedData.slice(viewGrid.first, viewGrid.first + viewGrid.rows);
  }

  /**
   * Function is used to show update message
   * it is used only by List of Rules for Impact Analysis screen.
  */
  private displayUpdateMessage(rule: any) {
    if (this.getRuleStatus(rule.workflowStatus) === APPROVED && rule.ruleImpactType === consts.LR_EDITORIAL) {
      this.messageService.add({ severity: 'success', summary: 'Info', detail: `Rule ${rule.ruleCode} has been updated successfully.`, life: 3000, closable: true });
    }
  }

  filters: any = {
    ruleId: '',
    ruleName: '',
    ruleImpacted: '',
    impactAnalysis: '',
    impactType: '',
    approvalStatus: ''
  }

}
