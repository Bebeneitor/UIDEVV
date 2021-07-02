import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { IdeaResearchDto } from 'src/app/shared/models/dto/idea-research-dto';
import { RuleResearchDto } from 'src/app/shared/models/dto/rule-research-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { Constants } from 'src/app/shared/models/constants';
import { ProvisionalRuleComponent } from '../provisional-rule/provisional-rule.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { OverlayPanel } from 'primeng/primeng';
import {ResearchRequestSearchedRuleDto} from "../../../shared/models/dto/research-request-searched-rule-dto";
import {ResearchRequestService} from "../../../services/research-request.service";

const ASSIGNED_TAB_ID = 0;

@Component({
  selector: 'app-idea-research',
  templateUrl: './idea-research.component.html',
  styleUrls: ['./idea-research.component.css']
})

export class IdeaResearchComponent implements OnInit {

  @ViewChild('assignedTable',{static: true}) assignedTable: EclTableComponent;
  @ViewChild('returnedTable',{static: true}) returnedTable: EclTableComponent;

  assignedTableConfig: EclTableModel = null;
  returnedTableConfig: EclTableModel = null;

  public pageTitle: string;
  public setFilter: string;
  public ideaResearchHeader: any[] = [];
  public selectedAssignedRules: IdeaResearchDto[] = [];
  public ruleResearchHeader: any[] = [];
  public selectedReturnedRules: RuleResearchDto[] = [];
  public tabIndex: number = 0;

  ruleResponseSearchDto: ResearchRequestSearchedRuleDto;

  public constructor(private utils: AppUtils, private router: Router, private storageService: StorageService,
    private activatedRoute: ActivatedRoute, private provDialogService: DialogService, public ref: DynamicDialogRef, private rrService: ResearchRequestService) {
    this.assignedTableConfig = new EclTableModel();
    this.returnedTableConfig = new EclTableModel();
  }

  public ngOnInit() {
    this.pageTitle = "Ideas Needing Research";
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === Constants.ASSIGNED_TAB.toUpperCase()) {
        this.tabIndex = 0;
      } else if (params['tab'] === Constants.RETURNED_TAB.toUpperCase()) {
        this.tabIndex = 1;
      } else {
        this.tabIndex = 0;
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['filter']) {
        this.setFilter = params['filter'];
      }
    });
    this.initializeTableConfig(this.assignedTableConfig, Constants.ASSIGNED_TAB);
    this.initializeTableConfig(this.returnedTableConfig, Constants.RETURNED_TAB);
  }

  /**
  * This method is for initialize EclTableModel
  * @param table
  * @param tabStatus
  */
  initializeTableConfig(table: EclTableModel, tabStatus: string) {
    let serviceUrl: string = "";
    let manager = new EclTableColumnManager();
    switch (tabStatus) {
      case Constants.ASSIGNED_TAB:
        serviceUrl = RoutingConstants.IDEAS_URL + "/" + RoutingConstants.IDEAS_RESEARCH_URL;
        manager.addLinkColumnWithIcon("ideaCode", "Idea ID", '12%', true, EclColumn.TEXT, true, 'left', 'researchRequestIdeaIndicator', Constants.RESEARCH_REQUEST_INDICATOR_CLASS);
        manager.addTextColumn('ideaName', 'Idea Name', null, true, EclColumn.TEXT, true);
        manager.addTextColumn('ideaDescription', 'Idea Description', null, true, EclColumn.TEXT, true, 150);
        manager.addTextColumn('eclStageDesc', 'Stage', '10%', false, EclColumn.TEXT, false);
        manager.addTextColumn('categoryDesc', 'Category', '15%', true, EclColumn.TEXT, true);
        manager.addTextColumn('firstName', 'Assigned to', '15%', true, EclColumn.TEXT, true);
        table.sortBy = "ideaCode";
        break;
      case Constants.RETURNED_TAB:
        serviceUrl = RoutingConstants.RULES_URL + '/' + RoutingConstants.RULES_RESEARCH_URL;
        manager.addLinkColumn("ruleCode", "Provisional Rule ID", '8%', true, EclColumn.TEXT, true);
        manager.addTextColumn('ruleName', 'Provisional Rule Name', null, true, EclColumn.TEXT, true);
        manager.addTextColumn('ruleDescription', 'Provisional Rule Description', null, true, EclColumn.TEXT, true, 150);
        manager.addTextColumn('lookupDesc', 'Review Status', '10%', true, EclColumn.TEXT, true);
        manager.addTextColumn('categoryDesc', 'Category', '15%', true, EclColumn.TEXT, true);
        manager.addTextColumn('firstName', 'Assigned To', '15%', true, EclColumn.TEXT, true);
        table.sortBy = "ruleCode";
        break;
    }
    table.url = serviceUrl;
    table.columns = manager.getColumns();
    table.lazy = true;   
    table.sortOrder = 1;
    table.excelFileName = tabStatus.substring(0, 1).toUpperCase()
      + tabStatus.substring(1, tabStatus.length - 1) + ' Ideas Research';
    table.checkBoxSelection = false;
  }

  handleTabViewChange(event: any) {
    const index = event.index;
    this.tabIndex = index;
    if (index === 0) {
      this.refreshEclTable(Constants.ASSIGNED_TAB);
      this.assignedTableConfig.sortBy = "ideaCode";
      this.assignedTableConfig.sortOrder = 1;
    } else if (index === 1) {
      this.refreshEclTable(Constants.RETURNED_TAB);
      this.returnedTableConfig.sortBy = "ruleCode";
      this.returnedTableConfig.sortOrder = 1;
    }
  }

  showReviewComments(event: any) {
    if(event.field == "lookupDesc") {
      const overlaypanel: OverlayPanel = event.overlaypanel;
      this.returnedTable.popUpOverlayInfo = { data: { description: event.row.reviewComments, href: null}, isLink: false, isList: false };
      overlaypanel.toggle(event.overlayEvent);
    }
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

  public redirect(event: any, tab: string): void {
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        let id: number;
        let parent: string;
        let type: string;
        if (tab === Constants.ASSIGNED_TAB) {
          id = event.row.ideaId;
          parent = "IDEAS_RESEARCH_ASSIGNED";
          type = "IDEA";
        } else if (tab === Constants.RETURNED_TAB) {
          id = event.row.ruleId;
          parent = "IDEAS_RESEARCH_RETURNED";
          type = 'RULE';
        }
        this.storageService.set("PARENT_NAVIGATION", parent, false);
        this.router.navigate(['item-detail', this.utils.encodeString(id.toString()), type]);
        break;
      case Constants.RETURNED_TAB:
        this.showProvisionalDialog(event.row.ruleId, tab);
    }
  }

  /* Method to show the dialog of the provisional rule based
    on the provisional rule id and if the rule needs more info
    @input : provisional rule id
  */
  public showProvisionalDialog(ruleId: any, tab: string) {
    const creationStatus = false;
    let ruleResponseIndicator: boolean = false;
    let rrId: string = '';
    this.getRuleResponseIndicator(ruleId).then((rrCode: any) => {
      if (rrCode !== null && rrCode != "" ) {
        ruleResponseIndicator = true;
        rrId = rrCode;
      }
    });
    const ref = this.provDialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: ruleId,
        header: Constants.PROVISIONAL_RULE_CREATION,
        creationStatus: creationStatus,
        provRuleNeedsMoreInfo: tab == Constants.RETURNED_TAB,
        stageId: Constants.ECL_PROVISIONAL_STAGE,
        ruleResponseInd: ruleResponseIndicator,
        researchRequestId: rrId
      },
      showHeader: !ruleResponseIndicator,
      header: `Provisional Rule`,
      width: '80%',
      height: '95%',
      closeOnEscape: false,
      closable: false,
      contentStyle: { "max-height": "95%", "overflow": "auto" }
    });

    ref.onClose.subscribe((provRuleId: any) => {
      this.returnedTable.resetDataTable();
    });
  }

  // Source Link for Research Request
  async getRuleResponseIndicator(ruleId: number) {
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

  /**
  * This method to set the RR rule filter for Assigned Tab
  */
  researchRequestIdeaIdFilter(){
    if(this.setFilter) {
      this.assignedTable.keywordSearch = this.setFilter;
      this.assignedTable.search();
    }
  }

   /**
   * If the service call ends remove the blocked screen.
   * @param event that ecl table fires when the call starts or ends
   */
    onServiceCall(event) {
      if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
         //RR rule filter logic
         if(this.tabIndex === ASSIGNED_TAB_ID && this.setFilter) {
           this.researchRequestIdeaIdFilter();
           this.setFilter = null;
         }

      }
    }

  refreshEclTable(tab: string) {
    switch (tab) {
      case Constants.ASSIGNED_TAB:
        this.selectedAssignedRules = [];
        if(this.assignedTable) {
        this.assignedTable.selectedRecords = [];
        this.assignedTable.keywordSearch = '';
        this.assignedTable.resetDataTable();
        }
        break;
      case Constants.RETURNED_TAB:
        this.selectedReturnedRules = [];
        if (this.returnedTable) {
          this.returnedTable.selectedRecords = [];
          this.returnedTable.keywordSearch = '';
          this.returnedTable.resetDataTable();
        }
        break;
    }
  }
}
