import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-cvp-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  type: string = 'U';
  activeIndex: number = 0;

  @Input('parentPage') parentPage: string;
  @Output() onCancel = new EventEmitter();
  fileLoaded: File = null;
  subType: string = 'CLIENT_CONTEXT';
  screenAI: string = '_AI';

  loadedTemplate: any = null;

  constructor(private toastService: ToastMessageService,
    private convergencePointService: ConvergencePointService,
    private fileManager: FileManagerService,
    private permissions: NgxPermissionsService) { }

  ngOnInit() {

    if(this.permissions.getPermission('ROLE_CVPA') == undefined && this.permissions.getPermission('ROLE_CVPAP') == undefined) {
      this.type = 'D';
      this.fileLoaded = undefined;
      this.loadTemplate();
    }

    if (this.parentPage == Constants.ANCILLARY_INFORMATION_SCREEN) {
      this.activeIndex = 1;
      this.subType +=  this.screenAI;
    } else {
      this.screenAI = '';;
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  upload() {

    if (this.fileLoaded == null) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please enter a valid file to continue.');
      return;
    }

    if (this.activeIndex == 0) {
      let type = 'Primary requirement';

      if(this.parentPage == Constants.ANCILLARY_INFORMATION_SCREEN) {
        type = 'Section';
      }
      this.convergencePointService.uploadModuleTemplate(Constants.CLINICAL_REQUIREMENTS_SCREEN, this.fileLoaded).then(() => {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, type + ' template was uploaded successfully.');
        this.cancel();
      });
    } else {
      this.convergencePointService.uploadModuleTemplate(this.subType, this.fileLoaded).then(() => {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Section template was uploaded successfully.');
        this.cancel();
      });
    }
  }

  loadTemplate() {
    if(this.type == 'D') {
      if (this.activeIndex == 0) {
        this.convergencePointService.downloadModuleTemplate(Constants.CLINICAL_REQUIREMENTS_SCREEN).then((template: any) => {
          this.processTemplate(template);
        });
      } else {
        this.convergencePointService.downloadModuleTemplate(this.subType).then((template: any) => {
          this.processTemplate(template);
        });
      }
    }
  }

  processTemplate(template) {
    if(template !== null) {
      this.loadedTemplate = {
        name : template.fileName == null ? 'No file name found.' : template.fileName
      };
    } else {
      this.loadedTemplate = null;
    }
  }

  download() {

    if (this.activeIndex == 0) {
      this.convergencePointService.downloadModuleTemplate(Constants.CLINICAL_REQUIREMENTS_SCREEN).then((template: any) => {
        if (template != null) {
          this.downloadFile(template.fileId, template.fileName);
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Module template was downloaded successfully.');
          this.cancel();
        } else {
          this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Template you want to download does not exits.');
        }
      });
    } else {
      this.convergencePointService.downloadModuleTemplate(this.subType).then((template: any) => {
        if (template != null) {
          this.downloadFile(template.fileId, template.fileName);
          this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Section template was downloaded successfully.');
          this.cancel();
        } else {
          this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Template you want to download does not exits.');
        }
      });
    }

  }

  downloadFile(fileId: number, fileName: string) {
    this.fileManager.downloadFile(fileId).subscribe(response => {
      this.fileManager.createDownloadFileElement(response, fileName);
    });
  }

  loadFile(event) {
    this.fileLoaded = event;
  }

  changeTabTemplate(event) {
    this.activeIndex = event.index;

    if (this.activeIndex == 1) {
      this.subType = 'CLIENT_CONTEXT';

      if (this.parentPage == Constants.ANCILLARY_INFORMATION_SCREEN) {
        this.subType += this.screenAI;
      }
    }

    this.loadTemplate();
  }
}
