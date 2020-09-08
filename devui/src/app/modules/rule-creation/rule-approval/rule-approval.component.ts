import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, DialogService, MessageService } from 'primeng/api';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { GoodIdeasDto } from 'src/app/shared/models/dto/good-ideas-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { environment } from '../../../../environments/environment';
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { Constants } from '../../../shared/models/constants';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { ProvisionalRuleComponent } from '../provisional-rule/provisional-rule.component';

const LIBRARY_RULE = 'Library Rule';
const SHELVED = 'Shelved';
const NEED_MORE_INFO = 'Need More Information';
const NEED_MD_APPROVAL = 'Need Peer Reviewer Approval';
const STAGE_SAVESUBMIT = 2;
const SHELVED_VALUE = Constants.SHELVED_VALUE;
const NEED_MORE_INFO_VALUE = Constants.NEED_MORE_INFO_VALUE;
const NEED_MD_APPROVAL_VALUE = Constants.PR_APPROVAL_VALUE;

const RESPONSE_SUCCESS = "success";

@Component({
  selector: 'app-rule-approval',
  templateUrl: './rule-approval.component.html',
  styleUrls: ['./rule-approval.component.css'],
  providers: [ConfirmationService]
})
export class RuleApprovalComponent implements OnInit {

  @ViewChild('poApprovalTable') poApprovalTable: EclTableComponent;

  poApprovalTableConfig: EclTableModel = new EclTableModel();
  cols: any[];
  statusCodes: any[] = [{ label: 'Select', value: null }];

  selectedData: any[] = [];

  ruleStatus: number;
  pageTitle: string;
  userId: number;

  loading: boolean = true;
  idearequiredVal: boolean = true;
  saveMessage = '';
  IdeaSaveModal: boolean = false;
  modalSaveBtn: boolean = false;
  modalSubmitBtn: boolean = false;
  msgTitle: string;
  saveDisplay: boolean = false;
  submitMsgFlag: boolean = false;
  Message: string;

  selectedRuleIds: any[] = [];

  saveGoodIdeas: boolean = false;
  selectedShelved: GoodIdeasDto[];

  constructor(private util: AppUtils, public route: ActivatedRoute, private http: HttpClient,
    private dialogService: DialogService, private confirmationDialogService: ConfirmationDialogService, private router: Router,
    private confirmationService: ConfirmationService, private provisionalService: ProvisionalRuleService, private messageService: MessageService,
    private ruleService: RuleInfoService, private eclConstantsService: ECLConstantsService, private toastService: ToastMessageService) {
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.ruleStatus = params['ruleStatus'];
      this.pageTitle = params['pageTitle'];
      this.userId = this.util.getLoggedUserId();
      this.statusCodes = this.provisionalService.getStatusCodeForApprovalScreen();
    });
    this.initializeTableConfig();
    
  }

  initializeTableConfig() {
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('ruleCode', 'Provisional Rule ID', '12%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Provisional Rule Name', '20%', true, EclColumn.TEXT, true);
    manager.addTextColumn('categoryDesc', 'Category', '8%', true, EclColumn.TEXT, true);
    manager.addTextColumn('daysOld', 'Days Old', "5%", true, EclColumn.TEXT, true);
    manager.addTextColumn('createdByUser', 'Provisional Rule Creator', '8%', true, EclColumn.TEXT, true);
    manager.addDropDownColumn('ruleStatusId', 'Review Status','8%', true, EclColumn.DROPDOWN, this.statusCodes, null, true);
    manager.addInputColumn('reviewComments', 'Review Comments','10%', true, EclColumn.TEXT, true);
    this.poApprovalTable.customFilterOptions = this.statusCodes;
    this.poApprovalTableConfig.lazy = true;
    this.poApprovalTableConfig.sortOrder = 1;
    this.poApprovalTableConfig.columns = manager.getColumns();
    this.poApprovalTableConfig.checkBoxSelection = true;
    this.poApprovalTableConfig.excelFileName = this.pageTitle;
    this.poApprovalTableConfig.url = 
    `${RoutingConstants.RULES_URL}/${RoutingConstants.PROVISIONAL_RULES_FOR_PO_URL}/${Constants.ASSIGNED_TAB}?userId=${this.userId}`;
  }

  refreshRuleApproval() {
    this.selectedData = [];
    this.poApprovalTable.selectedRecords = [];
    this.poApprovalTable.savedSelRecords = [];
    this.poApprovalTable.clearFilters();
    this.poApprovalTable.keywordSearch = '';
    this.poApprovalTable.refreshTable();
  }

  submitRuleApproval() {
    if (this.validateSelectedRows()) {
      this.saveSubmit("submit");
    }
  }

  saveRuleApproval() {
    if (this.validateSelectedRows()) {
      this.saveSubmit("save");
    }
  }

  public goodIdeasEvent(status: String): void {
    if (status === RESPONSE_SUCCESS) {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Good Ideas Saved Successfully', 3000, true);
    }
    this.saveGoodIdeas = false;
  }

  public fillselectedShelved(): void {
    this.selectedShelved = [];
    this.selectedData.forEach(data => {
      if (data.ruleStatusId === SHELVED_VALUE) {
        this.selectedShelved.push(
          {
            ruleId: data.ruleId,
            code: data.ruleCode,
            name: data.name,
            category: data.category,
            daysold: data.daysold,
            creator: data.creator,
            reviewComment: data.reviewComments,
            goodIdeaDt: undefined
          }
        );
      }
    });
  }

  saveSubmit(actionVal): void {

    let requestBody: any;
    let selectedRules: any[] = [];

    selectedRules = this.selectedData.map(rowData => {
      return ({
        ruleId: rowData.ruleId,
        stageId: 2,
        status: rowData.ruleStatusId,
        comments: rowData.reviewComments,
      });
    });

    requestBody = {
      "selectedRules": selectedRules,
      "action": actionVal,
      "userId": this.userId
    };

    if (actionVal === Constants.SAVE_ACTION) {
      this.ruleService.saveProvRuleApproval(requestBody).subscribe(response => {
        this.loading = false;
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: "Rule approval details saved successfully", life: 3000, closable: false });
        }
      });
    } else {
      this.ruleService.submitMDApproval(requestBody).subscribe(resp => {
        this.submitMsgFlag = false;
        this.loading = false;
        this.fillselectedShelved();
        this.refreshRuleApproval();
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
              this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Rule approval details submitted successfully', life: 3000, closable: false });
            }
            if (codes) {
              this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: `${codes} successfully been created.`, life: 5000, closable: true });
            }
          } else {
            this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Rule approval details submitted successfully', life: 3000, closable: false });
          }
          if (this.selectedShelved.length > 0) {
            this.saveGoodIdeas = true;
          } else {
            this.saveGoodIdeas = false;
          }
        }
      });
    }

  }

  validateSelectedRows() {
    let res: boolean = true;
    this.selectedData.forEach(data => {
      if (!data.ruleStatusId || data.ruleStatusId === Constants.PROVISIONAL_RULE_VALUE) { 
        this.messageService.add({ severity: 'warn', summary: 'No Status', detail: data.ruleCode + " : Please select a review status" + '.', life: 3000, closable: true });
        res = false;
      } else {
        if (data.ruleStatusId === SHELVED_VALUE && !data.reviewComments) {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Shelved' status a comment should be provided", life: 3000, closable: false });
          res = false;
        } else if (data.ruleStatusId === NEED_MORE_INFO_VALUE && !data.reviewComments) {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Need More Info' status a comment should be provided", life: 3000, closable: false });
          res = false;
        } else if (data.ruleStatusId === NEED_MD_APPROVAL_VALUE && !data.reviewComments) {
          this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: "For 'Need Peer Reviewer Approval' status a comment should be provided", life: 3000, closable: false });
          res = false;
        }
      }
    });
    return res;
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  public openConfirmationDialog() {
    this.idearequiredVal = false;
    this.confirmationDialogService.confirm('', 'Do you really want to exit from the screen?')
      .then((confirmed) => {
        if (confirmed) {
          this.idearequiredVal = false;
          this.navigateHome();
        } else {
          this.idearequiredVal = true;
        }
      });
  }

  viewProvisionalModal(event: any) {
    const rowData: any = event.row;
    let ruleId = rowData.ruleId;
    let ruleReviewStatus = rowData.ruleStatusId;
    let ruleReviewComments = rowData.reviewComments;
    const ref = this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: ruleId,
        header: 'Rule Provisional Details',
        reviewStatus: this.getReviewStatus(),
        ruleReviewStatus: ruleReviewStatus,
        ruleReviewComments: ruleReviewComments,
        stageId: STAGE_SAVESUBMIT
      },
      header: 'Rule Details',
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


    ref.onClose.subscribe((provRuleId: any) => {
      this.refreshRuleApproval();
    });
  }
  getReviewStatus() {

    return [
      {
        label: '', value: null
      },
      {
        label: LIBRARY_RULE,
        value: 9
      },
      {
        label: SHELVED,
        value: 6
      },
      {
        label: NEED_MORE_INFO,
        value: 12
      },
      {
        label: NEED_MD_APPROVAL,
        value: 7
      }

    ]

  }


  saveDialog() {
    this.saveDisplay = false;
  }
  showReturnDialog() {
    this.selectedRuleIds = this.selectedData.map(rule => {
      return ({
        ruleId: rule.ruleId,
      });
    });
    const ret = this.dialogService.open(ReturnDialogComponent, {
      data: {
        selectedRulesIds: this.selectedRuleIds,
        stageId: this.ruleStatus
      },
      header: 'Reassignment Policy Owner Return',
      contentStyle: { "max-height": "80%", "overflow": "auto" }
    })
  };

  /* function to confirm message for exit button*/
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

}
