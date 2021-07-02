import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { ValidateRuleCodeResponse } from 'src/app/shared/models/validate-rule-code-response';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { DateUtils } from 'src/app/shared/services/utils';
import { UploadRuleCodeRequest } from 'src/app/shared/models/upload-rule-code-request';


const TEMPLATE_EXT = '.xlsx';
const TEMPLATE_NAME = 'hcpcs_cpt_template_';

@Component({
  selector: 'app-provrule-proccodes-upload',
  templateUrl: './provrule-proccodes-upload.component.html',
  styleUrls: ['./provrule-proccodes-upload.component.css']
})



export class ProccodesUploadComponent implements OnInit {

  @Input() response: ValidateRuleCodeResponse = new ValidateRuleCodeResponse();
  @Input() ruleInfo: any;
  uploadedFile: File;
  loading: boolean = false;
  errorMap: any = null;
  
  @ViewChild('fileTemplate',{static: true}) fileTemplate: ElementRef;
  @Output() validatedFile: EventEmitter<any> = new EventEmitter();

  constructor(private codesService: ProcedureCodesService,
    private toastService: ToastMessageService, 
    private fileManagerService: FileManagerService,
    private dateUtils: DateUtils) { }

  ngOnInit() {
    this.loading = false;
    this.uploadedFile = null;
  }

  changeFile(event) {
    if (event.target.files.length > 0) {
      this.uploadedFile = event.target.files[0];
      this.validateUploadedFile();
      this.fileTemplate.nativeElement.value = '';
    }
  }

  validateUploadedFile() {
    this.loading = true;
    let existingRuleCodes = null;
    if (typeof this.response !== undefined && this.response) {
      if (typeof this.response.ruleCodeList !== undefined && this.response.ruleCodeList) {
        existingRuleCodes = this.response.ruleCodeList;
      }
      this.response.errorList = null;
    }
    let uploadRuleCodeRequest = new UploadRuleCodeRequest();
    uploadRuleCodeRequest.codeType = Constants.CPT_CODE_TYPE;
    uploadRuleCodeRequest.existingRuleCodes = existingRuleCodes;
    uploadRuleCodeRequest.ruleId = this.ruleInfo.ruleId;
    this.codesService.validateUploadedProcCodes(this.uploadedFile, uploadRuleCodeRequest).subscribe((resp: any) => {
      let procListReturned = resp.data.ruleCodeList;
      let errorListReturned = resp.data.errorList;

      if(errorListReturned && errorListReturned.DUP_RECORD){
        errorListReturned = null;
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, Constants.DUP_RECORD_SUCCESS);
        this.validatedFile.emit({ type: 'upload'});
      }      
      else if (errorListReturned && errorListReturned != null) {
        this.response.errorList = resp.data.errorList;
        this.errorMap = this.response.errorList;
        this.validatedFile.emit({ type: 'upload'});              
      } else if (procListReturned && procListReturned != null) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Code(s) validated succesfully');
        this.validatedFile.emit({ type: 'upload'});
        this.response.ruleCodeList = resp.data.ruleCodeList;
        this.ruleInfo.hcpcsCptCodeDtoList = this.response.ruleCodeList;
      }
      this.loading = false;
    }, (err => {
      this.loading = false;
    }));

  }

    /**
    * Download a  xslx template file with hcpcs/cpt codes related header.
    */
   downloadXslFile() {
    this.loading = true;
    let datePart = this.dateUtils.getCurrentDateString();
    let fileName = `${TEMPLATE_NAME}${datePart}${TEMPLATE_EXT}`;
    this.codesService.downloadCodeTemplate(Constants.PROCCODE_TEMPLATE_TYPE).subscribe(response => {
      this.fileManagerService.createDownloadFileElement(response, fileName);
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Template Downloaded');
      this.loading = false;
    }, (err) => { this.loading = false; });
  }

  dropFileHandler(event) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    let dragFile: File;
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          var file = event.dataTransfer.items[i].getAsFile();
          dragFile = file;
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)     
      dragFile = event.dataTransfer.files; 
    }
     this.uploadedFile = dragFile;
    this.validateUploadedFile();
    this.fileTemplate.nativeElement.value = '';
  }


}
