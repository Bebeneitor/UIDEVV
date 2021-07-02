import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-cvp-deletion',
  templateUrl: './deletion.component.html',
  styleUrls: ['./deletion.component.css']
})
export class DeletionComponent implements OnInit {

  @Input('cvpModuleInstance') cvpModuleInstance;
  @Input('parentPage') parentPage;
  subModules: any[];
  @Output() onCancel = new EventEmitter();

  options: any = [];
  allChecked: boolean = false;

  constructor(private convergencePointService: ConvergencePointService, private toastService: ToastMessageService) { }

  ngOnInit() {
    this.convergencePointService.getSubModules(this.cvpModuleInstance.instanceId, false, null).subscribe((response: BaseResponse) => {

      this.subModules = response.data.dtoList;

      this.options = [];
      this.options.push({
        'fileId': this.cvpModuleInstance.eclFileId,
        'fileName': this.cvpModuleInstance.filePath,
        'name': this.cvpModuleInstance.moduleList,
        'checked': false,
        'locked': this.cvpModuleInstance.lockedObject.locked,
        'instanceId': this.cvpModuleInstance.instanceId,
        'disabled': this.cvpModuleInstance.lockedObject.locked,
        'id': this.cvpModuleInstance.id,
        'version': this.cvpModuleInstance.version,
        'parentId': this.cvpModuleInstance.parentId,
        'parentVersion': this.cvpModuleInstance.parentVersion,
        'deleted': this.cvpModuleInstance.status == Constants.DELETED_STATUS,
        'parent': this.cvpModuleInstance.parent,
        'independent': this.cvpModuleInstance.independent != undefined ? this.cvpModuleInstance.independent : false
      });

      this.subModules.forEach(item => {
        this.options.push({
          'fileId': item.childModule.eclFileId,
          'fileName': item.childModule.filePath,
          'name': item.childModule.cvpModule.moduleName,
          'checked': false,
          'locked': item.childModule.moduleLocked,
          'instanceId': item.childModule.cvpModuleInstanceId,
          'disabled': item.childModule.moduleLocked,
          'id': item.childModule.cvpModule.cvpModuleId,
          'version': item.childModule.moduleVersion,
          'parentId': item.parentModule.cvpModule.cvpModuleId,
          'parentVersion': item.parentModule.moduleVersion,
          'deleted': item.childModule.cvpApprovalStatus.approvalDescription == Constants.DELETED_STATUS,
          'parent': false,
          'independent': item.childModule.cvpModule.independent
        });
      });
    });
  }

  cancel(refresh: boolean = false) {
    this.onCancel.emit(refresh);
  }

  delete() {
    let deleteIds = [];

    this.options.forEach(item => {
      if (item.checked) {
        deleteIds.push(item);
      }
    });

    if (deleteIds.length > 0) {
      this.deleteModule(deleteIds, 0);
    }

  }

  deleteModule(deleteArray, index) {
    this.convergencePointService.deleteModule(deleteArray[index].id, deleteArray[index].version, deleteArray[index].parentId, deleteArray[index].parentVersion).subscribe(() => {
      if (deleteArray.length > (index + 1)) {
        setTimeout(() => {
          index++;
          this.deleteModule(deleteArray, index);
        }, 200);
      } else {
        if(deleteArray.length > 1) {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Selected items are submitted for deletion');
        } else {
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Selected ' + this.convergencePointService.getDocumentType(deleteArray[index], this.parentPage) + ' is submitted for deletion');
        }
        
        this.cancel(true);
      }
    });
  }

  changeAllChecked(event) {
    this.options.forEach(item => {
      item.checked = this.allChecked;
    });
  }
  verifyChecked(ind, event) {
    if (ind == 0) {
      for (let i = 1; i < this.options.length; i++) {
        if(this.options[0].checked) {
          this.options[i].checked = false;
          this.options[i].disabled = true;
        } else {
          this.options[i].disabled = this.options[i].locked;
        }
      }
    }
  }

  checkDisabled() {
    let disabled = true;

    this.options.forEach(item => {
      if (item.checked) {
        disabled = false;
      }
    });

    return disabled;
  }

  getTitle() {
    if(this.cvpModuleInstance.pageKey == Constants.ANCILLARY_INFORMATION_SCREEN) {
      return 'The association of selected section with the primary requirement will be removed.';
    } else {
      if(this.cvpModuleInstance.parent) {
        return 'The sections and attachments associated with the selected primary requirement will also be deleted.';
      } else {
        if(!this.cvpModuleInstance.independent) {
          return 'The association of selected attachment with the primary requirement will be removed.'
        } else {
          return 'The association of selected section with the primary requirement will be removed.';
        }
      }
    }
  }
}
