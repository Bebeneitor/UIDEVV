import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { FileUploaderOptions } from '../../models/file-uploader-options.model';
import { FileManagerService } from '../../services/file-manager.service';

@Component({
  selector: 'ecl-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  providers: [ConfirmationService]
})
export class FileUploaderComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('myFile',{static: true}) fileInput: ElementRef;

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

  @Input('simpleUploader') simpleUploader: boolean = true;
  @Output('onRemoveMultipleFile') onRemoveMultipleFile: EventEmitter<number>;

  @Input('showTextHover') showTextHover: boolean = false;

  inputText: string = '';
  inputGroup: string;

  selectedText: string = '';

  selectedFile: any = {
    name: ''
  };

  errorLabel: boolean = false;

  @Output() onSetData = new EventEmitter<any>();
  @Output() onDeleteFile = new EventEmitter<any>();

  @Input() fileUpladerOptions: FileUploaderOptions;

  @Output() uploadStarted = new EventEmitter();
  @Output() uploadEnded = new EventEmitter();
  @Output() uploadError = new EventEmitter();

  @Output() onFileChange = new EventEmitter();

  addedFiles: any[] = [];

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;

  constructor(private fileManagerService: FileManagerService, private toastService: ToastMessageService,
    private confirmationService: ConfirmationService) {
    this.inputGroup = this.makeid(10);
    this.onRemoveMultipleFile = new EventEmitter();
  }
  ngOnDestroy(): void {
  }

  ngOnInit() {
    if (!this.showRadioButtons) {
      this.flag = 1;
    }
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
  }

  ngAfterViewChecked() {
    if (this.disabled) {
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
      srcElement: {
        value: this.selectedText
      }
    });
  }

  /**
   * Sends the file to the server,
   * and then send the status to the parent component.
   */
  downloadFile(fileId?: number, fileName?: string) {
    this.fileManagerService.downloadFile(fileId ? fileId : this.fileId).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, fileId ? fileName : this.selectedFile.name);
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'File Download');
    });
  }

  /**
   * Resets the file uploader elements
   */
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

  /**
   * Resets the component and deletes the file in the
   * component.
   */
  removeFile(fileId: number) {
    this.reset();
    this.onDeleteFile.emit({ fileId: fileId });
  }

  /**
   * Remove the file from the list file.
   */
  deleteFile(deletedFile) {
    if (this.fileUpladerOptions.confirmOnDeleteMultipleFile) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this file?',
        accept: () => {
          this.addedFiles = this.addedFiles.filter(file => file.name !== deletedFile.name);
          this.onRemoveMultipleFile.emit(deletedFile);
        }
      });
    } else {
      this.addedFiles = this.addedFiles.filter(file => file.name !== deletedFile.name);
      this.onRemoveMultipleFile.emit(deletedFile);
    }
  }

  /**
   * Sets the selected file.
   * @param event selected file.
   */
  setFile(event) {
    const fileToAdd = (event.target.files[0])
    this.selectedFile = fileToAdd ? fileToAdd : { name: '' };
    this.onFileChange.emit(this.selectedFile);
  }

  /**
   * Adds the files to the list.
   * @param event files to be added to the list.
   */
  setMultipleFiles(event) {
    if (event.target.files && event.target.files.length > 0) {
      let alreadySaved = [];
      let eventFiles = event.target.files;
      if (this.addedFiles && this.addedFiles.some(file => file.name) ) {
        alreadySaved = this.addedFiles.filter(file => file.name);   
        this.addedFiles = [...this.validateAlreadySavedFiles(eventFiles, alreadySaved)];
      } else { 
        this.addedFiles = [...eventFiles];
      }      
    }
    event.target.value = '';
  }

  /**
   * Method to validate if a file is Already saved
   * 
   * @param eventFiles 
   * @param alreadySaved 
   * @returns alreadySaved
   */
  validateAlreadySavedFiles(eventFiles, alreadySaved){
    let fileNames = alreadySaved.map(file => file.name);
    for(let file of eventFiles ){
      if(!fileNames.includes(file.name)){
        alreadySaved.push(file);
      }
    }
    return alreadySaved;    
  }

  /**
   * Sends the file to the server,
   * and then send the status to the parent component.
   */
  uploadFile() {
    this.uploadStarted.next(this.selectedFile);
    this.fileManagerService.uploadFile(this.selectedFile)
      .subscribe(response => {
        this.uploadEnded.next(response);
        this.selectedFile = { name: '' };
        this.fileInput.nativeElement.value = '';
      }, error => {
        this.uploadError.next(error);
        this.selectedFile = { name: '' };
        this.fileInput.nativeElement.value = '';
      });
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  displayTextHover(displayHover :boolean) {
    if(displayHover && this.inputText)
    {
      return this.inputText.substring(0,400);
    }
  }
}
