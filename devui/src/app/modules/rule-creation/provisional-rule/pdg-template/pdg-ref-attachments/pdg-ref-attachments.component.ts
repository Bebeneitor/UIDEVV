import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReferenceService } from 'src/app/services/reference.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';
import { ReferenceInfoDto } from 'src/app/shared/models/dto/reference-info-dto';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { environment } from 'src/environments/environment';

const REF_DOC_FILE1 = 2;
const REF_DOC_FILE2 = 3;
const REF_COMMENTS_FILE1 = 1;
const REF_COMMENTS_FILE2 = 2;

@Component({
  selector: 'app-pdg-ref-attachments',
  templateUrl: './pdg-ref-attachments.component.html',
  styleUrls: ['./pdg-ref-attachments.component.css']
})



export class PdgRefAttachmentsComponent implements OnInit {
  removeAttachmentDisplay: boolean = false;
  referenceInfo: ReferenceInfoDto;
  downloadFileId: number;
  existingFileName: string = null;
  existingFileType: string;
  isFileExist: boolean = false;
  isFileRemoved: boolean;
  isImage: boolean = false;
  refSrcUrl: SafeUrl = null;
  addedFileName: string = null;
  addedFileType: string = null;
  addedFile : File = null;
  existingFile: any = null;
  fileIcon: any = null;
  displayFileUpload: boolean = true;

  
  referenceData: EclReferenceDto;
  @Input() set reference(_reference: EclReferenceDto) {
    if (_reference) {
      this.referenceData = _reference;
      if (this.referenceData.refInfo) {
        this.referenceInfo = this.referenceData.refInfo;
        this.setFileSpecificAttribute();
      }
    }
  }
  
  attachmentType: string;
  @Input() set fileCategory(_category: string) {
    this.attachmentType = _category;
    this.setFileSpecificAttribute();
  }
  
  exitingFileList: string[] = null;
  @Input() set validationFiles(_files: string[]) {
    this.exitingFileList = _files;
  }

  
  _disableView : boolean = false;
  @Input() set disableView(flag: boolean) { 
    this._disableView = flag;
    this.setDisplayUpload();
  }
  @Output() fileChanged = new EventEmitter();
  @Output() fileDeleted = new EventEmitter();

  @ViewChild('fileUpload',{static: true}) fileUpload: ElementRef;

  constructor(private referenceService: ReferenceService,
    private sanitizer: DomSanitizer,
    private toastService: ToastMessageService,
    private utils: AppUtils, private fileManagerService: FileManagerService) { }

  ngOnInit() {

  }


  setFileSpecificAttribute() {
    if (this.attachmentType && this.referenceData && Object.keys(this.referenceData).length!==0) {
      this.existingFileName = null;
      this.existingFile = null;
      this.refSrcUrl = null;
      this.isFileExist = false;
      switch (this.attachmentType) {
        case "comment1":          
          this.downloadFileId = this.referenceData.commentsFile1Id;
          if (this.referenceData.commentsFile1 && this.referenceData.eclAttachmentList) {
            this.existingFileName = this.referenceData.eclAttachmentList[0].attachmentFileName;
            this.existingFile = this.referenceData.eclAttachmentList[0];
          }
          this.isFileExist = this.referenceData.commentsFile1;
          break;
        case "comment2":
          this.downloadFileId = this.referenceData.commentsFile2Id;
          if (this.referenceData.commentsFile2 && this.referenceData.eclAttachmentList) {
            if (this.referenceData.eclAttachmentList.length == 2) {
              this.existingFileName = this.referenceData.eclAttachmentList[1].attachmentFileName;
              this.existingFile = this.referenceData.eclAttachmentList[1];
            } else {
              this.existingFileName = this.referenceData.eclAttachmentList[0].attachmentFileName;
              this.existingFile = this.referenceData.eclAttachmentList[0];
            }
          }
          this.isFileExist = this.referenceData.commentsFile2;
          break;
        case "refDoc1":
          this.downloadFileId = this.referenceData.refFile1Id;
          if (this.referenceData.refFile1) {
            this.existingFileName = this.referenceData.refInfo.refDocFileName1;
          }
          this.isFileExist = this.referenceData.refFile1;
          break;
        case "refDoc2":
          this.downloadFileId = this.referenceData.refFile2Id;
          if (this.referenceData.refFile2) {
            this.existingFileName = this.referenceData.refInfo.refDocFileName2;
          }
          this.isFileExist = this.referenceData.refFile2;
          break;
      }
      this.setDisplayUpload();
      if (this.isFileExist) {
        this.fileIcon = this.utils.getFileIcon(this.existingFileName);
        this.getImageContent();
      }
    }
  }
  getImageContent() {
    let file = this.existingFileName;
    if (this.isImageFile(file)) {
      if (this.downloadFileId != null) {        
          this.fileManagerService.downloadFile(this.downloadFileId).subscribe(response => {
          this.isImage = true;
          let blob = new Blob([response], { type: response.type }), url = window.URL.createObjectURL(blob);
          this.refSrcUrl = this.sanitizer.bypassSecurityTrustUrl(url);
          switch (this.attachmentType) {
            case "comment1":
              this.referenceData.refSrcComment1 = this.refSrcUrl;
              break;
            case "comment2":
              this.referenceData.refSrcComment2 = this.refSrcUrl;
              break;
            case "refDoc1":
              this.referenceData.refSrcRefDoc1 = this.refSrcUrl;
              break;
            case "refDoc2":
              this.referenceData.refSrcRefDoc2 = this.refSrcUrl;
              break;
          }
        });
      }
    }
  }


  isImageFile(fileName) {
    let fileExtension: string = fileName.split('.')[1];
    fileExtension = fileExtension.toLowerCase();
    switch (fileExtension) {
      case "png":
      case "jpg":
      case "jpeg":
        return true;
      default:
        return false;
    }

  }

  /* Method invoked when files are dragged and dropped */
  dropFileHandler(event) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    if (this.displayFileUpload) {
      this.updateFilesList(this.utils.dropFileHandler(event));
    }
    this.fileUpload.nativeElement.value = '';
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
    this.addedFile = addedFiles[0];
    if (!this.exitingFileList.some(fileObj => fileObj === this.addedFile.name)) {
      this.addedFileName = this.addedFile.name;
      this.addedFileType = this.addedFile.type;
      this.fileChanged.emit(this.addedFileName);
      this.fileIcon = this.utils.getFileIcon(this.addedFileName);
      switch (this.attachmentType) {
        case "comment1":
          this.referenceData.addedCommentFile1 = this.addedFile;
          break;
        case "comment2":
          this.referenceData.addedCommentFile2 = this.addedFile;
          break;
        case "refDoc1":
          this.referenceData.addedRefDoc1 = this.addedFile;
          break;
        case "refDoc2":
          this.referenceData.addedRefDoc2 = this.addedFile;
          break;
      }
      let file: File = this.addedFile;
      let reader = new FileReader();
      if (this.isImageFile(file.name)) {
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.refSrcUrl = reader.result;
          switch (this.attachmentType) {
            case "comment1":
              this.referenceData.refSrcComment1 = this.refSrcUrl;
              break;
            case "comment2":
              this.referenceData.refSrcComment2 = this.refSrcUrl;
              break;
            case "refDoc1":
              this.referenceData.refSrcRefDoc1 = this.refSrcUrl;
              break;
            case "refDoc2":
              this.referenceData.refSrcRefDoc2 = this.refSrcUrl;
              break;
          }
        }

      } 
      this.setDisplayUpload();
    } else {
      let warnMessage: string = `File '${this.addedFile.name}' already attached, please upload a new file`;
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, warnMessage, 4000, true);
      this.addedFile = null;
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
    this.removeAttachmentDisplay = true;
  }

  /* Method to remove the selected file from the selected files list based on the name of the file
 @input : file object
 reseting the file input if the length of the files list if empty
 */
  removeSelectedFile(fileObj: any) {
    switch (this.attachmentType) {
      case "comment1":
        this.referenceData.addedCommentFile1 = null;
        this.refSrcUrl = null;
        break;
      case "comment2":
        this.referenceData.addedCommentFile2 = null;
        this.refSrcUrl = null;
        break;
      case "refDoc1":
        this.referenceData.addedRefDoc1 = null;
        this.refSrcUrl = null;
        break;
      case "refDoc2":
        this.referenceData.addedRefDoc2 = null;
        this.refSrcUrl = null;
        break;
    }
    this.fileDeleted.emit(this.addedFileName);
    this.addedFileName = null;
    this.setDisplayUpload();
    this.refSrcUrl = null;
    this.fileUpload.nativeElement.value = '';
  }


  removeSavedFile() {
    this.removeAttachmentDisplay = false;
    this.referenceService.deletePdgRefAttachment(this.downloadFileId).subscribe(response => {
      switch (this.attachmentType) {
        case "comment1":
          if (response.code === 200) {
            this.fileDeleted.emit(this.existingFileName);
            this.isFileExist = false;
            this.setDisplayUpload();
            this.referenceData.commentsFile1 = false;
            this.referenceData.refSrcComment1 = null;
            this.refSrcUrl = null;
            this.existingFileName = null;
            this.existingFile = null;
          }
          break;
        case "comment2":
          if (response.code === 200) {
            this.fileDeleted.emit(this.existingFileName);
            this.isFileExist = false;
            this.setDisplayUpload();
            this.referenceData.commentsFile2 = false;
            this.referenceData.refSrcComment2 = null;
            this.refSrcUrl = null;
            this.existingFileName = null;
            this.existingFile = null;
          }
          break;
        case "refDoc1":
          if (response.code === 200) {
            this.fileDeleted.emit(this.existingFileName);
            this.isFileExist = false;
            this.setDisplayUpload();
            this.referenceData.refFile1 = false;
            this.referenceData.refSrcRefDoc1 = null;
            this.refSrcUrl = null;
            this.existingFileName = null;
            this.existingFile = null;
          }
          break;
        case "refDoc2":
          if (response.code === 200) {
            this.fileDeleted.emit(this.existingFileName);
            this.isFileExist = false;
            this.referenceData.refFile2 = false;
            this.referenceData.refSrcRefDoc2 = null;
            this.refSrcUrl = null;
            this.existingFileName = null;
            this.existingFile = null;
            this.setDisplayUpload();
          }
          break;
      }
    });
  }

  /* Method to click the file input by using the id of the input*/
  clickFileUpload() {
    this.fileUpload.nativeElement.click();
  }

  setDisplayUpload() {
    let addFileExist = this.addedFileName == null ? false : true;
    this.displayFileUpload = !this._disableView  &&
                             !this.isFileExist && !addFileExist;
  }

  downloadSavedFile() {
      this.fileManagerService.downloadFile(this.downloadFileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, this.existingFileName);
    });
  }

    /**
* download just uploaded file
* @param file that we want to download.
*/
downloadAddedFile() {
  if (!this._disableView) {
    this.fileManagerService.createDownloadFileElement(this.addedFile, this.addedFileName);
  }
}

}
