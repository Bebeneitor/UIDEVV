import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { CvpService } from './services/cvp.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { SameSimService } from 'src/app/services/same-sim.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';

@Component({
  selector: 'app-cvp-template',
  templateUrl: './cvp-template.component.html',
  styleUrls: ['./cvp-template.component.css']
})
export class CvpTemplateComponent implements OnInit {

  blocked: boolean = false;

  cvp: any = {
    moduleName: '',
    productCode: null,
    ruleName: '',
    ruleDescription: '',
    ruleCategory: '',
    ruleCategoryEffectiveDate: null,
    ruleCategoryDeleteDate: null,
    ruleCategoryInactivationDate: null,
    editText: '',
    claimType: null,
    professionalProviderType: null,
    facilityProviderType: null,
    recodeUnits: [],
    gender: '',
    age: '',
    editAction: '',
    recodeUnit: '',
    percentageReduction: '',
    sources: [],
    editFlag: '',
    placeOfService: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    billTypes: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    revenueCodes: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    conditionCodes: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    specialities: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    diagnoses: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    logicExceptions: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    procedureCodes: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    denyAction: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    modifiers: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    },
    cvRule: {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    }
  };

  @ViewChild('placeOfService') placeOfService: FileUploaderComponent;
  @ViewChild('billTypes') billTypes: FileUploaderComponent;
  @ViewChild('revenueCodes') revenueCodes: FileUploaderComponent;
  @ViewChild('conditionCodes') conditionCodes: FileUploaderComponent;
  @ViewChild('specialities') specialities: FileUploaderComponent;
  @ViewChild('diagnoses') diagnoses: FileUploaderComponent;
  @ViewChild('logicExceptions') logicExceptions: FileUploaderComponent;
  @ViewChild('procedureCodes') procedureCodes: FileUploaderComponent;
  @ViewChild('denyAction') denyAction: FileUploaderComponent;
  @ViewChild('modifiers') modifiers: FileUploaderComponent;
  @ViewChild('cvRule') cvRule: FileUploaderComponent;

  displayDetail: boolean = false;
  copyText: string = '';

  providerTypes: any[] = [
    { name: 'Rendering', code: 'Rendering' },
    { name: 'Billing', code: 'Billing' },
    { name: 'Cross', code: 'Cross' }
  ];

  providerFacilityTypes: any[] = [
    { name: 'Billing', code: 'Billing' },
    { name: 'Cross', code: 'Cross' }
  ];

  claimTypes: any[] = [
    { name: 'Select claim type', code: null },
    { name: 'Facility', code: 'F' },
    { name: 'Professional', code: 'P' },
    { name: 'Professional and Facility', code: 'FP' }
  ];

  productCodes: any[] = [
    { name: 'Select product code', code: null },
    { name: '01', code: '01' },
    { name: '02', code: '02' },
    { name: '03', code: '03' }
  ];

  cvpIngestionId: number = 0;

  readOnly: boolean = true;

  moduleNames: any = [];

  deletedFiles: number[] = [];

  validationErrors: any = {
    moduleName: false,
    productCode: false,
    ruleName: false,
    ruleCategory: false,
    ruleCategoryEffectiveDate: false,
    editText: false,
    claimType: false,
    professionalProviderType: false,
    facilityProviderType: false,
    recodeUnits: false,
    editAction: false,
    logicExceptions: false,
    procedureCodes: false,
    denyAction: false,
    modifiers: false,
    sources: false
  };

  @ViewChild('moduleName') moduleName;

  //Event to display text from focused input
  @HostListener('document:keydown.control.e', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();

    if (this.copyText != '') {
      this.displayDetail = true;
    }
  }

  yearValidRange = `${Constants.MIN_VALID_YEAR}:${Constants.MAX_VALID_YEAR}`;
  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  
  constructor(private toastService: ToastMessageService, private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService, private cvpService: CvpService,
    private sameSimService: SameSimService, private router: Router,
    private permissions: NgxPermissionsService, private fileManagerService: FileManagerService) {

    this.route.params.subscribe(params => {
      this.cvpIngestionId = params['cvpIngestionId'] ? params['cvpIngestionId'] : 0;
    });
  }

  ngOnInit() {
    this.initializeScreen();
  }

  initializeScreen() {

    if (this.permissions.getPermission('ROLE_CCA') != undefined ||
      this.permissions.getPermission('ROLE_EA') != undefined ||
      this.permissions.getPermission('ROLE_MD') != undefined ||
      this.permissions.getPermission('ROLE_CVPA') != undefined ||
      this.permissions.getPermission('ROLE_PO') != undefined) {
      this.readOnly = false;
    } else {
      this.readOnly = true;
    }

    this.loadModuleNames().then(() => {

      this.deletedFiles = [];

      this.validationErrors = {
        moduleName: false,
        productCode: false,
        ruleName: false,
        ruleCategory: false,
        ruleCategoryEffectiveDate: false,
        editText: false,
        claimType: false,
        professionalProviderType: false,
        facilityProviderType: false,
        recodeUnits: false,
        editAction: false,
        logicExceptions: false,
        procedureCodes: false,
        denyAction: false,
        modifiers: false,
        sources: false
      }

      if (this.cvpIngestionId > 0) {
        this.loadRuleData();
      } else {
        this.addSource();
        this.addSource();
        this.addSource();
      }
    });
  }

  loadModuleNames() {
    return new Promise(resolve => {
      this.cvpService.loadUIData().subscribe((response: BaseResponse) => {
        this.moduleNames = [];
        response.data.cvpModuleNames.forEach(item => {
          this.moduleNames.push({label: item.moduleName, value: item.moduleName});
        });
        resolve();
      });
    });
  }

  /**
   * Load data from backend about rule
   */
  loadRuleData() {

    this.blocked = true;

    this.cvpService.getTemplate(this.cvpIngestionId).subscribe((response: BaseResponse) => {
      //Load info in components

      //Parse dates
      response.data.cvpTemplateDetails.ruleCategoryEffectiveDate = this.parseDate(response.data.cvpTemplateDetails.ruleCategoryEffectiveDate);
      response.data.cvpTemplateDetails.ruleCategoryDeleteDate = this.parseDate(response.data.cvpTemplateDetails.ruleCategoryDeleteDate);
      response.data.cvpTemplateDetails.ruleCategoryInactivationDate = this.parseDate(response.data.cvpTemplateDetails.ruleCategoryInactivationDate);

      this.cvp = response.data.cvpTemplateDetails;

      this.setFileComponentData('placeOfService');
      this.setFileComponentData('billTypes');
      this.setFileComponentData('revenueCodes');
      this.setFileComponentData('conditionCodes');
      this.setFileComponentData('specialities');
      this.setFileComponentData('diagnoses');
      this.setFileComponentData('logicExceptions');
      this.setFileComponentData('procedureCodes');
      this.setFileComponentData('denyAction');
      this.setFileComponentData('modifiers');
      this.setFileComponentData('cvRule');

      this.blocked = false;
    });
  }

  /**
   * Set retrieved data to file upload component in order
   * to display information and file
   * @param jsonKey 
   */
  setFileComponentData(jsonKey: string) {
    this[jsonKey].flag = this.cvp[jsonKey].selected;
    this[jsonKey].inputText = this.cvp[jsonKey].text;
    this[jsonKey].selectedFile.name = this.cvp[jsonKey].fileName;
    this[jsonKey].fileId = this.cvp[jsonKey].fileId;
  }

  /**
   * Parse local date to manage and display correctly
   * @param date 
   */
  parseDate(date) {
    if (date != null) {
      let arrDate = date.split("T");

      let newDate = arrDate[0] + "T00:00:00";

      return new Date(newDate);
    } else {
      return null;
    }
  }

  /**
   * Fill cvp file and upload in backend
   * @param jsonKey 
   * @param component 
   */
  manageFileComponent(jsonKey: string, component: FileUploaderComponent) {
    return new Promise(resolve => {
      this.uploadFile(component).then((fileId: number) => {
        this.cvp[jsonKey] = {
          fileId: fileId,
          fileName: component.selectedFile.name,
          text: component.inputText,
          selected: component.flag
        };

        resolve();
      });
    });
  }

  /**
   * Execute service to upload a file
   * @param component 
   */
  uploadFile(component: FileUploaderComponent) {
    return new Promise(resolve => {
      if (component.selectedFile.size != undefined) {
        //Upload file and retrieve fileId from backend
        this.sameSimService.uploadXLSX(component.selectedFile).subscribe((response: BaseResponse) => {
          resolve(response.data);
        });
      } else {
        resolve(component.fileId);
      }
    });
  }

  /**
   * Assigne text to variable in order to copy to clipboard
   * @param event 
   */
  setTextToCopy(event) {
    this.copyText = event.srcElement.value;
  }

  /**
   * Add row in references section
   */
  addSource() {
    this.cvp.sources.push({
      'code': '',
      'description': '',
      'security': ''
    })
  }

  /**
   * Remove row in references section
   * @param index 
   */
  removeSource(index) {
    this.cvp.sources.splice(index, 1);
  }

  /**
   * Copy to clipboard selected text
   */
  copyMessage() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.copyText;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Text copied to clipboard!');
  }

  /**
   * Create a new template (Empty fields)
   */
  newTemplate() {

    this.confirmationDialogService.confirm('New Template', 'Are you sure you want to delete and create a new template?  All non-saved changes will be lost.')
      .then((confirmed) => {
        if (confirmed) {
          window.scroll(0, 0);

          this.resetFiles().then(response => {
            this.router.navigate(['/rule-ingestion/cvp-template/']);
            this.initializeScreen();
          });

        }
      });
  }

  /**
   * Reset file components
   */
  resetFiles() {
    return new Promise(resolve => {
      this.placeOfService.reset();
      this.billTypes.reset();
      this.revenueCodes.reset();
      this.conditionCodes.reset();
      this.specialities.reset();
      this.diagnoses.reset();
      this.logicExceptions.reset();
      this.procedureCodes.reset();
      this.denyAction.reset();
      this.modifiers.reset();
      this.cvRule.reset();

      resolve();
    });
  }

  isValidField(field) {
    return field != null && field != undefined && field != '';
  }

  isValidForm() {
    return new Promise(resolve => {

      let isValid = true;

      //Disable errors
      this.validationErrors = {
        moduleName: false,
        productCode: false,
        ruleName: false,
        ruleCategory: false,
        ruleCategoryEffectiveDate: false,
        editText: false,
        claimType: false,
        professionalProviderType: false,
        facilityProviderType: false,
        recodeUnits: false,
        editAction: false,
        logicExceptions: false,
        procedureCodes: false,
        denyAction: false,
        modifiers: false,
        sources: false
      }

      if (!this.isValidField(this.cvp.moduleName)) {
        this.validationErrors.moduleName = true;
        this.moduleName.focusViewChild.nativeElement.focus();
        this.moduleName.focusViewChild.nativeElement.select();
        isValid = false;
      }

      if (!this.isValidField(this.cvp.productCode)) {
        this.validationErrors.productCode = true;
        isValid = false;
      }

      if (!this.isValidField(this.cvp.ruleName)) {
        this.validationErrors.ruleName = true;
        isValid = false;
      }

      if (!this.isValidField(this.cvp.ruleCategory)) {
        this.validationErrors.ruleCategory = true;
        isValid = false;
      }

      if (!this.isValidField(this.cvp.ruleCategoryEffectiveDate)) {
        this.validationErrors.ruleCategoryEffectiveDate = true;
        isValid = false;
      }

      if (!this.isValidField(this.cvp.editText)) {
        this.validationErrors.editText = true;
        isValid = false;
      }

      if (!this.isValidField(this.cvp.claimType)) {
        this.validationErrors.claimType = true;
        isValid = false;
      } else {
        if (this.cvp.claimType.code == 'P' || this.cvp.claimType.code == 'FP') {
          if (!this.isValidField(this.cvp.professionalProviderType) || this.cvp.professionalProviderType.length == 0) {
            this.validationErrors.professionalProviderType = true;
            isValid = false;
          }
        }

        if (this.cvp.claimType.code == 'F' || this.cvp.claimType.code == 'FP') {
          if (!this.isValidField(this.cvp.facilityProviderType) || this.cvp.facilityProviderType.length == 0) {
            this.validationErrors.facilityProviderType = true;
            isValid = false;
          }
        }
      }

      if (!this.isValidField(this.cvp.recodeUnits) || this.cvp.recodeUnits.length == 0) {
        this.validationErrors.recodeUnits = true;
        isValid = false;
      }

      if (!this.isValidField(this.cvp.editAction)) {
        this.validationErrors.editAction = true;
        isValid = false;
      }

      this.logicExceptions.errorLabel = false;
      if(this.logicExceptions.flag == 1) {
        if (this.logicExceptions.inputText == '') {
          this.logicExceptions.errorLabel = true;
          isValid = false;
        }
      }

      this.procedureCodes.errorLabel = false;
      if(this.procedureCodes.flag == 1) {
        if (this.procedureCodes.inputText == '' && this.procedureCodes.selectedFile.name == '') {
          this.procedureCodes.errorLabel = true;
          isValid = false;
        }
      }

      this.denyAction.errorLabel = false;
      if(this.denyAction.flag == 1) {
        if (this.denyAction.inputText == '' && this.denyAction.selectedFile.name == '') {
          this.denyAction.errorLabel = true;
          isValid = false;
        }
      }      

      this.modifiers.errorLabel = false;
      if (this.modifiers.inputText == '' && this.modifiers.selectedFile.name == '') {
        this.modifiers.errorLabel = true;
        isValid = false;
      }

      let errorSources = false;

      this.cvp.sources.forEach(item => {
        if (item.code == '' || item.description == '' || item.security == '') {
          isValid = false;
          if (!errorSources) {
            this.validationErrors.sources = true;
            errorSources = true;
          }
        }
      });

      if (!isValid) {
        //show message with empty fields
        window.scroll(0, 0);
        this.toastService.messageWarning('Empty field', 'Some fields are empty, please check them after save this template.');
      }

      resolve(isValid);
    });
  }

  /**
   * Save or update template in backend
   */
  saveTemplate(close: boolean = false) {

    this.isValidForm().then(valid => {
      if (valid) {
        this.blocked = true;

        //Save template and fill fields about file upload component
        Promise.all([
          this.manageFileComponent('placeOfService', this.placeOfService),
          this.manageFileComponent('billTypes', this.billTypes),
          this.manageFileComponent('revenueCodes', this.revenueCodes),
          this.manageFileComponent('conditionCodes', this.conditionCodes),
          this.manageFileComponent('specialities', this.specialities),
          this.manageFileComponent('diagnoses', this.diagnoses),
          this.manageFileComponent('logicExceptions', this.logicExceptions),
          this.manageFileComponent('procedureCodes', this.procedureCodes),
          this.manageFileComponent('denyAction', this.denyAction),
          this.manageFileComponent('modifiers', this.modifiers),
          this.manageFileComponent('cvRule', this.cvRule),
        ]).then(files => {
          window.scroll(0, 0);

          this.deleteFiles().then(() => {
            this.cvpService.saveTemplate(this.cvpIngestionId, this.cvp).subscribe((response: BaseResponse) => {
              this.cvpIngestionId = response.data.cvpIngestionId;
              this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Rule has been successfully saved.');
              this.blocked = false;

              if (close) {
                this.router.navigate(['/rule-ingestion/ingested-rules'], { queryParams: { tab: Constants.CVP_INGESTION_TAB } });
              } else {
                this.resetFiles().then(response => {
                  this.router.navigate(['/rule-ingestion/cvp-template/', this.cvpIngestionId]);
                  this.initializeScreen();
                });
              }

            });
          });
        });
      }
    })
  }

  deleteFiles() {
    return new Promise(resolve => {
      if (this.deletedFiles.length > 0) {
        this.fileManagerService.removeFiles(this.deletedFiles).subscribe(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  deleteFile(event, item) {

    this.cvp[item] = {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    };

    this.deletedFiles.push(event.fileId);
  }

}
