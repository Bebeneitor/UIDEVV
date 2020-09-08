import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { ReferenceInfoChangeDto } from 'src/app/shared/models/dto/reference-info-change-dto';
import { InitiateImpactService } from 'src/app/services/initiate-impact-service';
import { ImpactDto } from 'src/app/shared/models/dto/impact-dto';
import { RuleInfoService } from "../../../../services/rule-info.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService, DialogService } from "primeng/api";
import { Constants } from 'src/app/shared/models/constants';

import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';

const IMPACT_ANALYSIS_REQUEST_TYPE_REFERENCE_CHANGE = "Reference";

@Component({
  selector: 'app-reference-change',
  templateUrl: './reference-change.component.html',
  styleUrls: ['./reference-change.component.css']
})
export class ReferenceChangeComponent implements OnInit {

  newRefSource: any[] = [];
  response: boolean = false;
  cols: any;
  data: any;
  keywordSearch: string;
  loading: boolean;
  references: ReferenceInfoChangeDto[];
  selectedRefSource: any[] = [];
  selectedReferences: any[] = [];

  userId: number;
  impactDto: ImpactDto = new ImpactDto();

  tableConfig: EclTableModel = null;

  @ViewChild('viewTable') viewTable: EclTableComponent;
  isViewTableHidden = true;
  selectedRules: any[] = [];

  disableInitiateBtn: boolean = true;
  listStyles: any = { 'width': '100%', 'height': '435px', 'overflow': 'auto', 'border': '1px solid #31006F', 'margin': '1px' };
  constructor(private util: AppUtils, private impactService: InitiateImpactService, private ruleService: RuleInfoService,
    public route: ActivatedRoute, private messageService: MessageService, private router: Router, private dialogService: DialogService) { }

  ngOnInit() {
    this.references = [];
    this.keywordSearch = '';
    this.loading = true;
    this.util.getAllReferencesValue(this.newRefSource, this.response);
    this.loading = false;
    this.cols = [
      { field: 'refSourceName', header: 'Reference Source', width: '30%' },
      { field: 'referenceTitle', header: 'Reference Title', width: '70%' },
    ];

    this.route.data.subscribe(params => {
      this.userId = this.util.getLoggedUserId()
    });

    this.impactDto.userId = this.userId;
    this.impactDto.referenceIds = [];
    this.impactDto.impactType = Constants.IMPACT_ANALYSIS_REQUEST_TYPE_REFERENCE_CHANGE;

    this.tableConfig = new EclTableModel();
    this.initializeTableConfig(this.tableConfig);
  }

  /**
* This method to show the rule dialog
* @param rowEvent
*/
  viewRuleModal(rowEvent: any) {
    const ref = this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: rowEvent.row.ruleId,
        header: 'Library Rule Details',
        fromMaintenanceProcess: false,
        readOnlyView: true,
        provDialogDisable: true,
        ruleReview: true,
        readWrite: false
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
  }

  /**
  * This method is for initializing EclTableModel
  * @param table
  */
  initializeTableConfig(table: EclTableModel) {
    table.columns = this.initializeTableColumns();
    table.lazy = true;
    table.sortOrder = 1;
    table.excelFileName = 'Initiate Impact Analysis';
    table.checkBoxSelection = true;
  }

  /**
  * This method is for initializing table colums in EclTableColumnManager
  */
  initializeTableColumns(): EclColumn[] {
    let manager = new EclTableColumnManager();
    manager.addLinkColumn("ruleCode", "Rule ID", '10%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleName', 'Rule Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('categoryDesc', 'Category', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('referenceSource', 'Reference Source', '17%', true, EclColumn.TEXT, false);
    manager.addTextColumn('referenceTitle', 'Reference Title', '15%', true, EclColumn.TEXT, false);
    manager.addTextColumn('ruleImpactStatus', 'Review Status', '15%', false, EclColumn.TEXT, true);
    manager.addTextColumn('assignedToUser', 'Assigned To', '15%', true, EclColumn.TEXT, false);
    return manager.getColumns();
  }

  /* Method to fetch the rules based on the selection of category,lob and place of service*/
  viewImpactedRules() {
    this.createReferenceViewRequestObj(this.impactDto);
    this.tableConfig.url = RoutingConstants.RULES_URL + "/" + RoutingConstants.VIEW_IMPACTED_RULES;
    this.tableConfig.criteriaFilters = this.impactDto;
    this.viewTable.loadData(null);
    this.isViewTableHidden = false;
  }

  async createReferenceViewRequestObj(impactDto: ImpactDto) {
    impactDto.referenceIds = [];
    this.selectedReferences.forEach((reference: any) => {
      impactDto.referenceIds.push(reference.referenceId);
    });
  }

  initiateReferenceImpact() {
    this.disableInitiateBtn = true;
    this.loading = true;
    this.impactDto.ruleIds = [];
    this.impactDto.ruleIds = this.selectedRules.map(ele => ele.ruleId);
    this.ruleService.saveInitiateImpact(this.impactDto).subscribe(response => {
      if (response.data !== undefined && response.data !== null) {
        this.viewTable.selectedRecords = [];
        this.impactDto.ruleIds = [];
        this.selectedRules = [];
        this.showInitiateMessage(response.data.runId);
        this.viewImpactedRules();
      }
    });
  }

  /**
   * Method to get selected rows in viewTable
   * @param event 
   */
  setSelectRules(event: any) {
    this.selectedRules = event;
    if (this.selectedRules.length > 0) {
      this.disableInitiateBtn = false;
    } else {
      this.disableInitiateBtn = true;
    }
  }

  showInitiateMessage(runId: number) {
    this.ruleService.getImpactAnalysisRunDetails(runId).subscribe(response => {
      if (response.data !== undefined && response.data !== null) {
        if (response.data.processOutput === 1) {
          this.messageService.add({ severity: 'success', summary: 'Info', detail: 'No rules have been impacted based on your selection.', life: 5000, closable: true });
        } else if (response.data.processOutput > 1) {
          if (response.data.impactedRulesCount > 0 && response.data.rmImpactedRulesCount > 0) {
            let totalRulesImpacted = response.data.impactedRulesCount + response.data.rmImpactedRulesCount;
            this.messageService.add({ severity: 'success', summary: 'Info', detail: `There are ${totalRulesImpacted} rule(s) impacted in which ${response.data.rmImpactedRulesCount} rule(s) are already in the Rule Maintenance Workflow and ${response.data.impactedRulesCount} rules(s) are assigned to CCAs`, life: 5000, closable: true });
          } else if (response.data.impactedRulesCount <= 0 && response.data.rmImpactedRulesCount > 0) {
            this.messageService.add({ severity: 'success', summary: 'Info', detail: `All ${response.data.rmImpactedRulesCount} impacted rule(s) are already in the Rule Maintenance workflow`, life: 5000, closable: true });
          } else if (response.data.impactedRulesCount > 0 && response.data.rmImpactedRulesCount <= 0) {
            this.messageService.add({ severity: 'success', summary: 'Info', detail: `There are ${response.data.impactedRulesCount} rule(s) impacted based on your selection.`, life: 5000, closable: true });
          }
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'User profile setup is incomplete , please contact ECL Admin.', life: 5000, closable: true });
        }
      }
      this.disableInitiateBtn = true;
      this.loading = false;
    });
  }

  exit() {
    this.router.navigate(['/home']);
  }

  loadReferences() {
    if (this.selectedRefSource.length > 0) {
      this.getAllReferences(this.selectedRefSource);
    } else {
      this.references = [];
      this.selectedReferences = [];
    }
  }

  getAllReferences(refSourceIds) {
    this.loading = true;
    this.impactService.getAllReferenceInfo(refSourceIds).subscribe(response => {
      if (response) {
        if (response.data) {
          let referencesInfo: any[] = response.data;
          this.references = [];
          referencesInfo.forEach(reference => {
            this.references.push(reference);
          });
        }
      }
      this.loading = false;
    });
  }

}
