import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit, AfterViewChecked {

  @Input('label') label: string;
  @Input('fileId') fileId: number = 0;

  @Input('disabled') disabled: boolean = false;
  @Input('labelNo') labelNo: string = "No";
  @Input('labelYes') labelYes: string = "Yes";

  @Input('showRadioButtons') showRadioButtons: boolean = true;
  @Input('showInputText') showInputText: boolean = true;
  @Input('showInputFile') showInputFile: boolean = true;

  @Input('isTextArea') isTextArea: boolean = false;
  @Input('isRequired') isRequired: boolean = false;

  @Input('flag') flag: number = 0;

  inputText: string = '';
  inputGroup: string;

  selectedText: string = '';
  selectedFile: any = {
    name: ''
  };

  errorLabel: boolean = false;

  @Output() onSetData = new EventEmitter<any>();
  @Output() onDeleteFile = new EventEmitter<any>();

  constructor(private fileManagerService: FileManagerService, private toastService: ToastMessageService) {
    this.inputGroup = this.makeid(10);
  }

  ngOnInit() {
    if (!this.showRadioButtons) {
      this.flag = 1;
    }
  }

  ngAfterViewChecked() {
    if(this.disabled) {
      this.reset();
    }
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  setData(event) {
    this.selectedText = event.target.value;
    this.onSetData.emit({
      srcElement : {
        value : this.selectedText
      }
    });
  }

  setFile(event) {
    this.selectedFile = (event.target.files[0]);
  }

  downloadFile() {
    this.fileManagerService.downloadFile(this.fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, this.selectedFile.name);
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'File Download');
    });
  }

  reset() {
    if (!this.showRadioButtons) {
      this.flag = 1;
    } else {
      this.flag = 0;
    }

    this.inputText = '';
    this.selectedFile = {
      name: ''
    };

    this.fileId = 0;
  }

  removeFile(fileId: number) {
    this.reset();
    this.onDeleteFile.emit({ fileId: fileId });
  }

}
