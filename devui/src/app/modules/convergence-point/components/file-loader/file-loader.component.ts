import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {

  @ViewChild('fileTemplate',{static: true}) fileTemplate;
  @Output() onFileLoad = new EventEmitter();

  @Input('allowedExtensions') allowedExtensions: string;
  @Input('extraText') extraText: string;

  fileLoaded: File = null;

  constructor(private toastMessageService: ToastMessageService) { }

  ngOnInit() {
    this.fileLoaded = null;

    if (this.allowedExtensions == null) {
      this.allowedExtensions = '*';
    }

    this.onFileLoad.emit(this.fileLoaded);
  }

  changeFile(event) {

    this.fileLoaded = event.target.files[0];

    this.validateFile();
  }

  validateFile() {
    if (this.allowedExtensions != null && this.allowedExtensions != '*') {
      let extensions = this.allowedExtensions.split(',');

      let fileExtension = this.fileLoaded.name.split('.').pop();

      if (this.isInArray(extensions, fileExtension)) {
        this.onFileLoad.emit(this.fileLoaded);
      } else {
        this.removeFile();
        this.toastMessageService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Invalid extension, must add files with extensions (' + this.allowedExtensions + ').');
      }
    } else {
      this.onFileLoad.emit(this.fileLoaded);
    }
  }

  isInArray(array, word) {
    return array.indexOf('.' + word.toLowerCase()) > -1;
  }

  removeFile() {
    this.fileLoaded = null;
    this.fileTemplate.nativeElement.value = null;
    this.onFileLoad.emit(this.fileLoaded);
  }

  humanFileSize(size) {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i) * 1).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

  dropFileHandler(event) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {

        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          var file = event.dataTransfer.items[i].getAsFile();
          this.fileLoaded = file;
        }
      }

    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        this.fileLoaded = event.dataTransfer.files[i];
      }
    }

    this.validateFile();

  }

}
