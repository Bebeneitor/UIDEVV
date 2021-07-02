import { Component, HostListener, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { flatMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { RuleEngineTemplateService } from 'src/app/services/rule-engine-template.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { PrintService } from 'src/app/services/print.service';
import * as xlsx from 'xlsx';

const DELTAS = 'Deltas';
const CODES_DELTAS = 'Codes Deltas';
const FILE_NAME = 'ChangeRMR_Code_Deltas';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-icms-template-change',
  templateUrl: './icms-template-change.component.html'
})
export class IcmsTemplateChangeComponent implements OnInit {

  headerText = 'Confirmation';
  @ViewChild('pridControl',{static: true}) pridControl: ElementRef;
  createProjectForm: FormGroup;

  requiredFields = [
    { name: 'PRID', isValid: false },
    { name: 'Description', isValid: false }
  ];

  templateForm: FormGroup;
  writtenBy: any[] = [];
  ruleInfo;
  sendTemplateInProgress = false;
  blockDocument = true;
  blockButtonClass = 'btn btn-primary';
  statusAlignment = { 'text-align': 'right' };
  icmsVersionMinAllowedValue = 3;
  icmsVersionMaxAllowedValue = 98720;

  projectCreationModal;
  lotusNotesUrl;
  arrayMessage = [];
  Message: string;
  saveDisplay = false;
  prid: string;
  pridDetails: any;
  isSubmit = false;

  subRuleKey;
  prm;
  description;
  porpuse;
  loggedUser;
  templateStatus: string;
  formSubmitted = false;
  loadingText: string = '';

  tableConfig: EclTableModel;
  procedureCodesTableConfig: EclTableModel;
  hcpcsCptTables: any = {
    addedConfig: {data:[]},
    deletedConfig: {data:[]},
    changedConfig: {data:[]}
  }
  icdTables: any = {
    addedConfig: {data:[]},
    deletedConfig: {data:[]},
    changedConfig: {data:[]}
  }

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  
  constructor(private ruleEngineTemplateService: RuleEngineTemplateService, private util: AppUtils, public config: DynamicDialogConfig,
    public ref: DynamicDialogRef, private fb: FormBuilder, private sanitization: DomSanitizer, private messageService: MessageService, private utilsService: UtilsService,
    private authService: AuthService, private toast: ToastMessageService, private printService: PrintService) { }

  /**
   * We check every resize screen so we can change the button class.
   * @param event with window iformation.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 992) {
      this.blockButtonClass = 'btn btn-primary btn-sm btn-block';
      this.statusAlignment = { 'text-align': 'left' };
    } else {
      this.blockButtonClass = 'btn btn-primary';
      this.statusAlignment = { 'text-align': 'right' };
    }
  }

  /**
   * Get user list and creates the template form.
   */
  ngOnInit() {
    this.subRuleKey = this.config.data.subVersion;
    this.prm = this.config.data.prm;
    this.description = this.config.data.ruleInfo.ruleName;
    this.porpuse = this.config.data.ruleInfo.reasonsForDev;
    this.loggedUser = this.authService.getLoggedUser();

    this.templateForm = this.fb.group({
      prid: new FormControl(null, [Validators.required, Validators.pattern('[A-Za-z0-9--]{0,200}')]),
      versionNumber: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      dueDate: new FormControl(null, [Validators.required]),
      purpose: new FormControl(null, [Validators.required]),
      writtenBy: new FormControl(null, [Validators.required]),
    });

    if (window.innerWidth <= 992) {
      this.blockButtonClass = 'btn btn-primary btn-sm btn-block';
    }

    this.ruleInfo = this.config.data.ruleInfo;

    // We get all users so we can fill the form with the current data.
    this.utilsService.getAllUsers().pipe(map(usersList => {
      return usersList.map(user => {
        return { label: user['firstName'], value: user['userId'] }
      })
    }), flatMap((users: any) => {
      this.writtenBy = users;

      return this.ruleEngineTemplateService.getICMSTemplate(this.ruleInfo.ruleId,
        Constants.RMR_TEMPLATE_IS_NOT_SUBMITTED, Constants.RMR_CHANGE_TYPE);
    })).subscribe((response: BaseResponse) => {
      this.blockDocument = false;
      this.templateForm.patchValue({
          prid: response.data ? response.data.icmsTemplateDetails.prid : this.prm,
          versionNumber: response.data ? response.data.icmsTemplateDetails.versionNumber : this.subRuleKey,
          description: response.data ? response.data.icmsTemplateDetails.description : this.description,
          dueDate: response.data ? new Date(response.data.icmsTemplateDetails.dueDate) : null,
          purpose: response.data ? response.data.icmsTemplateDetails.purpose : this.porpuse,
          writtenBy: response.data ? response.data.icmsTemplateDetails.writtenBy : this.loggedUser.userId
      });
      this.templateStatus = (response.data && response.data.icmsTemplateDetails) ? response.data.icmsTemplateDetails.templateStatus : 'New';
      if(response.data) this.formSubmitted = response.data.submitted;
      if(this.formSubmitted) this.templateForm.disable();
      
      if(response.data && response.data.icmsTemplateDetails && response.data.icmsTemplateDetails.pridDetails != undefined)
        this.lotusNotesUrl = this.sanitization.bypassSecurityTrustUrl(response.data.icmsTemplateDetails.pridDetails.url);
    });

    this.templateStatus = this.templateStatus || this.templateStatus === '' ? 'New' : this.templateStatus;
    let manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();

    manager.addTextColumn('columnName', 'Field', null, false, EclColumn.TEXT, false);
    manager.addTextColumn('oldValue', 'Old Value', null, false, EclColumn.TEXT, false);
    manager.addTextColumn('delta', 'New Value', null, false, EclColumn.TEXT, false);

    this.tableConfig.columns = manager.getColumns();
    this.tableConfig.sort = false;
    this.tableConfig.export = false;
    this.tableConfig.filterGlobal = false;
    this.tableConfig.showPaginatorOptions = false;
    this.tableConfig.showPaginator = false;
    this.tableConfig.scrollable = false;

    const deltasWithoutCodes: any[] = this.config.data.deltas.filter(delta => {
      return (delta.columnName !== 'Procedure Codes' && delta.columnName !== 'Opportunity Value');
    });
    
    if (deltasWithoutCodes.length > 0) {
      const ruleLogicOriginal = deltasWithoutCodes.find(element => element.columnName === 'Rule Logic Original');
      if (ruleLogicOriginal) {
        ruleLogicOriginal.columnName = 'Rule Logic';
      }
    }

    if (deltasWithoutCodes.length > 0) {
      const elementsOnJson = ['Provider Type', 'Included Place of Service','Speciality','Included Speciality','Included Subspeciality'];
      
      elementsOnJson.forEach(currentNode => {
        this.orderElement(deltasWithoutCodes, currentNode );
      });
      
    }
    this.tableConfig.data = deltasWithoutCodes ? deltasWithoutCodes : [];

    manager = new EclTableColumnManager();
    this.procedureCodesTableConfig = new EclTableModel();

    manager.addTextColumn('category', 'Category', null, false, EclColumn.TEXT, false);
    manager.addTextColumn('codes', 'Codes', null, false, EclColumn.TEXT, false);
    manager.addTextColumn('status', 'Status', null, false, EclColumn.TEXT, false);

    this.procedureCodesTableConfig.columns = manager.getColumns();
    this.procedureCodesTableConfig.sort = false;
    this.procedureCodesTableConfig.export = false;
    this.procedureCodesTableConfig.filterGlobal = false;
    this.procedureCodesTableConfig.showPaginatorOptions = false;
    this.procedureCodesTableConfig.showPaginator = false;
    this.procedureCodesTableConfig.scrollable = false;

    const codesElement = this.config.data.deltas.find(delta => {
      return delta.columnName === 'Procedure Codes';
    });
    this.procedureCodesTableConfig.data = (codesElement && codesElement.newValue) ? JSON.parse(codesElement.newValue) : [];

    this.createHcpcsCptDeltaTables();
    this.createIcdDeltaTables();

    // Create the prid project form.
    this.createProjectForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      summary: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });

  }

  orderElement(deltasWithoutCodes: any[], currentNode: string){
    const node = deltasWithoutCodes.find(element => element.columnName === currentNode);
    const nodeNew = node;
    if (node) {
      const indexToRemove = deltasWithoutCodes.indexOf(node);
      deltasWithoutCodes.splice(indexToRemove,1);
      deltasWithoutCodes.push(nodeNew);
    }
  }

  orderDeltasToSend(filteredDeltas: any[], currentNode: string){
    const node = filteredDeltas.find(element => element.columnName === currentNode);
    const nodeNew = node;
    if (node) {
      const indexToRemove = filteredDeltas.indexOf(node);
      filteredDeltas.splice(indexToRemove,1);
      filteredDeltas.push(nodeNew);
    }
  }

  /**
   * Returns the Abstract control by name.
   * @param controlName that we want to get
   */
  getControl(controlName: string) {
    return this.templateForm.get(controlName);
  }

  public showPridCreationForm() {
    this.projectCreationModal = true;
    setTimeout(() => {
      this.arrayMessage = [];
      this.arrayMessage = Object.assign([], [{ severity: 'info', summary: 'Info', detail: 'This will create a Stub Project Request in Lotus Notes, along to a PRID.  Please note that for using this PRID to create RMR, the Project request should be fully processed and Submitted in Lotus Notes.' }]);
    }, 1000);


  }

  /**
   * Creates the project prid and populates the prid field.
   */
  submitProjectCreation() {
    if (this.createProjectForm.invalid) {
      return;
    }

    const body = {
      createdBy: this.creationName.value,
      summary: this.creationSummary.value,
      description: this.creationDescription.value
    };

    this.ruleEngineTemplateService.submitProjectCreation(body).subscribe(response => {
      if (response && response.code === 200) {

        this.getControl('prid').setValue(response.data.prid);
        this.pridDetails = response.data;

        this.checkIsValid(response.data.prid, 'PRID');
        this.lotusNotesUrl = this.sanitization.bypassSecurityTrustUrl(response.data.url);
        this.projectCreationModal = false;
        this.Message = 'PRID Creation successful';
      } else {
        this.Message = response.message;
      }
      this.createProjectForm.reset();
      this.headerText = 'Information';
      this.saveDisplay = true;
    }, error => {
      this.createProjectForm.reset();
    });
  }

  saveDialog() {
    this.saveDisplay = false;
    if (this.isSubmit) {
      this.ref.close();
    }
  }

  /**
   * Checks if the changed value is valid or not.
   * @param event that fires the value
   * @param field that we want to evaluate.
   */
  checkIsValid(event, field) {
    let element = this.requiredFields.find(el => el.name === field);
    if (typeof event === 'string' || event instanceof String) {
      if (event && event.length > 0) {
        element.isValid = true;
      } else {
        element.isValid = false;
      }
    } else if (event && typeof event === 'object' && event.constructor === Object) {
      if (event) {
        element.isValid = true;
      } else {
        element.isValid = false;
      }
    } else {
      if (event.length > 0) {
        element.isValid = true;
      } else {
        element.isValid = false;
      }
    }
  }


  /**
   * Process the icms template to the backend.
   * @param target if save then we call save service else submit service.
   */
  processIcmsTemplate(target: string) {
    if (this.templateForm.invalid) {
      return;
    }

    this.blockDocument = true;
    this.sendTemplateInProgress = true;
    let processIcmsTemplate$;

    // Filter the procedure codes from deltas.
    const filteredDeltas = this.config.data.deltas.filter(element => {
      return element.columnName !== 'Procedure Codes'
    });

    if (filteredDeltas.length > 0) {
      const elementsOnJson = ['Provider Type', 'Included Place of Service','Speciality','Included Speciality','Included Subspeciality'];
      
      elementsOnJson.forEach(currentNode => {
        this.orderDeltasToSend(filteredDeltas, currentNode );
      });
      
    }

    // Find procedure codes in deltas.
    const procedureCodes = this.config.data.deltas.find(delta => {
      return delta.columnName === 'Procedure Codes';
    });

    // Transform procedureCodes string into array.
    let arrayCodes;
    if (procedureCodes && procedureCodes.newValue) {
      arrayCodes = JSON.parse(procedureCodes.newValue);
    }

    // Fortmat the procedure codes into a string.
    const procedureCodesFormatted = arrayCodes ? arrayCodes.map(element => {
      return `${[element.category]}: ${element.codes}, ${element.status}`;
    }).join(' | ') : '';

    // Format the deltas into a string.
    let deltas = filteredDeltas ? filteredDeltas.map(element => {
      return `${[element.columnName]}: ${element.newValue}`;
    }).join(' | ') : '';

    // Concat the deltas with the procedure codes if there are procedure codes.
    if (procedureCodesFormatted.length > 0) {
      deltas += ` | ${procedureCodesFormatted} |`;
    }

    const requestObject = {
      icmsTemplateDetails: {
        ...this.templateForm.value,
        instructions: deltas,
        templateStatus: 'Saved',
        pridDetails: this.pridDetails,
      },
      ruleCode: this.ruleInfo.ruleCode,
      ruleId: this.ruleInfo.ruleId,
      rmrTypeCode: Constants.RMR_CHANGE_TYPE,
      submitted: false,
    }

    if (target === 'save') {
      processIcmsTemplate$ = this.ruleEngineTemplateService.saveIcmsRules(requestObject);
    } else {
      requestObject.submitted = true;
      requestObject.icmsTemplateDetails.templateStatus = 'Sent to Lotus Notes';
      processIcmsTemplate$ = this.ruleEngineTemplateService.submitIcmsRules(requestObject);
    }

    processIcmsTemplate$.subscribe((response: BaseResponse) => {
      this.blockDocument = false;
      this.sendTemplateInProgress = false;
      if (response.data) {
        let message = (response.message && response.message.length > 0) ? response.message : 'ICMS change successfully processed.'
        this.messageService.add({ severity: Constants.TOAST_SEVERITY_SUCCESS, summary: Constants.TOAST_SUMMARY_SUCCESS, detail: message, life: Constants.TOAST_DEFAULT_LIFE_TIME, closable: Constants.TOAST_CLOSABLE });

        if (requestObject.submitted === true) {
          this.ref.close();
        }
        this.templateStatus = 'Saved';
      }
    }, (error) => {
      this.blockDocument = false;
      this.sendTemplateInProgress = false;
      if (requestObject.submitted === true) {
        this.ref.close();
      }
    });
  }
  exportToExcel() {
    const deltas = this.tableConfig.data.map(element => {
      return {
        field: element.columnName,
        oldValue: element.oldValue,
        newValue: element.newValue
      }
    });
    let ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(deltas);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, DELTAS);
    ws = xlsx.utils.json_to_sheet(this.procedureCodesTableConfig.data);
    xlsx.utils.book_append_sheet(wb, ws, CODES_DELTAS);
    xlsx.writeFile(wb, FILE_NAME + EXCEL_EXTENSION);
  }

  get creationName() { return this.createProjectForm.get('name'); }
  get creationSummary() { return this.createProjectForm.get('summary'); }
  get creationDescription() { return this.createProjectForm.get('description'); }

  createHcpcsCptDeltaTables() {
    if (!this.config.data.hcpcsCptDelta) {
      return;
    }    
    let manager = new EclTableColumnManager();    
    let defaultConfig = new EclTableModel();
    let alignment = 'center';

    manager.addTextColumn('codeFrom'   ,'HCPCS/CPT From'  ,'8%',  false, EclColumn.TEXT, true, 0, alignment, null, null);
    manager.addTextColumn('codeTo'     ,'HCPCS/CPT To'    ,'8%',  false, EclColumn.TEXT, true, 0, alignment, null, null);
    manager.addOverlayPanelTextColumn('modifiers'  ,'Modifier'        ,'8%',  false, EclColumn.TEXT, true, 0, alignment, null, true);
    manager.addTextColumn('daysLo'          ,'Days Lo'         ,'5%',false, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('daysHi'          ,'Days Hi'         ,'5%',false, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('dateFrom','Date From','8%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('dateTo','Date To','8%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('category','Category','15%', false, EclColumn.TEXT, true, 0, alignment, null, null);
    manager.addOverlayPanelTextColumn('pos','POS','10%', false, EclColumn.TEXT, true, 0, alignment, null, true);
    manager.addTextColumn('revCodeFrom','Revenue Code From' ,'5%',false, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('revCodeTo','Revenue Code To','5%',false, EclColumn.TEXT, true, 0, alignment);

    manager.addMultiCheckIconIndictorColumn('bwDeny', 'B/W Deny', '5%', false, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);
    manager.addMultiCheckIconIndictorColumn('override', 'Override', '5%', false, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);
    manager.addMultiCheckIconIndictorColumn('icd', 'ICD', '5%', false, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);

    defaultConfig.columns = manager.getColumns();
    defaultConfig.sort = false;
    defaultConfig.export = false;
    defaultConfig.filterGlobal = false;
    defaultConfig.showPaginatorOptions = false;
    defaultConfig.showPaginator = false;
    defaultConfig.scrollable = false;

    this.hcpcsCptTables.addedConfig = Object.assign({}, defaultConfig);
    this.hcpcsCptTables.addedConfig.data = Object.assign([], this.config.data.hcpcsCptDelta.added);

    this.hcpcsCptTables.deletedConfig = Object.assign({}, defaultConfig);
    this.hcpcsCptTables.deletedConfig.data = Object.assign([], this.config.data.hcpcsCptDelta.deleted);

    this.hcpcsCptTables.changedConfig = Object.assign({}, defaultConfig);
    this.hcpcsCptTables.changedConfig.data = Object.assign([], this.config.data.hcpcsCptDelta.changed);
  }

  createIcdDeltaTables() {
    if (!this.config.data.icdDelta) {
      return;
    }    
    let manager = new EclTableColumnManager();    
    let defaultConfig = new EclTableModel();
    let alignment = 'center';

    manager.addTextColumn("codeFrom", 'ICD From', '12%', false, EclColumn.TEXT, true, 0, 'left', null, null);
    manager.addTextColumn('codeTo', 'ICD To', '12%', false, EclColumn.TEXT, true, 0, 'left', null, null);
    manager.addTextColumn('dateFrom','Date From','15%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('dateTo','Date To','15%', true, EclColumn.TEXT, true, 0, alignment);
    manager.addTextColumn('category', 'Category', '15%', false, EclColumn.TEXT, true);
    manager.addTextColumn('primSecInd', 'Primary / Secondary', '10%', false, EclColumn.TEXT, true);
    manager.addMultiCheckIconIndictorColumn('override', 'Override', '10%', false, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);
    manager.addMultiCheckIconIndictorColumn('claimHeaderLevel', 'Claim Header Level', '10%', false, EclColumn.CHECK_MULTI_ICON_IND, true, 2, true);
    

    defaultConfig.columns = manager.getColumns();
    defaultConfig.sort = false;
    defaultConfig.export = false;
    defaultConfig.filterGlobal = false;
    defaultConfig.showPaginatorOptions = false;
    defaultConfig.showPaginator = false;
    defaultConfig.scrollable = false;

    this.icdTables.addedConfig = Object.assign({}, defaultConfig);
    this.icdTables.addedConfig.data = Object.assign([], this.config.data.icdDelta.added);

    this.icdTables.deletedConfig = Object.assign({}, defaultConfig);
    this.icdTables.deletedConfig.data = Object.assign([], this.config.data.icdDelta.deleted);

    this.icdTables.changedConfig = Object.assign({}, defaultConfig);
    this.icdTables.changedConfig.data = Object.assign([], this.config.data.icdDelta.changed);
  }

}
