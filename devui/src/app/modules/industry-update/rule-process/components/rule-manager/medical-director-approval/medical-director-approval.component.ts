  import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { ECLConstantsService } from "../../../../../../services/ecl-constants.service";
import { ReturnDialogComponent } from "../../../../../rule-creation/new-idea-research/components/return-dialog/return-dialog.component";
import { RuleManagerService } from '../../../services/rule-manager.service';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { Router } from '@angular/router';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { ReferenceAnalysisComponent } from 'src/app/modules/industry-update/reference-analysis/reference-analysis.component';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';
import { RuleDto } from '../../../models/rule-dto.model';

const ECL_INDUSTRY_UPDATES_ASSIGNED_PEER_REVIEWER_APPROVAL = "ECL Industry Updates Assign for Peer Reviewer Approval";
const TOAST_RULES_CHANGED_SUCCESS = 'Rules successfully changed:';

@Component({
  selector: 'app-medical-director-approval',
  templateUrl: './medical-director-approval.component.html',
  styleUrls: ['./medical-director-approval.component.css']
})
export class MedicalDirectorApprovalComponent implements OnInit {
  constants = Constants;
  
  @ViewChild('peerReviewTable') peerReviewTable: EclTableComponent;

  public keyUp = new Subject<KeyboardEvent>();
  private keyUpSubscription: Subscription;
  pageTitle = '';
  cols;
  rules;
  selectedRules = [];
  loading = true;
  validStatusDropDown: any[] = [];
  resetDataSubscription: Subscription;

  tablePeerReviewApproval: EclTableModel;

  first = 0;
  last = 10;
  totalRecords = 0;

  keywordSearch = '';

  isNotValidForSubmit = true;
  requiredComment = '';

  approvalStatus;

  exportCols;

  constructor(private activatedRoute: ActivatedRoute, private dialogService: DialogService,
    private fileManagerService: FileManagerService, private ruleManagerService: RuleManagerService,
    private toastService: ToastMessageService, private eclConstantsService: ECLConstantsService,
    private appUtils: AppUtils, 
    private router: Router) { 

      this.validStatusDropDown = this.ruleManagerService.getStatusForMd();

    }

  /**
   * Get the current url and we subscribe to keyup event for the search input.
   */
  ngOnInit(): void {
    this.cols = this.ruleManagerService.getMdColumns();
    this.approvalStatus = this.ruleManagerService.getStatusForMd();
    this.exportCols = this.ruleManagerService.getMdColumsToExport();


    this.keyUpSubscription = this.keyUp.pipe(
      map((event: any) => event.target.value),
      debounceTime(1000),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(
        delay(500),
      )),
    ).subscribe(() => this.getRules());


    this.tablePeerReviewApproval = new EclTableModel();

    this.pageTitle = this.activatedRoute.snapshot.data.pageTitle;
    this.initializeTableConfig(this.tablePeerReviewApproval);

  }

  /**
  * This method is for initialize EclTableModel
  * @param table
  */
  initializeTableConfig(table: EclTableModel) {
    table.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    table.columns = this.initializeTableColumns();
    table.checkBoxSelection = true;
    table.excelFileName = 'peerReviewerApproval';
    table.lazy = true;
    table.extraBodyKeys = { role: Constants.MD_ROLE, status: Constants.ASSIGNED_STATUS, all: Constants.ALL_NO };
  }

  /**
  * This method is for initialize table colums in EclTableColumnManager
  */
  initializeTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumn('ruleCode', 'ECL ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('impactType', 'Impact Type', '8%', true, EclColumn.TEXT, true);
    manager.addIconColumn('codesActions', 'Codes Actions', '5%', 'fa fa-briefcase');
    manager.addDropDownColumn('approvalStatus', 'Approval Status', null, false, EclColumn.DROPDOWN, 
      this.validStatusDropDown, null, false, 'validStatusDropDown');
    manager.addInputColumn('comments', 'Comments', null, true, EclColumn.TEXT, false);
    manager.addLinkColumn('instanceName', 'Reference Analysis', '10%', true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  onChangeApprovalStatus(event: any, rowData: any) {
    rowData.approvalStatus = event.value;
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
      this.resetDataSubscription = this.ruleManagerService.showRuleDetailsScreenObs(event.row.ruleId, false, this.ruleManagerService.getStatusForMd())
          .subscribe(dialogRef => {
            if (dialogRef) {
              dialogRef.onClose.subscribe(() => {
       
                this.peerReviewTable.refreshTable();
                let dataList = this.peerReviewTable.value;
                let selectedLocalRules: any[] = [];
                this.selectedRules.forEach((rule: any) => {
                  dataList.forEach((dataItem: any) => {
                    if (rule.ruleId === dataItem.ruleId) {
                      selectedLocalRules.push(dataItem);
                    }
                  });
                });
                this.peerReviewTable.selectedRecords = selectedLocalRules;
                this.selectedRules = selectedLocalRules;
              });
            }
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
   * This method is used after the eclTable service was called, it is used to upload the reviewedStatus.
   */
  afterServiceCall(event: any) {
    if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      this.peerReviewTable.value.forEach(val => {
        val.reviewStatus = val.approvalStatus;
      });
      this.peerReviewTable.fillCustomFilterOptions('reviewStatus', this.validStatusDropDown);
    }
  }

/**
 * Resets the table properties
 */
refreshEclTable() {
  this.selectedRules = [];
  this.peerReviewTable.selectedRecords = [];
  this.peerReviewTable.savedSelRecords = [];
  this.peerReviewTable.refreshTable();
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
   * Sets the selectedRules every time the selection changes.
   * @param event changed data
   */
  setSelectRules(event: any) {
      this.selectedRules = event;
  }

  /**
   * Gets the observable rules, and define the columns to be shown.
   */
  getRules(): void {
    this.ruleManagerService.getRules(this.first, this.last, this.keywordSearch, Constants.MD_ROLE).subscribe((response: BaseResponse) => {
      this.loading = false;
      this.totalRecords = response.data.totalRecords;
      this.rules = response.data.dtoList;
    });
  }

  /**
   * Opens the details rule modal.
   * @param ruleId to retrieve the details.
   */
  viewRuleDetails(ruleId: number): void {
    this.ruleManagerService.showRuleDetailsScreen(ruleId, false, this.approvalStatus, 3);
  }

  /**
    * Gets the file from the service.
    * @param file that we want to download.
    */
  downloadFile(fileId, fileName) {
    this.fileManagerService.downloadFile(fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, fileName);
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'File downloaded');
    });
  }

  /**
   * Gets the codes by rule.
   * @param ruleId to filter the codes to be shown.
   */
  openBox(ruleId: number, instanceId: number): void {
    const url = `${Constants.INDUSTRY_UPDATES_CODES_URL}?ruleId=${this.appUtils.encodeString(ruleId.toString())}&instanceId=${this.appUtils.encodeString(instanceId.toString())}`;
    this.appUtils.openNewWindow(url, Constants.WINDOW_TARGET_BLANK, Constants.WINDOW_DEFAULT_FEATURES);
  }

  /**
   * Processes the selected rules.
   * @param type of the process, can be Constants.SUBMIT_ACTION, Constants.SAVE_ACTION
   */
  processRules(type: string) {
    if (!this.isSelectionValid()) {
      return;
    }

    let process$ = type === Constants.SUBMIT_ACTION ?
      this.ruleManagerService.submitRules(this.selectedRules, Constants.CCA_RETURNED) : this.ruleManagerService.saveRules(this.selectedRules);

    process$.subscribe((response: BaseResponse) => {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
      if (type === Constants.SUBMIT_ACTION) {
        this.showMessageWithNewVersionOfRules();
      }
      this.refreshEclTable();
    }, error => {
      this.refreshEclTable();
    });
  }

  /**
  * Show message with new version of rules
  */
  showMessageWithNewVersionOfRules() {
    let selectedRulesWithStatusApproval: any[] = [];
    this.selectedRules.forEach(item => {
      if (item.approvalStatus === Constants.MD_APPROVAL_PENDING_SUBMISSION) {
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
  isSelectionValid(): boolean {
    if (this.selectedRules.length <= 0) {
      this.toastService.messageWarning(Constants.TOAST_SEVERITY_WARN, Constants.NOT_SELECTED_RULES_ERROR);
      return false;
    }

    const errors = [];
    this.selectedRules.forEach(item => {
      if((item.approvalStatus == null || item.approvalStatus == '') &&
        (item.approvalStatus !== Constants.MD_APPROVAL_PENDING_SUBMISSION || item.approvalStatus !== Constants.MD_RETURN_TO_RA_PENDING_SUBMISSION) && 
        (!item.comments || item.comments === '')){
          errors.push(`${Constants.EMPTY_COMMENTS_AND_NO_SELECTED_STATUS_ERROR}${item.ruleCode}.`);
      } else {
          if (item.approvalStatus == null || item.approvalStatus == '' || (
            item.approvalStatus !== Constants.MD_APPROVAL_PENDING_SUBMISSION && item.approvalStatus !== Constants.MD_RETURN_TO_RA_PENDING_SUBMISSION)) {
            errors.push(`${Constants.NO_SELECTED_STATUS_ERROR_FOR_RULE}${item.ruleCode}.`);
          }

          if (item.approvalStatus === Constants.MD_RETURN_TO_RA_PENDING_SUBMISSION && (!item.comments || item.comments === '')) {
            errors.push(`${Constants.EMPTY_COMMENTS_ERROR_FOR_RULE}${item.ruleCode}`);
          }

          if (item.approvalStatus === Constants.MD_APPROVAL_PENDING_SUBMISSION && (!item.comments || item.comments === '')) {
            errors.push(`${Constants.EMPTY_COMMENTS_ERROR_FOR_APPROVED_RULE}${item.ruleCode}`);
          }
      }

    });

    if (errors.length > 0) {
      this.toastService.messages(this.toastService.WARNING, Constants.TOAST_SUMMARY_WARN, errors);
      return false;
    }

    return true;
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
      header: ECL_INDUSTRY_UPDATES_ASSIGNED_PEER_REVIEWER_APPROVAL,
      contentStyle: { "max-height": "80%", "overflow": "auto" }
    })
  }
}
