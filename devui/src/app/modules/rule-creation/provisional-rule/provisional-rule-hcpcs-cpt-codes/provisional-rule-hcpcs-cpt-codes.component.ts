import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { RuleCodeDto } from 'src/app/shared/models/dto/rule-code-dto';
import { ProcedureCodeDto } from 'src/app/shared/models/dto/procedure-code-dto';
import { ValidateRuleCodeRequest } from 'src/app/shared/models/validate-rule-code-request';
import { ValidateRuleCodeResponse } from 'src/app/shared/models/validate-rule-code-response';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { AppUtils } from 'src/app/shared/services/utils';
import { NewlyAddedCodesTableComponent } from './newly-added-codes-table/newly-added-codes-table.component';



@Component({
  selector: 'app-provisional-rule-hcpcs-cpt-codes',
  templateUrl: './provisional-rule-hcpcs-cpt-codes.component.html',
  styleUrls: ['./provisional-rule-hcpcs-cpt-codes.component.css']
})
export class ProvisionalRuleHcpcsCptCodesComponent implements OnInit {


  _ruleInfo: RuleInfo = new RuleInfo();
  selectedRadioText: string;
  @Input() set ruleInfo(value: RuleInfo) {
    if (value) {
      if (!value.hcpcsCptCodeDtoList) {
        let dtoList: RuleCodeDto[] = [];
        value.hcpcsCptCodeDtoList = dtoList;
      }
      this._ruleInfo = value;
      if (value.ruleId) {
        this.getProcedureCodesData(value);
      }
      this.rowToEdit = null;
    }
  }
  @Input() userId: number;


  @Input() _provDialogDisable: boolean = false;
  @Input() set provDialogDisable(value: boolean) {
    this._provDialogDisable = value;
    this.disableFields = value;
  }
  @Input() _readOnlyView: boolean = false;
  @Input() set readOnlyView(value: boolean) {
    this._readOnlyView = value;
  }
  @Input() _fromMaintenanceProcess: boolean = false;
  @Input() set fromMaintenanceProcess(value: boolean) {
    this._fromMaintenanceProcess = value;
  }
  selectedRadioValue: string;
  response: RuleCodeDto[] = [];
  openTab: any;
  disableFields: boolean = false;

  validationResponse: ValidateRuleCodeResponse = new ValidateRuleCodeResponse();
  rowToEdit: any;
  procTypeOptions: any[] = [];
  modifierOptions: any[] = [];
  posOptions: any[] = [];
  revenueCodeOptions: any[] = [];
  @ViewChild('individuallyTag',{static: true}) individuallyTag;
  @ViewChild('copyTag',{static: true}) copyTag;
  @ViewChild('errorTag',{static: true}) errorTag;
  @ViewChild('newCodesTableTag',{static: true}) newCodesTableTag:NewlyAddedCodesTableComponent;

  constructor(private codesService: ProcedureCodesService, private ruleService: RuleInfoService, private datepipe: DatePipe,
    private toastService: ToastMessageService, private utils: AppUtils) { }


  ngOnInit() {

    if (this._provDialogDisable || this._readOnlyView || this.fromMaintenanceProcess) {
      this.selectedRadioValue = '';
    } else {
      this.selectedRadioValue = 'individual';
      this.selectedRadioText = 'Individual Codes';
    }

    this.populateOptionLists();
    this.openTab = this.selectedRadioValue;

  }

  populateOptionLists() {
    this.procTypeOptions.push({ label: "Select Category", value: 0 });
    this.utils.getLookupCodesByList(this.procTypeOptions, Constants.LOOKUP_TYPE_PROC_CODE_OPTION,
      Constants.HCPCS_CODES_CATEGORY_LIST);
    this.utils.getAllProfessionalClaims(this.posOptions, false);
    this.utils.getAllModifierOptions(this.modifierOptions);
    this.utils.getAllRevenueCodes(this.revenueCodeOptions, false);
  }

  getProcedureCodesData(ruleInfo: RuleInfo) {
    this.validationResponse.errorList = {};
    this.rowToEdit = null;
    if (ruleInfo && ruleInfo.ruleId) {
      this.ruleService.getAllRuleProcedureCodesForRule(ruleInfo.ruleId).subscribe((resp) => {

        if (resp.data !== null && resp.data !== undefined) {
          this.validationResponse.ruleCodeList = this.processResponse(resp.data);
        } else {
          this.validationResponse.ruleCodeList = [];
        }

        ruleInfo.hcpcsCptCodeDtoList = this.validationResponse.ruleCodeList;
      });
    }
  }
  processResponse(data: RuleCodeDto[]): RuleCodeDto[] {
    data.forEach(element => {
      element.icd = element.icd ? element.icd : 'N';
      element.override = element.override ? element.override : 'N';
      element.bwDeny = element.bwDeny ? element.bwDeny : 'N';
    });
    return data;
  }

  updateCodesTable(ev:any) {
    if (!this.newCodesTableTag.ruleInfo) {
      // ECL newCodes RuleInfo isn't created. Force it!
      this.newCodesTableTag.ruleInfo = this._ruleInfo;
    } else {
      this.newCodesTableTag.procedureCodesTable.loadData(null);
    }
  }

  addRowToCodesTable(rowToAdd: any) {

    let request = new ValidateRuleCodeRequest();
    let reqCodeList: RuleCodeDto[] = [];

    if (rowToAdd.type == 'individually') {
      reqCodeList = [rowToAdd.data];
    } else {
      reqCodeList = rowToAdd;
    }

    
    request.newCodesList = reqCodeList;
    request.ruleId = this._ruleInfo.ruleId;

    this.validationResponse.errorList = null;
    this.codesService.validateProcedureCodes(request, "CPT").subscribe((resp: any) => {
      let procListReturned: any[] = [];
      procListReturned = resp.data.ruleCodeList;
      let errorListReturned = resp.data.errorList;

      if (errorListReturned && errorListReturned != null) {

        if (rowToAdd.type != 'individually') {
          this.rowToEdit = null;
          this.newCodesTableTag.clearEdit();
        }
        this.validationResponse.errorList = errorListReturned;
      } else {
        this.validationResponse.errorList = null;

        if (procListReturned && procListReturned != null) {
          this.validationResponse.ruleCodeList = procListReturned;
          this.clearData();
          this.rowToEdit = null;
          
        } else {
          this.validationResponse.ruleCodeList = [];
        }
      }

      this._ruleInfo.hcpcsCptCodeDtoList = this.validationResponse.ruleCodeList;

      let isThereDup: boolean = false;
      if(this.validationResponse.errorList){
        Object.keys(this.validationResponse.errorList).forEach(k=>{
          if(k === Constants.DUP_RECORD_TAG){
            isThereDup=true;
          }
        });
      }
      
      if (!this.validationResponse.errorList) {
        this.updateCodesTable(null);
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Code(s) validated succesfully');
      }

      if(this.validationResponse.errorList && isThereDup){
        this.updateCodesTable(null);
        if(this.selectedRadioValue=='copypaste'){
          this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN,Constants.DUP_RECORD_SUCCESS);
        }
        else{
          this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN,Constants.DUP_RECORD_FAIL);  
        }
        this.validationResponse.errorList = null;   
      }
      
    });
  }

  editCurrentRow(rowToEdit: any) {
    if(rowToEdit != null){
      this.rowToEdit = rowToEdit.data;
      this.clearData();
    }else{
      this.rowToEdit = null;
    }
    
  }

  changeTab() {
    this.rowToEdit = null;
    this.clearData();

    this.openTab = this.selectedRadioValue;
    if(this.selectedRadioValue=='individual')
      this.selectedRadioText = 'Individual Codes';
    else if(this.selectedRadioValue=='copypaste')
      this.selectedRadioText = 'Add Codes';
    else if(this.selectedRadioValue=='upload')
      this.selectedRadioText = 'Upload Spreadsheet';
  }

  clearData(){
    this.copyTag ? this.copyTag.clearData():'';
    this.individuallyTag ? this.individuallyTag.clearData():'';
    this.errorTag ? this.errorTag.clearData():'';
  }
}
