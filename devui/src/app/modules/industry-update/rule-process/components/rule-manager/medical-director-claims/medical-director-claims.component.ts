import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/api';
import { ReferenceAnalysisComponent } from 'src/app/modules/industry-update/reference-analysis/reference-analysis.component';
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

@Component({
  selector: 'app-industry-update-md-claim',
  templateUrl: './medical-director-claims.component.html',
  styleUrls: ['./medical-director-claims.component.css']
})
export class MedicalDirectorClaimComponent implements OnInit {
  @ViewChild('assignedTable',{static: true}) assignedTable: EclTableComponent;
  @ViewChild('returnedTable',{static: true}) returnedTable: EclTableComponent;
  selectedRules: any[] = [];
  activeTab: number = 0;
  selectedRulesReturned = [];

  pageTitle = '';
  public tabIndex = 0;
  public tabIndexReturned = 0;

  assignedTableConfig;
  returnedTableConfig;

  constructor(private activatedRoute: ActivatedRoute, private ruleManagerService: RuleManagerService, private toastService: ToastMessageService,
    private dialogService: DialogService, private utils: AppUtils, private fileManagerService: FileManagerService, private eclConstantsService: ECLConstantsService) { }

  ngOnInit() {
    this.pageTitle = this.activatedRoute.snapshot.data.pageTitle;
    this.tabIndexReturned = 0;
    this.tabIndex = 0;

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === Constants.ASSIGNED_TAB) {
        this.activeTab = 0;
      } else if (params['tab'] === Constants.RETURNED_TAB) {
        this.activeTab = 1;
      } else {
        this.activeTab = 0;
      }
    });

    let manager = new EclTableColumnManager();
    this.assignedTableConfig = new EclTableModel();

    manager.addLinkColumn('ruleCode', 'ECL ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 100);
    manager.addIconColumn('codesActions', 'Codes Actions', '5%', 'fa fa-briefcase');
    manager.addTextColumn('reviewStatus', '  Review Status', null, true, EclColumn.TEXT, true);
    manager.addLinkColumn('instanceName', 'Reference Analysis', null, true, EclColumn.TEXT, true);

    this.assignedTableConfig.columns = manager.getColumns();
    this.assignedTableConfig.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    this.assignedTableConfig.checkBoxSelection = true;
    this.assignedTableConfig.excelFileName = 'assignedPeerReviewer';
    this.assignedTableConfig.lazy = true;
    this.assignedTableConfig.extraBodyKeys = { role: Constants.MD_ROLE, status: Constants.ASSIGNED_STATUS, all: Constants.ALL_YES };


    manager = new EclTableColumnManager();
    this.returnedTableConfig = new EclTableModel();

    manager.addLinkColumn('ruleCode', 'ECL ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 100);
    manager.addIconColumn('codesActions', 'Codes Actions', '5%', 'fa fa-briefcase');
    manager.addTextColumn('reviewStatus', '  Review Status', null, false, EclColumn.TEXT, true);
    manager.addLinkColumn('instanceName', 'Reference Analysis', null, true, EclColumn.TEXT, true);

    this.returnedTableConfig.columns = manager.getColumns();
    this.returnedTableConfig.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    this.returnedTableConfig.checkBoxSelection = true;
    this.returnedTableConfig.excelFileName = 'assignedPeerReviewer';
    this.returnedTableConfig.lazy = true;
    this.returnedTableConfig.extraBodyKeys = { role: Constants.MD_ROLE, status: Constants.RETURNED_STATUS, all: Constants.ALL_YES };

  }

  handleTabViewChange(e) {
    const index = e.index;
    if (index === 0) {
      this.selectedRules = [];
    } else if (index === 1) {
      this.selectedRulesReturned = [];
    }

  }

  /**
   * Claim selected rules
   */
  claim() {
    if (!this.validate('selectedRules')) {
      return;
    }

    let userId = this.utils.getLoggedUserId();
    let recordsIds: number[] = [];

    this.selectedRules.forEach(item => {
      recordsIds.push(item.ruleId);
    });

    this.ruleManagerService.assignMedicalDirector(userId, recordsIds, Constants.STAGE_MD_CLAIM).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        this.resetDataTable();
      } else {
        this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, response.message);
      }
    });

  }


  /**
   * Claim selected rules
   */
  claimReturned() {
    if (!this.validate('selectedRulesReturned')) {
      return;
    }

    let userId = this.utils.getLoggedUserId();
    let recordsIds: number[] = [];

    this.selectedRulesReturned.forEach(item => {
      recordsIds.push(item.ruleId);
    });

    this.ruleManagerService.assignMedicalDirector(userId, recordsIds, Constants.STAGE_MD_CLAIM).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        this.resetDataTableReturned();
      } else {
        this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, response.message);
      }
    });

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
   * Validate if all information is ok before send to backend
   */
  validate(arrayName: string) {
    if (this[arrayName].length == 0) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, Constants.NOT_SELECTED_RULES_ERROR);
      return false;
    }

    return true;
  }

  /**
   * Shows popup with codes divided by type of codes
   */
  showLunchBox(ruleId: number, instanceId: number) {
    const url = `${Constants.INDUSTRY_UPDATES_CODES_URL}?ruleId=${this.utils.encodeString(ruleId.toString())}&instanceId=${this.utils.encodeString(instanceId.toString())}`;
    this.utils.openNewWindow(url, Constants.WINDOW_TARGET_BLANK, Constants.WINDOW_DEFAULT_FEATURES);
  }

  /**
    * event executed when a user clicks on the link column
    * @param event 
    */
  redirect(event: any) {
    switch (event.field) {
      case 'ruleCode':
        this.ruleManagerService.showRuleDetailsScreen(event.row.ruleId, true, this.ruleManagerService.getStatusForMd());
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
   * Refresh data and filtes in the table
   */
  resetDataTable(tableProperty?: string, selectedElement?: string) {
    if (tableProperty && selectedElement) {
      this[selectedElement] = [];
      this[tableProperty].resetDataTable();
    } else {
      if (this.tabIndex == 0) {
        this.assignedTable.resetDataTable();
        this.assignedTable.savedSelRecords = [];
        this.selectedRules = [];
      } else {
        this.returnedTable.resetDataTable();
        this.returnedTable.savedSelRecords = [];
        this.selectedRulesReturned = [];
      }
    }
  }

  /**
   * Refresh data and filtes in the table
   */
  resetDataTableReturned() {
    this.selectedRulesReturned = [];
    this.returnedTable.savedSelRecords = [];
    this.returnedTable.resetDataTable();
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
}
