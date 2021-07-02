import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PdgTemplateDownloadAttachment } from 'src/app/shared/models/dto/pdg-preview-dto';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { PdgUtil } from '../../pdg-util';

@Component({
  selector: 'app-pdg-preview-file',
  templateUrl: './pdg-preview-file.component.html',
  styleUrls: ['./pdg-preview-file.component.css']
})
export class PdgPreviewFileComponent implements OnInit {
  fileExists :boolean;
  
_fileList : PdgTemplateDownloadAttachment[];

  @Input() set fileList(data:PdgTemplateDownloadAttachment[]) {
    this._fileList = [];
    this._fileList = data;
    this.processImageFiles();
  }

  @Input() set screenshot(data:PdgTemplateDownloadAttachment) {
    this._fileList = [];
    if (data) {
      this._fileList.push(data);
    }    
    this.processImageFiles();
  }

  @Output() isLoaded = new EventEmitter<any>();

  constructor(private sanitizer: DomSanitizer,
    private utils: AppUtils, private pdgUtil: PdgUtil, 
    private fileManagerService: FileManagerService) { }

  ngOnInit() {
    this.isLoaded.emit();
  }

  processImageFiles() {    
    this.fileExists = false;
    if (this._fileList && this._fileList.length > 0) {
      this.fileExists = true;
      this._fileList.forEach(file => {
        if (this.pdgUtil.isImageFile(file.fileName)) {
        let objectURL = `data:${this.pdgUtil.getImageMimeType(file.fileName)};base64,${file.fileByteData}`;
        file.refSrcUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        } 
      });
    }        
    this.isLoaded.emit();
  }

  getFileIcon(fileName) {
    return this.utils.getFileIcon(fileName);
  }

  
  /**
* Gets the file from the service.
* @param file that we want to download.
*/
  downloadSavedFile(file: PdgTemplateDownloadAttachment) {
    this.fileManagerService.downloadFile(file.fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, file.fileName);
    });
  }
  
}
