import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/api';
import { ReferenceAnalysisComponent } from 'src/app/modules/industry-update/reference-analysis/reference-analysis.component';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { ECLConstantsService } from "../../../../../../services/ecl-constants.service";
import { RuleManagerService } from '../../../services/rule-manager.service';
import { Subscription } from 'rxjs';

const ECL_INDUSTRY_UPDATES_REASSIGNMENT_FOR_CCA = 'ECL Industry Updates Reassignment for CCA Analysis';

@Component({
  selector: 'app-rule-process',
  templateUrl: './impact-analysis-cca.component.html',
  styleUrls: ['./impact-analysis-cca.component.css']
})
export class ImpactAnalysisCcaComponent implements OnInit, OnDestroy {
  @ViewChild('assignedTable',{static: true}) assignedTable: EclTableComponent;
  @ViewChild('returnedTable',{static: true}) returnedTable: EclTableComponent;
  pageTitle = '';
  selectedRules = [];
  keywordSearch = '';
  public tabIndex = 0;
  resetDataSubscription: Subscription;

  public tabIndexReturned = 0;
  selectedRulesReturned = [];
  keywordSearchReturned = '';

  assignedTableConfig;
  returnedTableConfig;

  constructor(private activatedRoute: ActivatedRoute, private dialogService: DialogService, private fileManagerService: FileManagerService,
    private ruleManagerService: RuleManagerService, private toastService: ToastMessageService, private eclConstantsService: ECLConstantsService,
    private appUtils: AppUtils) { }

  /**
   * Get the current url and we subscribe to keyup event for the search input.
   */
  ngOnInit(): void {
    this.pageTitle = this.activatedRoute.snapshot.data.pageTitle;
    this.tabIndexReturned = 0;
    this.tabIndex = 0;

    let manager = new EclTableColumnManager();
    this.assignedTableConfig = new EclTableModel();

    manager.addLinkColumn('ruleCode', 'ECL ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 100);
    manager.addTextColumn('impactType', 'Impact type', null, true, EclColumn.TEXT, true);
    manager.addIconColumn('options', 'Codes Actions', '5%', 'fa fa-briefcase');
    manager.addTextColumn('reviewStatus', 'Status', null, true, EclColumn.TEXT, true);
    manager.addLinkColumn('instanceName', 'Reference Analysis', null, true, EclColumn.TEXT, true);

    this.assignedTableConfig.columns = manager.getColumns();
    this.assignedTableConfig.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    this.assignedTableConfig.checkBoxSelection = true;
    this.assignedTableConfig.excelFileName = 'CCAAnalysis';
    this.assignedTableConfig.lazy = true;
    this.assignedTableConfig.extraBodyKeys = { role: Constants.CCA_ROLE, status: Constants.ASSIGNED_STATUS, all: Constants.ALL_NO };

    manager = new EclTableColumnManager();
    this.returnedTableConfig = new EclTableModel();

    manager.addLinkColumn('ruleCode', 'ECL ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 100);
    manager.addTextColumn('impactType', 'Impact type', null, true, EclColumn.TEXT, true);
    manager.addIconColumn('options', 'Codes Actions', '5%', 'fa fa-briefcase');
    manager.addTextColumn('reviewStatus', 'Status', null, false, EclColumn.TEXT, true);
    manager.addLinkColumn('instanceName', 'Reference Analysis', null, true, EclColumn.TEXT, true);

    this.returnedTableConfig.columns = manager.getColumns();
    this.returnedTableConfig.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    this.returnedTableConfig.checkBoxSelection = true;
    this.returnedTableConfig.excelFileName = 'CCAAnalysis';
    this.returnedTableConfig.lazy = true;
    this.returnedTableConfig.extraBodyKeys = { role: Constants.CCA_ROLE, status: Constants.RETURNED_STATUS, all: Constants.ALL_NO };
  }

  /**
   * Opens the details rule modal.
   * @param ruleId to retrieve the details.
   */
  viewRuleDetails(ruleId: number): void {
    this.ruleManagerService.showRuleDetailsScreen(ruleId, false);
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
   * Resets the table status.
   */
  resetDataTable(tab: string) {
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        this.selectedRules = [];
        if (this.assignedTable) {
          this.assignedTable.resetDataTable();
          this.assignedTable.selectedRecords = [];
          this.assignedTable.savedSelRecords = [];
        }
        break;
      case Constants.RETURNED_TAB:
        this.selectedRulesReturned = [];
        if (this.returnedTable) {
          this.returnedTable.resetDataTable();
          this.returnedTable.selectedRecords = [];
          this.returnedTable.savedSelRecords = [];
        }
        break;
    }
  }

  /**
   * Submit the selected rules.
   */
  submitRules() {
    if (this.selectedRules.length <= 0) {
      return;
    }

    this.ruleManagerService.submitRules(this.selectedRules, Constants.NEW_VERION_PENDING_APPROVAL)
      .subscribe((response: BaseResponse) => {
        if (response.code == 200) {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        } else {
          this.toastService.messageError(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        }
        this.resetDataTable(Constants.ASSIGNED_TAB);
      }, error => {
        this.resetDataTable(Constants.ASSIGNED_TAB);
      });
  }

  /**
   * Submit the selected returned rules.
   */
  submitRulesReturned() {
    if (this.selectedRulesReturned.length <= 0) {
      return;
    }

    this.ruleManagerService.submitRules(this.selectedRulesReturned, Constants.RETURNED_FROM_CCA)
      .subscribe((response: BaseResponse) => {
        if (response.code == 200) {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        } else {
          this.toastService.messageError(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        }
        this.resetDataTable(Constants.RETURNED_TAB);
      }, error => {
        this.resetDataTable(Constants.RETURNED_TAB);
      });
  }

  /**
   * Show return dialog
   */
  showReturnDialog() {
    const ret = this.dialogService.open(ReturnDialogComponent, {
      data: {
        selectedRulesIds: this.selectedRules,
        stageId: this.eclConstantsService.RULE_STAGE_LIBRARY_RULE,
        isImpactAnalysis: true
      },
      header: ECL_INDUSTRY_UPDATES_REASSIGNMENT_FOR_CCA,
      contentStyle: { "max-height": "80%", "overflow": "auto" }
    })
  }

  /**
   * Sets the selectedRules every time the selection changes.
   * @param event changed data
   */
  setSelectRules(event: any, tab: string) {
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        this.selectedRules = event;
        break;
      case Constants.RETURNED_TAB:
        this.selectedRulesReturned = event;
        break;
    }
  }

  /**
   * Every time the service is called we reset the data.
   * @param event accion that occurred.
   * @param tab to identify which data we are resetting.
   */
  onServiceCall(event: { action: string }, tab: string) {
    if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      switch (tab) {
        case Constants.ASSIGNED_TAB:
          this.selectedRules = [];
          if (this.assignedTable) {
            this.assignedTable.selectedRecords = [];
          }
          break;
        case Constants.RETURNED_TAB:
          this.selectedRulesReturned = [];
          if (this.returnedTable) {
            this.returnedTable.selectedRecords = [];
          }
          break;
      }
    }
  }

  /**
   * event executed when a user clicks on the link column
   * @param event 
   */
  redirect(event: any, tab: string) {
    switch (event.field) {
      case 'ruleCode':
        this.resetDataSubscription = this.ruleManagerService.showRuleDetailsScreenObs(event.row.ruleId, false, 
          this.ruleManagerService.getStatusForCcaImpactAnalysis())
          .subscribe(dialogRef => {
            if (dialogRef) {
              dialogRef.onClose.subscribe(() => {
                this.resetDataTable(tab);
              });
            }
          });
        break;
      case 'instanceName':
        this.dialogService.open(ReferenceAnalysisComponent, {
          data: {
            instanceId: event.row.instanceId,
            codesType: event.row.codesType == null ? Constants.HCPCS_CODE_TYPE : event.row.codesType
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
        break;
    }
  }


  /**
   * Shows popup with codes divided by type of codes
   */
  showLunchBox(ruleId: number, instanceId: number) {
    const url = `${Constants.INDUSTRY_UPDATES_CODES_URL}?ruleId=${this.appUtils.encodeString(ruleId.toString())}&instanceId=${this.appUtils.encodeString(instanceId.toString())}`;
    this.appUtils.openNewWindow(url, Constants.WINDOW_TARGET_BLANK, Constants.WINDOW_DEFAULT_FEATURES);
  }

  /**
   * Checks every array element and determinates if the selected elements are ready for submit.
   */
  elementsReadyForSubmit(tab: string) {
    let rulesToCheck: any[] = [];
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        rulesToCheck = this.selectedRules;
        break;
      case Constants.RETURNED_TAB:
        rulesToCheck = this.selectedRulesReturned;
        break;
    }

    return rulesToCheck.every(rule => {
      return rule.ruleReady;
    });
  }


  ngOnDestroy(): void {
    if (this.resetDataSubscription) {
      this.resetDataSubscription.unsubscribe();
    }
  }
}
