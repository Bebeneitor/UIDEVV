import { OnInit, Component } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/api';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { MailTagReportDto } from 'src/app/shared/models/dto/mail-tag-report-dto';
import { MailDto } from 'src/app/shared/models/dto/mail-dto';
import { MetadataCacheService } from 'src/app/services/metadata-cache.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.css'],
  providers: []
})

export class EmailReport implements OnInit {

  reportName: string = "";
  subject: string = "";
  toList: string[] = [];
  ccList: string[] = [];
  bccList: string[] = [];
  emailBody: string = "";
  tagId: number = null;
  loggedUser: any = null;
  emailValidator: RegExp = new RegExp('^[A-za-z0-9]+(.|-|_)[A-za-z0-9]+[A-za-z0-9.-_]*@cotiviti.com$');

  constructor(private dialogService: DialogService, private toastService: ToastMessageService, private config: DynamicDialogConfig,
    private metadataCacheService: MetadataCacheService, private authorizationService: AuthService) { }

  ngOnInit() {
    this.reportName = this.config.data.reportName;
    this.tagId = this.config.data.tagId;
    this.loggedUser = this.authorizationService.getLoggedUser();
  }

  validateMail(event: any, field: string) {
    if (!this.emailValidator.test(event.value)) {
      switch (field) {
        case "to":
          this.toList.pop();
          break;
        case "cc":
          this.ccList.pop();
          break;
        case "bcc":
          this.bccList.pop();
      }
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please enter a valid email address', 5000, true);
    }
  }

  downloadReport() {
    this.metadataCacheService.generateTagReport(this.tagId).subscribe((response: any) => {
      var a = document.createElement("a");
      document.body.appendChild(a);
      let blob = new Blob([response], { type: Constants.FILE_TYPE }), url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = this.reportName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  close() {
    this.dialogService.dialogComponentRef.destroy();
  }

  validateInformation() {
    let toInputElement: any = document.querySelector(".to-list .ui-chips-input-token input");
    let ccInputElement: any = document.querySelector(".cc-list .ui-chips-input-token input");
    let bccInputElement: any = document.querySelector(".bcc-list .ui-chips-input-token input");
    let validToList: boolean = true;
    let validCcList: boolean = true;
    let validBccList: boolean = true;
    let validBody: boolean = this.emailBody.length > 0;
    if (this.toList.length > 0) {
      validToList = this.validateField("to", toInputElement.value);
      validCcList = this.validateField("cc", ccInputElement.value);
      validBccList = this.validateField("bcc", bccInputElement.value);
    } else {
      validToList = this.validateField("to", toInputElement.value);
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please enter at least one email in TO field', 5000, true);
    }
    if(!validBody) {
      this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please enter Email body field', 5000, true);
    }
    if (validToList && validCcList && validBccList && validBody) {
      this.sendEmail();
    }
  }

  validateField(field: string, fieldValue: string) : boolean {
    let fieldIsValid: boolean = true;
    if(this.toList.length == 0) {
      fieldIsValid = false;
    }
    if (fieldValue != "") {
      if (this.emailValidator.test(fieldValue)) {
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'press enter key to add an email address', 5000, true);
        fieldIsValid = false;
      } else {
        this.toastService.messageWarning(Constants.TOAST_SUMMARY_WARN, 'Please enter a valid email address in ' + field.toUpperCase() + ' field', 5000, true);
        fieldIsValid = false;
      }
    }
    return fieldIsValid;
  }

  sendEmail() {
    let mailTagReport: MailTagReportDto = new MailTagReportDto();
    mailTagReport.reportName = this.reportName;
    let mailDto: MailDto = new MailDto();
    mailDto.to = this.toList;
    mailDto.cc = this.ccList;
    mailDto.bcc = this.bccList;
    mailDto.subject = this.subject;
    mailDto.content = this.emailBody.toString();
    mailDto.from = this.loggedUser.email + "@cotiviti.com";
    mailTagReport.mailDto = mailDto;
    mailTagReport.tagId = this.tagId;
    this.metadataCacheService.sendTagReportEmail(mailTagReport).subscribe((response: BaseResponse) => {
      if (response.code === 200) {
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, "Email sent successfully!", 2000, true);
        this.close();
      }
    });
  }

}