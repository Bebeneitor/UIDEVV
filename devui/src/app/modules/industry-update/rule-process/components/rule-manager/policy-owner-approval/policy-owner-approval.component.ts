import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/api';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { ECLConstantsService } from "../../../../../../services/ecl-constants.service";
import { ReturnDialogComponent } from "../../../../../rule-creation/new-idea-research/components/return-dialog/return-dialog.component";
import { RuleDto } from '../../../models/rule-dto.model';
import { RuleManagerService } from '../../../services/rule-manager.service';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { ReferenceAnalysisComponent } from 'src/app/modules/industry-update/reference-analysis/reference-analysis.component';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';

const ECL_INDUSTRY_UPDATES_REASSIGNMENT_POLICY_OWNER = "ECL Industry Updates Reassignment for Policy Owner Analysis";
const TOAST_RULES_CHANGED_SUCCESS = 'Rules successfully changed';

@Component({
  selector: 'app-industry-update-po',
  templateUrl: './policy-owner-approval.component.html',
  styleUrls: ['./policy-owner-approval.component.css']
})

export class PolicyOwnerComponent implements OnInit {

  @ViewChild('eclTable') eclTable: EclTableComponent;

  eclTableConfig: EclTableModel = null;
  pageTitle = '';
  selectedRules: any[] = [];
  validStatusDropDown: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private ruleManagerService: RuleManagerService, private toastService: ToastMessageService,
    private dialogService: DialogService, private eclConstantsService: ECLConstantsService, private appUtils: AppUtils) {
    this.eclTableConfig = new EclTableModel();
    this.validStatusDropDown = ruleManagerService.getStatusForPo();
  }

  ngOnInit() {
    this.pageTitle = this.activatedRoute.snapshot.data.pageTitle;
    this.initializeTableConfig(this.eclTableConfig);
  }

  /**
  * This method is for initialize EclTableModel
  * @param table
  */
  initializeTableConfig(table: EclTableModel) {
    table.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    table.columns = this.initializeTableColumns();
    table.lazy = true;
    table.sortOrder = 1;
    table.excelFileName = 'policyOwnerApproval';
    table.checkBoxSelection = true;
    table.extraBodyKeys = { role: Constants.PO_ROLE, status: Constants.ASSIGNED_TAB, all: Constants.ALL_NO };
  }

  /**
  * This method is for initialize table colums in EclTableColumnManager
  */
  initializeTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumn("ruleCode", "ECL ID", '8%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 150);
    manager.addTextColumn('impactType', 'Impact Type', '8%', true, EclColumn.TEXT, true);
    manager.addIconColumn('lunchBox', 'Code Actions', '7%', 'fa fa-briefcase');
    manager.addDropDownColumn('reviewStatus', 'Approval Status', '12%', false, EclColumn.DROPDOWN, 
      this.validStatusDropDown, this.onChangeApprovalStatus, true, 'validStatusDropDown');
    manager.addInputColumn('comments', 'Comments', '12%', true, EclColumn.TEXT, true);
    manager.addLinkColumn('instanceName', 'Reference Analysis', '10%', true, EclColumn.TEXT, true)
    return manager.getColumns();
  }

  onChangeApprovalStatus(event: any, rowData: any) {
    rowData.approvalStatus = event.value;
  }

  /**
   * This method is used after the eclTable service was called, it is used to upload the revieStatus.
   */
  afterServiceCall(event: any) {
    if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      this.eclTable.value.forEach(val => {
        val.reviewStatus = val.approvalStatus;
      });
      this.eclTable.fillCustomFilterOptions('reviewStatus', this.validStatusDropDown);
    }
  }

  setSelectRules(event: any) {
    this.selectedRules = event;
  }

  /**
   * Save status for selected rules
   */
  save(submit: boolean) {
    if (!this.validate()) {
      return;
    }
    let approvalArray: RuleDto[] = [];
    this.selectedRules.forEach(item => {
      let status = item.approvalStatus;
      if (submit) {
        if (status === Constants.PO_APPROVAL_PENDING_SUBMISSION_CODE) {
          status = Constants.APPROVED_CODE;
        } else if (status === Constants.PO_MD_APPROVAL_PENDING_SUBMISSION) {
          status = Constants.MEDICAL_DIRECTOR_APPROVAL_NEEDED_CODE;
        } else {
          status = Constants.RETURN_TO_RESEARCH_ANALYSIS;
        }
      }
      const approvalObject: RuleDto = {
        ruleId: item.ruleId,
        status: status,
        comments: item.comments == null ? '' : item.comments,
        returnedStatus: item.approvalStatus == Constants.PO_RETURN_TO_RA_PENDING_SUBMISSION
      };
      approvalArray.push(approvalObject);
    });
    this.ruleManagerService.processImpactedRules(submit, approvalArray).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Information ' + (submit ? 'submited' : 'saved') + ' successfully.');
        if (submit) {
          this.showMessageWithNewVersionOfRules();
          this.refreshEclTable();
        }
      } else {
        this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, response.message);
      }
    });
  }

  /**
   * Show message with new version of rules
   */
  showMessageWithNewVersionOfRules() {
    let selectedRulesWithStatusApproval: any[] = [];

    this.selectedRules.forEach(item => {
      if (item.approvalStatus === Constants.PO_APPROVAL_PENDING_SUBMISSION_CODE) {
        selectedRulesWithStatusApproval.push(item);
      }
    });

    if (selectedRulesWithStatusApproval.length > 0) {
      this.ruleManagerService.getCodesOfOldAndNewVersionOfRules(selectedRulesWithStatusApproval).then((codesOfOldAndNewRules: string[]) => {
        if (codesOfOldAndNewRules.length > 0) {
          this.toastService.message(Constants.TOAST_SEVERITY_SUCCESS, TOAST_RULES_CHANGED_SUCCESS, codesOfOldAndNewRules.join('\n'), Constants.TOAST_DEFAULT_LIFE_TIME, Constants.TOAST_CLOSABLE);
        }
      });
    }
  }

  /**
   * Validate if all information is ok before send to backend
   */
  validate(): boolean {
    if (this.selectedRules.length == 0) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_ERROR, Constants.NOT_SELECTED_RULES_ERROR);
      return false;
    }
    let errors = [];
    let invalidStatus: boolean = false;
    let invalidComments: boolean = false;
    this.selectedRules.forEach(item => {
      if ((item.approvalStatus == null || item.approvalStatus == '') ||
        (item.approvalStatus !== Constants.PO_APPROVAL_PENDING_SUBMISSION_CODE && item.approvalStatus !== Constants.PO_MD_APPROVAL_PENDING_SUBMISSION &&
          item.approvalStatus !== Constants.PO_RETURN_TO_RA_PENDING_SUBMISSION)) {
        invalidStatus = true;
      }
      if (item.comments === '') {
          invalidComments = true;
      }
      if(invalidStatus && invalidComments) {
        errors.push(`${Constants.APPROVAL_AND_COMMENTS_MANDATORY}${item.ruleCode}`);
      } else if(invalidStatus && !invalidComments) {
        errors.push(`${Constants.APPROVAL_STATUS_MANDATORY}${item.ruleCode}`);
      } else if(!invalidStatus && invalidComments) {
        errors.push(`${Constants.COMMENTS_MANDATORY}${item.ruleCode}`);
      }
    });
    if (errors.length > 0) {
      this.toastService.messages(this.toastService.WARNING, 'Warning', errors);
      return false;
    }
    return true;
  }

  /**
   * Shows popup with codes divided by type of codes
   */
  showLunchBox(event: any) {
    const row = event.row;
    const url = `${Constants.INDUSTRY_UPDATES_CODES_URL}?ruleId=${this.appUtils.encodeString(row.ruleId.toString())}&instanceId=${this.appUtils.encodeString(row.instanceId.toString())}`;
    this.appUtils.openNewWindow(url, Constants.WINDOW_TARGET_BLANK, Constants.WINDOW_DEFAULT_FEATURES);
  }

  /**
  * Open pop up details
  * @param event
  */
  openDetails(event: any) {
    const row = event.row;
    const field = event.field;
    switch (field) {
      case "ruleCode":
        this.ruleManagerService.findClonedRuleId(row.ruleId, impactedId => {
          let header = 'Library Rule Details';
          let readOnly = false;
          if (!impactedId) {
            impactedId = row.ruleId;
            readOnly = true;
            header = 'Library Rule Details - Invalid Rule';
          }
          const ref = this.dialogService.open(ProvisionalRuleComponent, {
            data: {
              ruleId: impactedId,
              header: 'Library View',
              isSameSim: !readOnly,
              fromSameSimMod: true,
              fromMaintenanceProcess: true,
              readOnlyView: true,
              provDialogDisable: true,
              ruleReview: true,
              readWrite: !readOnly,
              reviewStatus: this.ruleManagerService.getStatusForPo(),
              tabSelected: 3
            },

            header: header,
            width: '90%',
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
          ref.onClose.subscribe(() => {
            this.eclTable.refreshTable();
            let dataList = this.eclTable.value;
            let selectedRules: any[] = [];
            this.selectedRules.forEach((rule: any) => {
              dataList.forEach((dataItem: any) => {
                if (rule.ruleId === dataItem.ruleId) {
                  selectedRules.push(dataItem);
                }
              });
            });
            this.eclTable.selectedRecords = selectedRules;
            this.selectedRules = selectedRules;
          });
        });
        break;
      case "instanceName":
        this.dialogService.open(ReferenceAnalysisComponent, {
          data: {
            instanceId: event.row.instanceId
          },
          header: 'Reference Analysis',
          width: '80%',
          height: '92%',
          contentStyle: {
            'max-height': '92%',
            'overflow': 'auto',
            'padding-top': '0',
            'padding-bottom': '0',
            'border': 'none'
          }
        });
    }
  }

  /**
    * Show return dialog
    */
  showReturnDialog() {
    const ret = this.dialogService.open(ReturnDialogComponent, {
      data: {
        selectedRulesIds: this.selectedRules,
        stageId: this.eclConstantsService.RULE_STAGE_LIBRARY_RULE
      },
      header: ECL_INDUSTRY_UPDATES_REASSIGNMENT_POLICY_OWNER,
      contentStyle: { "max-height": "80%", "overflow": "auto" }
    })
  }

  refreshEclTable() {
    this.selectedRules = [];
    this.eclTable.selectedRecords = [];
    this.eclTable.savedSelRecords = [];
    this.eclTable.refreshTable();
  }

}