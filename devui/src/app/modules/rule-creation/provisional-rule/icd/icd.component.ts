import { RequestMatch } from '@angular/common/http/testing';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ElementRef, OnDestroy } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ConfirmationService } from 'primeng/api';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { RuleCodeDto } from 'src/app/shared/models/dto/rule-code-dto';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { ValidateRuleCodeRequest } from 'src/app/shared/models/validate-rule-code-request';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils, DateUtils } from 'src/app/shared/services/utils';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { EclColumnStyleCondition, EclColumnStyles } from 'src/app/shared/components/ecl-table/model/ecl-column-style';

const TEMPLATE_EXT = '.xlsx';
const TEMPLATE_NAME = 'icd_template_';

@Component({
  selector: 'app-icd',
  templateUrl: './icd.component.html',
  styleUrls: ['./icd.component.css']
})
export class IcdComponent implements OnInit {

  ADD_CODES_INDIVIDUALY = 'ACI';
  USE_SPREADSHEET = 'US';
  COPY_PASTE = 'CPC';

  @ViewChild('individuallyTag',{static: true}) individuallyTag;
  @ViewChild('copyTag',{static: true}) copyTag;
  @ViewChild('errorTag',{static: true}) errorTag;

  @Input('readOnlyView') readOnlyView: boolean;
  @Input('provDialogDisable') provDialogDisable: boolean;

  @Input() _fromMaintenanceProcess: boolean = false;
  @Input() set fromMaintenanceProcess(value: boolean) {
    this._fromMaintenanceProcess = value;
  }

  _ruleInfo: RuleInfo = new RuleInfo();
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      this._ruleInfo = value;
      this.loadIcdCodesData();
    }
  }

  @ViewChild('dt',{static: true}) dt;

  @Output() onChange = new EventEmitter();

  icdRadio: string = this.ADD_CODES_INDIVIDUALY;

  cols: any[] = [];
  data: any[] = [];

  categories: any[] = [];
  primarySecondary: any[] = [];

  uploadedFile: File;
  loading: boolean = false;
  existingIcdCodes: RuleCodeDto[] = [];
  originalIcdCodes: RuleCodeDto[] = [];

  @ViewChild('fileTemplate',{static: true}) fileTemplate: ElementRef;

  errorList: any = null;

  selectedICD: any = null;
  rowIndex: number;
  previousRowData: any = null;
  filtersColumns: any = {};
  yearValidRangeEft = `${Constants.PR_CODE_MIN_VALID_YEAR}:${Constants.PR_CODE_MAX_VALID_YEAR}`;

  /**Used in table section */
  ruleCodeDtoObj: RuleCodeDto = new RuleCodeDto();
  tableConfig: EclTableModel = null;
  @ViewChild('viewTable',{static: true}) viewTable: EclTableComponent;
  userId: number;

  blockICD: boolean = false;


  constructor(private toastMessage: ToastMessageService, private dashboardService: DashboardService, private confirmationService: ConfirmationService,
    private codesService: ProcedureCodesService, private ruleService: RuleInfoService,
    private fileManagerService: FileManagerService,
    private dateUtils: DateUtils, private utils: AppUtils) { }

  ngOnInit() {

    this.tableConfig = new EclTableModel();
    this.initializeTableConfig(this.tableConfig);
    this.userId = this.utils.getLoggedUserId();

  }

  /**
* This method is for initializing EclTableModel
* @param table
*/
  initializeTableConfig(table: EclTableModel) {
    table.columns = this.initializeTableColumns();
    table.lazy = true;
    table.sortOrder = 1;
    table.excelFileName = 'Icd codes';
    table.checkBoxSelection = (!this.provDialogDisable && !this.readOnlyView);
    table.toolBar = { trashButton: (!this.provDialogDisable && !this.readOnlyView), recoveryButton: false };
  }

  /**
     * This method is for initializing table colums in EclTableColumnManager
     */
  initializeTableColumns(): EclColumn[] {

    let manager = new EclTableColumnManager();
    let stylesCodeFrom: EclColumnStyles[] = [
      new EclColumnStyles({ 'color': 'orange' }, new EclColumnStyleCondition('deletedIcdCodeFrom', '=', 'Y')),
    ];

    let stylesCodeTo: EclColumnStyles[] = [
      new EclColumnStyles({ 'color': 'orange' }, new EclColumnStyleCondition('deletedIcdCodeTo', '=', 'Y'))
    ];
    manager.addTextColumn("codeRangeFrom", 'ICD From', '12%', true, EclColumn.TEXT, true, 0, 'left', stylesCodeFrom, 'codeRangeFromDescription');
    manager.addTextColumn('codeRangeTo', 'ICD To', '12%', true, EclColumn.TEXT, true, 0, 'left', stylesCodeTo, 'codeRangeToDescription');
    manager.addTextColumn('icdType', 'ICD Type', '11%', true, EclColumn.TEXT, true, 0, 'center');
    manager.addTextColumn('dateFrom','Date From','15%', true, EclColumn.TEXT, true, 0, 'center');
    manager.addTextColumn('dateTo','Date To','15%', true, EclColumn.TEXT, true, 0, 'center');

    manager.addTextColumn('codeCatDescription', 'Category', '15%', true, EclColumn.TEXT, true);
    manager.addTextColumn('primarySecondaryCodeDesc', 'Primary / Secondary', '10%', true, EclColumn.TEXT, true);
    manager.addMultiCheckIconIndictorColumn('override', 'Override', '5%', true, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);
    manager.addMultiCheckIconIndictorColumn('claimHeaderLevel', 'Claim Header Level', '5%', true, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);

    return manager.getColumns();
  }

  /** Method to load the icd tab codes data with initialized parameters */
  loadIcdCodesData() {
    if (this._ruleInfo.ruleId !== undefined && this._ruleInfo.ruleId !== null) {
      this.tableConfig.url = `${RoutingConstants.PROC_CODES_URL}/${Constants.ICD_CODE_TYPE}/${this._ruleInfo.ruleId}`;
      this.tableConfig.criteriaFilters = this.ruleCodeDtoObj;
      this.viewTable.loadData(null);
    } else {
      this.viewTable.loading = false;
    }
  }

  /**
  *  Method to show a confirmation dialog and remove the selected codes.
  * @Param event
  */
  deleteSelection(event: any) {
    if (!this.readOnlyView && !this.provDialogDisable) {
      this.confirmationService.confirm({
        key: 'icdDialog',
        message: Constants.ARE_YOU_WANT_TO_REMOVE_CODES,
        header: Constants.CONFIRM_DELETION,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.clearRowSelection();
          this.deleteSelectedCode(event);
        }
      });
    }
  }

  /** Method to clear the table row selection */
  clearRowSelection() {
    this.onRowUnselect({});
    this.individuallyTag.clearData();
  }

  /** Method to delete the selected row after the user confirmation*/
  deleteSelectedCode(event: any) {
    let request = new ValidateRuleCodeRequest();
    let reqCodeList: RuleCodeDto[] = event;
    request.newCodesList = reqCodeList;
    request.codeType = Constants.ICD_CODE_TYPE;
    request.ruleId = this._ruleInfo.ruleId;
    this.loading = true;
    this.codesService.deleteRuleCode(request).subscribe((response: BaseResponse) => {
      if (response && response.code === Constants.HTTP_OK) {
        this.loadIcdCodesData();
        this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, Constants.ICD_REMOVED_SUCCESSFULLY);
        this.clearEdit();
      }
      this.loading = false;
    }, (err => {
      this.loading = false;
    }));
  }

  /**
   * This method is to update ecl table.
   *
   */
  /*private updateEclTable() {
    if (this.viewTable) {
      this.viewTable.resetDataTable();
    }
  }
  */

  /** Method to add a new code after entering the required details */
  addICD(event) {
    if (event.type === Constants.INDIVIDUALLY) {
      this.errorList = null;
      let request = new ValidateRuleCodeRequest();
      let reqCodeList: RuleCodeDto[] = [];
      if (this.selectedICD) {
        event.data.codeId = this.selectedICD.codeId;
        event.data.statusTypeId = this.selectedICD.statusTypeId;
        event.data.parentCodeId = this.selectedICD.parentCodeId;
        event.data.retired = this.selectedICD.retired;
      }
      event.data.ruleId = this._ruleInfo.ruleId;
      reqCodeList = [event.data];
      this.createValidateRuleCodeRequestObj(request, reqCodeList);
      this.codesService.validateProcedureCodes(request, "ICD").subscribe((resp: any) => {
        let errorList: Object = resp.data.errorList;
        if (request.newCodesList.length === 1 && errorList && errorList !== null) {
          if (errorList[Constants.EXISTING_RULE_CODE_ERROR] !== undefined &&
            errorList[Constants.EXISTING_RULE_CODE_ERROR] !== null) {
            this.toastMessage.messageWarning(Constants.TOAST_SUMMARY_WARN, errorList[Constants.EXISTING_RULE_CODE_ERROR][0]);
          } else {
            this.errorList = resp.data.errorList;
          }
        } else {
          this.loadIcdCodesData();
          this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Code(s) validated successfully.');
          if (this.selectedICD !== null) {
            this.onRowUnselect({});
          }
          this.individuallyTag.clearData();
        }
      });
    }
  }

  /** Method to create a basic request object with required parameters */
  createValidateRuleCodeRequestObj(request: ValidateRuleCodeRequest, reqCodeList?: RuleCodeDto[]) {
    request.newCodesList = reqCodeList;
    request.codeType = Constants.ICD_CODE_TYPE;
    request.ruleId = this._ruleInfo.ruleId;
    request.userId = this.userId;
  }

  getTextFromDropdown(list, key) {
    let text = '';
    if (key !== null && key !== undefined) {
      list.forEach(item => {
        if (item.value == key) {
          text = item.label;
        }
      });
    }
    return text;
  }

  loadFinish(event) {
    this.categories = event.categories;
    this.primarySecondary = event.primarySecondary;
  }

  /* spread sheet upload methods */

  /** Method to upload a file */
  changeFile(event) {
    if (event.target.files.length > 0) {
      this.uploadedFile = event.target.files[0];
      this.validateUploadedFile();
      this.fileTemplate.nativeElement.value = '';
    }
  }

  /** Method to validate and display the uploaded codes from the file */
  validateUploadedFile() {
    this.blockICD = true;
    this.errorList = null;
    let request = new ValidateRuleCodeRequest();
    this.createValidateRuleCodeRequestObj(request);
    this.codesService.validateUploadedProcCodes(this.uploadedFile, request).subscribe((resp: any) => {
      let errorList: Object = resp.data.errorList;
      if (errorList && errorList !== null) {
        if (errorList[Constants.EXISTING_RULE_CODE_ERROR] !== undefined &&
          errorList[Constants.EXISTING_RULE_CODE_ERROR] !== null) {
          this.toastMessage.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Code(s) validated successfully, however same data already exist');
        } else {
          this.errorList = resp.data.errorList;
        }
        this.loadIcdCodesData();
      } else {
        this.loadIcdCodesData();
        this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Code(s) validated succesfully');
      }
      this.blockICD = false;
    }, (err => {
      this.blockICD = false;
    }));

  }

  /**
  * Download a  xslx template file with icd codes related header.
  *
  */
  downloadXslFile() {
    this.loading = true;
    let datePart = this.dateUtils.getCurrentDateString();
    let fileName = `${TEMPLATE_NAME}${datePart}${TEMPLATE_EXT}`;
    this.codesService.downloadCodeTemplate(Constants.DIAGCODE_TEMPLATE_TYPE).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, fileName);
      this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Template Downloaded');
      this.loading = false;
    }, (err) => { this.loading = false; });
  }

  /** Method to handle the file upload on drop*/
  dropFileHandler(event) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    let dragFile: File;
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          var file = event.dataTransfer.items[i].getAsFile();
          dragFile = file;
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      dragFile = event.dataTransfer.files;
    }
    this.uploadedFile = dragFile;
    this.validateUploadedFile();
    this.fileTemplate.nativeElement.value = '';
  }

  /* copy paste methods */

  /*Method to validate the added ICD codes and update the newly added table */
  addRowToCodesTable(rowToAdd: any[]) {
    this.loading = true;
    this.errorList = null;
    let request = new ValidateRuleCodeRequest();
    this.createValidateRuleCodeRequestObj(request, rowToAdd);
    this.codesService.validateProcedureCodes(request, "ICD").subscribe((resp: any) => {

      let errorListReturned: Object = resp.data.errorList;
      this.clearEdit();
      if (errorListReturned && errorListReturned !== null) {
        if (errorListReturned[Constants.EXISTING_RULE_CODE_ERROR] !== undefined &&
          errorListReturned[Constants.EXISTING_RULE_CODE_ERROR] !== null) {
          this.clearData();
          this.toastMessage.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Code(s) validated successfully, however same data already exist');
        } else {
          this.errorList = resp.data.errorList;
        }
        this.loadIcdCodesData();
      }
      else {
        this.clearData();
        this.loadIcdCodesData();
        this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Code(s) validated successfully');
      }
      this.loading = false;

    }, (err => {
      this.loading = false;
    }));

  }

  /* Method to generate the ICD code DTO object List from the copy paste text */
  generateRuleProcedureCode(event: any) {
    let codeRange = event.data.codeRange;
    let selectedIcdObj = event.data.icdObj;
    let splittedCodes = codeRange.split(",");
    let icdCodeList: any = [];
    if (codeRange !== '') {
      splittedCodes.forEach(codes => {
        if (codes && codes != '') {
          let icdCodeDto = new RuleCodeDto();
          icdCodeDto.ruleId = this._ruleInfo.ruleId;
          if (codes.indexOf('-') !== -1) {
            let splitRange = codes.split('-');
            icdCodeDto.codeRangeFrom = splitRange[0];
            icdCodeDto.codeRangeTo = splitRange[1];
          } else {
            icdCodeDto.codeRangeFrom = codes;
            icdCodeDto.codeRangeTo = codes;
          }

          icdCodeDto.codeRangeFrom = icdCodeDto.codeRangeFrom.toUpperCase();
          icdCodeDto.codeRangeTo = icdCodeDto.codeRangeTo.toUpperCase();
          let jsonDateFrm = null;
          let jsonDateTo = null;

          if (typeof selectedIcdObj.dateFrom !== 'undefined'
            && selectedIcdObj.dateFrom !== Constants.CODES_DEF_DATE_FROM) {
            jsonDateFrm = JSON.parse(JSON.stringify(selectedIcdObj.dateFrom));
          }
          if (typeof selectedIcdObj.dateTo !== 'undefined'
            && selectedIcdObj.dateTo !== Constants.CODES_DEF_DATE_TO) {
            jsonDateTo = JSON.parse(JSON.stringify(selectedIcdObj.dateTo));
          }


          icdCodeDto.dateFrom = jsonDateFrm != null ? this.transformDate(jsonDateFrm) : null;
          icdCodeDto.dateTo = jsonDateTo != null ? this.transformDate(jsonDateTo) : null;

          icdCodeDto.category = selectedIcdObj.category;
          icdCodeDto.primarySecondaryCode = selectedIcdObj.primarySecondaryCode;
          icdCodeDto.override = this.getIdFromBoolean(selectedIcdObj.override);
          icdCodeDto.claimHeaderLevel = this.getIdFromBoolean(selectedIcdObj.claimHeaderLevel);

          icdCodeList.push(icdCodeDto);
        }
      });
      if (icdCodeList.length) {
        this.addRowToCodesTable(icdCodeList);
      } else {
        this.toastMessage.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter valid code(s)');
      }
    } else {
      this.toastMessage.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter a value in Add codes field');
    }
  }

  /* Method to return indicator based on the boolean value selection */
  getIdFromBoolean(status: boolean) {
    return status ? 'Y' : 'N';
  }

  /** Method to set the edit part with the selected row values */
  onRowSelect(event) {
    if (event != null && !this.provDialogDisable && !this.readOnlyView) {

      let rowSelected: any = this.utils.removeMarkups(JSON.parse(JSON.stringify(event[event.length - 1])));
      let isDeleted = rowSelected.statusId == 2 && rowSelected.originalCodeId;

      if(!isDeleted) {
        this.selectedICD = rowSelected;
        this.selectedICD.action = 'edit';
      }

      this.tableConfig.toolBar.recoveryButton = true;

    } else {
      this.tableConfig.toolBar.recoveryButton = false;
    }
  }

  /** Method clear the edit part on row unselection */
  onRowUnselect(event) {
    if (event && event.length) {
      let rowSelected: any = this.utils.removeMarkups(JSON.parse(JSON.stringify(event[event.length - 1])));
      this.selectedICD = Object.assign({}, rowSelected);
      this.tableConfig.toolBar.recoveryButton = true;
    } else {
      this.selectedICD = null;
      this.tableConfig.toolBar.recoveryButton = false;
    }
  }

  transformDate(date) {
    let newDate = date.toString().split('T')[0].split('-');

    return newDate[1] + '-' + newDate[2] + '-' + newDate[0];
  }

  showLabel() {
    if (this.icdRadio == 'ACI')
      return 'Individual Codes';
    else if (this.icdRadio == 'CPC')
      return 'Add Codes';
    else if (this.icdRadio == 'US')
      return 'Upload Spreadsheet';
  }

  changeTab() {
    this.clearEdit();
  }

  clearEdit() {
    this.selectedICD = null;
    this.rowIndex = -1;
    this.onRowUnselect({});
    if (this.viewTable) {
      this.viewTable.resetDataTable();
    }
  }

  clearData() {
    this.copyTag ? this.copyTag.clearData() : '';
    this.individuallyTag ? this.individuallyTag.clearData() : '';
    this.errorTag ? this.errorTag.clearData() : '';
  }

  /** Service call method to delete the unsaved draft status type codes */
  deleteDraftRuleCodes() {
    if (this._ruleInfo.ruleId !== undefined) {
      this.codesService.deleteDraftRuleCodes(Constants.ICD_CODE_TYPE, this._ruleInfo.ruleId).subscribe();
    }
  }

  /**
   * Recovers the elements of the selection.
   */
  recoverSelection(event : any) {

    let request = new ValidateRuleCodeRequest();
    let reqCodeList: RuleCodeDto[] = event;

    request.newCodesList = reqCodeList;
    request.codeType = Constants.ICD_CODE_TYPE;
    request.ruleId = this._ruleInfo.ruleId;

    this.loading = true;
    this.codesService.recoverICDCodes(request).subscribe((response: BaseResponse) => {
      if (response && response.code === Constants.HTTP_OK) {
        this.loadIcdCodesData();
        this.toastMessage.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, response.message);
        this.clearEdit();
      }
      this.loading = false;
    }, (err => {
      this.loading = false;
    }));
  }

}

