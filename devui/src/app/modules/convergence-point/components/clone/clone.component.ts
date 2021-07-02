import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Component({
  selector: 'app-cvp-clone',
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.css']
})
export class CloneComponent implements OnInit {

  @Input('cvpModuleInstance') cvpModuleInstance;
  subModules: any[];
  @Output() onCancel = new EventEmitter();

  options: any = [];
  allChecked: boolean = false;

  originalData: any[];

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
        'independent': false,
        'parent': this.cvpModuleInstance.parent
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
          'independent': item.childModule.cvpModule.independent,
          'parent': false
        });
      });

      this.originalData = JSON.parse(JSON.stringify(this.options));
    });
  }

  cancel(refresh: boolean = false) {
    this.onCancel.emit(refresh);
  }

  clone() {
    let cloneItems = {};

    this.options.forEach((item, index) => {
      if (item.checked) {
        cloneItems[this.originalData[index].name] = item.name;
      }
    });

    this.convergencePointService.cloneModules(this.cvpModuleInstance.id, cloneItems, this.cvpModuleInstance.parentId).subscribe(() => {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Selected items were cloned successfully!.');
      this.cancel(true);
    });

  }

  changeAllChecked(event) {
    this.options.forEach(item => {
      if(!item.independent) {
        item.checked = this.allChecked;
      }
    });
  }

  checkDisabled() {
    let disabled = true;

    this.options.forEach(item => {
      if(item.checked) {
        disabled = false;
      }
    });

    return disabled;
  }

  getTitle() {
    if(this.cvpModuleInstance.pageKey == Constants.ANCILLARY_INFORMATION_SCREEN) {
      return 'Clone the selected section file.';
    } else {
      if(this.cvpModuleInstance.parent) {
        return 'The selected primary requirement has associated sections and attachements. Select the files you want to clone. You may also rename the resulting Attachments if you wish';
      } else {
        if(!this.cvpModuleInstance.independent) {
          return 'Please enter the new name for the selected Attachment if you wish to rename the resulting cloned file.'
        } else {
          return 'Clone the selected section file.';
        }
      }
    }
  }
}
