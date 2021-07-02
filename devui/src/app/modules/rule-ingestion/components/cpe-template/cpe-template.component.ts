import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { MenuItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { forkJoin, of, Subscription, zip } from 'rxjs';
import { delay, flatMap, map } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { FileUploaderComponent } from 'src/app/shared/components/file-uploader/file-uploader.component';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { FileUploaderOptions } from 'src/app/shared/models/file-uploader-options.model';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { CpeService } from './services/cpe.service';

@Component({
  selector: 'app-cpe-template',
  templateUrl: './cpe-template.component.html',
  styleUrls: ['./cpe-template.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CpeTemplateComponent implements OnInit, OnDestroy {
  @ViewChild('moduleName',{static: false}) moduleName;
  @ViewChild('businessImpAnalysis',{static: false}) businessImpAnalysis: FileUploaderComponent;
  @ViewChild('otherLimitation',{static: false}) otherLimitation: FileUploaderComponent;
  @ViewChild('clinicalExamplePlainlyState',{static: false}) clinicalExamplePlainlyState: FileUploaderComponent;
  @ViewChild('clinicalExampleExceptionToRule',{static: false}) clinicalExampleExceptionToRule: FileUploaderComponent;
  @ViewChild('procedureDiagOtherCodes',{static: false}) procedureDiagOtherCodes: FileUploaderComponent;
  @ViewChild('newOrExistingTableContent',{static: false}) newOrExistingTableContent: FileUploaderComponent;
  @ViewChild('testCasesNotesFiles',{static: false}) testCasesNotesFiles: FileUploaderComponent;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  blocked: boolean = false;

  setFilesValueSubscription: Subscription;
  fileUpladerOptions = new FileUploaderOptions();

  cpe: any;
  deletedFiles: number[] = [];
  moduleNames: any = [];
  copyText: string = '';
  items: MenuItem[];
  activeIndex: number = 0;
  firstFormGroup: FormGroup;
  cpeIngestionId: number = 0;
  readOnly: boolean = true;
  filesObs = [];

  validationErrors = {
    editDescription: false,
    editName: false,
    editDescriptionProduct: false,
    clientEOBMessage: false,
    editType: false,
    product: false,
    status: false,
    requireSuggestedCode: false,
    requireSuggestedUnits: false,
    requireHistoryLine: false,
    requireSuggestedPaid: false,
    historyInterval: false,
    allowSwitch: false,
    needsEditExplanation: false,
    reverseFlag: false,
    reductionFlag: false,
    allowExceed: false,
    messageFlag: false,
    userSpecCond: false,
    reporting: false,
    useNewEditSetting: false
  };
  testCasesNotesFilesSaved: any[];
  fileObsTestCases: any[] = [];

  constructor(private toastService: ToastMessageService, private route: ActivatedRoute, public cpeService: CpeService,
    private router: Router, private confirmationDialogService: ConfirmationDialogService,
    private permissions: NgxPermissionsService, private fileManagerService: FileManagerService) {
    this.route.params.subscribe(params => {
      this.cpeIngestionId = params['cpeIngestionId'] ? +params['cpeIngestionId'] : 0;
    });
    this.fileUpladerOptions.allowExtensions = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword';
    this.fileUpladerOptions.multipleFiles = true;
    this.fileUpladerOptions.uploadFiles = true;
    this.fileUpladerOptions.confirmOnDeleteMultipleFile = true;
  }

  /**
   * Sets the steps elements and if is edit the selected cpe template.
   */
  ngOnInit() {
    this.cpe = this.cpeService.getDefaultCpeJson();

    this.initializeDropdowns();

    this.initializeScreen();
    if (this.cpeIngestionId <= 0) {
      this.initializeCpeJson();
    }

    this.items = [
      {
        label: ' ',
        command: (event: any) => {
          this.activeIndex = 0;
          this.storeDataFile();
        }
      },
      {
        label: ' ',
        command: (event: any) => {
          this.activeIndex = 1;
          this.storeDataFile();
        }
      },
      {
        label: ' ',
        command: (event: any) => {
          this.activeIndex = 2;
          this.storeDataFile();
        }
      }
    ];
  }

  initializeDropdowns() {
    this.cpeService.getCPEIngestionCatalog().subscribe((response: BaseResponse) =>{
      if(response.data){
        this.cpeService.product = [this.cpeService.product[0], ...response.data.CPE_INGESTION_CAT_PRODUCT];
        this.cpeService.businessCase = [this.cpeService.businessCase[0], ...response.data.CPE_INGESTION_CAT_BS_CODE];
        this.cpeService.formTypes = [...response.data.CPE_INGESTION_CAT_FM_TPS];
        this.cpeService.providerScope = [this.cpeService.providerScope[0], ...response.data.CPE_INGESTION_CAT_PRD_SCP];
        this.cpeService.batchScope = [this.cpeService.batchScope[0], ...response.data.CPE_INGESTION_CAT_BCH_SCP];
        this.cpeService.lineFilterCriteria = [this.cpeService.lineFilterCriteria[0], ...response.data.CPE_INGESTION_CAT_LN_CTR];
        this.cpeService.specialityScope = [this.cpeService.specialityScope[0], ...response.data.CPE_INGESTION_CAT_SP_SCP];
        this.cpeService.sourceValue = [this.cpeService.sourceValue[0], ...response.data.CPE_INGESTION_CAT_SRC_VAL];
        this.cpeService.nucleousEditingSetting = [this.cpeService.nucleousEditingSetting[0], ...response.data.CPE_INGESTION_CAT_NES];
        this.cpeService.nucleousEditingSettingFlagAutoReviewStatus = [...response.data.CPE_INGESTION_CAT_NES_FAR];
      }
    });
  }

  /**
   * Sets the file content for the controls.
   */
  loadDataFiles() {
    this.setFileComponentData('businessImpAnalysis');
    this.setFileComponentData('otherLimitation');
    this.setFileComponentData('clinicalExamplePlainlyState');
    this.setFileComponentData('clinicalExampleExceptionToRule');
    this.setFileComponentData('procedureDiagOtherCodes');
    this.setFileComponentData('newOrExistingTableContent');
    this.setFileComponentData('testCasesNotesFiles');
  }

  /**
   * Sets the json file property every time the file changes.
   * @param file the selected element.
   * @param jsonKey the selected component.
   */
  onFileChange(file, jsonKey) {
    if (file && file['lastModified']) {
      const component = this[jsonKey] as FileUploaderComponent;
      component.fileId = 0;
      this.cpe[jsonKey] = {
        fileId: 0,
        fileName: component.selectedFile.name,
        text: component.inputText,
        selected: component.flag,
        selectedFile: component.selectedFile
      };
    }
  }

  /**
  * Stores the data file if the file is selected, the reason is that when the step changes, 
  * the File uploader component gets destroyed.
  */
  storeDataFile() {
    if (this.businessImpAnalysis && this.businessImpAnalysis.selectedFile && this.businessImpAnalysis.selectedFile.name !== '') {
      this.backupFileData('businessImpAnalysis', this.businessImpAnalysis);
    }

    if (this.otherLimitation && this.otherLimitation.selectedFile && this.otherLimitation.selectedFile.name !== '') {
      this.backupFileData('otherLimitation', this.otherLimitation);
    }

    if (this.clinicalExamplePlainlyState && this.clinicalExamplePlainlyState.selectedFile && this.clinicalExamplePlainlyState.selectedFile.name !== '') {
      this.backupFileData('clinicalExamplePlainlyState', this.clinicalExamplePlainlyState);
    }

    if (this.clinicalExampleExceptionToRule && this.clinicalExampleExceptionToRule.selectedFile && this.clinicalExampleExceptionToRule.selectedFile.name !== '') {
      this.backupFileData('clinicalExampleExceptionToRule', this.clinicalExampleExceptionToRule);
    }

    if (this.procedureDiagOtherCodes && this.procedureDiagOtherCodes.selectedFile && this.procedureDiagOtherCodes.selectedFile.name !== '') {
      this.backupFileData('procedureDiagOtherCodes', this.procedureDiagOtherCodes);
    }

    if (this.newOrExistingTableContent && this.newOrExistingTableContent.selectedFile && this.newOrExistingTableContent.selectedFile.name !== '') {
      this.backupFileData('newOrExistingTableContent', this.newOrExistingTableContent);
    }

    if (this.testCasesNotesFiles && this.testCasesNotesFiles.addedFiles && this.testCasesNotesFiles.addedFiles.length > 0) {
      this.backupTestCasesFiles();
    }

    this.setFilesValueSubscription = of(true).pipe(delay(250)).subscribe(() => this.loadDataFiles());
  }

  backupTestCasesFiles() {
    this.testCasesNotesFilesSaved = this.testCasesNotesFiles.addedFiles;
  }

  /**
   * Initialize the flag11 which eneble a slave component
   * depending the selected option of dropdown
   * @param dropdown 
   */
  disabledSpecialityScope(dropdown: Dropdown) {
    if (dropdown.value.code === 'S')
      this.cpe.specialityScope.selected.code = 'S';
    else
      this.cpe.specialityScope.selected.code = 'A';
  }

  /**
   * Initialize the code which eneble a slave component
   * depending the selected option of dropdown
   * @param dropdown 
   */
  disabledNucleousEditing(dropdown: Dropdown) {
    if (dropdown.value.code === 'S')
      this.cpe.nucleousEditSettingManageClients.selected.code = 'S';
    else
      this.cpe.nucleousEditSettingManageClients.selected.code = 'A';
  }

  /**
   * Validates if the fiel is not empty, undefined or null
   * @param field 
   */
  isValidField(field) {
    return field != null && field != undefined && field != '';
  }

  /**
   * Validates if a mandatory field is filled or not
   */
  isValidForm() {
    let isValid = true;
    this.validationErrors = {
      editDescription: false,
      editName: false,
      editDescriptionProduct: false,
      clientEOBMessage: false,
      editType: false,
      product: false,
      status: false,
      requireSuggestedCode: false,
      requireSuggestedUnits: false,
      requireHistoryLine: false,
      requireSuggestedPaid: false,
      historyInterval: false,
      allowSwitch: false,
      needsEditExplanation: false,
      reverseFlag: false,
      reductionFlag: false,
      allowExceed: false,
      messageFlag: false,
      userSpecCond: false,
      reporting: false,
      useNewEditSetting: false
    };

    for (const key in this.cpe) {
      if (Object.prototype.hasOwnProperty.call(this.cpe, key)) {
        if (key === 'editDescription' || key === 'editName' || key === 'editDescriptionProduct'
          || key === 'clientEOBMessage') {
          if (!this.isValidField(this.cpe[key])) {
            this.validationErrors[key] = true;
            isValid = false;
          }
        }
      }
    }

    if (!isValid) {
      this.showErrorFieldsMessage();
    }

    return isValid;
  }

  /**
   * Creates the message for the error validation.
   */
  showErrorFieldsMessage() {
    window.scroll(0, 0);
    let errorMessage = `field`;
    let errorKeys = Object.keys(this.validationErrors).filter(element => this.validationErrors[element] === true);

    errorKeys = errorKeys.map(key =>
      key === 'editDescription' ? 'Short Description' : key === 'editName' ? 'Edit Name' : key === 'editDescriptionProduct' ? 'Edit Description Product' : key === 'clientEOBMessage' ?
        'Client EOB Message' : ''
    );

    if (errorKeys.length > 1) {
      errorMessage += 's';
    }
    errorMessage = `The ${errorMessage} ${errorKeys.join(', ')} cannot be empty.`;

    this.toastService.messageWarning('Empty field', errorMessage);
  }

  /**
   * Checks if file has been selected, other wise throws an error message.
   * @param component to be evaluated
   */
  isFileSelected(component: FileUploaderComponent) {
    let isValid = true;

    if (component != undefined) {
      if (+component.flag === 1) {
        if (!this.isValidField(component.selectedFile.name)) {
          isValid = false;
        }
      }
    }

    if (!isValid) {
      window.scroll(0, 0);
      this.toastService.messageWarning('Empty file selected', 'Some of the files are selected as Yes but file is not uploaded.');
    }

    return isValid;
  }

  /**
   * Assigne text to variable in order to copy to clipboard
   * @param event 
   */
  setTextToCopy(event, fileControl) {
    const fileUploader = this[fileControl] as FileUploaderComponent;
    fileUploader.inputText = event.srcElement.value;
    this.backupFileData(fileControl, fileUploader);
    this.copyText = event.srcElement.value;
  }

  /**
   * Fill cpe file and upload in backend
   * @param jsonKey 
   * @param component manageFileComponent
   */
  backupFileData(jsonKey: string, component: FileUploaderComponent) {
    if (component != undefined) {
      this.cpe[jsonKey] = {
        fileId: component.fileId,
        fileName: component.selectedFile.name,
        text: component.inputText,
        selected: component.flag,
        selectedFile: component.selectedFile
      };
    }
  }

  /**
   * Fill cpe file and upload in backend
   * @param jsonKey 
   * @param component 
   */
  manageFileComponent(jsonKey: string) {
    if (jsonKey !== 'testCasesNotesFiles') {
      const file = this.cpe[jsonKey].selectedFile;
      const alreadyAddedFile = this.filesObs.findIndex(file => file.key === jsonKey);

      if (file && file['lastModified']) {
        if (alreadyAddedFile >= 0) {
          const file = { ...this.filesObs[alreadyAddedFile] };
          this.filesObs[alreadyAddedFile] = file;
        } else {
          this.filesObs.push({ observable: this.fileManagerService.uploadFile(file), key: jsonKey });
        }
      } else {
        const component = this[jsonKey] as FileUploaderComponent;
        if (component) {
          if (component.selectedFile['lastModified']) {
            this.filesObs.push({ observable: this.fileManagerService.uploadFile(file), key: jsonKey });
          }
        }
      }
    } else {
      if (this.testCasesNotesFilesSaved && this.testCasesNotesFilesSaved.length > 0 && !this.testCasesNotesFiles) {
        this.testCasesNotesFilesSaved.filter(file => !file.fileId).forEach(file => {
          this.fileObsTestCases.push({ observable: this.fileManagerService.uploadFile(file), key: jsonKey, name: file.name });
        })
      } else if (this.testCasesNotesFiles && this.testCasesNotesFiles.addedFiles && this.testCasesNotesFiles.addedFiles.length > 0) {
        this.testCasesNotesFiles.addedFiles.filter(file => !file.fileId).forEach(file => {
          this.fileObsTestCases.push({ observable: this.fileManagerService.uploadFile(file), key: jsonKey, name: file.name });
        })
      }
    }
  }

  createFileRequestObservable(obs: any[], obsName: string) {
    return zip(...obs).pipe(map(testCasesResponse => testCasesResponse.sort((a: any, b: any) => (a.data > b.data) ? 1 : -1)), map(response => {
      response.forEach((element: any, index) => {
        let fileElement = this[obsName][index];
        if (obsName === 'filesObs') {
          this.cpe[fileElement.key].fileId = element.data;
        } else {
          this.cpe[fileElement.key].push({ name: fileElement.name, fileId: element.data });
        }
      });
    }));


  }

  getFlatMapForSaveTemplate = () => this.cpeService.saveTemplate(this.cpeIngestionId, this.cpe);

  /**
   * Save or update template in backend
   */
  saveTemplate(close: boolean = false) {
    if (this.isValidForm()) {

      if (this.isFileSelected(this.businessImpAnalysis) && this.isFileSelected(this.otherLimitation) && this.isFileSelected(this.clinicalExamplePlainlyState)
        && this.isFileSelected(this.clinicalExampleExceptionToRule) && this.isFileSelected(this.procedureDiagOtherCodes) && this.isFileSelected(this.newOrExistingTableContent)) {

        this.blocked = true;
        this.manageFileComponent('businessImpAnalysis');
        this.manageFileComponent('otherLimitation');
        this.manageFileComponent('clinicalExamplePlainlyState');
        this.manageFileComponent('clinicalExampleExceptionToRule');
        this.manageFileComponent('procedureDiagOtherCodes');
        this.manageFileComponent('newOrExistingTableContent');
        this.manageFileComponent('testCasesNotesFiles');

        const obs = [];
        const obsTestCases = [];
        this.filesObs.forEach(ele => {
          obs.push(ele.observable);
        });

        this.fileObsTestCases.forEach(ele => {
          obsTestCases.push(ele.observable);
        });

        let saveTemplateObservable;
        // if the user saves notes files and the other files.
        if (obs.length > 0 && obsTestCases.length > 0) {
          const normalFilesObs = this.createFileRequestObservable(obs, 'filesObs');
          const testCasesFilesObs = this.createFileRequestObservable(obsTestCases, 'fileObsTestCases');

          saveTemplateObservable = forkJoin(normalFilesObs, testCasesFilesObs).pipe(flatMap(this.getFlatMapForSaveTemplate));
        }
        // if the user only selects normal files.
        else if (obs.length > 0 && obsTestCases.length <= 0) {
          saveTemplateObservable = this.createFileRequestObservable(obs, 'filesObs').pipe(flatMap(this.getFlatMapForSaveTemplate));
        }
        // if the user only selects the notes files.
        else if (obsTestCases.length > 0 && obs.length <= 0) {
          saveTemplateObservable = this.createFileRequestObservable(obsTestCases, 'fileObsTestCases').pipe(flatMap(this.getFlatMapForSaveTemplate));
        }
        // if user does not select any file at all.
        else {
          saveTemplateObservable = this.cpeService.saveTemplate(this.cpeIngestionId, this.cpe);
        }

        // Remove all unneeded properties.
        for (const key in this.cpe) {
          if (Object.prototype.hasOwnProperty.call(this.cpe, key)) {
            if (key === 'businessImpAnalysis' || key === 'otherLimitation' || key === 'clinicalExamplePlainlyState' || key === 'clinicalExampleExceptionToRule' || key === 'procedureDiagOtherCodes' || key === 'newOrExistingTableContent') {
              delete this.cpe[key].selectedFile;
            } else if (key === 'nucleousEditSettingManageFlagAuto') {
              if (this.cpe.nucleousEditSettingManageFlagAuto && this.cpe.nucleousEditSettingManageFlagAuto.length > 0) {
                this.cpe[key].selectedFile;
              }
            }
          }
        }

        saveTemplateObservable.subscribe((response: any) => {
          this.cpeIngestionId = response.data;
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Edit created successfully.');
          this.blocked = false;
          window.scroll(0, 0);
          if (close) {
            this.router.navigate(['/rule-ingestion/ingested-rules'], { queryParams: { tab: Constants.CPE_INGESTION_TAB } });
          } else {
            this.router.navigate(['/rule-ingestion/cpe-template/', +this.cpeIngestionId]);
            this.ngOnInit();
          }
        });
      }
    }
  }

  /**
   * Removes the file from the cpe template in case there is a match.
   * @param fileToRemove selected file from the list.
   */
  onRemoveMultipleFile(fileToRemove) {
    let cpeFile;
    if (fileToRemove.fileId) {
      cpeFile = this.cpe.testCasesNotesFiles.findIndex(file => file.name === fileToRemove.name && file.fileId === fileToRemove.fileId);
    } else {
      cpeFile = this.cpe.testCasesNotesFiles.findIndex(file => file.name === fileToRemove.name);
    }

    if (cpeFile > -1) {
      this.cpe.testCasesNotesFiles.splice(cpeFile, 1);
    }
  }

  /**
   * Initialize the Jason file elements of selected file  
   * uploader component and include it at deleted file
   * array.
   * @param event 
   * @param item 
   */
  deleteFile(event, item) {
    this.cpe[item] = {
      fileId: 0,
      fileName: '',
      text: '',
      selected: 0
    };

    this.deletedFiles.push(event.fileId);
  }

  /**
   * Initialize the screen elements as default, the
   * mandatory fields, the file uploaders and the 
   * component staring values
   */
  initializeScreen() {
    if (this.permissions.getPermission('ROLE_CCA') != undefined ||
      this.permissions.getPermission('ROLE_EA') != undefined ||
      this.permissions.getPermission('ROLE_MD') != undefined ||
      this.permissions.getPermission('ROLE_CPEA') != undefined ||
      this.permissions.getPermission('ROLE_PO') != undefined) {
      this.readOnly = false;
    } else {
      this.readOnly = true;
    }

    this.deletedFiles = [];
    this.filesObs = [];
    this.fileObsTestCases = [];

    this.validationErrors = {
      editDescription: false,
      editName: false,
      editDescriptionProduct: false,
      clientEOBMessage: false,
      editType: false,
      product: false,
      status: false,
      requireSuggestedCode: false,
      requireSuggestedUnits: false,
      requireHistoryLine: false,
      requireSuggestedPaid: false,
      historyInterval: false,
      allowSwitch: false,
      needsEditExplanation: false,
      reverseFlag: false,
      reductionFlag: false,
      allowExceed: false,
      messageFlag: false,
      userSpecCond: false,
      reporting: false,
      useNewEditSetting: false
    };

    if (this.cpeIngestionId > 0) {
      this.loadRuleData();
    }
  }

  /**
   * Inizialize the values of the Json
   * to the starting values
   */
  initializeCpeJson() {
    this.cpe.versionNumber = '';
    this.cpe.editDescription = '';
    this.cpe.editName = '';
    this.cpe.productCode = null;
    this.cpe.editDescriptionProduct = '';
    this.cpe.desciptionRequest = '0';
    this.cpe.clinicalRationale = '';
    this.cpe.clientEOBMessage = '';
    this.cpe.storyIds = '';
    this.cpe.businessCase = null;

    this.cpe.businessImpAnalysis.fileId = 0;
    this.cpe.businessImpAnalysis.fileName = '';
    this.cpe.businessImpAnalysis.text = '';
    this.cpe.businessImpAnalysis.selected = 0;

    this.cpe.dateRquest = null;
    this.cpe.clinicalAdvGroupRevDate = null;
    this.cpe.formTypes = [];
    this.cpe.providerScope = null;
    this.cpe.batchScope = null;
    this.cpe.productLineFilterCriteria = null;

    this.cpe.specialityScope.speciality = '';
    this.cpe.specialityScope.selected = {};
    this.cpe.specialityScope.selected.name = '';
    this.cpe.specialityScope.selected.code = '';

    this.cpe.otherLimitation.fileId = 0;
    this.cpe.otherLimitation.fileName = '';
    this.cpe.otherLimitation.text = '';
    this.cpe.otherLimitation.selected = 0;

    this.cpe.diagnosesCpe = '0';

    this.cpe.clinicalExamplePlainlyState.fileId = 0;
    this.cpe.clinicalExamplePlainlyState.fileName = '';
    this.cpe.clinicalExamplePlainlyState.text = '';
    this.cpe.clinicalExamplePlainlyState.selected = 0;

    this.cpe.clinicalExampleExceptionToRule.fileId = 0;
    this.cpe.clinicalExampleExceptionToRule.fileName = '';
    this.cpe.clinicalExampleExceptionToRule.text = '';
    this.cpe.clinicalExampleExceptionToRule.selected = 0;

    this.cpe.procedureDiagOtherCodes.fileId = 0;
    this.cpe.procedureDiagOtherCodes.fileName = '';
    this.cpe.procedureDiagOtherCodes.text = '';
    this.cpe.procedureDiagOtherCodes.selected = 0;

    this.cpe.procedureCodesTypes = [];
    this.cpe.testCasesNotes = '';
    this.cpe.testCasesNotesFiles = [];
    this.cpe.sources = '';
    this.cpe.sourceValue = null;
    this.cpe.newSourceValue = '0';
    this.cpe.newSourceValueDescription = '';
    this.cpe.viewableRepository = '0';
    this.cpe.nucleousEditSettingManageOptions = 'R';
    this.cpe.nucleousEditSettingManageClients.editingSetting = '';
    this.cpe.nucleousEditSettingManageClients.selected = {};
    this.cpe.nucleousEditSettingManageClients.selected.code = '';
    this.cpe.nucleousEditSettingManageClients.selected.name = '';
    this.cpe.nucleousEditSettingManageFlagAuto = [];
    this.cpe.ancillarySettingName = '';
    this.cpe.ancillarySettingOptions = '';
    this.cpe.otherAndFallback = '';
    this.cpe.willChangeBeMade = '0';
    this.cpe.willNewTableBeRequired = '0';
    this.cpe.newOrExistingTableName = '';

    this.cpe.newOrExistingTableContent.fileId = 0;
    this.cpe.newOrExistingTableContent.fileName = '';
    this.cpe.newOrExistingTableContent.text = '';
    this.cpe.newOrExistingTableContent.selected = 0;

    this.cpe.instrtuctionForAnalysisReview = '';
    this.cpe.instrtuctionForClinicalServices = '';

    this.cpe.effectiveAndTermDates.termDates = null;
    this.cpe.effectiveAndTermDates.selected = '0';

    this.cpe.flagLines = '0';
    this.cpe.flagTrigger = '0';
    this.cpe.DosScopes = 'NA';
    this.cpe.effectSaiving = '0';
    this.cpe.savingCalculatedFrom = 'AP';
    this.cpe.revReductionSwitch = 'NA';
    this.cpe.mantisId = '';
    this.cpe.editOrder = '';
    this.cpe.editType = 'M';
    this.cpe.product = 'FCI';
    this.cpe.categoryId = '';
    this.cpe.status = '0';
    this.cpe.requireSuggestedCode = '0';
    this.cpe.requireSuggestedUnits = '0';
    this.cpe.requireHistoryLine = '0';
    this.cpe.requireSuggestedPaid = '0';
    this.cpe.historyInterval = 'S';
    this.cpe.allowSwitch = '0';
    this.cpe.needsEditExplanation = '0';
    this.cpe.reverseFlag = '0';
    this.cpe.reductionFlag = '0';
    this.cpe.allowExceed = '0';
    this.cpe.requireMessageFlag = '0';
    this.cpe.reverseEditSwitchFlag = '';
    this.cpe.reverseReductionSwitchPerc = '';
    this.cpe.userSpecCond = '0';
    this.cpe.reporting = '0';
    this.cpe.useNewEditSetting = '0';
  }

  /**
   * Load data from backend about rule
   */
  loadRuleData() {
    this.blocked = true;
    this.cpeService.getTemplate(this.cpeIngestionId).subscribe((response: BaseResponse) => {      //Parse dates
      response.data.cpeTemplateDetails.dateRquest = this.cpeService.parseDate(response.data.cpeTemplateDetails.dateRquest);
      response.data.cpeTemplateDetails.clinicalAdvGroupRevDate = this.cpeService.parseDate(response.data.cpeTemplateDetails.clinicalAdvGroupRevDate);
      response.data.cpeTemplateDetails.effectiveAndTermDates.termDates = this.cpeService.parseDate(response.data.cpeTemplateDetails.effectiveAndTermDates.termDates);
      this.cpe = response.data.cpeTemplateDetails;

      this.loadDataFiles();

      this.blocked = false;
    });
  }

  /**
   * Set retrieved data to file upload component in order
   * to display information and file
   * @param jsonKey 
   */
  setFileComponentData(jsonKey: string) {
    const fileUploaderComponent = this[jsonKey] as FileUploaderComponent;
    const fileElement = this.cpe[jsonKey];

    if (fileUploaderComponent != undefined && jsonKey !== 'testCasesNotesFiles') {

      if (fileElement.selected === '0')
        fileUploaderComponent.flag = 0;
      else if (fileElement.selected === '1')
        fileUploaderComponent.flag = 1;
      else
        fileUploaderComponent.flag = fileElement.selected;

      fileUploaderComponent.inputText = fileElement.text;
      fileUploaderComponent.selectedFile = (fileElement.selectedFile && fileElement.selectedFile['lastModified']) ? <File>fileElement.selectedFile : { name: fileElement.fileName };
      fileUploaderComponent.fileId = fileElement.fileId;
    } else {
      if (this[jsonKey]) {
        if (fileElement.length > 0 && !this.testCasesNotesFilesSaved) {
          this.testCasesNotesFiles.addedFiles = fileElement;
        } else {
          this.testCasesNotesFiles.addedFiles = this.testCasesNotesFilesSaved;
        }
      }
    }
  }

  /**
   * Create a new template (Empty fields)
   */
  newTemplate() {
    this.confirmationDialogService.confirm('New Template', 'Are you sure you want to delete and create a new template?  All non-saved changes will be lost.')
      .then((confirmed) => {
        if (confirmed) {
          window.scroll(0, 0);
          this.router.navigate(['/rule-ingestion/cpe-template/']);
          this.ngOnInit();
        }
      });
  }

  /**
   * When the component is destroyed we remove the subscription.
   */
  ngOnDestroy(): void {
    if (this.setFilesValueSubscription) {
      this.setFilesValueSubscription.unsubscribe();
    }
  }
}

