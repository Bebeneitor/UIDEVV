import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/api';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleInfoService } from '../../../services/rule-info.service';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ECLConstantsService } from '../../../services/ecl-constants.service';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../shared/models/users';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-assignment-md-approval',
  templateUrl: './assignment-md-approval.component.html',
  styleUrls: ['./assignment-md-approval.component.css']
})
export class AssignmentMdApprovalComponent implements OnInit {

  @ViewChild('notAssignedTable') notAssignedTable: EclTableComponent;
  @ViewChild('assignedTable') assignedTable: EclTableComponent;
  @ViewChild('returnedTable') returnedTable: EclTableComponent;

  notAssignedTableConfig: EclTableModel = null;
  assignedTableConfig: EclTableModel = null;
  returnedTableConfig: EclTableModel = null;

  serviceUrl: string = "";
  tabIndex = 0;
  ruleStatus: number;
  pageTitle: string;
  userId: number;

  selectedRulesNotAssigned: any[];
  selectedRulesAssigned: any[];
  selectedRulesReturned: any[];

  selectedUserAssigned: string = "";
  selectedUserReturned: string = "";
  selectedCommentAssigned: string = "";
  selectedCommentReturned: string = "";

  users: any[] = [];
  comments: any[] = [];

  constructor(private ruleInfoService: RuleInfoService, private http: HttpClient, private utils: AppUtils,
    public route: ActivatedRoute, private dialogService: DialogService, private eclConstants: ECLConstantsService,private toastService: ToastMessageService,
    private usersService: UsersService, private utilService: UtilsService) {
    this.users = [{ label: 'Search for User', value: null }];
    this.comments = [{ label: 'Select Comment', value: null }];
    this.serviceUrl = RoutingConstants.RULES_URL + "/" + RoutingConstants.ASSIGN_FOR_PEER_REVIEWER_APPROVAL + "/"
    this.notAssignedTableConfig = new EclTableModel();
    this.assignedTableConfig = new EclTableModel();
    this.returnedTableConfig = new EclTableModel();
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.ruleStatus = params['ruleStatus'];
      this.pageTitle = params['pageTitle'];
      this.userId = this.utils.getLoggedUserId();
    });
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === Constants.RETURNED_TAB) {
        this.tabIndex = 2;
      }
    })
    this.usersService.getUserInfo(this.userId).subscribe((user: any) => {
      if (this.usersService.checkUserPermission(user, this.eclConstants.USERS_MEDICAL_DIRECTOR_ROLE)) {
        this.getAllUsers();
        this.getAllReassignComments();
      }
    });
    let stage: string = this.ruleStatus > Constants.ECL_PROVISIONAL_STAGE ? "library" : "provisional";
    this.initializeTableConfig(this.notAssignedTableConfig, stage, "notAssigned");
    this.initializeTableConfig(this.assignedTableConfig, stage, "assigned");
    this.initializeTableConfig(this.returnedTableConfig, stage, "returned");
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
  * @param stage
  * @param tabStatus
  */
  initializeTableConfig(table: EclTableModel, stage: string, tabStatus: string) {
    table.url = this.serviceUrl + stage + "/" + tabStatus;
    table.columns = this.initializeTableColumns();
    table.lazy = true;
    table.sortOrder = 1;
    table.excelFileName = tabStatus.substring(0, 1).toUpperCase()
      + tabStatus.substring(1, tabStatus.length - 1) + ' Rules for Peer Reviewer Approval';
    table.checkBoxSelection = true;
  }

  /**
  * This method is for initialize table colums in EclTableColumnManager
  */
  initializeTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    let provisional: string = this.ruleStatus > Constants.ECL_PROVISIONAL_STAGE ? "" : "Provisional ";
    manager.addLinkColumn("ruleCode", provisional + "Rule ID", '12%', true, EclColumn.TEXT, true);
    manager.addTextColumn("ruleName", provisional + "Rule Name", null, true, EclColumn.TEXT, true);
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
  }

  setSelectRules(event: any, tab: string) {
    switch (tab) {
      case "notAssigned":
        this.selectedRulesNotAssigned = event;
        break;
      case "assigned":
        this.selectedRulesAssigned = event;
        break;
      case "returned":
        this.selectedRulesReturned = event;
        break;
    }
  }

  claimRules() {
    let requestBody: any = {
      userId: this.utils.getLoggedUserId(),
      recordIds: this.selectedRulesNotAssigned.map((rule: any) => rule.ruleId),
      stageId: this.ruleStatus
    };
    this.ruleInfoService.claimRules(requestBody).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        this.usersService.getUserInfo(this.utils.getLoggedUserId()).subscribe((user: Users) => {
          let username = user.firstName + ' ' + user.lastName;
          this.selectedRulesNotAssigned.forEach((selectedRule: any) => {
            selectedRule.assignedTo = username;
          })
          this.selectedRulesNotAssigned = [];
          this.notAssignedTable.refreshTable();
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, Constants.SUCCESS_PR_CLAIM_MESSAGE);
        });
      }
    });
  }

  reassignIdeasAssigned() {
    let requestBody: any = {
      userId: this.selectedUserAssigned,
      recordIds: this.selectedRulesAssigned.map((rule: any) => rule.ruleId),
      stageId: this.ruleStatus,
      reAssignComment : this.selectedCommentAssigned
    };
    this.ruleInfoService.reassignRules(requestBody).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        let username: string = "";
        for (let user of this.users) {
          if (user.value == this.selectedUserAssigned) {
            username = user.label;
            break;
          }
        }
        this.selectedRulesAssigned.forEach((selectedRule: any) => {
          selectedRule.assignedTo = username;
        });
        this.selectedUserAssigned = "";
        this.selectedCommentAssigned = "";
        this.selectedRulesAssigned = [];
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Selected rules have been assigned to ' + username + '.');
        this.assignedTable.refreshTable();
      }
    });
  }

  reassignIdeasReturned() {
    let requestBody: any = {
      userId: this.selectedUserReturned,
      recordIds: this.selectedRulesReturned.map((idea: any) => idea.ruleId),
      stageId: this.ruleStatus,
      reAssignComment: this.selectedCommentReturned
    };
    this.ruleInfoService.reassignRules(requestBody).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        let username: string = "";
        for (let user of this.users) {
          if (user.value == this.selectedUserReturned) {
            username = user.label;
            break;
          }
        }
        this.selectedRulesReturned.forEach((selectedRule: any) => {
          selectedRule.assignedTo = username;
        });
        this.selectedUserReturned = "";
        this.selectedCommentReturned = "";
        this.selectedRulesReturned = [];
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Selected rules have been assigned to ' + username + '.');
        this.returnedTable.refreshTable();
      }
    });
  }

  viewRuleModal(event: any) {
    const rowData: any = event.row;
    this.ruleInfoService.getRulesByParentId(rowData.ruleId).subscribe((response: any) => {
      let draftRuleId: number = 0;
      response.data.forEach((rule: any) => {
        draftRuleId = rule.ruleId;
      })
      if (draftRuleId > 0 && this.ruleStatus > Constants.ECL_PROVISIONAL_STAGE) {
        this.callMaintenanceRuleDetail(rowData, draftRuleId);
      } else {
        this.callCreationRuleDetail(rowData.ruleId);
      }
    });
  }

  private callCreationRuleDetail(ruleId) {
    const ref = this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: ruleId,
        header: 'Provisional Details'
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
        'border': 'none' }
    });
  }

  private callMaintenanceRuleDetail(ruleData, draftId) {
    const ref = this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        pageTitle: this.pageTitle,
        reassignmentFlag: true,
        ruleId: draftId,
        header: 'Library View',
        ruleReview: true,
        provisionalRuleCreation: false,
        reviewStatus: this.getReviewStatus(ruleData),
        fromMaintenanceProcess: true,
        workFlowStatusId: ruleData.reviewStatus,
        reviewComments: ruleData.reviewComments,
        readOnlyView: true
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
        'border': 'none' }
    });

  }

  getReviewStatus(rowInfo: any): any {
    let ret = [{ label: '', value: null }];
    this.ruleInfoService.getValidApprovalStatus(rowInfo.ruleId, this.userId).subscribe((resp: any) => {
      let appStat: any[] = resp.data;
      appStat.forEach(stat => {
        ret.push({ label: stat.description, value: stat.id });
      });
    })
    return ret;
  }

  private getAllUsers(): void {
    this.utils.getAllMedicalDirectors(this.users);
  }

  refreshEclTable(tab: string) {
    switch (tab) {
      case "notAssigned":
        this.selectedRulesNotAssigned = [];
        this.notAssignedTable.selectedRecords = [];
        this.notAssignedTable.savedSelRecords = [];
        this.notAssignedTable.keywordSearch = '';
        this.notAssignedTable.refreshTable();
        break;
      case "assigned":
        this.selectedRulesAssigned = [];
        this.assignedTable.selectedRecords = [];
        this.assignedTable.savedSelRecords = [];
        this.assignedTable.keywordSearch='';
        this.assignedTable.refreshTable();
        break;
      case "returned":
        this.selectedRulesReturned = [];
        this.returnedTable.selectedRecords = [];
        this.returnedTable.savedSelRecords = [];
        this.returnedTable.keywordSearch='';
        this.returnedTable.refreshTable();
        break;
    }
  }

}