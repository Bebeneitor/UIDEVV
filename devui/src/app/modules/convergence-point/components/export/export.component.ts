import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';

@Component({
  selector: 'app-cvp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  @Input('cvpModuleInstance') cvpModuleInstance;
  @Output() blockDocument = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  subModules: any[] = [];
  exporting: boolean = false;

  constructor(private convergencePointService: ConvergencePointService, private toastService: ToastMessageService, private fileManager: FileManagerService) { }

  ngOnInit() {
    this.convergencePointService.getSubModules(this.cvpModuleInstance.instanceId, false, null).subscribe((response: BaseResponse) => {
      this.subModules = response.data.dtoList;
    });
  }

  cancel() {
    this.onCancel.emit();
  }

  exportPrimary() {
    this.exporting = true;
    this.blockDocument.emit(this.exporting);
    this.convergencePointService.exportModuleSubmoduleToPDF(this.cvpModuleInstance.instanceId).subscribe(
      (response: any) => {
        this.fileManager.createDownloadFileElement(response, this.cvpModuleInstance.moduleList);
        this.toastService.messageSuccess(Constants.TOAST_SEVERITY_SUCCESS, 'Module was exported sucessfully!.');
        this.exporting = false;
        this.blockDocument.emit(this.exporting);
        this.onCancel.emit();
      }, error => {
        this.exporting = false;
        this.blockDocument.emit(this.exporting);
        this.onCancel.emit();
      });
  }

  exportPrimaryAndSubModules() {
    this.exporting = true;
    this.blockDocument.emit(this.exporting);
    this.convergencePointService.exportModuleSubmoduleToPDF(this.cvpModuleInstance.instanceId).subscribe(
      (response: any) => {
        this.fileManager.createDownloadFileElement(response, this.cvpModuleInstance.moduleList);
        this.exportSubModule(this.subModules[0].childModule.cvpModuleInstanceId,
          this.subModules[0].childModule.cvpModule.moduleName, this.subModules, 0);
      }, error => {
        this.exportSubModule(this.subModules[0].childModule.cvpModuleInstanceId,
          this.subModules[0].childModule.cvpModule.moduleName, this.subModules, 0);
      });
  }

  exportSubModule(fileId: number, fileName: string, files: any[], index: number) {
    setTimeout(() => {
      this.convergencePointService.exportModuleSubmoduleToPDF(fileId).subscribe((response: any) => {
        this.fileManager.createDownloadFileElement(response, fileName);
        this.downloadSubModule(files, index);
      }, error => {
        this.downloadSubModule(files, index);
      });
    }, 500);
  }

  downloadSubModule(files: any[], index: number) {
    index++;
      if(index < files.length) {
          this.exportSubModule(files[index].childModule.cvpModuleInstanceId, 
            files[index].childModule.cvpModule.moduleName, files, index);
      } else {
        this.toastService.messageSuccess(Constants.TOAST_SEVERITY_SUCCESS, 'Module and sub-modules were exported sucessfully!.');
        this.exporting = false;
        this.blockDocument.emit(this.exporting);
        this.onCancel.emit();
      }
  }

  getTitle() {
    if(this.cvpModuleInstance.pageKey == Constants.ANCILLARY_INFORMATION_SCREEN) {
      return 'Export the selected section.';
    } else {
      if(this.cvpModuleInstance.parent) {
        return 'There are sections and attachements associated with the selected Primary Requirement. Which ones do you want to export?';
      } else {
        if(!this.cvpModuleInstance.independent) {
          return 'Export the selected attachement.'
        } else {
          return 'Export the selected section.';
        }
      }
    }
  }
}
