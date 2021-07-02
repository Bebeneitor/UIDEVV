import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';

@Component({
  selector: 'app-cvp-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  @Input('cvpModuleInstance') cvpModuleInstance;
  @Input('downloadSubmodules') downloadSubmodules;
  @Output() onDownload = new EventEmitter();

  downloadOptions: any = [];
  allChecked: boolean = true;

  progressMessage: string = '';
  progress: number = 0;
  showProgress: boolean = false;
  avg: number = 0;

  constructor(private toastService: ToastMessageService,
    private convergencePointService: ConvergencePointService,
    private fileManager: FileManagerService) { 
      
    }

  ngOnInit() {
    this.downloadOptions = [];

    this.downloadOptions.push({
      'fileId': this.cvpModuleInstance.eclFileId,
      'fileName': this.cvpModuleInstance.filePath,
      'name': this.cvpModuleInstance.moduleList,
      'checked': true,
      'locked': this.cvpModuleInstance.lockedObject.locked,
      'instanceId': this.cvpModuleInstance.instanceId,
      'disabled': this.cvpModuleInstance.lockedObject.locked || this.cvpModuleInstance.status == Constants.DELETED_STATUS
    });

    this.downloadSubmodules.forEach(item => {
      this.downloadOptions.push({
        'fileId': item.childModule.eclFileId,
        'fileName': item.childModule.filePath,
        'name': item.childModule.cvpModule.moduleName,
        'checked': true,
        'locked': item.childModule.moduleLocked,
        'instanceId': item.childModule.cvpModuleInstanceId,
        'disabled': item.childModule.moduleLocked || item.childModule.cvpApprovalStatus.approvalDescription == Constants.DELETED_STATUS
      });
    });
  }

  cancel(refresh: boolean = false) {
    this.onDownload.emit(refresh);
  }

  download() {
    let files = [];
    let filesToLock = [];

    this.downloadOptions.forEach(item => {
      if (item.checked) {
        files.push(item);
      }

      if(item.locked && !item.disabled) {
        filesToLock.push(item.instanceId);
      }
    });

    if(filesToLock.length == 0) {
      this.startDownload(files);
    } else {
      this.convergencePointService.lockFiles(filesToLock).subscribe(() => {
        this.startDownload(files);
      });
    }
    
  }

  startDownload(files) {
    this.progressMessage = '';
    this.progress = 0;

    if (files.length == 0) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please select at least one item to download.');
    } else {
      this.avg = Math.ceil(100 / files.length);
      this.showProgress = true;
      this.downloadFile(files[0].fileId, files[0].fileName, files, 0);
    }
  }

  downloadFile(fileId: number, fileName: string, files: any[], index: number) {
    if (fileId != null && fileName != null) {
      this.progressMessage = ('Downloading ' + fileName);
      this.fileManager.downloadFile(fileId).subscribe(response => {
        this.fileManager.createDownloadFileElement(response, fileName);

        index++;
        this.progress = this.progress + this.avg;
        if(this.progress > 100) {
          this.progress = 100;
        }

        if (index < files.length) {
          this.progressMessage = ('Downloading ' + files[index].fileName);
          setTimeout(() => {
            this.downloadFile(files[index].fileId, files[index].fileName, files, index);
          }, 1000);
        } else {
          setTimeout(() => {
            this.showProgress = false;
            this.finishDownload();
          }, 200);
        }
      });
    } else {
      index++;
      this.progress = this.progress + this.avg;
      if(this.progress > 100) {
        this.progress = 100;
      }
      
      if (index < files.length) {
        this.progressMessage = ('Downloading ' + files[index].fileName);
        setTimeout(() => {
          this.downloadFile(files[index].fileId, files[index].fileName, files, index);
        }, 1000);
      } else {
        setTimeout(() => {
          this.showProgress = false;
          this.finishDownload();
        }, 200);
      }
    }
  }

  finishDownload() {
    this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Files downloaded correctly.');
    this.cancel(true);
  }

  changeAllChecked(event) {
    this.downloadOptions.forEach(item => {
      item.checked = this.allChecked;
    });
  }

  getTitle() {
    if(this.cvpModuleInstance.pageKey == Constants.ANCILLARY_INFORMATION_SCREEN) {
      return 'Download the selected section.';
    } else {
      if(this.cvpModuleInstance.parent) {
        return 'The selected primary requirement has associated sections and attachements. Select the files you want to download.';
      } else {
        if(!this.cvpModuleInstance.independent) {
          return 'Download the selected attachement.'
        } else {
          return 'Download the selected section.';
        }
      }
    }
  }
}
