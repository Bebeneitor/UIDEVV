import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, MessageService } from 'primeng/api';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { environment } from 'src/environments/environment';
import { AppUtils } from "../../../shared/services/utils";
import { ProvisionalRuleComponent } from '../provisional-rule/provisional-rule.component';

import { ECLConstantsService } from "src/app/services/ecl-constants.service";
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { UtilsService } from 'src/app/services/utils.service';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';


@Component({
  selector: 'app-assign-idea',
  templateUrl: './reassign-provisional-rules.component.html',
  styleUrls: ['./reassign-provisional-rules.component.css'],
  providers: [DialogService]
})
export class ReassignProvisionalRulesComponent implements OnInit {

  data: any = [];
  tableConfig: EclTableModel;

  keywordSearch: string = '';

  ruleStatus: number;
  columnsToExport: any[] = [];
  pageTitle: string;

  user: any;
  @ViewChild('eclTable') eclTable: EclTableComponent;

  comments: any[] = [];
  users: any[] = [{ label: "Search for User", value: null }];

  selectedProvRules: RuleInfo[];
  loading: boolean;

  selectedUser: string = "";
  selectedComment: string = "";

  constructor(public dialogService: DialogService, private messageService: MessageService, private http: HttpClient, private utils: AppUtils,
    public route: ActivatedRoute, private constants: ECLConstantsService, private utilService: UtilsService) { }


  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
      this.user = this.utils.getLoggedUserId();
      this.ruleStatus = this.constants.RULE_STAGE_PROVISIONAL_RULE;
    });

    this.getAllReassignComments();
    this.getAllUsers();
    this.keywordSearch = '';


    let manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();

    manager.addLinkColumn('ruleCodeId', 'Provisional Rule ID', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Provisional Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('categoryDto.categoryDesc', 'Category', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('daysOld', 'Days Old', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleStatusDesc', 'Review Status', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('firstName', 'Assigned To', null, true, EclColumn.TEXT, true);


    this.tableConfig.columns = manager.getColumns();
    this.tableConfig.url = RoutingConstants.RULES_URL + '/' + RoutingConstants.ALL_RULES_RESEARCH_URL;
    this.tableConfig.filterGlobal = true;
    this.tableConfig.lazy = true;
    this.tableConfig.export = true;
    this.tableConfig.excelFileName = "Reassignment For Provisional Rules";
    this.tableConfig.dataKey = 'ruleCode';
    this.tableConfig.checkBoxSelection = true;
  }


  viewRuleModal(ruleRow: any) {
    this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: ruleRow.row.eclId,
        header: 'Provisional Details'
      },
      header: 'Provisional Details',
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


  private getAllUsers(): void {
    this.utils.getAllResearchAnalysts(this.users);
  }


  reassignProvisionalRules() {

    this.loading = true;
    let requestBody: any;
    let requestUrl: any;
    let selectedIdeaIds: any[] = [];
    let username: string = "";

    selectedIdeaIds = this.selectedProvRules.map(idea => {
      return idea.ruleId
    });
    requestUrl = environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.REASSIGN_URL;
    requestBody = { "userId": this.selectedUser, "recordIds": selectedIdeaIds, "stageId": this.ruleStatus, "reAssignComment": this.selectedComment };
    this.http.post(requestUrl, requestBody).subscribe(response => {

      for (let user of this.users) {
        if (user.value == this.selectedUser) {
          username = user.label;
          break;
        }
      }

      for (let selectedIdea of this.selectedProvRules) {
        selectedIdea.assignedTo = username;
      }

      this.selectedUser = null;
      this.selectedComment = null;
      this.loading = false;
      this.selectedProvRules = null;
      this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Selected Rules have been assigned to ' + username + '.', life: 3000, closable: true });
      this.refreshEclTable();
    });

  }

  setSelectRules(event: any) {
    this.selectedProvRules = event;

  }

  refreshEclTable() {
    this.selectedProvRules = [];
    this.eclTable.selectedRecords = [];
    this.eclTable.savedSelRecords = [];
    this.eclTable.keywordSearch = '';
    this.eclTable.refreshTable();
  }


}
