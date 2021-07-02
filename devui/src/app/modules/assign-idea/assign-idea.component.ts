import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, MessageService } from 'primeng/api';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { AppUtils } from "../../shared/services/utils";
import { ProvisionalRuleComponent } from '../rule-creation/provisional-rule/provisional-rule.component';
import { IdeaDetailComponent } from "./idea-detail/idea-detail.component";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { Constants } from 'src/app/shared/models/constants';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { UtilsService } from 'src/app/services/utils.service';
import { PageTitleConstants as ptc} from 'src/app/shared/models/page-title-constants';
import {ResearchRequestSearchedRuleDto} from "../../shared/models/dto/research-request-searched-rule-dto";
import {ResearchRequestService} from "../../services/research-request.service";

const REASSIGNMENT_FOR_RULE_APPROVAL = 'Reassignment for Policy Owner Approval';

@Component({
  selector: 'app-assign-idea',
  templateUrl: './assign-idea.component.html',
  styleUrls: ['./assign-idea.component.css']
})

export class AssignIdeaComponent implements OnInit {

  @ViewChild('assignedTable',{static: false}) assignedTable: EclTableComponent;
  @ViewChild('returnedTable',{static: false}) returnedTable: EclTableComponent;

  serviceUrl: string = "";
  assignedTableConfig: EclTableModel = null;
  returnedTableConfig: EclTableModel = null;

  ruleStatus: number;
  pageTitle: string;
  tabName: string;
  userId: number;

  comments: any[] = [];
  users: any[] = [];

  selectedRulesAssigned: RuleInfo[];
  selectedRulesReturned: RuleInfo[];

  selectedUser: string = "";
  selectedComment: string = "";
  selectedUserAssigned: string = "";
  selectedUserReturned: string = "";
  selectedCommentReturned: string = "";
  tabIndex: number = 0;
  // Research Request
  rrId: number;
  rrCode: string;
  navPageTitle: string = 'My Requests';
  ruleResponseSearchDto: ResearchRequestSearchedRuleDto;
  ruleResponseIndicator: boolean = false;

  constructor(public route: ActivatedRoute, public dialogService: DialogService,
    private utilService: UtilsService, private utils: AppUtils, public ruleInfoService: RuleInfoService,
    private messageService: MessageService, private rrService: ResearchRequestService) {
    this.users = [{ label: "Search for User", value: null }];
    this.assignedTableConfig = new EclTableModel();
    this.returnedTableConfig = new EclTableModel();
    this.serviceUrl = RoutingConstants.RULES_URL + "/" + RoutingConstants.PROVISIONAL_RULES_FOR_PO_URL;
  }

  ngOnInit() {
    this.userId = this.utils.getLoggedUserId();
    this.getAllUsers();
    this.getAllReassignComments();
    this.route.data.subscribe(params => {
      this.ruleStatus = params['ruleStatus'];
      this.pageTitle = params['pageTitle'];
      this.tabName = params['tabName'];
      this.tabIndex = this.tabName === Constants.RETURNED_TAB ? 1 : 0;
    });
    this.initializeTableConfig(this.assignedTableConfig, Constants.ASSIGNED_TAB);
    this.initializeTableConfig(this.returnedTableConfig, Constants.RETURNED_TAB);
  }
  /**
    * This method to fetch all the available reassign workflow comments by loopup type RULE_REASSIGN_WORKFLOW_COMMENT
    */
  getAllReassignComments() {
    this.comments = [];
    this.comments = [{ label: "Select Comment", value: null }];
    this.utilService.getAllLookUps(Constants.RULE_REASSIGN_WORKFLOW_COMMENT).subscribe(response => {
      if (response !== null && response.length > 0) {
        response.forEach(lookUpObj => {
          this.comments.push({ label: lookUpObj.lookupDesc, value: lookUpObj.lookupDesc });
        });
      }
    });
  }

  /**
  * This method is for initialize EclTableModel
  * @param table
  * @param tabStatus
  */
  initializeTableConfig(table: EclTableModel, tabStatus: string) {
    table.url = this.serviceUrl + "/" + tabStatus;
    table.columns = this.initializeTableColumns();
    table.lazy = true;
    table.sortBy = 'daysOld';
    table.sortOrder = 0;
    table.excelFileName = tabStatus.substring(0, 1).toUpperCase()
      + tabStatus.substring(1, tabStatus.length - 1) + ' Rules Reassignment for Policy Owner Approval';
    table.checkBoxSelection = true;
  }

  /**
  * This method is for initialize table colums in EclTableColumnManager
  */
  initializeTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumnWithIcon("ruleCode", "Provisional Rule ID", '12%', true, EclColumn.TEXT, true, 'left', 'researchRequestRuleIndicator', Constants.RESEARCH_REQUEST_INDICATOR_CLASS);
    manager.addTextColumn("ruleName", "Provisional Rule Name", null, true, EclColumn.TEXT, true);
    manager.addTextColumn('categoryDesc', 'Category', '16%', true, EclColumn.TEXT, true);
    manager.addTextColumn('daysOld', 'Days Old', "8%", true, EclColumn.TEXT, true);
    manager.addTextColumn('workflowStatus', 'Status', '15%', false, EclColumn.TEXT, false);
    manager.addTextColumn('assignedToUser', 'Assigned To', '15%', true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  handleTabViewChange(event: any) {
    const index = event.index;
    this.tabIndex = index;
    this.selectedUserAssigned = "";
    this.selectedUserReturned = "";
    if (index === 0) {
      this.assignedTableConfig.sortBy = 'daysOld';
      this.assignedTableConfig.sortOrder = 0;
    } else if (index === 1) {
      this.returnedTableConfig.sortBy = 'daysOld';
      this.returnedTableConfig.sortOrder = 0;
    }
  }

  setSelectRules(event: any, tab: string) {
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        this.selectedRulesAssigned = event;
        break;
      case Constants.RETURNED_TAB:
        this.selectedRulesReturned = event;
        break;
    }
  }

  reassignIdeas() {
    let requestBody: any;
    let username: string = "";
    requestBody = {
      userId: this.selectedUser,
      recordIds: this.selectedRulesAssigned.map((rule: any) => rule.ruleId),
      stageId: this.ruleStatus,
      reAssignComment: this.selectedComment
    };
    this.ruleInfoService.reAssignRules(requestBody).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        for (let user of this.users) {
          if (user.value == this.selectedUser) {
            username = user.label;
            break;
          }
        }
        for (let selectedIdea of this.selectedRulesAssigned) {
          selectedIdea.assignedTo = username;
        }
        this.selectedUser = "";
        this.selectedComment = "";
        this.selectedRulesAssigned = [];
        this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Selected Rules have been assigned to ' + username + '.', life: 3000, closable: true });
        this.refreshEclTable(Constants.ASSIGNED_TAB);
      }
    });
  }

  reassignRulesReturned() {
    let requestBody: any;
    let username: string = "";
    requestBody = {
      userId: this.selectedUserReturned,
      recordIds: this.selectedRulesReturned.map((rule: any) => rule.ruleId),
      stageId: this.ruleStatus,
      reAssignComment: this.selectedCommentReturned
    };
    this.ruleInfoService.reAssignRules(requestBody).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        for (let user of this.users) {
          if (user.value == this.selectedUserReturned) {
            username = user.label;
            break;
          }
        }
        for (let selectedRule of this.selectedRulesReturned) {
          selectedRule.assignedTo = username;
        }
        this.selectedUserReturned = "";
        this.selectedCommentReturned = "";
        this.selectedRulesReturned = [];
        this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Selected Rules have been assigned to ' + username + '.', life: 3000, closable: true });
        this.refreshEclTable(Constants.RETURNED_TAB);
      }
    });
  }

  viewRuleModal(event: any) {
    const rowData: any = event.row;
    if (this.pageTitle == REASSIGNMENT_FOR_RULE_APPROVAL) {
      this.viewProvisionalModal(rowData.ruleId);
    } else {
      this.dialogService.open(IdeaDetailComponent, {
        data: {
          ruleId: rowData.ruleId
        },
        header: 'Idea Details',
        width: '60%',
        contentStyle: { "max-height": "70%", "overflow": "auto" }
      });
    }
  }

  viewProvisionalModal(ruleId: any) {
    this.getRuleResponseIndicatorAndRuleCode(ruleId).then((rrCode: any) => {
      if (rrCode !== null && rrCode != "" ) {
        this.ruleResponseIndicator = true;
        this.rrCode = rrCode;
      }
      this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: ruleId,
          header: ptc.PROVISIONAL_RULE_DETAIL_TITLE,
          provDialogDisable: true,
          stageId: Constants.ECL_PROVISIONAL_STAGE,
          provSetup: Constants.ECL_PROVISIONAL_STAGE,
          ruleResponseInd: this.ruleResponseIndicator,
          researchRequestId: this.rrCode,
        },
        showHeader: !this.ruleResponseIndicator,
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
    });

  }

  private getAllUsers(): void {
    this.utils.getAllPolicyOwners(this.users);
  }

  refreshEclTable(tab: string) {
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        this.selectedRulesAssigned = [];
        this.assignedTable.selectedRecords = [];
        this.assignedTable.savedSelRecords = [];
        this.assignedTable.keywordSearch = '';
        this.assignedTable.resetDataTable();
        break;
      case Constants.RETURNED_TAB:
        this.selectedRulesReturned = [];
        this.returnedTable.selectedRecords = [];
        this.returnedTable.savedSelRecords = [];
        this.returnedTable.keywordSearch = '';
        this.returnedTable.resetDataTable();
        break;
    }
  }

  // Source Link for Research Request
  async getRuleResponseIndicatorAndRuleCode(ruleId: number) {
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

}
