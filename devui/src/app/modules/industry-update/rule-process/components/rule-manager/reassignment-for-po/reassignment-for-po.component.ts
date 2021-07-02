import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, MessageService } from 'primeng/api';
import { SameSimService } from 'src/app/services/same-sim.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { UtilsService } from 'src/app/services/utils.service';
import { RuleManagerService } from '../../../services/rule-manager.service';
import { ReferenceAnalysisComponent } from 'src/app/modules/industry-update/reference-analysis/reference-analysis.component';

@Component({
    selector: 'app-reassignment-for-po',
    templateUrl: './reassignment-for-po.component.html',
    styleUrls: ['./reassignment-for-po.component.css']
})

export class ReassignmentForPolicyOwnerComponent implements OnInit {

    @ViewChild('assignedTable',{static: true}) assignedTable: EclTableComponent;
    @ViewChild('returnedTable',{static: true}) returnedTable: EclTableComponent;

    assignedTableConfig: EclTableModel = null;
    returnedTableConfig: EclTableModel = null;
    users: any[] = [];
    comments: any[] = [];
    selectedAssignedRules: any[] = [];
    selectedAssignedUser: number = 0;
    reassignComments: any;
    selectedReturnedRules: any[] = [];
    selectedReturnedUser: number = 0;
    selectedReturnedComment: string = "";
    tabIndex: number = 0;


    constructor(private utilService: UtilsService, private messageService: MessageService, private dialogService: DialogService,
        private util: AppUtils, private router: Router, private sameSimService: SameSimService,
        private activatedRoute: ActivatedRoute, private ruleManagerService: RuleManagerService) {

        this.assignedTableConfig = new EclTableModel();
        this.returnedTableConfig = new EclTableModel();
        this.users = [{ label: "Search for User", value: null }];
        this.getAllComments();
    }

    ngOnInit(): void {
        this.util.getAllPolicyOwners(this.users);
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['tab'] === Constants.ASSIGNED_TAB) {
                this.tabIndex = 0;
            } else if (params['tab'] === Constants.RETURNED_TAB) {
                this.tabIndex = 1;
            }
        });
        this.initializeTableConfig(this.assignedTableConfig, Constants.ASSIGNED_TAB);
        this.initializeTableConfig(this.returnedTableConfig, Constants.RETURNED_TAB);
    }

    getAllComments() {
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

    handleChangeTab(event: any) {
        this.tabIndex = event.index;
    }

    /**
    * This method is for initialize EclTableModel
    * @param table
    * @param tabStatus
    */
    initializeTableConfig(table: EclTableModel, tabStatus: string) {
        table.url = RoutingConstants.SAME_SIM + "/" + RoutingConstants.SAME_SIM_GET_RULES;;
        table.columns = this.initializeTableColumns(tabStatus);
        table.lazy = true;
        table.sortOrder = 1;
        table.excelFileName = 'reassignmentPolicyOwner';
        table.checkBoxSelection = true;
        table.extraBodyKeys = { role: Constants.PO_ROLE, status: tabStatus, all: Constants.ALL_YES };
    }

    /**
    * This method is for initialize table colums in EclTableColumnManager
    */
    initializeTableColumns(tabStatus: string): EclColumn[] {
        let manager = new EclTableColumnManager();
        manager.addLinkColumn("ruleCode", "ECL ID", '8%', true, EclColumn.TEXT, true);
        manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
        manager.addTextColumn('sameSimRuleLogic', 'Rule Logic', null, true, EclColumn.TEXT, true, 150);
        manager.addIconColumn('lunchBox', 'Code Actions', '7%', 'fa fa-briefcase');
        manager.addTextColumn('reviewStatus', 'Review Status', '13%', tabStatus === Constants.ASSIGNED_STATUS ? true : false, EclColumn.TEXT, true);
        manager.addTextColumn('assignedTo', 'Assigned To', '13.5%', true, EclColumn.TEXT, true);
        manager.addLinkColumn("instanceName", "Reference Analysis", '12%', true, EclColumn.TEXT, true);
        return manager.getColumns();
    }

    /**
    * event executed when a user clicks on the link column
    * @param event 
    */
   openDetails(event: any) {
        const row = event.row;
        const field = event.field;
        let urlArray = [];
        switch (field) {
            case "ruleCode":
                this.ruleManagerService.showRuleDetailsScreen(row.ruleId, true);
                break;
            case "instanceName":
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
        this.router.navigate(urlArray);
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

    setSelectRules(event: any, tab: string) {
        switch (tab) {
            case Constants.ASSIGNED_TAB:
                this.selectedAssignedRules = event;
                break;
            case Constants.RETURNED_TAB:
                this.selectedReturnedRules = event;
                break;
        }
    }

    reassignRules(tab: string) {
        let userId: number = 0;
        let selectedRules: number[] = [];
        let returned: boolean = false;
        switch (tab) {
            case Constants.ASSIGNED_TAB:
                userId = this.selectedAssignedUser;
                this.selectedAssignedRules.forEach(rule => {
                    selectedRules.push(rule.ruleId);
                });
                break;
            case Constants.RETURNED_TAB:
                userId = this.selectedReturnedUser;
                this.selectedReturnedRules.forEach(rule => {
                    selectedRules.push(rule.ruleId);
                });
                break;
        }
        this.sameSimService.reassignRulesComments(userId, selectedRules, "PO", this.reassignComments, returned).subscribe((response: any) => {
            if (response.code == 200) {
                this.refreshEclTable(tab);
                this.messageService.add({ severity: 'success', summary: 'Info', detail: response.message, life: 5000, closable: true });
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error proccessing data", life: 5000, closable: true });
            }
        });
    }

    refreshEclTable(tab: string) {
        switch (tab) {
            case Constants.ASSIGNED_TAB:
                this.selectedAssignedRules = [];
                this.assignedTable.selectedRecords = [];
                this.assignedTable.savedSelRecords = []
                this.assignedTable.resetDataTable();
                break;
            case Constants.RETURNED_TAB:
                this.selectedReturnedRules = [];
                this.returnedTable.selectedRecords = [];
                this.returnedTable.savedSelRecords = [];
                this.returnedTable.resetDataTable();
                break;
        }
    }

}