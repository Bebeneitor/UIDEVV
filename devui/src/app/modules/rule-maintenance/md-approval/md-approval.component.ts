import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from "primeng/api";
import { AppUtils } from 'src/app/shared/services/utils';
import { environment } from 'src/environments/environment';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { UsersService } from "../../../services/users.service";
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { Constants as consts, Constants } from "../../../shared/models/constants";
import { PageTitleConstants as ptc } from "src/app/shared/models/page-title-constants";
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { GoodIdeasDto } from 'src/app/shared/models/dto/good-ideas-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import {ResearchRequestSearchedRuleDto} from "../../../shared/models/dto/research-request-searched-rule-dto";
import {ResearchRequestService} from "../../../services/research-request.service";

const LIBRARY_RULE = "Library Rule";
const SHELVED = "Shelved";
const REJECTED = "Rejected";
const REJECTED_ID = 56;
const NEED_MORE_INFO = "Need More Information";
const APPROVED = "Approved";
const RETURN_TO_RA = "Return to Research Analyst";
const RETURN__TO_RA_ID = 61;
const APPROVED_ID = 40;
const STAGE_SAVE = 2;
const STAGE_SUBMIT = 3;
const PROVISIONAL_RULE_STAGE = 2;
const LIBRARY_RULE_STAGE = 3;
const MD_APPROVAL_VALUE = Constants.PR_APPROVAL_VALUE;
const MD_APPROVAL_PENDING_SUBMISSION = "PR Approval Pending Submission";
const MD_APPROVAL_PENDING_SUBMISSION_ID = 287;
const MD_REJECTION_PENDING_SUBMISSION = "MD Rejection Pending Submission";
const MD_REJECTION_PENDING_SUBMISSION_ID = 288;
const MD_RETURN_TO_RA_PENDING_SUBMISSION = "PR Return to CCA Pending Submission";
const MD_RETURN_TO_RA_PENDING_SUBMISSION_ID = 289;
const MEDICAL_DIRECTOR_APPROVAL_NEEDED_ID = 60;
const MD_SAVE_MESSAGE = "Peer reviewer approval details saved successfully";
const MD_SUBMIT_MESSAGE = "Peer reviewer approval details submitted successfully";
const SHELVED_VALUE = Constants.SHELVED_VALUE;
const NEED_MORE_INFO_VALUE = Constants.NEED_MORE_INFO_VALUE;
const RULE_NEED_MORE_INFO_VALUE = Constants.RULE_NEED_MORE_INFO_VALUE;

const RESPONSE_SUCCESS = "success";

const TYPE_RULE = "rule";
const TYPE_PROVISIONAL_RULE = "provisional";
const RETIRED_RULE = 'Retired Rule';
const RETIRE_PENDING_APPROVAL = consts.RETIRE_PENDING_APPROVAL;


@Component({
  selector: 'app-mdapproval',
  templateUrl: './md-approval.component.html',
  styleUrls: ['./md-approval.component.css'],
  providers: [ConfirmationService]
})

export class MdApprovalComponent implements OnInit {

  @ViewChild('eclTable',{static: false}) eclTable: EclTableComponent;
  @ViewChild('dt',{static: false}) dtEclTable: EclTableComponent;

  formatedData: any[] = [];
  cols: any[];

  PROVISIONAL_RULE_STAGE: any = PROVISIONAL_RULE_STAGE;
  LIBRARY_RULE_STAGE: any = LIBRARY_RULE_STAGE;

  data: any[] = [];
  constants: Constants;

  business: any[];
  categories: any[];
  states: any[];
  jurisdictions: any[];
  selectedRules: RuleInfo[];

  selectedData: any[] = [];

  selectedRuleIds: any[] = [];

  errorsData: string[] = [];

  ruleStatus: number;

  pageTitle: string;

  userId: number;

  validStatus: any[] = [];
  ruleDetailValidStatus: any[] = [];

  loading: boolean;

  // To hold values returned from Rule Details Screen
  resFromRuleDetails: any = null;
  isShelved: boolean = false;
  keywordSearch: string;

  saveGoodIdeas: boolean = false;
  selectedShelved: GoodIdeasDto[] = [];
  typeTable: string;
  submitMsgFlag: boolean = false;

  tableConfig: EclTableModel = null;
  dtTableConfig: EclTableModel = null;
  manager: EclTableColumnManager = null;

  isEclTableCharged: boolean = false;
  isDtEclTableCharged: boolean = false;

  validStatusDropDown: any[];
  ruleResponseSearchDto: ResearchRequestSearchedRuleDto;

  validStatusDW: any = [
    { label: 'select', value: '' },
    { label: APPROVED, value: "MD Approval Pending Submission" },
    { label: RETURN_TO_RA, value: "MD Return to RA Pending Submission" }
  ];

  constructor(private ruleService: RuleInfoService, private util: AppUtils, public route: ActivatedRoute,
    private router: Router, private http: HttpClient, private confirmationService: ConfirmationService,
    private dialogService: DialogService, private usersService: UsersService,
    private eclConstants: ECLConstantsService, private messageService: MessageService,
    private toastService: ToastMessageService,
    private rrService: ResearchRequestService) {
    this.tableConfig = new EclTableModel();
    this.dtTableConfig = new EclTableModel();
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.ruleStatus = params['ruleStatus'];
      this.pageTitle = params['pageTitle'];
      this.userId = this.util.getLoggedUserId();
    });
    // Does this ever get used?
    let selectedRules: any[] = [];
    if (this.ruleStatus > PROVISIONAL_RULE_STAGE) {
      this.categories = [
        { label: 'All Categories', value: null }
      ];

      this.ruleDetailValidStatus = [
        { label: "Select", value: "" },
        { label: APPROVED, value: MD_APPROVAL_PENDING_SUBMISSION_ID },
        { label: RETURN_TO_RA, value: MD_RETURN_TO_RA_PENDING_SUBMISSION_ID }
      ];
    } else {
      this.categories = [{
        label: 'All Categories',
        value: null
      }];
      this.validStatus = [
        { label: "Select", value: "" },
        { label: LIBRARY_RULE, value: 9 },
        { label: SHELVED, value: 6 },
        { label: NEED_MORE_INFO, value: 12 }
      ];
    }

    if (this.ruleStatus > PROVISIONAL_RULE_STAGE) {
      this.typeTable = TYPE_RULE;
    }
    else {
      this.cols = [
        { field: 'ruleCode', header: 'Provisional Rule ID' },
        { field: 'ruleName', header: 'Provisional Rule Name' },
        { field: 'category', header: 'Category' },
        { field: 'daysOld', header: 'Days Old' },
        { field: 'creator', header: 'Provisional Rule Creator' },
        { field: 'reviewStatus', header: 'Review Status' },
        { field: 'reviewComment', header: 'Review Comments' }
      ];
      this.typeTable = TYPE_PROVISIONAL_RULE;
    }

    this.refreshRules();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.fixExportData('excel');
      this.fixExportData('pdf');
    }, 500);
  }

  fixExportData(type: string) {
    var self = this;
    let element = null;
    switch (type) {
      case "excel":
        element = this.dtEclTable.excelButton;
        break;
      case "pdf":
        element = this.dtEclTable.pdfButton;
    }
    if (element) {
      element.__zone_symbol__clickfalse.pop();
      element.addEventListener('click', function (event) {
        if (self.dtEclTable.value.length > 0) {
          let reviewStatus: any[] = self.getReviewStatus();
          reviewStatus[0].value = 5;
          self.dtEclTable.exportData(type, reviewStatus, 'reviewStatus');
        }
      });
    }
  }

  refreshRules() {
    this.usersService.getUserInfo(this.userId).subscribe((user: any) => {
      if (this.usersService.checkUserPermission(user, this.eclConstants.USERS_MEDICAL_DIRECTOR_ROLE))
        this.readAllRules();
      else
        return;
    });
  }

  readAllRules(): void {
    this.loading = true;
    this.data = [];
    if (this.ruleStatus > PROVISIONAL_RULE_STAGE) {
      this.initializeTableConfig();
    } else {
      this.initializeDtTableConfig();
    }
    this.util.getAllCategories(this.categories);
    this.selectedData = null;
    this.refreshEclTable();

  }

  callRuleDetailScreen(rowData: any) {
    let ruleResponseIndicator: boolean = false;
    let rrId: string = '';
    this.getRuleResponseIndicator(rowData.ruleId).then((rrCode: any) => {
      if (rrCode !== null && rrCode != "" ) {
        ruleResponseIndicator = true;
        rrId = rrCode;
      }
    });
    this.ruleService.getRulesByParentId(rowData.ruleId).subscribe((response: any) => {
      let draftRuleId: number = 0;
      response.data.forEach((rule: any) => {
        draftRuleId = rule.ruleId;
      });
      if (draftRuleId > 0 && this.ruleStatus > PROVISIONAL_RULE_STAGE) {
        this.callMaintenanceRuleDetail(rowData, draftRuleId, ruleResponseIndicator, rrId);
      } else {
        this.viewProvisionalModal(rowData, ruleResponseIndicator, rrId);
      }
    })
  }

  private callMaintenanceRuleDetail(rowData: any, draftId: any, ruleResponseIndicator: boolean, rrId: string) {

    const ref = this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: draftId,
        ruleReview: true,
        provisionalRuleCreation: false,
        reviewStatus: this.ruleDetailValidStatus,
        fromMaintenanceProcess: true,
        workFlowStatusId: this.getRuleDetailStatus(rowData.reviewStatus, ""),
        reviewComments: rowData.reviewComment,
        readWrite: true,
        pageTitle: ptc.PEER_REVIEWER_APPROVAL_TITLE,
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
        'border': 'none'
      }
    });

    ref.onClose.subscribe((ri: any) => {
      this.readAllRules();
    });
  }

  async getRuleResponseIndicator(ruleId: number) {
    let rrCode = "";
    return new Promise((resolve, reject) => {
      this.rrService.isRuleCreatedFromRR(ruleId).subscribe((resp: any) => {
        if (resp.data !== null && resp.data !== undefined ) {
          rrCode = resp.data;
        }
        resolve(rrCode);
      });
    });
  }

  viewProvisionalModal(rule: any, ruleResponseIndicator: boolean, rrId: string) {
    let ruleId = rule.ruleId;
    let ruleReviewStatus = rule.reviewStatus;
    let ruleReviewComments = rule.reviewComments;
    const ref = this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: ruleId,
        header: ptc.PROVISIONAL_RULE_DETAIL_TITLE,
        reviewStatus: this.getReviewStatus(),
        ruleReviewStatus: ruleReviewStatus,
        ruleReviewComments: ruleReviewComments,
        stageId: Constants.ECL_LIBRARY_STAGE,
        provSetup: Constants.ECL_PROVISIONAL_STAGE,
        ruleResponseInd: ruleResponseIndicator,
        researchRequestId: rrId,
        hideMyRequestLink: true
      },
      showHeader: !ruleResponseIndicator,
      header: ptc.PROVISIONAL_RULE_DETAIL_TITLE,
      width: '80%',
      height: '92%',
      closeOnEscape: false,
      closable: false,
      contentStyle: {
        'max-height': '92%',
        'overflow': 'auto',
        'padding-top': '0',
        'padding-bottom': '0',
        'border': 'none'
      }
    });

    ref.onClose.subscribe((provRuleId: any) => {
      this.readAllRules();
    });
  }

  refreshRuleApproval(dt) {
    this.loading = true;
    this.keywordSearch = '';
    dt.selection = [];
    this.selectedData = null;
    this.readAllRules();
    this.loading = false;

    this.refreshEclTable();
  }


  getReviewStatus() {
    return [{ label: '', value: null },
    { label: LIBRARY_RULE, value: 9 },
    { label: SHELVED, value: 6 },
    { label: NEED_MORE_INFO, value: 12 }
    ]
  }

  validateSelectedRows() {
    let res: boolean = true;

    this.selectedData.forEach(data => {
      if (!data.reviewStatus || data.reviewStatus === 5 || data.reviewStatus === MEDICAL_DIRECTOR_APPROVAL_NEEDED_ID ||
        data.reviewStatus === this.eclConstants.MEDICAL_DIRECTOR_APPROVAL_NEEDED_PROVISIONAL) {
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: data.ruleCode + " : Please select a Review Status" + '.', life: 3000, closable: true });
        res = false;
      } else {
        if (data.reviewStatus === SHELVED_VALUE && !data.reviewComments && data.reviewComments == "") {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Shelved' status a comment should be provided", life: 3000, closable: false });
          res = false;
        } else if (data.reviewStatus === NEED_MORE_INFO_VALUE && !data.reviewComments && data.reviewComments == "") {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Need More Info' status a comment should be provided", life: 3000, closable: false });
          res = false;
        } else if (data.reviewStatus === MD_APPROVAL_VALUE && !data.reviewComments && data.reviewComments == "") {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Need Peer Reviewer Approval' status a comment should be provided", life: 3000, closable: false });
          res = false;
        } else if (data.reviewStatus === RULE_NEED_MORE_INFO_VALUE && !data.reviewComments && data.reviewComments == "") {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Need Peer Reviewer Approval' status a comment should be provided", life: 3000, closable: false });
          res = false;
        } else if (data.reviewStatus === APPROVED_ID && !data.reviewComments && data.reviewComments == "") {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Aproved' status a comment should be provided", life: 3000, closable: false });
          res = false;
        } else if (data.reviewStatus === RETURN__TO_RA_ID && !data.reviewComments && data.reviewComments == "") {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Return to Research Analysis' status a comment should be provided", life: 3000, closable: false });
          res = false;
        }
      }
    });
    return res;
  }

  public goodIdeasEvent(status: string): void {
    if (status === RESPONSE_SUCCESS) {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Good Ideas Saved Successfully', 3000, true);
    }
    this.saveGoodIdeas = false;
  }


  public fillselectedShelved(): void {
    this.selectedShelved = [];
    this.selectedData.forEach(data => {
      if (data.reviewStatus === SHELVED_VALUE) {
        this.selectedShelved.push(
          {
            ruleId: data.ruleId,
            code: data.ruleCode,
            name: data.ruleName,
            category: data.category,
            daysold: data.daysOld,
            creator: data.creator,
            reviewComment: data.reviewComment,
            goodIdeaDt: undefined
          }
        );
      }
    });
  }

  submit(): void {
    if (this.ruleStatus > PROVISIONAL_RULE_STAGE) {
      if (this.validateSelectedRows()) {
        this.ruleMaintenanceSaveSubmit("submit");
      }
    }
    else {
      if (this.validateSelectedRows()) {
        this.saveSubmit("submit", STAGE_SUBMIT);
      }
    }
  }

  save(): void {
    if (this.ruleStatus > PROVISIONAL_RULE_STAGE) {
      if (this.validateSelectedRows()) {
        this.ruleMaintenanceSaveSubmit("save");
      }
    }
    else {
      if (this.validateSelectedRows()) {
        this.saveSubmit("save", STAGE_SAVE);
      }

    }
  }

  saveSubmit(actionVal: any, stageId: number): void {
    let requestBody: any;
    let selectedRules: any[] = [];

    selectedRules = this.selectedData.map(rowData => {
      return ({
        ruleId: rowData.ruleId,
        status: rowData.reviewStatus,
        stageId: stageId,
        comments: rowData.reviewComments,
        pdgTemplate:rowData.pdgTemplate
        
      });
    });

    requestBody = {
      "selectedRules": selectedRules,
      "action": actionVal,
      "userId": this.userId
      
    };

    if (actionVal === "save") {
      this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.SAVE_RULE_APPROVAL_URL, requestBody).subscribe(response => {
        this.loading = false;
        if ((response)) {
          this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: MD_SAVE_MESSAGE, life: 3000, closable: false });
        }
      });
    } else {
      this.ruleService.submitMDApproval(requestBody).subscribe(resp => {
        this.submitMsgFlag = false;
        this.loading = false;
        this.fillselectedShelved();
        this.readAllRules();
        if (resp) {
          if (resp.data !== []) {
            let codes: string = '';
            let rule: string[] = resp.data
            let indexLength: number;

            rule.forEach((value, index) => {
              indexLength = index + 1;
              if (value && !value.includes(Constants.NEED_MORE_INFO_CODE) &&
                !value.includes(Constants.SHELVED_CODE) &&
                !value.includes(Constants.MD_APPROVAL_CODE)) {
                indexLength === rule.length ? codes += value : codes += value + ', ';
              } else {
                this.submitMsgFlag = true;
              }
            })
            if (this.submitMsgFlag) {
              this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: MD_SAVE_MESSAGE, life: 3000, closable: false });
            }
            if (codes) {
              this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: `${codes} successfully been created.`, life: 5000, closable: true });
            }
          } else {
            this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: MD_SUBMIT_MESSAGE, life: 3000, closable: false });
          }
          if (this.selectedShelved.length > 0) {
            this.saveGoodIdeas = true;
          } else {
            this.saveGoodIdeas = false;
          }
        }
        this.refreshEclTable();
      });
    }
  }

  colShouldOrder(col: any): boolean {
    let woOrder = ["review", "comments", "matches", "chsel"];
    return (woOrder.indexOf(col.field) < 0);
  }

  showReturnDialog() {
    this.selectedRuleIds = this.selectedData.map(rule => {
      return ({
        ruleId: rule.ruleId,
      });
    });
    this.dialogService.open(ReturnDialogComponent, {
      data: {
        selectedRulesIds: this.selectedRuleIds,
        stageId: this.ruleStatus
      },
      header: 'Reassignment Peer Reviewer Return',
      contentStyle: { "max-height": "80%", "overflow": "auto" }
    })
  }

  colShouldHaveInpControl(col: any): boolean {
    let wInpCtl = ['ruleCode', 'ruleName'];
    return (wInpCtl.indexOf(col.field) >= 0);
  }

  emptyStatus(ev) {
    if (ev.value === SHELVED_VALUE || ev.value === NEED_MORE_INFO_VALUE) {
      this.isShelved = true;
    } else {
      this.isShelved = false;
    }
    this.selectedData.forEach(d => {
      d.reviewComment = "";
    });
  }

  ruleMaintenanceSaveSubmit(actionVal): void {
    let requestBody: any;
    let selectedRules: any[] = [];

    selectedRules = this.selectedData.map(rule => {
      return ({
        ruleId: rule.ruleId,
        status: this.getRuleStatus(rule.reviewStatus, actionVal, rule.workflowStatus, rule.ruleImpactType, rule.ruleImpactedInd),
        comments: rule.reviewComments
      });
    });
    requestBody = {
      "selectedIdeas": selectedRules,
      "stageId": this.ruleStatus,
      "action": actionVal,
      "userId": this.userId
    };

    this.ruleService.saveImpactRuleApproval(requestBody).subscribe(resp => {
      this.loading = true;
      let logicalRules: any[] = [];
      let editorialRules: any[] = [];
      let indexLength: number;
      let returnRules: any[] = [];
      let retiredRules: any[] = [];

      // Setting up Code Single Message
      this.selectedData.forEach((rule, index) => {
        if (rule.reviewStatus === APPROVED_ID) {
          if (rule.ruleImpactType === Constants.LR_LOGICAL) {
            logicalRules.push(rule);
          } else if (rule.ruleImpactType === Constants.LR_EDITORIAL) {
            editorialRules.push(rule);
          } else if (rule.ruleImpactedInd === "" && rule.ruleImpactType === null) {
            retiredRules.push(rule);
          }
        } else if (rule.reviewStatus === RETURN__TO_RA_ID) {
          returnRules.push(rule)
        }
      });

      if (actionVal === Constants.SUBMIT_ACTION) {
        if (logicalRules.length > 0) {
          logicalRules.forEach(rule => {
            this.ruleService.getRuleLatestVersion(rule.ruleId).subscribe(response => {
              if (response.data && response.data !== rule.ruleCode)
                this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: `New Rule Version ${response.data} has been created successfully for Rule - ${rule.ruleCode}`, life: 3000, closable: false })
            });
          });
        }
        if (editorialRules.length > 0) {
          let editorialRule: string = '';
          editorialRules.forEach((edit, index) => {
            indexLength = index + 1;
            indexLength === editorialRules.length ? editorialRule += edit.ruleCode : editorialRule += edit.ruleCode + ', ';
          });
          this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: `${editorialRule} has been updated successfully`, life: 3000, closable: false });
        }
        if (retiredRules.length > 0) {
          let retiredRule: string = '';
          retiredRules.forEach((edit, index) => {
            indexLength = index + 1;
            indexLength === retiredRules.length ? retiredRule += edit.ruleCode : retiredRule += edit.ruleCode + ', ';
          });
          this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: `Retired Rule ${retiredRule} has been submitted successfully`, life: 3000, closable: false });
        }
        if (returnRules.length > 0) {
          this.messageService.add({ severity: 'success', summary: 'Info', detail: MD_SUBMIT_MESSAGE, life: 3000, closable: false });
        }
      } else {
        this.messageService.add({ severity: 'success', summary: 'Info', detail: MD_SAVE_MESSAGE, life: 3000, closable: false });
      }
      this.refreshRules();
      this.loading = false;
      this.selectedData = null;
      this.refreshEclTable();
    });
  }


  getRuleStatus(reviewStatus, actionVal?: string, workflowStatus?: string, ruleImpactType?: string, ruleImpactedInd?: string) {
    if (actionVal === 'submit' && ruleImpactType === null) {
      if (reviewStatus === APPROVED_ID && ruleImpactedInd === '') {
        return RETIRED_RULE;
      } else if (reviewStatus === MD_APPROVAL_PENDING_SUBMISSION) {
        return APPROVED;
      } else if (reviewStatus === MD_REJECTION_PENDING_SUBMISSION) {
        return REJECTED;
      } else if (reviewStatus === MD_RETURN_TO_RA_PENDING_SUBMISSION) {
        return RETURN_TO_RA;
      } else if (reviewStatus === RETURN__TO_RA_ID) {
        return RETURN_TO_RA;
      }
    } else if (reviewStatus === MD_APPROVAL_PENDING_SUBMISSION) {
      return APPROVED;
    } else if (reviewStatus === MD_REJECTION_PENDING_SUBMISSION) {
      return REJECTED;
    } else if (reviewStatus === MD_RETURN_TO_RA_PENDING_SUBMISSION) {
      return RETURN_TO_RA;
    }


    if (reviewStatus === MD_APPROVAL_PENDING_SUBMISSION_ID) {
      return APPROVED_ID;
    }
    else if (reviewStatus === MD_REJECTION_PENDING_SUBMISSION_ID) {
      return REJECTED_ID;
    }
    else if (reviewStatus === MD_RETURN_TO_RA_PENDING_SUBMISSION_ID) {
      return RETURN__TO_RA_ID;
    }

    if (actionVal === "save" && this.ruleStatus === this.LIBRARY_RULE_STAGE) {
      if (reviewStatus === APPROVED_ID) {
        return MD_APPROVAL_PENDING_SUBMISSION;
      }
      else if (reviewStatus === REJECTED_ID) {
        return MD_REJECTION_PENDING_SUBMISSION;
      }
      else if (reviewStatus === RETURN__TO_RA_ID) {
        return MD_RETURN_TO_RA_PENDING_SUBMISSION;
      }
    } else {
      return reviewStatus;
    }
  }
  disableBtn() {
    return (!this.selectedData || this.selectedData.length < 1);
  }

  getRuleDetailStatus(workflowStatus, actionVal) {
    if (workflowStatus === APPROVED_ID)
      return MD_APPROVAL_PENDING_SUBMISSION_ID;
    else if (workflowStatus === REJECTED_ID)
      return MD_REJECTION_PENDING_SUBMISSION_ID;
    else if (workflowStatus === RETURN__TO_RA_ID)
      return MD_RETURN_TO_RA_PENDING_SUBMISSION_ID;
    else
      return workflowStatus;

  }

  /**
   *  Method to confirm message for exit button
   */
  exit() {
    this.confirmationService.confirm({
      message: 'All unsaved changes will be lost. Are you sure you want to Exit?',
      header: 'Exit',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.navigateHome();
        //Actual logic to perform a confirmation
      }
    });
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  resetDataTable(viewGrid) {

    this.loading = true;

    this.keywordSearch = "";
    viewGrid.selection = [];

    this.selectedRules = null;

    this.loading = false;
  }


  /**
  * This method is for initialize EclTableModel.
  */
  initializeTableConfig() {
    this.tableConfig.url = RoutingConstants.RULES_URL + '/' + RoutingConstants.PEER_REVIEWER_APPROVAL_URL + '/' + Constants.LIBRARY + "?userId=" + this.userId;
    this.tableConfig.columns = this.initializeTableColumns();
    this.tableConfig.lazy = true;
    this.tableConfig.sortOrder = 1;
    this.tableConfig.excelFileName = this.pageTitle;
    this.tableConfig.checkBoxSelection = true;
    this.isEclTableCharged = true;
  }

  initializeDtTableConfig() {
    this.dtTableConfig.url = RoutingConstants.RULES_URL + "/" + RoutingConstants.RULE_STAGE_STATUS + "/" + this.ruleStatus;
    this.dtTableConfig.columns = this.initializeDtTableColumns();
    this.dtTableConfig.lazy = true;
    this.dtTableConfig.excelFileName = this.pageTitle;
    this.dtTableConfig.checkBoxSelection = true;
    this.dtTableConfig.sortBy = 'daysOld';
    this.dtTableConfig.sortOrder = 0;
    this.isDtEclTableCharged = true;
  }


  /**
  * This method is for initialize table colums in EclTableColumnManager.
  */
  initializeTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumnWithIcon('ruleCode', 'Library Rule ID', null, true, EclColumn.TEXT, true, 'left', 'researchRequestRuleIndicator', Constants.RESEARCH_REQUEST_INDICATOR_CLASS);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactAnalysis', 'Rule Impact Description', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactType', 'Impact Type', null, true, EclColumn.TEXT, true);
    manager.addDropDownColumn('reviewStatus', 'Approval Status', null, true, EclColumn.DROPDOWN, null,
      this.onChangeApprovalStatus, true, 'validStatusDropDown');
    manager.addInputColumn('reviewComments', 'Comments', null, true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  initializeDtTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumnWithIcon('ruleCode', 'Provisional Rule ID', null, true, EclColumn.TEXT, true, 'left', 'researchRequestRuleIndicator', Constants.RESEARCH_REQUEST_INDICATOR_CLASS);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('categoryDesc', 'Category', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('daysOld', 'Days Old', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('creator', 'Provisional Rule Creator', null, true, EclColumn.TEXT, true);
    manager.addDropDownColumn('reviewStatus', 'Review Status', null, true, EclColumn.DROPDOWN, null,
      this.onChangeApprovalStatus, true, 'validStatusDropDown');
    manager.addInputColumn('reviewComments', 'Review Comments', null, true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  onChangeApprovalStatus(event: any, rowData: any) {
    rowData.reviewStatus = event.value;
  }

  /**
   * This method is for selected and unselected element colums in table.
   */
  setSelectRules(event: any) {
    this.selectedData = event;
  }

  /**
   * This method is used after the eclTable service was called, it is used to upload the revieStatus.
   */
  afterServiceCall(event: any) {
    if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      this.eclTable.value.forEach(val => {
        this.validStatusDropDown = [];
        if (val.ruleImpactedInd === '' && val.ruleImpactType === null) {
          this.validStatusDropDown = [
            { label: RETIRE_PENDING_APPROVAL, value: '' },
            { label: APPROVED, value: APPROVED_ID },
            { label: RETURN_TO_RA, value: RETURN__TO_RA_ID }
          ];
        } else {
          this.validStatusDropDown = [
            { label: 'select', value: '' },
            { label: APPROVED, value: APPROVED_ID },
            { label: RETURN_TO_RA, value: RETURN__TO_RA_ID }
          ];
        }

        val.validStatusDropDown = this.validStatusDropDown;
        val.reviewStatus = this.getRuleStatus(val.workflowStatusId);
      });
      this.eclTable.fillCustomFilterOptions('reviewStatus', this.validStatusDW);
    }
  }

  afterServiceCallDt(event: any) {
    if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {

      this.dtEclTable.value.forEach(val => {

        val.validStatusDropDown = [
          { label: "Select", value: "" },
          { label: LIBRARY_RULE, value: 9 },
          { label: SHELVED, value: 6 },
          { label: NEED_MORE_INFO, value: 12 }
        ];

      });

      this.dtEclTable.fillCustomFilterOptions('reviewStatus', this.validStatus);

    }
  }

  refreshEclTable() {
    if (this.dtEclTable) {
      this.dtEclTable.resetDataTable();
      this.dtEclTable.selectedRecords = [];
      this.dtEclTable.savedSelRecords = [];
    }
    if (this.eclTable) {
      this.eclTable.resetDataTable();
      this.eclTable.selectedRecords = [];
      this.eclTable.savedSelRecords = [];
    }
  }

  filters: any = {

    ruleId: '',
    ruleName: '',
    Category: '',
    daysOld: '',
    ruleCreator: '',
    reviewStatus: '',
    reviewComments: ''
  };

}
