import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, OverlayPanel } from 'primeng/primeng';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { UtilsService } from '../../../../services/utils.service';
import { StagedRule } from '../../models/staged-rule.model';
import { RuleIngestionService } from '../../services/rule-ingestion.service';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';
import { DialogService } from 'primeng/api';
import { NgxPermissionsService } from 'ngx-permissions';
import { CvpService } from '../cvp-template/services/cvp.service';
import { CpeService } from '../cpe-template/services/cpe.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { FileUploaderOptions } from 'src/app/shared/models/file-uploader-options.model';
import { AuthService } from 'src/app/services/auth.service';
import { EclAsyncFileDetails } from 'src/app/shared/components/ecl-table/model/ecl-async-file-details';

const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-ingested-rules',
  templateUrl: './ingested-rules.component.html',
  styleUrls: ['./ingested-rules.component.css']
})
export class IngestedRulesComponent implements OnInit, OnDestroy {

  @ViewChild('cvpIngestionTable',{static: true}) cvpIngestionTable: EclTableComponent;
  @ViewChild('icmsTable',{static: true}) assignedTable: EclTableComponent;
  @ViewChild('cpeTable',{static: true}) cpeTable: EclTableComponent;

  tableConfig: EclTableModel;
  cpeTableConfig: EclTableModel;

  tableManager: EclTableColumnManager;

  pageTitle: string;
  loading = false;
  userId: number;
  activeIndex = 0;
  selectedRuleOverlay: any;
  keywordSearch: string;
  ingestedRules: StagedRule[] = [];
  columnsToExport: any[] = [];
  startDefaultDate: Date = new Date();
  categories: any[] = [];
  cvpTableConfig: EclTableModel = null;
  activeTab = 0;
  cvRuleValues: any[] = [];

  cvpUserRoleOnly: boolean = false;
  disableExportSelected: boolean = true;

  endDefaultDate: Date = new Date(this.startDefaultDate.getFullYear() + 1,
    this.startDefaultDate.getMonth() + 1, this.startDefaultDate.getDate());
  fileUpladerOptions = new FileUploaderOptions();

  userRoles: any[];
  userHasCvpRole;
  comeFromLibraryRuleScreen: boolean = false;
  ruleId: number;

  constructor(private router: Router, private route: ActivatedRoute, public ruleIngestionService: RuleIngestionService,
    private utils: AppUtils, private messageService: MessageService, private utilsService: UtilsService, private dialogService: DialogService,
    private permissions: NgxPermissionsService, private cvpService: CvpService, private cpeService: CpeService, private toast: ToastMessageService, private authService: AuthService) {
    this.tableConfig = new EclTableModel();
    this.cpeTableConfig = new EclTableModel();
    this.cvRuleValues = [
      { label: 'select', value: '' },
      { label: 'Yes', value: '1' },
      { label: 'No', value: '0' }
    ];
  }

  /**
   * We get the user info, also the page title and we check the local storage if we have saved filters.
   */
  ngOnInit() {
    const user = this.authService.getLoggedUser();
    // Check if we have cvp admin role.
    this.userRoles = user.roles;
    if (this.userRoles && this.userRoles.length > 0) {
      this.userHasCvpRole = this.userRoles.find(role => {
        return role.roleName === 'CVPA';
      });
    }

    this.userId = user.userId;
    this.route.data.subscribe(params => this.pageTitle = params['pageTitle']);

    this.ruleIngestionService.cols.forEach(value => {
      this.columnsToExport.push(value.field);
    });



    //Check permissions, if the user just has CVP_USER role only can view CVP tab
    if (this.permissions.getPermission('ROLE_CCA') != undefined ||
      this.permissions.getPermission('ROLE_EA') != undefined ||
      this.permissions.getPermission('ROLE_MD') != undefined ||
      this.permissions.getPermission('ROLE_CVPA') != undefined ||
      this.permissions.getPermission('ROLE_PO') != undefined) {
      this.cvpUserRoleOnly = false;
    } else {
      if (this.permissions.getPermission('ROLE_CVPU') != undefined) {
        this.cvpUserRoleOnly = true;
        this.activeTab = 1;
      }
    }

    this.createIcmsTable();
    this.createCpeTable();
    this.createCvpTable();
    this.checkQueryParams();

    this.fileUpladerOptions.allowExtensions = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  }

  private checkQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === Constants.ICMS_INGESTION_TAB) {
        this.activeTab = 0;
      } else if (params['tab'] === Constants.CVP_INGESTION_TAB) {
        this.activeTab = 1;
      } else if (params['tab'] === Constants.CPE_INGESTION_TAB) {
        this.activeTab = 2;
      }
      this.filterICMSectionByMidRuleAndRuleCode(params);
      if (this.assignedTable) {
        this.assignedTable.refreshTable();
      }
    });
  }


  private createCvpTable() {
    let manager = new EclTableColumnManager();
    manager.addTextColumn('cvpTemplateDetails.moduleName', 'Module Name', "12%", true, EclColumn.TEXT, true);
    manager.addTextColumn('cvpTemplateDetails.ruleName', 'Rule Name', "12%", true, EclColumn.TEXT, true);
    manager.addLinkColumn("cvpTemplateDetails.ruleCategory", "Rule Category", "12%", true, EclColumn.TEXT, true);
    manager.addTextColumn('cvpTemplateDetails.editText', 'Edit Text', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('cvpTemplateDetails.claimType.name', 'Claim Types', "10%", true, EclColumn.TEXT, true);
    manager.addTextColumn('cvpTemplateDetails.cvRule.selected', 'CV Rule', "6%", true, EclColumn.DROPDOWN, true);
    manager.addTextColumn('cvpTemplateDetails.defenseText', 'Defense Text', null, true, EclColumn.TEXT, true, 50);
    manager.addDateColumn('cvpTemplateDetails.ruleCategoryEffectiveDate', 'Rule Category Effective Date', '10%', true, true, EclColumn.DATE, 'MM/dd/yyyy');

    this.cvpTableConfig = new EclTableModel();
    this.cvpTableConfig.url = RoutingConstants.CVP_INGESTION_TEMPLATE + "/";
    this.cvpTableConfig.columns = manager.getColumns();
    this.cvpTableConfig.lazy = true;
    this.cvpTableConfig.sortOrder = 1;
    this.cvpTableConfig.export = true;
    this.cvpTableConfig.excelFileName = 'CVP Ingested Rules';
    this.cvpTableConfig.filterGlobal = true;
    this.cvpTableConfig.checkBoxSelection = true;
  }

  createIcmsTable() {
    const icmsManager = new EclTableColumnManager();
    const url = `${RoutingConstants.RULE_INGESTION_URL}/${RoutingConstants.INGESTED_RULES}?ruleEngine=ICMS`;

    icmsManager.addLinkColumn('ruleCode', 'ECL ID', '10%', true, EclColumn.TEXT, true);
    icmsManager.addTextColumn('identifier', 'Mid Rule', '10%', true, EclColumn.TEXT, true);
    icmsManager.addTextColumn('subIdentifier', 'Version', '10%', true, EclColumn.TEXT, true, 100);
    icmsManager.addTextColumn('deactivatedYn', 'Deactivated Midrule Version', '10%', true, EclColumn.TEXT, true, 10);
    icmsManager.addDateColumn('implementationDate', 'Implementation Date', '10%', true, true, EclColumn.DATE, 'MM/dd/yyyy');
    icmsManager.addTextColumn('logic', 'Logic', null, true, EclColumn.TEXT, true, 100);
    icmsManager.addTextColumn('ruleHeaderDescription', 'Rule Header Description', '15%', true, EclColumn.TEXT, true, 100);
    icmsManager.addTextColumn('category', 'Category', '10%', true, EclColumn.TEXT, true, 100);
    icmsManager.addTextColumn('libraryCustomInternal', 'Type', '10%', true, EclColumn.TEXT, true, 100);

    this.tableConfig.columns = icmsManager.getColumns();
    this.tableConfig.paginationSize = 10;
    this.tableConfig.lazy = true;
    this.tableConfig.url = url;
    this.tableConfig.filterGlobal = true;
    this.tableConfig.excelFileName = 'ICMS Ingested Rules';
    this.tableConfig.asyncDownload = true;
    let asyncFileDetails = new EclAsyncFileDetails();
    asyncFileDetails.fileName = 'Ingested_Rules';
    asyncFileDetails.processCode = 'IRL_QUERY';
    this.tableConfig.asyncFileDetails = asyncFileDetails;
  }

  createCpeTable() {
    this.tableManager = new EclTableColumnManager();
    const url = `${RoutingConstants.CPE_INGESTION_URL}/templates/filtered`;

    this.tableManager.addLinkColumn('cpeTemplateDetails.editName', 'Edit Name', null, true, EclColumn.TEXT, true);
    this.tableManager.addTextColumn('cpeTemplateDetails.editDescriptionProduct', 'Short Description', null, true, EclColumn.TEXT, true);
    this.tableManager.addTextColumn('cpeTemplateDetails.editDescription', 'Edit Description', null, true, EclColumn.TEXT, true);

    this.cpeTableConfig.columns = this.tableManager.getColumns();
    this.cpeTableConfig.paginationSize = 10;
    this.cpeTableConfig.lazy = true;
    this.cpeTableConfig.url = url;
    this.cpeTableConfig.filterGlobal = true;
    this.cpeTableConfig.checkBoxSelection = true;
    this.cpeTableConfig.excelFileName = 'CPE Ingested Rules';
  }

  handleChange(event: any) {
    if (event.index === 1) {
      setTimeout(() => {
        this.cvpIngestionTable.fillCustomFilterOptions('cvpTemplateDetails.cvRule.selected', this.cvRuleValues);
      }, 100);
    }
  }

  redirectToRule(event: any) {
    const row = event.row;
    let isCustomRule: boolean = row.libraryCustomInternal == Constants.CUSTOM_RULE;
    this.dialogService.open(ProvisionalRuleComponent, {
      data: {
        ruleId: row.ruleId,
        header: 'Library View',
        isSameSim: false,
        fromSameSimMod: true,
        readOnlyView: true,
        provDialogDisable: true,
        provisionalRuleReview: true,
        readWrite: true,
        reviewStatus: [],
        ruleReview: true,
        isIngestedRule: true,
        isCustomRule: isCustomRule
      },
      header: (isCustomRule ? 'Custom Rule' : 'Library Rule') + ' Details',
      width: '90%',
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
  * event executed when a user clicks on the link column
  * @param event
  */
  redirect(event: any) {
    const row = event.row;
    const field = event.field;
    let urlArray = [];
    if (field == "cvpTemplateDetails.ruleCategory") {
      urlArray = ['rule-ingestion', 'cvp-template', row.cvpIngestionId];
    }
    this.router.navigate(urlArray);
  }

  /**
   * Removes the decimal part from string.
   * @param value to be formated.
   */
  removeDecimalPart(value: string) {
    if (value && value.includes('.')) {
      value = value.split('.')[0];
    }
    return value;
  }


  /**
   * Determines if a column should have an input element instead a dropdown.
   * @param col current column
   */
  colShouldHaveInpControl(col: any): boolean {
    return (this.ruleIngestionService.colsWithOnlyInputs.indexOf(col.field) >= 0);
  }

  /**
  * Filters the data in the grid.
  * @param value that we want to filter with
  * @param column that we want to filter
  * @param filter the type of filter contains, equals etc
  * @param viewGrid The table reference
  */
  onInplementationDateChanged(value, column, filter, viewGrid): void {
    viewGrid.filter(value ? value.name : value, column, filter);
  }

  /**
   * We reset the table filters.
   * @param viewGrid grid table reference.
   */
  resethDataTable(viewGrid): void {
    this.loading = true;
    this.keywordSearch = "";
    this.loading = false;
  }

  /**
  * When the mouse is over the description column we display the description itself.
  * @param event selected element and values
  * @param element the rule selected item
  * @param overlay local reference to the overlay panel component
  */
  onMouseEnter(event, element, overlay: OverlayPanel) {
    this.selectedRuleOverlay = element;
    overlay.toggle(event);
  }

  /**
   * When the user leaves the route, we save user selection in local storage.
   */
  ngOnDestroy(): void { }

  exportPdf() {

    var cols = [

      { field: 'ruleIngestionId', header: 'Rule Ingestion Id' },
      { field: 'identifier', header: 'Mid Rule' },
      { field: 'subIdentifier', header: 'Version' },
      { field: 'name', header: 'Name' },
      { field: 'implementationDate', header: 'Implementation Date' },
      { field: 'category', header: 'Category' },
      { field: 'logic', header: 'Logic' },
      { field: 'ruleHeaderDescription', header: 'Rule Header Description' },
      { field: 'title', header: 'Title' },
      { field: 'libraryCustomInternal', header: 'Type' },
      { field: 'ruleCode', header: 'Rule Code' }

    ];

    var exportColumns: any[];

    exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

    let doc = new jsPDF('l', 'pt');
    doc.autoTable(exportColumns, this.ingestedRules);
    doc.save('RuleIngestionRepo.pdf');

  }

  /**
   * Verify if there are selected records to enable/disable cvp export selected templates button
   * @param event
   */
  setSelectRules(event: any) {
    this.disableExportSelected = event.length > 0 ? false : true;
  }

  /**
   * Export CVP Selected Templates to Excel File by sending CVP Ingestion Id's to the service call.
   */
  exportTemplate(tableToExport: string, tableKey: string, service: string) {
    const templateIds = this[tableToExport].selectedRecords.map(element => element[tableKey]);
    const fileName = tableToExport === 'cvpIngestionTable' ? Constants.CVP_FILE_NAME : Constants.CPE_FILE_NAME;
    const messageSuccess = tableToExport === 'cvpIngestionTable' ? Constants.CVP_EXPORT_SUCCESS : Constants.CPE_EXPORT_SUCCESS;

    if (templateIds.length <= 0) {
      return;
    }

    this[service].exportRules(templateIds).subscribe((response: any) => {
      this.createDownloadFileElement(response, fileName);
      this.toast.messageSuccess(messageSuccess, Constants.EMPTY_MESSAGE, 4000, false);
    });
  }

  /**
   * Download the Excel File with the CVP Templates selected
   * @param response
   */
  createDownloadFileElement(response: any, fileName: string) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([response], { type: Constants.FILE_TYPE }), url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * 
   * @param event when the file is uploaded.
   */
  onCvpTemplateUploadEnded(event) {
    this.ruleIngestionService.processCvpIngestionFile(event.data).subscribe((response: BaseResponse) => {
      this.toast.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
      this.cvpIngestionTable.refreshTable();
    });
  }

  /**
   * 
   * @param event when the file is uploaded.
   */
  onCpeTemplateUploadEnded(event) {
    this.ruleIngestionService.processCpeIngestionFile(event.data).subscribe((response: BaseResponse) => {
      this.toast.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
    });
  }

  /**
   * Redirects to the cpe ingestion page.
   * @param event row object.
   */
  openCpeTemplate(event) {
    this.router.navigate(['rule-ingestion/cpe-template/' + event.row.cpeIngestionId]);
  }

  /**
   * This method is for load the icms table using specific midRule and ruleCode
   * This method just works if the user comes from rule catalog screen
   * @param midRule 
   * @param ruleCode 
   */
  filterICMSectionByMidRuleAndRuleCode(params: any){
    
    let source = params['source'] as string;
    
    if(source && source === Constants.LIBRARY_RULE_SCREEN){

      this.comeFromLibraryRuleScreen = true;
      let ruleCode = params['RC'] as string;
      let midRule = params['MR'] as string;
      this.ruleId = params['RI'] as number;
      this.tableConfig.criteriaFilters = {midRule: midRule}
      this.tableConfig.url = `${RoutingConstants.RULE_INGESTION_URL}/${RoutingConstants.INGESTED_RULES_MID_RULE}?ruleEngine=ICMS`;
      this.assignedTable.filtersColumns.identifier = midRule;
      this.assignedTable.filters.identifier = midRule; 
    }
  }

  returnPreviousScreen(){
    if(this.comeFromLibraryRuleScreen){
      this.router.navigate(['/item-detail', this.utils.encodeString(this.ruleId.toString()), 'RULE'],
      { queryParams: { source: Constants.RULE_CATALOG_SCREEN } });      
    }
  }

}
