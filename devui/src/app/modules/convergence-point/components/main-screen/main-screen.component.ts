import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { ActivatedRoute } from '@angular/router';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { OverlayPanel } from 'primeng/primeng';
import { NgxPermissionsService } from 'ngx-permissions';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as _ from 'underscore';
import {ConfirmationService} from 'primeng/api';

const CVP_REFERENCE_TAB = 'U-CR';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit, AfterViewInit {

  @ViewChild('tt',{static: true}) tt;
  @ViewChild('overlayApprovers',{static: true}) overlayApprovers;
  @ViewChild('overlayComments',{static: true}) overlayComments;
  @ViewChild('overlayCommentsAdd',{static: true}) overlayCommentsAdd;

  tabs: any[] = undefined;
  indexTab: number = 0;

  data: any[] = [];
  cols: any[] = [];
  filters: any[] = [];
  selectedItem: any = null;

  pageKey: string = '';
  pageTitle: string = '';

  displayDownload: boolean = false;
  displayUpload: boolean = false;
  displayTemplate: boolean = false;
  displayApprovers: boolean = false;
  displaySubmit: boolean = false;
  displayReview: boolean = false;
  displayUnlock: boolean = false;
  displayClone: boolean = false;
  displayDeletion: boolean = false;
  displayAssociate: boolean = false;
  displayExport: boolean = false;

  moduleInstanceIdApprovers: number = 0;
  loadedApprovers: any[] = [];

  lockedFiles: boolean = false;
  downloadSubmodules: any[] = [];

  DRAFT_STATUS = Constants.DRAFT_STATUS;
  IN_REVIEW_STATUS = Constants.IN_REVIEW_STATUS;
  RETURNED_STATUS = Constants.RETURNED_CVP_STATUS;
  IN_DELETION_STATUS = Constants.IN_DELETION_STATUS
  DELETION_IN_REVIEW = Constants.DELETION_IN_REVIEW;

  selectedOptionReview: string = 'approve';
  commentsReturn: string = '';
  commentsReturned: any = null;

  tempModule: any = null;

  sortingObject: any = [];

  selectedRadio: string;
  blockedDocument: boolean = false;
  totalRecords: number = 0;
  first: number = 0;
  datasource: any[] = [];
  lastLazyEvent: any = null;

  isCVPReferenceTab: boolean = false;

  displayComments: boolean = false;
  loadedComments: string[] = [];
  moduleIdComments: number = 0;
  commentToAdd: string = '';
  isCVPUser: boolean = false

  constructor(private convergencePointService: ConvergencePointService,
    private route: ActivatedRoute,
    private toastService: ToastMessageService,
    private permissions: NgxPermissionsService,
    private dashboarServices: DashboardService,
    private confirmationService: ConfirmationService) {
      this.filterByColumn = _.debounce(this.filterByColumn, 1000);
  }

  /**
   * MAIN FUNCTIONALITY
   */
  ngOnInit() {

    this.route.data.subscribe(params => {
      this.pageKey = params['key'];
      this.pageTitle = params['pageTitle'];
    });

    if (this.permissions.getPermission('ROLE_CVPA') != undefined || this.permissions.getPermission('ROLE_CVPAP') != undefined || this.permissions.getPermission('ROLE_CVPE') != undefined) {
      this.isCVPUser = false;
    } else {
      this.isCVPUser = true;
    }

  }

  ngAfterViewInit() {
    this.loadTabs().then(() => {
      this.loadData();
    });
  }

  initializeColumns() {

    this.cols = [
      { field: 'moduleList', header: this.isCVPReferenceTab ? 'References' : 'Module List', width: '35%', requestField: 'moduleName', entity: 'cvpModule' },
      { field: 'version', header: 'Version', width: '12%', requestField: 'moduleVersion', entity: 'root' },
      { field: 'status', header: 'Status', width: '13%', requestField: 'approvalDescription', entity: 'cvpApprovalStatus' },
      { field: 'updatedBy', header: 'Updated by', width: '14%', requestField: 'updatedBy', entity: 'updatedBy' },
      { field: 'lastUpdate', header: 'Last Update', width: '13%', requestField: 'updatedOn', entity: 'root' },
      { field: 'approver', header: this.isCVPReferenceTab ? 'Comments' : 'PO/CCA', width: '13%' }
    ];

    this.filters = [];

    this.cols.forEach(item => {
      if(item.field != 'approver') {
        this.filters[item.field] = {
          'columnName': item.requestField,
          'value': '',
          'entity': item.entity
        };
      }
    });
  }

  loadSubmodules(parentId: number) {
    return new Promise(resolve => {
      this.convergencePointService.getSubModules(parentId, this.lockedFiles, null).subscribe((response: BaseResponse) => {

        let childrens = [];
  
        response.data.dtoList.forEach(item => {
  
          let lastUpdate = '';
  
          if (item.childModule.updatedOn == null && item.childModule.creationDt == null) {
            lastUpdate = '-';
          } else {
            lastUpdate = this.dashboarServices.parseDate(new Date(item.childModule.updatedOn + ' 00:00:00')) || '-';
          }
          childrens.push({
            'data': {
              'id': item.childModule.cvpModule.cvpModuleId,
              'instanceId': item.childModule.cvpModuleInstanceId,
              'moduleList': item.childModule.cvpModule.moduleName,
              'version': item.childModule.moduleVersion,
              'status': item.childModule.cvpApprovalStatus.approvalDescription,
              'statusId': item.childModule.cvpApprovalStatus.cvpApprovalStatusId,
              'updatedBy': item.childModule.updatedBy.firstName != null ? item.childModule.updatedBy.firstName + ' ' + item.childModule.updatedBy.lastName : '-',
              'lastUpdate': lastUpdate,
              'eclFileId': item.childModule.eclFileId,
              'filePath': item.childModule.filePath,
              'approver': item.childModule.moduleInstanceUserList,
              'parent': false,
              'parentId': item.parentModule.cvpModule.cvpModuleId,
              'parentStatus': item.parentModule.cvpApprovalStatus.approvalDescription,
              'parentInstanceId': item.parentModule.cvpModuleInstanceId,
              'parentVersion': item.parentModule.moduleVersion,
              'parentVersions': item.parentModule.moduleVersions,
              'commentReturned': item.childModule.currentWorkflow != null && item.childModule.currentWorkflow != undefined ? {
                'user': item.childModule.currentWorkflow.updatedBy.firstName,
                'date': this.dashboarServices.parseDate(new Date(item.childModule.currentWorkflow.updatedOn + ' 00:00:00')),
                'text': item.childModule.currentWorkflow.comments
              } : null,
              'lockedObject': {
                'locked': item.childModule.moduleLocked != null,
                'submodulesLocked': 0,
                'lockedBy': item.childModule.moduleLocked != null ? item.childModule.moduleLocked.lockedBy.firstName : '',
                'cvpLockId': item.childModule.moduleLocked != null ? item.childModule.moduleLocked.cvpLockId : 0
              },
              'independent': item.childModule.cvpModule.independent,
              'category': item.childModule.cvpModule.cvpSection.parentSection != null ? item.childModule.cvpModule.cvpSection.parentSection.sectionCode : null,
              'subCategory': item.childModule.cvpModule.cvpSection.sectionCode
            }
          });
        });
  
        this.datasource.forEach((item) => {

          let foundInstance = false;

          if (item.data.instanceId == parentId) {
            item.children = childrens;
            foundInstance = true;
          }

          if(!foundInstance) {
            item.expanded = false;
          }
        });
  
        this.datasource = Object.assign([], this.datasource);

        this.setPagination();

        resolve();
      });
    });
  }

  loadTabs() {
    return new Promise((resolve) => {
      if (this.tabs != undefined) {
        resolve();
      } else {
        this.convergencePointService.getTabs(this.pageKey).subscribe(response => {
          this.tabs = response;
          resolve();
        });
      }
    });
  }

  getNameReport(selectedValue: string) {

    if (selectedValue == null) {
      return '';
    }

    let name: string = '';
    this.tabs.forEach(item => {
      item.radioButtons.forEach(itemRadio => {
        if (itemRadio.key == selectedValue) {
          name = itemRadio.name;
        }
      });
    });

    return name;
  }

  clickRadio(event) {
    this.tt.reset();

    this.tabs[this.indexTab].selectedValue = event;
    this.hideOverlayPanels();
    this.uncheckAll();
    this.loadData()
  }

  changeTab(event) {

    this.tt.reset();

    this.uncheckAll();
    this.indexTab = event.index;
    this.isCVPReferenceTab = (this.pageKey == Constants.ANCILLARY_INFORMATION_SCREEN && this.tabs[this.indexTab].tabCode.includes(CVP_REFERENCE_TAB));    
    this.selectedRadio = null;
    this.selectedItem = null;
    this.hideOverlayPanels();
    this.loadData();    
  }

  expandModule(event) {
    
    this.loadSubmodules(event.node.data.instanceId).then(() => {
      this.assignNode(event);
    });

    this.hideOverlayPanels();
  }

  hideOverlayPanels(event = null) {
    if(event != null) {
      this.assignNode(event);
    }
    this.overlayApprovers.hide();
    this.overlayComments.hide();
    this.overlayCommentsAdd.hide();
  }

  assignNode(event) {
    for(let i = 0; i < this.datasource.length; i++) {
      if(this.datasource[i].data.id == event.node.data.id) {
        this.datasource[i] = event.node;
        break;
      }
    }

    this.setPagination();
  }

  /**
  * FINISH MAIN FUNCTIONALITY
  */

  /**
  * DOWNLOAD SECTION
  */
  showDownload() {
    if (this.selectedItem == null) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please select a module to continue.');
      return;
    }

    this.downloadSubmodules = [];

    this.convergencePointService.getSubModules(this.selectedItem.data.instanceId, false, null).subscribe((response: BaseResponse) => {
      this.downloadSubmodules = response.data.dtoList;
      this.displayDownload = true;
    });
  }

  downloadFinished(refresh) {
    this.displayDownload = false;

    //For locked modules
    if (refresh) {
      this.loadData();
    }
  }
  /**
  * FINISH DOWNLOAD SECTION
  */

  /**
  * APPROVERS SECTION
  */
  getApproversText(approvers) {

    if (approvers == null || approvers == undefined) {
      return '';
    }

    let text = '';

    approvers.forEach(item => {
      text += item.firstName + ', ';
    });

    try {
      return text.substring(0, text.length - 2);
    } catch (e) {
      return '';
    }
  }

  getCommentsText(data) {

    if (data == null || data == undefined) {
      return '';
    }

    let text = '';
    
    if(data.comments.length > 0) {
      text = data.comments[0].cvpCommnent;
    }

    return text;
  }

  addComment() {

    if(this.commentToAdd.trim() == '') {
      return;
    }

    this.convergencePointService.addCVPComment(this.moduleIdComments, this.commentToAdd).subscribe((response: BaseResponse) => {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Comment was added successfully.');      

      this.data.forEach(item => {
        if(item.data.id == this.moduleIdComments) {
          item.data.comments.unshift(response.data);
        }
      });

      this.commentToAdd = '';
    });
  }

  selectApprovers(event, data, overlaypanel: OverlayPanel) {
    this.displayApprovers = false;
    if (this.permissions.getPermission('ROLE_CVPA') != undefined || this.permissions.getPermission('ROLE_CVPAP') != undefined || this.permissions.getPermission('ROLE_CVPE') != undefined) {
      this.loadedApprovers = data.approver;
      this.moduleInstanceIdApprovers = data.instanceId;
      setTimeout(() => {
        this.displayApprovers = true;
      }, 50);
      overlaypanel.toggle(event);
    }
  }

  selectComments(event, data, overlaypanel: OverlayPanel) {
    this.displayComments = false;
    if (this.permissions.getPermission('ROLE_CVPA') != undefined || this.permissions.getPermission('ROLE_CVPAP') != undefined || this.permissions.getPermission('ROLE_CVPE') != undefined) {
      this.commentToAdd = '';
      this.loadedComments = data.comments;
      this.moduleIdComments = data.id;
      setTimeout(() => {
        this.displayComments = true;
      }, 50);
      overlaypanel.toggle(event);
    }
  }

  cancelApprovers() {
    setTimeout(() => {
      this.loadedApprovers = [];
      this.displayApprovers = false;
    }, 1500);
  }

  /**
  * FINISH APPROVERS SECTION
  */

  /**
  * TEMPLATE SECTION
  */
  showTemplate() {
    this.displayTemplate = true;
  }

  cancelTemplate() {
    this.displayTemplate = false;
  }
  /**
  * FINISH TEMPLATE SECTION
  */

  /**
  * UPLOAD SECTION
  */
  showUpload() {
    this.displayUpload = true;
  }

  cancelUpload(event) {
    this.displayUpload = false;

    if (event) {
      this.loadData();
    }
  }
  /**
  * FINISH UPLOAD SECTION
  */

  selectItemFromTable(data) {
    data.pageKey = this.pageKey;
    this.selectedItem = {
      data: data
    };

    this.selectedRadio = data.instanceId;
  }

  changeModuleVersion(module, node) {

    let loadSubmodules = node.node.expanded != undefined && node.node.expanded;

    this.convergencePointService.getModuleVersion(module.id, module.version).subscribe((response: BaseResponse) => {
      let module = response.data;

      this.datasource.forEach((item, index) => {
        if (item.data.id == module.cvpModule.cvpModuleId) {
          this.replaceValues(this.datasource[index], module);
        }
      });

      this.datasource = Object.assign([], this.datasource);

      if (loadSubmodules) {
        this.loadSubmodules(module.cvpModuleInstanceId)
      }

      this.setPagination();
    });
  }

  submit() {
    this.displaySubmit = true;
  }

  cancelSubmit() {
    this.displaySubmit = false;
  }

  submitForReview() {
    if (this.selectedItem.data.status == Constants.DRAFT_STATUS) {
      this.convergencePointService.submitToReview(this.selectedItem.data.instanceId).subscribe(() => {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'The selected item was submited for review.');
        this.selectedItem = null;
        this.loadData();
        this.cancelSubmit();
      });
    } else {
      this.convergencePointService.submitForDeletionReview(this.selectedItem.data.instanceId,
          this.selectedItem.data.parentInstanceId).subscribe(() => {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'The selected item was submited to deletion for review.');
        this.selectedItem = null;
        this.loadData();
        this.cancelSubmit();
      });
    }

  }

  openReview() {
    this.selectedOptionReview = 'approve';
    this.commentsReturn = '';
    this.displayReview = true;
  }

  cancelReview() {
    this.displayReview = false;
  }

  review() {

    let type = this.convergencePointService.getDocumentType(this.selectedItem.data, this.pageKey);

    if (this.selectedOptionReview == 'approve') {
      if (this.selectedItem.data.status == Constants.IN_REVIEW_STATUS) {
        this.convergencePointService.approveModule(this.selectedItem.data.instanceId).subscribe(() => {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, type + ' was approved successfully.');
          this.cancelReview();
          this.loadData();
          this.selectedItem = null;
        });
      } else {
        this.convergencePointService.approveDeletion(this.selectedItem.data.instanceId, this.selectedItem.data.parentInstanceId).subscribe(() => {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, type + ' was deleted successfully.');
          this.cancelReview();
          this.loadData();
          this.selectedItem = null;
        });
      }
    } else if (this.selectedOptionReview == 'cancelDeletion') {
      this.convergencePointService.cancelDeletionModule(this.selectedItem.data.instanceId, 
          this.commentsReturn, this.selectedItem.data.parentInstanceId).subscribe(() => {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'The deletion of this ' + type.toLowerCase() + ' was canceled successfully.');
        this.cancelReview();
        this.loadData();
        this.selectedItem = null;
      });
    } else if (this.selectedOptionReview == 'return') {
      this.convergencePointService.returnModule(this.selectedItem.data.instanceId, this.commentsReturn).subscribe(() => {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, type + ' was returned successfully.');
        this.cancelReview();
        this.loadData();
        this.selectedItem = null;
      });
    }
  }

  uncheckAll() {
    this.selectedItem = null;
    this.selectedRadio = null;
  }

  selectCommentsReturned(event, data, panel) {
    this.commentsReturned = data.commentReturned;
    panel.show(event);
  }

  showUnlock(data) {
    this.tempModule = data;
    this.displayUnlock = true;
  }

  cancelUnlock() {
    this.displayUnlock = false;
  }

  unlock() {
    this.convergencePointService.unlockModule(this.tempModule.lockedObject.cvpLockId).subscribe(() => {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, this.convergencePointService.getDocumentType(this.tempModule, this.pageKey) + ' was unlocked successfully.');
      this.cancelUnlock();
      this.loadData();
    });
  }

  showClone() {
    if (this.selectedItem == null) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please select a module to continue.');
      return;
    }

    let { parent, independent, status, parentStatus } = this.selectedItem.data;
    let currentStatus: string = null;

    if (this.isSection(parent, independent)) {
      this.displayClone = true;
    } else {
      let displayErrorMessage = '';
      if (this.isPrimary(parent)) {
        currentStatus = status;
        displayErrorMessage = Constants.INVALID_PRIMARY_CLONING_ERROR;
      } else if (this.isAttachment(parent, independent)) {
        currentStatus = parentStatus;
        displayErrorMessage = Constants.INVALID_ATTACHMENT_CLONING_ERROR;
      }

      if (currentStatus != null &&
        (currentStatus === Constants.IN_DELETION_STATUS || currentStatus === Constants.DELETION_IN_REVIEW)) {
        
        this.confirmationService.confirm({
          message: displayErrorMessage,
          header: Constants.ERROR_CLONE_MESSAGE_HEAD,
          icon: 'pi pi-times-circle',
        });
      } else {
        this.displayClone = true;
      }
    }

  }

  cancelClone(refresh) {
    this.displayClone = false;

    if (refresh) {
      this.loadData();
    }
  }

  showDeletion() {
    if (this.selectedItem == null) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please select a module to continue.');
      return;
    }
    let { parent,  status, independent, version, versions, parentVersion, parentVersions } = this.selectedItem.data;
    if (status == Constants.DELETED_STATUS) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'This item is already deleted.');
      return;
    }
    let displayErrorMessage = '';
    let currentVersion : string;
    let lastVersion : string;
    
    if (this.isPrimary(parent)) {
      currentVersion = version;
      lastVersion = versions ? versions[versions.length - 1] : undefined;
    } else if (this.isSection(parent, independent) || this.isAttachment(parent, independent)){
      currentVersion = parentVersion;
      lastVersion = parentVersions ? parentVersions[parentVersions.length - 1] : undefined;
    } 
    if (currentVersion === lastVersion) {
      this.displayDeletion = true;
    } else {
      if (this.isPrimary(parent)) {
        displayErrorMessage = Constants.INVALID_LAST_PRIMARY_ERROR;
      } else if (this.isSection(parent, independent)) {
        displayErrorMessage = Constants.INVALID_LAST_SECTION_ERROR;
      } else if (this.isAttachment(parent, independent)){
        displayErrorMessage = Constants.INVALID_LAST_ATTACHMENT_ERROR;
      }

      this.confirmationService.confirm({
        message: displayErrorMessage,
        header: Constants.ERROR_DELETE_MESSAGE_HEAD,
        icon: 'pi pi-times-circle',
      });
    }
  }

  cancelDeletion(refresh) {
    this.displayDeletion = false;

    if (refresh) {
      this.loadData();
    }
  }

  showAssociate() {
    this.displayAssociate = true;
  }

  cancelAssociate(reload) {
    this.displayAssociate = false;

    if (reload) {
      this.loadData();
    }
  }

  showExport() {
    if (this.selectedItem == null) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please select a module to continue.');
      return;
    }

    this.displayExport = true;
  }

  cancelExport() {
    this.displayExport = false;
  }

  blockDocument(blocked: boolean) {
    this.blockedDocument = blocked;
  }

  /**
   * Refresh single node 
   */
  loadData() {
    let requestLazy = this.getRequestLazy(this.tt);
    let previousData = Object.assign([], this.datasource);

    return new Promise(resolve => {
      this.convergencePointService.getModules(this.tabs[this.indexTab].selectedValue, this.lockedFiles, requestLazy).subscribe((response: BaseResponse) => {
      
        let dataResponse = response.data.dtoList;
        this.totalRecords = dataResponse.length;
        let modulesLoadSubmodules = [];
  
        let newData = [];
        
        dataResponse.forEach(moduleResponse => {
  
          let json: any = this.getJSONFromModule(moduleResponse);
  
          for (let i = 0; i < previousData.length; i++) {
            if (moduleResponse.cvpModule.cvpModuleId == previousData[i].data.id) {
              
              //Check if this module is expanded
              if(previousData[i].expanded != undefined && previousData[i].expanded) {
                json.expanded = true;
                modulesLoadSubmodules.push(previousData[i].data.instanceId);
              }
  
              break;
            }
          }
  
          newData.push(json);
        });
  
        this.datasource = Object.assign([], newData);

        this.setPagination();

        this.initializeColumns();
  
        //Add submodules
        if(modulesLoadSubmodules.length > 0) {
          this.refreshSubmodule(modulesLoadSubmodules, 0);
        } else {
          resolve();
        }
      });
    });
  }

  refreshSubmodule(submodulesIds, index) {
    this.loadSubmodules(submodulesIds[index]).then(() => {
      if(index + 1 == submodulesIds.length) {
        return;
      } else {
        index = index + 1;
        this.refreshSubmodule(submodulesIds, index);
      }
    });
  }

  getRequestLazy(event = null) {
    let sort = [];

    if (event && event.multiSortMeta != null && event.multiSortMeta != undefined) {
      event.multiSortMeta.forEach(item => {

        let requestField = item.field;
        let entity = null

        this.cols.forEach(itemCol => {
          if(itemCol.field == item.field) {
            requestField = itemCol.requestField;
            entity = itemCol.entity;
          }
        });

        sort.push({
          'field': requestField,
          'order': item.order != 1 ? 'DESC' : 'ASC',
          'entity': entity
        });
      });

      this.sortingObject = sort;
    }

    let filters = [];
    let keys = Object.keys(this.filters);

    keys.forEach(key => {
      filters.push(this.filters[key]);
    });

    let requestLazy = {
      filters: JSON.parse(JSON.stringify(filters)),
      sorting: JSON.parse(JSON.stringify(this.sortingObject))
    }

    return requestLazy;
  }

  getJSONFromModule(item) {

    let lastUpdate = '';

    if (item.updatedOn == null && item.creationDt == null) {
      lastUpdate = '-';
    } else {
      lastUpdate = this.dashboarServices.parseDate(new Date(item.updatedOn + ' 00:00:00'));
    }

    return {
      'data': {
        'id': item.cvpModule.cvpModuleId,
        'instanceId': item.cvpModuleInstanceId,
        'moduleList': item.cvpModule.moduleName,
        'comments': item.cvpModule.commentsDto == null ? [] : item.cvpModule.commentsDto,
        'version': item.moduleVersion,
        'versions': (item.moduleVersions == undefined || item.moduleVersions.length == 0) ? [item.moduleVersion] : item.moduleVersions,
        'status': (item.cvpApprovalStatus != undefined && item.cvpApprovalStatus != null) ? item.cvpApprovalStatus.approvalDescription : '-',
        'statusId': (item.cvpApprovalStatus != undefined && item.cvpApprovalStatus != null) ? item.cvpApprovalStatus.cvpApprovalStatusId : '0',
        'updatedBy': item.updatedBy.firstName != null ? item.updatedBy.firstName + ' ' + item.updatedBy.lastName : '-',
        'lastUpdate': lastUpdate,
        'eclFileId': item.eclFileId,
        'filePath': item.filePath,
        'approver': item.moduleInstanceUserList,
        'parent': true,
        'parentId': null,
        'parentInstanceId': null,
        'parentVersion': null,
        'commentReturned': item.currentWorkflow != null && item.currentWorkflow != undefined ? {
          'user': item.currentWorkflow.updatedBy.firstName,
          'date': this.dashboarServices.parseDate(new Date(item.currentWorkflow.updatedOn + ' 00:00:00')),
          'text': item.currentWorkflow.comments
        } : null,
        'lockedObject': {
          'locked': item.moduleLocked != null,
          'submodulesLocked': item.cntSubmodulesLocked,
          'lockedBy': item.moduleLocked != null ? item.moduleLocked.lockedBy.firstName : '',
          'cvpLockId': item.moduleLocked != null ? item.moduleLocked.cvpLockId : 0
        }
      },
      "children": this.pageKey == Constants.CLINICAL_REQUIREMENTS_SCREEN ? [
        {
          'data': {
            'id': 0,
            'moduleList': 'Loading...',
            'version': '',
            'status': '',
            'statysId': '',
            'eclFileId': '',
            'filePath': '',
            'updatedBy': '',
            'lastUpdate': '',
            'approver': [],
            'parent': false
          }
        }
      ] : []
    };
  }

  filterByColumn() {

    //Remove expanded
    this.datasource.forEach(item => {
      item.expanded = false;
    });

    this.first = 0;

    this.lastLazyEvent.first = 0;

    this.loadData();
  }

  replaceValues(row, module) {
    let lastUpdate = '';

          if (module.updatedOn == null && module.creationDt == null) {
            lastUpdate = '-';
          } else {
            lastUpdate = module.updatedOn != null ? this.dashboarServices.parseDate(new Date(module.updatedOn + ' 00:00:00')) : '-';
          }

          row.data.eclFileId = module.eclFileId;

          if (module.moduleLocked == null) {
            row.data.lockedObject = {
              'locked': false,
              'submodulesLocked': module.cntSubmodulesLocked,
              'lockedBy': '',
              'cvpLockId': 0
            };
          } else {
            row.data.lockedObject = {
              'locked': true,
              'submodulesLocked': module.cntSubmodulesLocked,
              'lockedBy': module.moduleLocked.lockedBy.firstName,
              'cvpLockId': module.moduleLocked.cvpLockId
            };
          }



          row.data.commentReturned = module.currentWorkflow != null && module.currentWorkflow != undefined ? {
            'user': module.currentWorkflow.updatedBy.firstName,
            'date': this.dashboarServices.parseDate(new Date(module.currentWorkflow.updatedOn + ' 00:00:00')),
            'text': module.currentWorkflow.comments
          } : null;

          row.data.approver = module.moduleInstanceUserList;
          row.data.filePath = module.filePath;
          row.data.instanceId = module.cvpModuleInstanceId;
          row.data.lastUpdate = lastUpdate;
          row.data.status = (module.cvpApprovalStatus != undefined && module.cvpApprovalStatus != null) ? module.cvpApprovalStatus.approvalDescription : '-';
          row.data.statusId = (module.cvpApprovalStatus != undefined && module.cvpApprovalStatus != null) ? module.cvpApprovalStatus.cvpApprovalStatusId : '0';
          row.data.version = module.moduleVersion;
          row.data.updatedBy = module.updatedBy != null ? module.updatedBy.firstName + module.updatedBy.lastName : '-';
  }

  highlightText(text, column) {
    try {
      let filter = this.filters[column].value;

      if(filter == null || filter == undefined || filter == '') {
        return text;
      } else {
        let regEx = new RegExp(filter, "gi");

        return text.replaceAll(regEx, function(str) {
          return '<span class="span-highlight">' + str + '</span>'
        });
      }
    } catch(e) {
      return text;
    }
  }

  /**
   * Method used to know if the module is a Primary.
   * @param parent
   */
  private isPrimary (parent: number){
    return (parent) ? true : false ;
  }

  /**
   * Method used to know if the module is a Section.
   * @param parent
   * @param independent
   */
  private isSection (parent: number, independent: number){
    return (!parent && independent) ? true : false;
  }

  /**
   * Method used to know if the module is an Attachment.
   * @param parent
   * @param independent
   */
  private isAttachment (parent: number, independent: number){
    return (!parent && !independent) ? true : false ;
  }

  paginate(event) {
    this.first = event.first;    
    this.lastLazyEvent.first = event.first;
  }

  loadLazy(event) {
    this.lastLazyEvent = event;
    this.loadTabs().then(() => {
      this.loadData().then(() => {
        this.setPagination();
      });
    });
  }

  setPagination() {
    this.data = this.datasource.slice(this.lastLazyEvent.first, (this.lastLazyEvent.first + this.lastLazyEvent.rows));
    this.selectedRadio = null;
    this.selectedItem = null;
  }

  /**
   * Method executed when a module has updated its approvers.
   * @param onChange, module event.
   */
  refreshModule(event : any) {
    if (event) {
      this.loadData();
    }
  }

  removeComment(commentObject, index) {
    //call service to remove comment in base of id
    this.convergencePointService.removeCVPComment(commentObject.cvpModuleCommentId).subscribe((response) => {
      this.loadedComments.splice(index, 1);
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Comment deleted successfully.');
    });
  }
}
