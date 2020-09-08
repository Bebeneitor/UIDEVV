import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { DialogService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { UtilsService } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';

const LIBRARY_VIEW = 'Library View';
const returnFromScreen = Constants.RETURNED_TAB;
const RETURNED_TAB = 'RETURNED';
const RETURNED_IND = 1;


@Component({
  selector: 'app-re-assign-policy-owner',
  templateUrl: './re-assign-policy-owner.component.html',
  styleUrls: ['./re-assign-policy-owner.component.css']
})
export class ReAssignPolicyOwnerComponent implements OnInit {
  
  ruleStatus = Constants.ECL_LIBRARY_STAGE; //Library Rule
  pageTitle: string;
  reviewStatus = "Potentially Impacted";
  userId: number;
  selectedRules: RuleInfo[];
  selectedRulesReturned: any[];

  users: any[] = [{ label: "Search for User", value: null }];
  selectedUser: string = "";
  selectedUserReturned: string = "";
  selectedComment: string = "";
  selectedCommentReturned: string = "";
  comments: any[] = [{ label: "Select Comment", value: null }];
  tabIndex = 0;

  @ViewChild('tableAssigned') tableAssigned;
  @ViewChild('tableReturned') tableReturned;

  assignedTableConfig: EclTableModel;
  returnedTableConfig: EclTableModel;


  constructor(private route: ActivatedRoute, private utils: AppUtils, private ruleInfoService: RuleInfoService,
    private dialogService: DialogService, private http: HttpClient, private eclConstants: ECLConstantsService,
    private messageService: MessageService, private utilService: UtilsService) { }

  ngOnInit() {

    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
    });
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === RETURNED_TAB) {
        this.tabIndex = RETURNED_IND;
        this.fetchRulesReturned();
      }
    })
    this.userId = this.utils.getLoggedUserId();
    this.getAllUsers();

    this.getAllReassignComments();

    this.fetchRules();

  }

  /**
 * This method to fetch all the available reassign workflow comments by loopup type RULE_REASSIGN_WORKFLOW_COMMENT  
 */
  private getAllReassignComments() {
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

  private fetchRules(): void {

    this.assignedTableConfig = new EclTableModel();
    this.assignedTableConfig.lazy = true;
    this.assignedTableConfig.filterGlobal = true;
    this.assignedTableConfig.export = true;
    this.assignedTableConfig.checkBoxSelection = true;
    this.assignedTableConfig.sortBy = 'daysOld';
    this.assignedTableConfig.sortOrder = 0;
    this.assignedTableConfig.excelFileName = 'ReassignmentforPolicyOwner';
    this.assignedTableConfig.url = RoutingConstants.RULES_URL + '/' + RoutingConstants.REASSIGNMENT_PO + '/' + RoutingConstants.LIBRARY_REASSIGNMENT_PO + '?tabStatus=assigned';

    let columnManager = new EclTableColumnManager();

    columnManager.addLinkColumn('ruleCode', 'Rule ID', '13%', true, EclColumn.TEXT, true, 'center');
    columnManager.addTextColumn('ruleName', 'Rule Name', '28%', true, EclColumn.TEXT, true, 100);
    columnManager.addTextColumn('categoryDesc', 'Category', '17%', true, EclColumn.TEXT, true, 100, 'center');
    columnManager.addTextColumn('daysOld', 'Days Old', '10%', true, EclColumn.TEXT, true, 100, 'center');
    columnManager.addTextColumn('workflowStatus', 'Review Status', '17%', true, EclColumn.TEXT, true, 100, 'center');
    columnManager.addTextColumn('assignedToUser', 'Assigned To', '17%', true, EclColumn.TEXT, true, 100, 'center');

    this.assignedTableConfig.columns = columnManager.getColumns();

  }

  private fetchRulesReturned(): void {

    this.returnedTableConfig = new EclTableModel();
    this.returnedTableConfig.lazy = true;
    this.returnedTableConfig.filterGlobal = true;
    this.returnedTableConfig.export = true;
    this.returnedTableConfig.checkBoxSelection = true;
    this.returnedTableConfig.sortBy = 'daysOld';
    this.returnedTableConfig.sortOrder = 0;
    this.returnedTableConfig.excelFileName = 'ReassignmentforPolicyOwner-returned';
    this.returnedTableConfig.url = RoutingConstants.RULES_URL + '/' + RoutingConstants.REASSIGNMENT_PO + '/' + RoutingConstants.LIBRARY_REASSIGNMENT_PO + '?tabStatus=returned';

    let columnManager = new EclTableColumnManager();

    columnManager.addLinkColumn('ruleCode', 'Rule ID', '13%', true, EclColumn.TEXT, true, 'center');
    columnManager.addTextColumn('ruleName', 'Rule Name', '28%', true, EclColumn.TEXT, true, 100);
    columnManager.addTextColumn('categoryDesc', 'Category', '17%', true, EclColumn.TEXT, true, 100, 'center');
    columnManager.addTextColumn('daysOld', 'Days Old', '10%', true, EclColumn.TEXT, true, 100, 'center');
    columnManager.addTextColumn('workflowStatus', 'Review Status', '17%', true, EclColumn.TEXT, true, 100, 'center');
    columnManager.addTextColumn('assignedToUser', 'Assigned To', '17%', true, EclColumn.TEXT, true, 100, 'center');

    this.returnedTableConfig.columns = columnManager.getColumns();
  }

  private getAllUsers() {
    this.utils.getAllPolicyOwners(this.users);
  }

  viewRuleModal(rowInfo: any) {
    let draftRuleId = 0;
    this.ruleInfoService.getRulesByParentId(rowInfo.ruleId).subscribe((response: any) => {
      response.data.forEach(rule => {
        if (rule.ruleStatusId.ruleStatusId === this.eclConstants.RULE_STATUS_IMPACTED)
          draftRuleId = rule.ruleId;
      });

      const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: draftRuleId > 0 ? draftRuleId : rowInfo.ruleId,
          pageTitle: this.pageTitle,
          reassignmentFlag: true,
          header: LIBRARY_VIEW,
          reviewStatus: this.getReviewStatus(rowInfo),
          ruleReview: true,
          provisionalRuleCreation: false,
          fromMaintenanceProcess: true,
          readWrite: false,
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
          'border': 'none'
        }
      });
      ref.onClose.subscribe((ri: any) => {
        switch (this.tabIndex) {
          case 0:
            this.resethDataTable();
            break;
          case 1:
            this.resethDataTableReturned();
            break;
        }
      });
    })

  }

  getReviewStatus(rowInfo: any): any {
    let ret = [{ label: '', value: null }];
    if (rowInfo.ruleImpactType != '') {
      ret.push({ label: 'Approved', value: 'Approved' });
      ret.push({ label: 'Submit for Approval', value: 'Submit for Approval' });
      ret.push({ label: 'Not Approved', value: 'Not Approved' });
    }
    return ret;
  }

  reassignIdeas() {

    let requestBody: any;
    let selectedRuleIds: any[] = [];
    let username: string = "";

    selectedRuleIds = this.selectedRules.map(idea => {
      return ({
        selectedRuleId: idea.ruleId
      });
    });

    requestBody = { "selectedUser": this.selectedUser, "selectedRules": selectedRuleIds, "reAssignComment": this.selectedComment };

    this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.REASSIGN_IMPACT_ANALYSIS_URL, requestBody).subscribe(response => {

      for (let user of this.users) {
        if (user.value == this.selectedUser) {
          username = user.label;
          break;
        }
      }

      for (let selectedRule of this.selectedRules) {
        selectedRule.assignedTo = username;
      }

      this.selectedUser = null;
      this.selectedComment = null;
      this.selectedRules = null;

      this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Selected Rules have been assigned to ' + username + '.', life: 3000, closable: true });

      this.resethDataTable();
    });
  }

  reassignRulesReturned() {

    let requestBody: any;
    let selectedReturnedRuleIds: any[] = [];
    let username: string = "";

    selectedReturnedRuleIds = this.selectedRulesReturned.map(rule => {
      return ({
        selectedRuleId: rule.ruleId,
        impactType: rule.ruleImpactType
      });
    });

    requestBody = { "selectedUser": this.selectedUserReturned, "selectedRules": selectedReturnedRuleIds, "ruleStatus": returnFromScreen, "reAssignComment": this.selectedCommentReturned };

    this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.REASSIGN_IMPACT_ANALYSIS_URL, requestBody).subscribe(response => {

      for (let user of this.users) {
        if (user.value == this.selectedUserReturned) {
          username = user.label;
          break;
        }
      }

      for (let selectedRule of this.selectedRulesReturned) {
        selectedRule.assignedTo = username;
      }

      this.selectedUserReturned = null;
      this.selectedCommentReturned = null;
      this.selectedRulesReturned = null;

      this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Selected Rules have been assigned to ' + username + '.', life: 3000, closable: true });

      this.resethDataTableReturned();
    });
  }


  resethDataTable() {
    this.selectedUser = null;
    this.selectedComment = null;
    this.tableAssigned.resetDataTable();
  }

  resethDataTableReturned() {
    this.selectedUserReturned = null;
    this.selectedCommentReturned = null;
    this.tableReturned.resetDataTable();
  }

  checkUserPermission(user: any, allowedRoleId: any): boolean {

    let accessAllowed: boolean = false;

    user.roles.forEach(role => {
      if (!accessAllowed && role.role.roleId === allowedRoleId) {
        accessAllowed = true;
      }
    });
    return accessAllowed;
  }

  handleTabViewChange(e) {
    const index = e.index;
    this.tabIndex = index;
    if (index === 0) {
      this.fetchRules();
    } else if (index === 1) {
      this.fetchRulesReturned();
    }

    this.selectedUser = '';
    this.selectedUserReturned = '';
    this.selectedComment = '';
    this.selectedCommentReturned = '';
  }

  handleLinkAction(event) {
    switch (event.field) {
      case 'ruleCode':
        this.viewRuleModal(event.row);
        break;
    }
  }

  handleSelectionAssigned(event) {
    this.selectedRules = event;
  }

  handleSelectionReturned(event) {
    this.selectedRulesReturned = event;
  }
}
