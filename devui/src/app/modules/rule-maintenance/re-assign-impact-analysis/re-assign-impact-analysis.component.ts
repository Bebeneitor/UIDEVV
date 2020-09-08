import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { DialogService, MessageService } from 'primeng/api';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ECLConstantsService } from "../../../services/ecl-constants.service";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { UtilsService } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-re-assign-impact-analysis',
  templateUrl: './re-assign-impact-analysis.component.html',
  styleUrls: ['./re-assign-impact-analysis.component.css']
})

export class ReAssignImpactAnalysisComponent implements OnInit {

  @ViewChild('reassigmentTable') reassigmentTable: EclTableComponent;

  pageTitle: string;
  userId: number;
  tableConfig: EclTableModel = null;
  users: any[] = [];
  comments: any[] = [];
  selectedRules: any[] = [];
  selectedUser: string = "";
  selectedComment: string = "";

  constructor(private route: ActivatedRoute, private utils: AppUtils, private ruleInfoService: RuleInfoService,
    private dialogService: DialogService, private eclConstants: ECLConstantsService, private messageService: MessageService, private utilService: UtilsService) {

    this.tableConfig = new EclTableModel();
    this.users = [{ label: "Search for User", value: null }];
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
    });
    this.userId = this.utils.getLoggedUserId();
    this.getAllUsers();
    this.initializeTableConfig(this.tableConfig);
    this.getAllReassignComments();
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

  /**
  * This method is for initialize EclTableModel
  * @param table
  * @param tabStatus
  */
  initializeTableConfig(table: EclTableModel) {
    table.url = RoutingConstants.RULES_URL + "/"+RoutingConstants.IMPACTED_URL + "?pageName=" + RoutingConstants.REASSIGNMENT_FOR_IMPACT_ANALYSIS;
    table.columns = this.initializeTableColumns();
    table.lazy = true;
    table.sortOrder = 1;
    table.excelFileName = 'Rules Reassigment for Impact Analysis';
    table.checkBoxSelection = true;
  }

  /**
  * This method is for initialize table colums in EclTableColumnManager
  */
  initializeTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumn("ruleCode", "Rule ID", '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('categoryDesc', 'Category', '17%', true, EclColumn.TEXT, true);
    manager.addTextColumn("daysOld", "Days Old", '8%', true, EclColumn.TEXT, true);
    manager.addTextColumn('workflowStatus', 'Review Status', '15%', true, EclColumn.TEXT, true);
    manager.addTextColumn('assignedToUser', 'Assigned To', '15%', true, EclColumn.TEXT, true);
    return manager.getColumns();
  }

  private getAllUsers(): void {
    this.utils.getAllResearchAnalystsOfPO(this.userId, this.users);
  }

  viewRuleModal(event: any) {
    const rowInfo = event.row;
    let draftRuleId = 0;
    this.ruleInfoService.getRulesByParentId(rowInfo.ruleId).subscribe((response: any) => {
      response.data.forEach(rule => {
        if (rule.ruleStatusId.ruleStatusId === this.eclConstants.RULE_STATUS_IMPACTED)
          draftRuleId = rule.ruleId;
      });

      const ref = this.dialogService.open(ProvisionalRuleComponent, {
        data: {
          ruleId: draftRuleId > 0 ? draftRuleId : rowInfo.ruleId,
          header: 'Library View',
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
          'border': 'none' }
      });
    })
  }

  getReviewStatus(rowInfo: any): any {
    let ret = [{ label: '', value: null }];
    if (rowInfo.impactType != '') {
      ret.push({ label: 'Approved', value: 'Approved' });
      ret.push({ label: 'Submit for Approval', value: 'Submit for Approval' });
      ret.push({ label: 'Not Approved', value: 'Not Approved' });
    }
    return ret;
  }

  reassignIdeas() {
    let username: string = "";
    let selectedRuleIds = this.selectedRules.map(idea => {
      return ({
        selectedRuleId: idea.ruleId
       });
    });
    let requestBody = {
      selectedUser: this.selectedUser,
      selectedRules: selectedRuleIds,
      reAssignComment: this.selectedComment
    };
    this.ruleInfoService.reAssignImpactAnalysis(requestBody).subscribe((response: any) => {
      if (response.code == 200) {
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
        this.selectedRules = [];
        this.refreshEclTable();
        this.messageService.add({
          severity: 'success', summary: 'Info',
          detail: 'Selected rules have been assigned to ' + username + '.', life: 3000, closable: true
        });
      }
    });
  }

  setSelectRules(event: any) {
    this.selectedRules = event;
  }

  refreshEclTable() {
    this.selectedRules = [];
    this.reassigmentTable.selectedRecords = [];
    this.reassigmentTable.savedSelRecords = [];
    this.reassigmentTable.refreshTable();
  }

}
