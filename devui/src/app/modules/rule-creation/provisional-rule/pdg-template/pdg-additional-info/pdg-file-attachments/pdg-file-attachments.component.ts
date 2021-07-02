import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReferenceService } from 'src/app/services/reference.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { EclFileDto } from 'src/app/shared/models/ecl-file';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { PdgUtil } from '../../pdg-util';

const MAX_FILE_SIZE = 10;

@Component({
  selector: 'app-pdg-file-attachments',
  templateUrl: './pdg-file-attachments.component.html',
  styleUrls: ['./pdg-file-attachments.component.css']
})
export class PdgFileAttachmentsComponent implements OnInit {

  @ViewChild('fileUpload',{static: true}) fileUpload: ElementRef;
  
  currRuleInfo: RuleInfo;
  ruleId: number;
  existingFiles: EclFileDto[];
  removeAttachmentDisplay: boolean = false;
  @Input("pdgOption") pdgOption: any;
  @Input() set maxFiles(_maxFiles: any) {
    if (_maxFiles && _maxFiles != "*") {
      this.maxAllowedFiles = Number.parseInt(_maxFiles);
    } else {
      this.maxAllowedFiles = 99;
    }
  }
  @Input() set ruleInfo(rule: RuleInfo) {
    if (rule) {
      this.currRuleInfo = rule;
    }
    if (!rule.ruleId) {
      this.ruleId = rule.parentRuleId;
    } else {
      this.ruleId = rule.ruleId;
    }
    this.filesAttached = [];
    this.fileUpload.nativeElement.value = '';
  }

  @Input() set fileList(files: EclFileDto[]) {
    this.existingFiles = [];
    if (files && files.length > 0) {
      this.isSavedFileExist = true;
      files.forEach(file=>{
        this.getImageContent(file).then((file:EclFileDto)=>{
          this.existingFiles.push(file);
        })
      })
    } else {
      this.isSavedFileExist = false;
    }
    this.fileUpload.nativeElement.value = '';
  }
  @Output() onFilesAttached = new EventEmitter<any>();
  @Input() acceptFiles: any;
  @Input("filesAttached") filesAttached: EclFileDto[];
  @Input() provDialogDisable: boolean;
  
  maxAllowedFiles: number;
  isSavedFileExist: boolean = false;
  isAddedFileExist: boolean = false;
  isImage: boolean = true;
  deletedFile: EclFileDto;


  constructor(private eclReferenceService: ReferenceService,
    private sanitizer: DomSanitizer, private fileManagerService: FileManagerService,
    private toastService: ToastMessageService,
    private utils: AppUtils, private pdgUtil: PdgUtil) { }

  ngOnInit() {
    this.filesAttached = [];
  }


  getImageContent(file: EclFileDto) {
    return new Promise((resolve, reject) => {
        if (this.pdgUtil.isImageFile(file.fileName)) {
          this.fileManagerService.downloadFile(file.fileId).subscribe(response => {
            let blob = new Blob([response], { type: response.type }), url = window.URL.createObjectURL(blob);
            file.refSrcUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            file.isImage = true;
            resolve(file);
          });
        } else{
          resolve(file);
        }
        file.isRemoved = false;
      });
  }


  /* Method to show a warning message for the maximum files */
  maxFilesWarning() {
    let warnMessage: string = `Maximum two files can be uploaded`;
    this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
  }

  /* Method invoked when files are dragged and dropped */
  dropFileHandler(event) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    if (!this.provDialogDisable) {
      this.updateFilesList(this.utils.dropFileHandler(event));
    }
    this.fileUpload.nativeElement.value = '';
  }


  /* Method to click the file input by using the id of the input*/
  clickFileUpload() {
    this.fileUpload.nativeElement.click();
  }

  /* Method to add files into the */
  addFiles(event: any) {
    let fileList: FileList = event.target.files;
    this.updateFilesList(fileList);
    this.fileUpload.nativeElement.value = '';
  }

  /* Method to update selected files into filelist
    @input : html event object
    add unique files less than 10mb to fileslist object
    show warn messages for duplicate files and large files
  */
  updateFilesList(addedFiles: any) {
    let activeAttachments: EclFileDto[] =
      (this.existingFiles && this.existingFiles.length > 0) ?
        this.existingFiles.filter(attachment => attachment.isRemoved === false) : [];
    for (let i = 0; i < addedFiles.length; i++) {
      let size = addedFiles[i].size / 1024 / 1024; // size conversion to MB.
      if (size < MAX_FILE_SIZE) { //max 10MB
        let attachmentListSize = activeAttachments.length + this.filesAttached.length; // size variable to upload only 5 file attachments
        if (attachmentListSize < this.maxAllowedFiles) {
          if (!this.filesAttached.some(file => file.newFile.name === addedFiles[i].name) && !activeAttachments.some(fileObj => fileObj.fileName === addedFiles[i].name)) {
            // this.filesAttached.push(addedFiles[i]);
            this.filesAttached.push(new EclFileDto(addedFiles[i], true));
            this.isAddedFileExist = this.filesAttached.length > 0 ? true : false;
          } else {
            let warnMessage: string = `File '${addedFiles[i].name}' already Exists, please upload a new file`;
            this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
          }
        } else {
          this.maxFilesWarning();
          break;
        }
      } else {
        let warnMessage: string = `File ${addedFiles[i].name} has ${Math.round(size)}MB of size, max file size uploaded 10MB`;
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
        break;
      }
    }

    if (this.isAddedFileExist) {
      this.onFilesAttached.emit(this.filesAttached);
      for (let i = 0; i < this.filesAttached.length; i++) {
        let file: File;
        let reader = new FileReader();
        file = this.filesAttached[i].newFile;
        if (this.pdgUtil.isImageFile(file.name)) {
          reader.readAsDataURL(file);
          reader.onload = (_event) => {
            this.filesAttached[i].refSrcUrl = reader.result;
            this.filesAttached[i].isImage = true;
          }
        } else {
          this.filesAttached[i].isImage = false;
        }
      }
    }
  }


  /***Activated when user clicks Cancel on File Deletion dialog***/
  removeAttachmentCancel() {
    this.removeAttachmentDisplay = false;
  }

  /**
 * Removes the file from the list, but the deletion is until user clicks save or submit.
 * @param file to be removed.
 */
  removeFile(file) {
    this.deletedFile = file;
    this.removeAttachmentDisplay = true;
  }

  /* Method to remove the selected file from the selected files list based on the name of the file
   @input : file object
   reseting the file input if the length of the files list if empty
   */
  removeSelectedFile(fileObj: any) {
    this.filesAttached = this.filesAttached.filter(file => file.newFile.name !== fileObj.name);
    this.onFilesAttached.emit(this.filesAttached);
    if (this.filesAttached.length < 1) {
      this.fileUpload.nativeElement.value = '';
    }
    if (this.filesAttached.length > 0) {
      this.isAddedFileExist = true;
    } else {
      this.isAddedFileExist = false;
    }

  }

  /* Method to delete a file attached to research request Object
  setting the deletedstatus value of the list index object to true,
  to pass the entire update list when the save or submit event occurs.
  */
  removeSavedFile() {
    this.removeAttachmentDisplay = false;

    this.existingFiles.forEach(fileObj => {
      if (this.deletedFile && fileObj.fileId === this.deletedFile.fileId) {
        fileObj.isRemoved = true;
        this.deletedFile = null;
      }
    });
    if (this.existingFiles.length > 0) {
      this.isSavedFileExist = false;
      this.existingFiles.forEach(fileObj => {
        if (fileObj.isRemoved == false) {
          this.isSavedFileExist = true;
        }
      });

    } else {
      this.isSavedFileExist = false;
    }
  }

  /**
* Shows an icon according to the extension.
* @param file to get the extension,
*/
  getFileIcon(fileName) {
    return this.utils.getFileIcon(fileName);
  }

  
  /**
* Gets the file from the service.
* @param file that we want to download.
*/
  downloadSavedFile(file: EclFileDto) {
    this.fileManagerService.downloadFile(file.fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, file.fileName);
    });
  }

  
  /**
* download just uploaded file
* @param file that we want to download.
*/
  downloadAddedFile(file: EclFileDto) {
    if (!this.provDialogDisable) {
      this.fileManagerService.createDownloadFileElement(file.newFile, file.newFile.name);
    }
  }
}
