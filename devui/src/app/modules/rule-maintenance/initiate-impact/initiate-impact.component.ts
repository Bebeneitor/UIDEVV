import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem, MessageService, DialogService } from 'primeng/api';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { ImpactDto } from 'src/app/shared/models/dto/impact-dto';
import { PermissionsService } from 'src/app/services/permissions.service';
import { Constants } from 'src/app/shared/models/constants';
import { UtilsService } from 'src/app/services/utils.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';

@Component({
  selector: 'app-initiate-impact',
  templateUrl: './initiate-impact.component.html',
  styleUrls: ['./initiate-impact.component.css']
})
export class InitiateImpactComponent implements OnInit {

  @ViewChild('viewGrid') viewGrid: any;
  @ViewChild('viewTable') viewTable: EclTableComponent;

  minDate: Date;
  maxDate: Date;
  index: number;

  //Key Limiter
  ruleStatus: number;
  pageTitle: string;
  keywordSearch: string;
  loading: boolean = false;

  display: string = 'none';

  response: boolean = true;

  message: string = '';
  saveDisplay: boolean = false;

  // category array objects
  categories: SelectItem[] = [];
  selectedCategory: SelectItem[] = [];
  displayCat: any[] = [];

  // place of service array objects
  placeOfServiceList: any[] = [];
  selectedPlaceOfService: any[] = [];
  displayPlaceOfService: any[] = [];

  // category array objects
  lobsList: any[] = [];
  selectedLobs: any[] = [];
  displayLobs: any[] = [];

  Message: string;

  impactDto: ImpactDto = new ImpactDto();

  userId: number;
  // boolean value to enable and disable the internal request tab based on the user role either CCA or PO
  roleCCA: boolean = false;

  disableInitiateBtn: boolean = true;
  disableViewBtn: boolean = true;

  dropDownStyles: any = { 'width': '100%', 'border': '1px solid #31006F' };

  /**Used in table section */
  tableConfig: EclTableModel = null;
  selectedRules: any[] = [];
  isViewTableHidden = true;

  constructor(private util: AppUtils, private utilService: UtilsService, private rule: RuleInfoService, public route: ActivatedRoute,
    private messageService: MessageService, private userPermissions: PermissionsService,private dialogService: DialogService) {
    this.placeOfServiceList = [];
    this.categories = [];
    this.lobsList = [];
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.userId = this.util.getLoggedUserId()
    });
    this.impactDto.userId = this.userId;
    this.impactDto.impactType = Constants.IMPACT_ANALYSIS_REQUEST_TYPE_INTERNAL;

    this.categories = [];

    this.getCategories();
    this.getLineOfBusiness();
    this.getPlaceOfService();
    this.index = 0;

    // internal request tab disable call back method
    this.disableInternalRequestTab();

    this.tableConfig = new EclTableModel();
    this.initializeTableConfig(this.tableConfig);
  }

 /**
* This method to show the rule dialog
* @param rowEvent
*/
  viewRuleModal(rowEvent : any){
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
    manager.addTextColumn('categoryDesc', 'Category', '17%', true, EclColumn.TEXT, true);
    manager.addTextColumn('ruleImpactStatus', 'Review Status', '15%', false, EclColumn.TEXT, true);
    manager.addTextColumn('assignedToUser', 'Assigned To', '15%', true, EclColumn.TEXT, false);

    return manager.getColumns();
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

  // Methods to fetch all the metadata drop down values
  getCategories(): void {
    this.categories = [];
    this.util.getAllCategoriesValue(this.categories, this.response);
  }

  getLineOfBusiness() {
    this.lobsList = [];
    this.util.getAllLobsValue(this.lobsList, this.response);
  }

  getPlaceOfService() {
    this.placeOfServiceList = [];
    this.utilService.getAllLookUps(Constants.LOOKUP_TYPE_CLAIM_PLACE_OF_SERVICE).subscribe(response => {
      if (response !== null && response !== undefined) {
        response.forEach(pos => {
          this.placeOfServiceList.push({ label: pos.lookupDesc, value: { id: pos.lookupId, name: pos.lookupDesc } });
        });
      }
    });
  }

  /*  Method to disable internal request tab based on the user role
  Disable if CCA  set roleCCA flag to true
  Enable if PO set role roleCCA flag to false
  */
  disableInternalRequestTab() {
    if (this.userId) {
      this.setTabDisable(this.userId);
    } else {
      this.userId = this.util.getLoggedUserId();
      if (this.userId) {
        this.setTabDisable(this.userId);
      }
    }
  }

  /*  Method to fetch the user permissions
  Disable if CCA  set roleCCA flag to true
  Enable if PO set role roleCCA flag to false
  */
  setTabDisable(userId: number) {
    this.userPermissions.getPermissions(userId).subscribe(response => {
      if (response) {
        const permissionObj: any = response;
        let roleObj: any[] = [];
        permissionObj.forEach(userAccess => {
          let roleName: string = userAccess.role.roleName.toUpperCase();
          if (roleName) {
            roleObj.push(roleName);
          }
        });
        if (roleObj.includes(Constants.PO_ROLE)) {
          this.index = 0;
          this.roleCCA = false;
        } else if (roleObj.includes(Constants.CCA_ROLE)) {
          this.index = 1;
          this.roleCCA = true;
        } else {
          this.index = 1;
          this.roleCCA = true;
        }
      }
    });
  }


  initate() {
    this.disableInitiateBtn = true;
    this.loading = true;
    this.impactDto.ruleIds = [];
    this.impactDto.ruleIds = this.selectedRules.map(ele => ele.ruleId);
    this.rule.saveInitiateImpact(this.impactDto).subscribe(response => {
      if (response.data !== undefined && response.data !== null) {
        this.viewTable.selectedRecords = [];
        this.impactDto.ruleIds = [];
        this.selectedRules = [];
        this.showInitiateMessage(response.data.runId);
        this.viewImpactedRules();
      }
    });
  }

  showInitiateMessage(runId: number) {
    this.rule.getImpactAnalysisRunDetails(runId).subscribe(response => {
      if (response.data.processOutput === 1) {
        this.messageService.add({ severity: 'success', summary: 'Info', detail: 'No rules have been impacted based on your selection.', life: 5000, closable: true });
      } else if (response.data !== undefined && response.data !== null) {
        if (response.data.processOutput > 1) {
          if (response.data.impactedRulesCount > 0 && response.data.rmImpactedRulesCount > 0) {
            let totalRulesImpacted = response.data.impactedRulesCount + response.data.rmImpactedRulesCount;
            this.messageService.add({ severity: 'success', summary: 'Info', detail: `There are ${totalRulesImpacted} rule(s) impacted in which ${response.data.rmImpactedRulesCount} rule(s) are already in the Rule Maintenance Workflow and ${response.data.impactedRulesCount} rule(s) are assigned to CCAs`, life: 5000, closable: true });
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

  /* Method to enable and disable the view button based on category selection */
  categoryCheck() {
    this.selectedCategory.length > 0 ? this.disableViewBtn = false : this.disableViewBtn = true;
  }

  /* Method to remove and unselect the selected category*/
  removeCatSelection(item: any) {
    this.selectedCategory = this.selectedCategory.filter((cat: any) => cat.id !== item.id);
  }

  /* Method to remove and unselect the selected line of business */
  removeLobSelection(item: any) {
    this.selectedLobs = this.selectedLobs.filter((lob: any) => lob.id !== item.id);
  }

  /* Method to remove and unselect the selected place of service*/
  removePlaceOfServiceSelection(item: any) {
    this.selectedPlaceOfService = this.selectedPlaceOfService.filter((pos: any) => pos.id !== item.id);
  }

  /* Method to fetch the rules based on the selection of category,lob and place of service*/
  viewImpactedRules() {
    this.createRequestObj(this.impactDto);
    this.tableConfig.url = RoutingConstants.RULES_URL + "/" + RoutingConstants.VIEW_IMPACTED_RULES;
    this.tableConfig.criteriaFilters = this.impactDto;
    this.viewTable.loadData(null);
    this.isViewTableHidden = false;
  }

  async createRequestObj(impactDto: ImpactDto) {
    impactDto.categoryIds = [];
    impactDto.placeOfServiceIds = [];
    impactDto.lobIds = [];
    this.selectedCategory.forEach((item: any) => {
      impactDto.categoryIds.push(item.id);
    });
    this.selectedPlaceOfService.forEach((item: any) => {
      impactDto.placeOfServiceIds.push(item.id);
    });
    this.selectedLobs.forEach((item: any) => {
      impactDto.lobIds.push(item.id);
    });
  }

  indexShift(event) {

  }

}
