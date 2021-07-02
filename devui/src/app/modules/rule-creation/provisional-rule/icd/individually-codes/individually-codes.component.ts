import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { Constants } from 'src/app/shared/models/constants';
import { UtilsService } from 'src/app/services/utils.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleCodeDto } from 'src/app/shared/models/dto/rule-code-dto';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-icd-individually-codes',
  templateUrl: './individually-codes.component.html',
  styleUrls: ['./individually-codes.component.css']
})
export class IndividuallyCodesComponent implements OnInit {

  @Input() readOnlyView: boolean
  cols: any;

  _ruleInfo: RuleInfo = new RuleInfo();
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      this._ruleInfo = value;
    }
  }

  private _rowToEdit: any;
  @Input() set rowToEdit(mode) {
    this._rowToEdit = mode;
    this.populateInputsWithRowData(this._rowToEdit)
  }

  @Output() onAdd = new EventEmitter();
  @Output() onLoad = new EventEmitter();

  minDate: Date = Constants.MIN_VALID_DATE;
  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  icd: any = {
    codeFrom: '',
    codeTo: '',
    dateFrom: this.datepipe.transform(
      Constants.CODES_DEF_DATE_FROM, Constants.DATE_FORMAT_IN_ECL_TABLE),
    dateTo: this.datepipe.transform(
      Constants.CODES_DEF_DATE_TO, Constants.DATE_FORMAT_IN_ECL_TABLE),
    category: null,
    primarySecondary: null,
    override: false,
    claim: false
  }

  categories: any[] = [];
  primarySecondary: any[] = [];

  constructor(private utilsService: UtilsService,
    private utils: AppUtils, private toastMessageService: ToastMessageService,
    private datepipe: DatePipe) { }

  ngOnInit() {

    this.loadCategories();
    this.cols = [
      { field: 'codeRangeFrom', header: 'ICD From', width: '15%' },
      { field: 'codeRangeTo', header: 'ICD To', width: '15%' },
      { field: 'dateFrom', header: 'Date From', width: '15%' },
      { field: 'dateTo', header: 'Date To', width: '15%' },
      { field: 'categoryDesc', header: 'Category', width: '15%' },
      { field: 'primarySecondaryDesc', header: 'Primary / Secondary', width: '10%' },
      { field: 'override', header: 'Override', width: '6%' },
      { field: 'claimHeaderLevel', header: 'Claim Header Level', width: '6%' },
      { field: 'options', header: '', width: '3%' }
    ];
  }

  loadCategories() {
    this.categories = [];
    this.categories.push({ label: "Select Category", value: null });
    this.utils.getLookupCodesByList(this.categories, Constants.LOOKUP_TYPE_PROC_CODE_OPTION,
      Constants.ICD_CODES_CATEGORY_LIST).then(() => {
        this.loadPrimarySecondary();
      });
  }

  loadPrimarySecondary() {
    this.primarySecondary = [];
    this.primarySecondary.push({ label: "Select one option", value: null });
    this.utilsService.getAllLookUps(Constants.LOOKUP_PRIMARY_SECONDARY_ICD).subscribe((array: any[]) => {
      array.forEach(item => {
        this.primarySecondary.push({ label: item.lookupDesc, value: item.lookupId });
      });

      this.onLoad.emit({ categories: this.categories, primarySecondary: this.primarySecondary });
    });
  }

  addICD() {

    let error = false;

    if (this.icd.codeFrom.trim() == '') {
      this.toastMessageService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter a value in ICD from field');
      error = true;
    }

    if (this.icd.codeTo == null || this.icd.codeTo.trim() == '') {
      this.icd.codeTo = this.icd.codeFrom;
    }

    if (error) {
      return;
    } else {

      let json = JSON.parse(JSON.stringify(this.icd));

      //Create rule code object
      let ruleCode = new RuleCodeDto();

      if (json.category != null && json.category != undefined) {
        ruleCode['categoryDesc'] = this.getTextFromDropdown(this.categories, json.category);
        ruleCode.category = json.category;
      } else {
        json.category = null;
      }

      if (json.primarySecondary != null && json.primarySecondary != undefined) {
        ruleCode['primarySecondaryDesc'] = this.getTextFromDropdown(this.primarySecondary, json.primarySecondary);
        ruleCode.primarySecondaryCode = json.primarySecondary;
      } else {
        json.primarySecondary = null;
      }

      ruleCode.codeId = 0;
      ruleCode.codeRangeFrom = json.codeFrom.toUpperCase().trim();
      ruleCode.codeRangeTo = json.codeTo.toUpperCase().trim();
      ruleCode.dateFrom = json.dateFrom != null && json.dateFrom != undefined ? this.transformDate(json.dateFrom) : null;
      ruleCode.dateTo = json.dateTo != null && json.dateTo != undefined ? this.transformDate(json.dateTo) : null
      ruleCode.override = json.override ? 'Y' : 'N';
      ruleCode.claimHeaderLevel = json.claim ? 'Y' : 'N';
      ruleCode.ruleDiagnosisCodeId = null;
      ruleCode.existing = false;
      ruleCode.retired = false;
      ruleCode.originalCodeId = json.originalCodeId;
      ruleCode.action = json.action;

      ruleCode['options'] = '';

      this.onAdd.emit({ type: Constants.INDIVIDUALLY, data: ruleCode });

    }
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

  transformDate(date) {

    //let newDate = date.toString().split('T')[0].split('-');

    //return newDate[1] + '-' + newDate[2] + '-' + newDate[0];
    return this.datepipe.transform(date, 'MM-dd-yyyy');
  }

  reverseDate(dateStr) {
    //let arrDate = dateStr.split('-');

    //return new Date(arrDate[2], arrDate[0] - 1, arrDate[1]);
    return this.datepipe.transform(dateStr, 'MM/dd/yyyy');
  }

  populateInputsWithRowData(rowData) {

    if (rowData == null || rowData == undefined) {
      this.clearData()
      return;
    }

    this.icd = {
      codeFrom: rowData.codeRangeFrom,
      codeTo: rowData.codeRangeTo,
      dateFrom: rowData.dateFrom != null ? this.reverseDate(rowData.dateFrom) : null,
      dateTo: rowData.dateTo != null ? this.reverseDate(rowData.dateTo) : null,
      category: rowData.category,
      categoryDesc: rowData.category != null ? this.getTextFromDropdown(this.categories, rowData.category) : '',
      primarySecondary: rowData.primarySecondaryCode,
      primarySecondaryDesc: rowData.primarySecondaryCode != null ? this.getTextFromDropdown(this.primarySecondary, rowData.primarySecondaryCode) : '',
      override: rowData.override == 'Y',
      claim: rowData.claimHeaderLevel == 'Y',
      action: rowData.action,
      originalCodeId: rowData.originalCodeId,
      icdCodeFromVersion: rowData.icdCodeFromVersion,
      icdCodeToVersion: rowData.icdCodeToVersion
    }
  }


  clearData() {
    this.icd = {
      codeFrom: '',
      codeTo: '',
      dateFrom: this.datepipe.transform(
        Constants.CODES_DEF_DATE_FROM, Constants.DATE_FORMAT_IN_ECL_TABLE),
      dateTo: this.datepipe.transform(
        Constants.CODES_DEF_DATE_TO, Constants.DATE_FORMAT_IN_ECL_TABLE),
      category: null,
      primarySecondary: null,
      override: false,
      claim: false
    }
  }
}
