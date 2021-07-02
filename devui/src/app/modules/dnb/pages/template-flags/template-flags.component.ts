import { Component, OnInit, ViewChild } from '@angular/core';
import { CrosswalkService } from 'src/app/services/crosswalk.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { DnbService } from '../../services/dnb.service';
import { ConfirmationService } from "primeng/api";
import { HeaderDialog, IconDialog } from '../../models/constants/dialogConfig.constants';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-template-flags',
  templateUrl: './template-flags.component.html',
  styleUrls: ['./template-flags.component.css']
})
export class TemplateFlagsComponent implements OnInit {

  dngEditFlags: any[];
  selectedFlag: any = null;
  midRules: string = '';
  midRulesText: string = '';
  block: boolean = false;
  errorMidRule: boolean = false;
  enableGenerateButton: boolean = true;

  midRuleAdd: any = {
    midRule: '',
    previousVersion: '',
    nextVersion: ''
  }
  midRulesReport: any[] = [];

  fileTemplate: string = '';

  fileUpload: any = null;
  invalidMidRules: any[] = [];
  blockMessage: string = '';

  @ViewChild('fileLoader',{static: true}) fileLoader;

  constructor(
    private toastMessageService: ToastMessageService, 
    private dnbServices: DnbService, 
    private fileManagerService: FileManagerService,
    private crossWalkService: CrosswalkService,
    private confirmationService: ConfirmationService,
    private toast: ToastMessageService) { }

  ngOnInit() {
    this.loadFlags();
  }

  loadFlags() {
    this.dngEditFlags = [];

    this.dnbServices.getDnbEditFlags().subscribe((response: BaseResponse) => {
      response.data.forEach(flag => {
        this.dngEditFlags.push({
          'label': flag.dnbTemplateName,
          'value': flag.dnbTemplateCode
        });
      });
    });
  }

  clearHTML(text) {
    return text.split('<span class="invalid-midrule">').join('').split('</span>').join('').replace(/(\r\n|\n|\r)/gm, '');
  }

  clearMidRule() {
    this.midRules = this.clearHTML(this.midRules);
  }

  validateMidRulesTemplate(midRules) {
    return new Promise(resolve => {

      let requestBody = [];

      midRules.forEach(midRule => {
        let arrMidRule = midRule.split('.');

        requestBody.push({
          'midRule': midRule,
          'version': null
        })
      });
      
      this.dnbServices.validateMidRules(requestBody).subscribe((response: BaseResponse) => {

        let responseData = response.data;
        let invalidMidRules = [];

        responseData.forEach(item => {
          if(!item.valid) {
            invalidMidRules.push(item);
          }
        });

        this.invalidMidRules = invalidMidRules;

        let textAreaMidRules = this.clearHTML(this.midRulesText).split(',');

        let newHTML = '';

        textAreaMidRules.forEach(itemTextArea => {

          let error = false;

          invalidMidRules.forEach(invalidMidRule => {
            if(invalidMidRule.midRule == itemTextArea) {
              error = true;
            }
          });

          if(error) {
            newHTML += '<span class="invalid-midrule">' + itemTextArea + '</span>,';
          } else {
            newHTML += itemTextArea + ','
          }

        });

        if(newHTML != '') {
          newHTML = newHTML.substring(0, newHTML.length - 1);
        }

        this.midRules = newHTML;

        resolve(invalidMidRules.length == 0);
      });
    });
  }

  generateTemplate() {
    this.enableGenerateButton = false;
    let error = false;
    this.errorMidRule = false;

    if (this.selectedFlag == null) {
      this.toastMessageService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Select DNG Edit Flag to continue.');
      this.enableGenerateButton = true;
      error = true;
    }

    if (this.midRulesText.trim() == '') {
      this.toastMessageService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Enter ICMS Mid Rules List to continue.');
      this.enableGenerateButton = true;
      error = true;
    }

    if (error) {
      return;
    }

    let midRules = this.clearHTML(this.midRulesText).trim().split(' ').join('').split(',');

    this.validateMidRulesTemplate(midRules).then(isValid => {
      
      this.errorMidRule = !isValid;

      if (isValid) {
        this.blockMessage = 'Load File';
        this.block = false;

        let nameFlag = '';

        this.dngEditFlags.forEach(item => {
          if(item.value == this.selectedFlag) {
            nameFlag = item.label;
          }
        })

        let fileName = Constants.CPE_LOAD_FILE_NAME + nameFlag + '.xlsx';        
        
        this.dnbServices.generateDnbTemplate(midRules,this.selectedFlag,fileName).subscribe((response:any)=>{
          if (response.code == 200) {
            this.toast.messageSuccess(Constants.CONFIRMATION_WORD, Constants.FILE_INBOX_MESSAGE);  
            //This timeout is for avoid many clicks from user     
            setTimeout(() => {  this.enableGenerateButton = true; }, 3000);
          } else {
            this.toast.messageError('Error', 'Error processing XLSX file, please try again.');
            this.enableGenerateButton = true;
          }
        });
      }
      else{
        this.enableGenerateButton = true;
      }
    });

  }

  refresh() {
    this.selectedFlag = null;
    this.midRules = '';
    this.midRulesText = '';
    this.errorMidRule = false;

    this.invalidMidRules = [];

    document.querySelector('div.text-area-mid-rules').innerHTML = '';
  }

  setMidRuleValue(event) {
    this.midRulesText = event.target.innerHTML;
  }

  checkKey(event) {
    return (event.which != 13 && this.isNumberKey(event)) || event.which == 44;
  }

  addMidRule() {

    let error = false;

    if(this.midRuleAdd.midRule.trim() == '') {
      error = true;
      this.toastMessageService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Enter midrule to continue');
    }

    if(this.midRuleAdd.previousVersion.trim() == '') {
      error = true;
      this.toastMessageService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Enter previous version to continue');
    }

    if(this.midRuleAdd.nextVersion.trim() == '') {
      error = true;
      this.toastMessageService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Enter new version to continue');
    }

    if(Number(this.midRuleAdd.nextVersion) <= Number(this.midRuleAdd.previousVersion)) {
      error = true;
      this.toastMessageService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'The new version can not be less than previous version.');
    }

    if(error) {
      return;
    }

    this.midRulesReport.push(this.midRuleAdd);

    this.midRuleAdd = {
      midRule: '',
      previousVersion: '',
      nextVersion: ''
    }

    this.toastMessageService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'MidRule added successfully.');
  }

  refreshReport() {
    this.midRuleAdd = {
      midRule: '',
      previousVersion: '',
      nextVersion: ''
    }

    this.invalidMidRules = [];

    this.midRulesReport = [];

    this.fileTemplate = null;

    this.fileLoader.removeFile();
  }

  generateReport() {
    if(this.midRulesReport.length == 0 && this.fileTemplate == null) {
      this.toastMessageService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Upload the input sheet or enter at least one midrule');
      return;
    }

    //Generate report
    this.blockMessage = 'MidRule Diff Report';
    this.block = true;

    if(this.fileTemplate != null) {
      this.dnbServices.getMidRulesByFile(this.fileTemplate).subscribe((response: BaseResponse) => {
        this.generateTemplateReport(response.data);
      });
    } else {
      this.generateTemplateReport(this.midRulesReport);
    }
    
  }

  generateTemplateReport(midRules) {

    this.invalidMidRules = [];

    let midRuleValidation = [];

    midRules.forEach(midRule => {
      midRuleValidation.push({
        'midRule': midRule.midRule,
        'version': midRule.previousVersion
      });

      midRuleValidation.push({
        'midRule': midRule.midRule,
        'version': midRule.nextVersion
      });
    });

    //Validate midRules
    this.dnbServices.validateMidRules(midRuleValidation).subscribe((response: BaseResponse) => {
      
      let responseData = response.data;
      let invalidMidRules = [];

      responseData.forEach(item => {
        if(!item.valid) {
          invalidMidRules.push(item);
        }
      });

      this.invalidMidRules = invalidMidRules;

      if(invalidMidRules.length == 0) {
        this.dnbServices.generateReportTemplates(midRules).subscribe((response) => {
          this.toastMessageService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Report generated successfully.');
          this.fileManagerService.createDownloadFileElement(response, 'MidRule Diff Report.xlsx');
          this.block = false;
        });
      } else {
        this.toastMessageService.messageError(Constants.TOAST_SUMMARY_ERROR, 'There are some errors with the entered MidRules.');
        this.block = false;
      }      
    });    
  }

  downloadTemplate() {
    this.blockMessage = 'template to download';
    this.block = true;
    this.dnbServices.getReportTemplate().subscribe((result) => {
      this.fileManagerService.createDownloadFileElement(
        result,
        "MidRule_Diff_Report_Template.xlsx"
      );
      this.block = false;
    });
  }

  loadFile(event) {
    this.fileTemplate = event;

    if(this.midRulesReport.length > 0) {

      const message = `The data you have entered manually will be lost if you upload file now. Do you want to continue?`;

      this.confirmationService.confirm({
        message,
        header: HeaderDialog.confirm,
        icon: IconDialog.question,
        acceptLabel: "Ok",
        rejectLabel: "Cancel",
        accept: () => {
          setTimeout(() => {
            this.midRulesReport = [];
          });
        },
        reject: () => {
          this.fileLoader.removeFile();
        }
      });
    }
  }

  onPaste(e) {
    e.preventDefault();
    e.target.textContent = e.target.textContent.replace(window.getSelection().toString(), '');
    e.target.textContent = e.target.textContent + e.clipboardData.getData('text/plain');
    this.midRulesText = e.target.textContent;
    return false;
  }

  isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 
      && (charCode < 48 || charCode > 57))
        return false;

    return true;
  }

  handleTabChange(event) {
    this.invalidMidRules = [];
  }

  removeMidRule(index) {
    this.midRulesReport.splice(index, 1);
  }
}
