import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ReferenceAnalysisComponent } from 'src/app/modules/industry-update/reference-analysis/reference-analysis.component';
import { SameSimService } from 'src/app/services/same-sim.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleManagerService } from '../../../services/rule-manager.service';

@Component({
  selector: 'app-reassignment-cca',
  templateUrl: './reassignment-cca.component.html',
  styleUrls: ['./reassignment-cca.component.css']
})
export class ReassignmentCcaComponent implements OnInit, OnDestroy {
  @ViewChild('rulesTable',{static: true}) rulesTable: EclTableComponent;
  @ViewChild('rulesTableReturned',{static: true}) rulesTableReturned: EclTableComponent;

  resetDataSubscription: Subscription;

  reassignComments: any;

  tableConfig: EclTableModel;
  tableConfigReturned: EclTableModel;

  comments: any[] = [];
  users: any[] = [{ label: "Search for User", value: null }];

  selectedRules: any[];
  selectedRulesReturned: any[];

  selectedUser: number = 0;
  selectedUserReturned: number = 0;

  selectedComment: string = "";
  selectedCommentReturned: string = '';
  tabIndex: any;

  constructor(private utilService: UtilsService, private utils: AppUtils, private dialogService: DialogService, private util: AppUtils,
    private sameSimService: SameSimService, private toastService: ToastMessageService,
    private activatedRoute: ActivatedRoute, private ruleManagerService: RuleManagerService) { }

  ngOnInit() {
    let manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();

    manager.addLinkColumn('ruleCode', 'ECL ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 100);
    manager.addIconColumn('codesActions', 'Codes Actions', '5%', 'fa fa-briefcase');
    manager.addTextColumn('reviewStatus', '  Review Status', null, false, EclColumn.TEXT, true);
    manager.addTextColumn('assignedTo', 'Assigned to', null, true, EclColumn.TEXT, true);
    manager.addLinkColumn('instanceName', 'Reference Analysis', null, true, EclColumn.TEXT, true);



    this.tableConfig.columns = manager.getColumns();
    this.tableConfig.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    this.tableConfig.checkBoxSelection = true;
    this.tableConfig.excelFileName = 'reassignmentCCAAnalysis';
    this.tableConfig.lazy = true;
    this.tableConfig.extraBodyKeys = { role: Constants.CCA_ROLE, status: Constants.ASSIGNED_STATUS, all: Constants.ALL_YES };

    manager = new EclTableColumnManager();
    this.tableConfigReturned = new EclTableModel();

    manager.addLinkColumn('ruleCode', 'ECL ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 100);
    manager.addIconColumn('codesActions', 'Codes actions', '5%', 'fa fa-briefcase');
    manager.addTextColumn('reviewStatus', '  Review Status', null, false, EclColumn.TEXT, true);
    manager.addTextColumn('assignedTo', 'Assigned to', null, true, EclColumn.TEXT, true);
    manager.addLinkColumn('instanceName', 'Reference Analysis', null, true, EclColumn.TEXT, true);

    this.tableConfigReturned.columns = manager.getColumns();
    this.tableConfigReturned.url = `${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
    this.tableConfigReturned.checkBoxSelection = true;
    this.tableConfigReturned.excelFileName = 'reassignmentCCAAnalysis';
    this.tableConfigReturned.lazy = true;
    this.tableConfigReturned.extraBodyKeys = { role: Constants.CCA_ROLE, status: Constants.RETURNED_STATUS, all: Constants.ALL_YES };


    this.getAllUsers();
    this.getAllComments();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === Constants.ASSIGNED_TAB) {
        this.tabIndex = 0;
      } else if (params['tab'] === Constants.RETURNED_TAB) {
        this.tabIndex = 1;
      }
    });
  }

  private getAllUsers(): void {
    this.utils.getAllResearchAnalysts(this.users);
  }

  private getAllComments() {
    this.comments.push({ label: "Select Comment", value: null });
    this.utilService.getAllLookUps(Constants.RULE_REASSIGN_WORKFLOW_COMMENT).subscribe(response => {
      response.forEach(resType => {
        this.comments.push({
          label: resType.lookupDesc,
          value: { ...resType }
        });
      });
    });
  }

  /**
   * Resets the ecl table data.
   */
  refreshEclTable(tab: string) {
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        this.selectedRules = [];
        if (this.rulesTable) {
          this.rulesTable.resetDataTable();
          this.rulesTable.selectedRecords = [];
          this.rulesTable.savedSelRecords = [];
        }
        break;
      case Constants.RETURNED_TAB:
        this.selectedRulesReturned = [];
        if (this.rulesTableReturned) {
          this.rulesTableReturned.resetDataTable();
          this.rulesTableReturned.selectedRecords = [];
          this.rulesTableReturned.savedSelRecords = [];
        }
        break;
    }
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
   * event executed when a user clicks on the link column
   * @param event 
   */
  redirect(event: any, tab: string) {
    const field = event.field;
    switch (field) {
      case "ruleCode":
        this.resetDataSubscription = this.ruleManagerService.showRuleDetailsScreenObs(event.row.ruleId, true, this.ruleManagerService.getStatusForCCA())
          .subscribe(dialogRef => {
            if (dialogRef) {
              dialogRef.onClose.subscribe(() => {
                this.refreshEclTable(tab);
              });
            }
          });
        break;
      case "instanceName":        // this.sameSimService.showAnalysisScreenObs(event.row.instanceId)
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
  * event executed when a user clicks on the icon column
  * @param event 
  */
  showLunchBox(event: any) {
    const row = event.row;

    const url = `${Constants.INDUSTRY_UPDATES_CODES_URL}?ruleId=${this.util.encodeString(row.ruleId.toString())}&instanceId=${this.util.encodeString(row.instanceId.toString())}`;
    this.util.openNewWindow(url, Constants.WINDOW_TARGET_BLANK, Constants.WINDOW_DEFAULT_FEATURES);
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
          if (this.rulesTable) {
            this.rulesTable.selectedRecords = [];
          }
          break;
        case Constants.RETURNED_TAB:
          this.selectedRulesReturned = [];
          if (this.rulesTableReturned) {
            this.rulesTableReturned.selectedRecords = [];
          }
          break;
      }
    }
  }

  /**
   * Sends the selected rules and reassing them.
   */
  reassignRules(tab: string) {
    let selectedRules: number[] = [];
    let userId = tab === Constants.ASSIGNED_TAB ? this.selectedUser : this.selectedUserReturned;
    let selectedRulesFor = tab === Constants.ASSIGNED_TAB ? this.selectedRules : this.selectedRulesReturned;
    let selectedComment = tab === Constants.ASSIGNED_TAB ? this.selectedComment : this.selectedCommentReturned;

    selectedRulesFor.forEach(rule => {
      selectedRules.push(rule.ruleId);
    });

    this.sameSimService.reassignRulesComments(userId, selectedRules, "CCA", selectedComment, false).subscribe((response: any) => {
      if (response.code == 200) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
      } else {
        this.toastService.messageError(Constants.TOAST_SUMMARY_SUCCESS, response.message);
      }
      this.refreshEclTable(tab);
    }, error => {
      this.refreshEclTable(tab);
    });
  }

  ngOnDestroy(): void {
    if (this.resetDataSubscription) {
      this.resetDataSubscription.unsubscribe();
    }
  }
}




