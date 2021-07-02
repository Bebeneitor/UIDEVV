import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-cvp-uploads',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  //Primary module creation for Client Rule Requirements
  type: string = 'NEW';
  newModuleName: string = '';
  fileLoaded = null;
  modules: any[] = [];
  selectedModule: any = null;
  overwrite: boolean = true;

  //Sub-module creation for Client Rule Requirements
  typeSubmodule: string = 'NEW';
  newSubModuleName: string = '';
  fileLoadedSubModule = null;
  subModules: any[] = [];
  overwriteSubmodule: boolean = true;
  selectedSubModule: any = null;

  //Ancillary information extra data
  tabs: any;
  selectedSection: any = null;
  categories: any[] = [];
  selectedCategory: any = null;
  subCategories: any[] = [];
  activeIndex: number = 0;

  subModuleList: any[] = [];

  currentUser: any;
  validRollToUnlock : boolean;

  @Input('cvpModuleInstance') cvpModuleInstance: any;
  @Input('parentPage') parentPage: string;
  @Input('tabName') tabName: string;
  @Input('sectionCode') sectionCode: string;
  @Output() onCancel = new EventEmitter();

  constructor(private convergencePointService: ConvergencePointService,
    private toastService: ToastMessageService,  
    private storageService: StorageService) { }

  ngOnInit() {
    this.loadModules();

    if (this.parentPage == Constants.ANCILLARY_INFORMATION_SCREEN) {
      this.loadCategories();
    }

    this.currentUser = this.storageService.get(Constants.USER_SESSION_KEY, true);
    this.validRollToUnlock = this.currentUser.roles.some(i => 
      (i.roleName === Constants.CVP_EDITOR_ROLE_NAME  || 
       i.roleName === Constants.CVP_APPROVER_ROLE_NAME)) ;
  }

  loadCategories() {
    this.categories = [];

    this.convergencePointService.getTabs(Constants.ANCILLARY_INFORMATION_SCREEN).subscribe(response => {
      this.tabs = JSON.parse(JSON.stringify(response));

      this.tabs.forEach(item => {
        this.categories.push({
          'label': item.tab,
          'value': item.tab
        });
      });

    });
  }

  loadSubCategories() {
    return new Promise(resolve => {
      //this.selectedModule = null;

      this.subCategories = [];
      this.selectedSection = null;

      this.tabs.forEach(item => {
        if (item.tab === this.selectedCategory) {
          item.radioButtons.forEach(radio => {
            this.subCategories.push({
              'label': radio.name,
              'value': radio.key
            });
          });
        }
      });

      resolve();
    });
  }

  //Primary module
  loadModules(tableObject = null) {

    let sectionCode = this.sectionCode;

    if (this.parentPage == Constants.ANCILLARY_INFORMATION_SCREEN && this.selectedSection != null) {
      sectionCode = this.selectedSection;
    }

    this.modules = [];
    this.convergencePointService.getModules(sectionCode, false, tableObject)
    .subscribe((response: BaseResponse) => {
      response.data.dtoList.forEach(item => {
        this.modules.push({
          'value': item,
          'label': item.cvpModule.moduleName
        });
      });
    });
  }

  loadFile(event) {
    this.fileLoaded = event;

    if (this.type == 'NEW' && event != null) {
      this.newModuleName = event.name.substring(0, event.name.lastIndexOf('.'));
    }
  }

  changeRadio() {

    this.newModuleName = '';
    this.selectedModule = null;

    if (this.type == 'EXISTS') {
      this.populateExistingData();
    }
  }

  parseModuleById(id: number, returnObject: boolean = false) {
    let name = '';
    let object = null;

    if (id == null) {
      return name;
    }

    this.modules.forEach(item => {
      if (item.value.cvpModuleInstanceId == id) {
        name = item.label;
        object = item;
      }
    });

    return returnObject ? object.value : name;
  }

  getModuleName() {
    if (this.type == 'NEW') {
      return this.newModuleName;
    } else {
      return this.selectedModule != null ? this.parseModuleById(this.selectedModule.cvpModuleInstanceId) : null;
    }
  }

  upload() {

    let moduleName = '';
    let overwrite = this.overwrite;

    if (this.type == 'NEW') {
      moduleName = this.newModuleName;
    } else {
      moduleName = this.parseModuleById(this.selectedModule.cvpModuleInstanceId);
      overwrite = true;
    }

    let sectionCode = this.sectionCode;
    let type = 'Primary requirement';

    if (this.parentPage == Constants.ANCILLARY_INFORMATION_SCREEN) {
      sectionCode = this.selectedSection;
      type = 'Section';
    }

    this.convergencePointService.saveModule(this.fileLoaded, moduleName, sectionCode, overwrite).subscribe((response: BaseResponse) => {
      if (response) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, type + ' was uploaded successfully.');
        this.cancel(true);
      }
    });
  }

  disableUpload() {

    let disable = false;

    if (this.type == 'NEW') {
      if (this.newModuleName.trim().length == 0) {
        disable = true;
      }
    }

    if (this.type == 'EXISTS') {
      if (this.selectedModule == null || !this.isUnLockedToLoggerUser(this.selectedModule)) {
        disable = true;
      }

      if (!this.overwrite) {
        disable = true;
      }
    }

    if (this.fileLoaded != null) {
      if (this.fileLoaded.name.substring(0, this.fileLoaded.name.lastIndexOf('.')) != this.getModuleName()) {
        disable = true;
      }
    }

    return this.fileLoaded == null || disable;
  }

  checkExistingName() {

    let exists = false;
    let name = this.newModuleName;

    if (this.type == 'EXISTS') {
      return false;
    }

    this.modules.forEach(item => {
      if (item.label == name) {
        exists = true;
      }
    });

    return exists;
  }

  checkDifferenceName() {

    if (this.fileLoaded == null) {
      return true;

    }
    return this.fileLoaded.name.substring(0, this.fileLoaded.name.lastIndexOf('.')) != this.getModuleName()
  }
  //Finish primary module

  //Submodule
  loadFileSubModule(event) {
    this.fileLoadedSubModule = event;

    if (this.typeSubmodule == 'NEW' && event != null) {
      this.newSubModuleName = event.name.substring(0, event.name.lastIndexOf('.'));
    }
  }

  changeRadioSubmodule() {

    this.newSubModuleName = '';
    this.selectedSubModule = null;

    if (this.typeSubmodule == 'EXISTS') {
      this.populateExistingData();
    }
  }

  parseSubModuleById(id: number, returnObject: boolean = false) {
    let name = '';
    let object = null;

    if (id == null) {
      return name;
    }

    this.subModules.forEach(item => {
      if (item.value.cvpModuleInstanceId == id) {
        name = item.label;
        object = item;
      }
    });

    return returnObject ? object.value : name;
  }

  getSubModuleName() {
    if (this.typeSubmodule == 'NEW') {
      return this.newSubModuleName;
    } else {
      return this.parseSubModuleById(this.selectedSubModule.cvpModuleInstanceId);
    }
  }

  uploadSubModule(independent: boolean) {

    let overwrite = this.overwriteSubmodule;
    let moduleName = '';

    if (this.typeSubmodule == 'NEW') {
      moduleName = this.newSubModuleName;
    } else {
      overwrite = true;
      moduleName = this.parseSubModuleById(this.selectedSubModule.cvpModuleInstanceId);
    }

    let subModType = 'Section';
    let sectionCode = null;

    if (!independent) {
      subModType = 'Attachment'
    } else {
      sectionCode = this.selectedSection;
    }

    this.convergencePointService.saveSubModule(this.selectedModule.cvpModuleInstanceId, this.fileLoadedSubModule, moduleName, independent, overwrite, sectionCode).subscribe((response: BaseResponse) => {
      if (response) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, subModType + ' was uploaded successfully.');
        this.cancel(true);
      }
    });
  }

  disableUploadSubmodule() {

    let disable = false;

    if (this.typeSubmodule == 'NEW') {
      if (this.newSubModuleName.trim().length == 0) {
        disable = true;
      }
    }

    if (this.typeSubmodule == 'EXISTS') {
      if (this.selectedSubModule == null || !this.isUnLockedToLoggerUser(this.selectedSubModule)) {
        disable = true;
      }
    }

    if (this.selectedModule == null) {
      disable = true;
    }

    if (this.fileLoadedSubModule != null) {
      if (this.fileLoadedSubModule.name.substring(0, this.fileLoadedSubModule.name.lastIndexOf('.')) != this.getSubModuleName()) {
        disable = true;
      }
    }

    return this.fileLoadedSubModule == null || disable;
  }

  checkExistingNameSubModule() {

    let exists = false;
    let name = this.newSubModuleName;

    if (this.typeSubmodule == 'EXISTS') {
      return false;
    }

    this.subModules.forEach(item => {
      if (item.label == name) {
        exists = true;
      }
    });

    return exists;
  }

  checkDifferenceNameSubmodule() {

    //Commented temporally
    /*if(this.typeSubmodule == "EXISTS") {
      return false;
    }*/

    return this.fileLoadedSubModule.name.substring(0, this.fileLoadedSubModule.name.lastIndexOf('.')) != this.getSubModuleName()
  }
  //Finish submodule

  cancel(reload) {
    this.onCancel.emit(reload);
  }

  changeTab(event) {
    this.subModules = [];
    this.selectedSubModule = null;
    this.newSubModuleName = '';
    this.selectedModule = null;
    this.typeSubmodule = 'NEW';
    this.type = 'NEW';
    this.overwrite = false;
    this.overwriteSubmodule = false;
    this.fileLoaded = null;
    this.fileLoadedSubModule = null;

    this.activeIndex = event.index;

    if (this.activeIndex == 1) {
      this.loadCategories();
    } 
    if (this.activeIndex == 0) {
      this.loadModules();
    }else {
      // in this case, we require only approved Prim Requirements.
      let tableObject = {
        "filters": [
          {
            "columnName" : "approvalDescription",
            "value": Constants.APPROVED_STATUS  
          }
        ]
      }
      this.loadModules(tableObject);
    };
  }

  changeModuleFromSubmodule() {
    return new Promise((resolve) => {
      this.subModules = [];

      let independent = null;

      if(this.activeIndex == 1) {
        independent = true;
      } else if(this.activeIndex == 2) {
        independent = false;
      }

      this.convergencePointService.getSubModules(this.selectedModule.cvpModuleInstanceId, false, independent).subscribe((response: BaseResponse) => {

        this.subModuleList = response.data.dtoList;

        response.data.dtoList.forEach(item => {
          this.subModules.push({
            'value': item.childModule,
            'label': item.childModule.cvpModule.moduleName
          });
        });

        this.subModules = JSON.parse(JSON.stringify(this.subModules));
        resolve();
      });
    });
  }

  getCategoryNameByCode(code) {
    let name = '';
    this.tabs.forEach(item => {
      if (item.tabCode == code) {
        name = item.tab;
      }
    });
    return name;
  }

  populateExistingData() {
    if (this.cvpModuleInstance != null) {
      if (this.parentPage == Constants.CLINICAL_REQUIREMENTS_SCREEN) {
        switch (this.activeIndex) {
          case 0: //Primary requirements
            this.loadPrimaryRequirementTab();
            break;
          case 1: //Sections
            this.loadSectionTab();
            break;
          case 2: //Attachments
            this.loadAttachmentTab();
            break;
        }
      } else {
        //load ancillary page
        this.loadAncillaryTab();
      }
    }
  }

  loadPrimaryRequirementTab() {
    if (this.cvpModuleInstance.parent) {
      this.selectedModule = this.parseModuleById(this.cvpModuleInstance.instanceId, true);
    }
  }

  loadSectionTab() {
    if (!this.cvpModuleInstance.parent && this.cvpModuleInstance.independent) {
      this.selectedModule = this.parseModuleById(this.cvpModuleInstance.parentInstanceId, true);
      this.changeModuleFromSubmodule().then(() => {
        this.selectedSubModule = this.parseSubModuleById(this.cvpModuleInstance.instanceId, true);
      });

      this.selectedCategory = this.getCategoryNameByCode(this.cvpModuleInstance.category);

      this.loadSubCategories().then(() => {
        setTimeout(() => {
          this.selectedSection = this.cvpModuleInstance.subCategory;
        }, 100);
      });
    }
  }

  loadAttachmentTab() {
    if (!this.cvpModuleInstance.parent && !this.cvpModuleInstance.independent) {
      this.selectedModule = this.parseModuleById(this.cvpModuleInstance.parentInstanceId, true);
      this.changeModuleFromSubmodule().then(() => {
        this.selectedSubModule = this.parseSubModuleById(this.cvpModuleInstance.instanceId, true);
      });
    }
  }

  loadAncillaryTab() {
    this.selectedModule = this.parseModuleById(this.cvpModuleInstance.instanceId, true);
    this.selectedCategory = this.tabName;
    this.loadSubCategories().then(() => {
      setTimeout(() => {
        this.selectedSection = this.sectionCode;
      }, 100);
    });
  }

  /**
   * Method used to validate if a locked item is unlocked.
   * The item has the followings validations: Module locked, owner user, valid status and finally, valid roll. 
   * @param selectedSubModule
   */
  isUnLockedToLoggerUser({moduleLocked, cvpApprovalStatus}) {
    let unLocked : boolean = true;
    let ownerUser: boolean;
    let validStatus: boolean;

    if  (moduleLocked && moduleLocked != null){
      ownerUser = this.isTheOwnerUser(moduleLocked);
      validStatus= this.isValidStatus(cvpApprovalStatus);
      unLocked = ownerUser && validStatus && this.validRollToUnlock;
    }
    return unLocked;
  }

  private isTheOwnerUser(moduleLocked: any){
    return (moduleLocked.lockedBy.userId === this.currentUser.userId);
  }

  private isValidStatus(cvpApprovalStatus: any){
    let isValidStatus: boolean = false;
    if (cvpApprovalStatus && cvpApprovalStatus != null &&
       (cvpApprovalStatus.approvalDescription !== Constants.IN_DELETION_STATUS && 
        cvpApprovalStatus.approvalDescription !== Constants.DELETION_IN_REVIEW)) {
      isValidStatus = true;
    }
    return isValidStatus;
  }

  
}
