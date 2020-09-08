import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { EmailNotificationService } from 'src/app/services/email-notification.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { EmailNotificationDto } from 'src/app/shared/models/dto/email-notifications-dto';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Component({
  selector: 'app-email-notification',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.css']
})
export class EmailNotificationComponent implements OnInit, OnDestroy {

  editMode: boolean = false;
  emailNotification: EmailNotificationDto = null;

  to: string[] = [];
  cc: string[] = [];
  bcc: string[] = [];
  from: string[] = [];

  notApplicable: string[] = ["N/A"];

  data: any = undefined;

  constructor(private storageService: StorageService, private router: Router, private emailNotificationService: EmailNotificationService, private toastService: ToastMessageService, private utils: AppUtils) {
    if (this.storageService.exists('EMAIL_NOTIFICATION_DATA')) {

      this.editMode = true;
      this.data = this.storageService.get('EMAIL_NOTIFICATION_DATA', true);

      this.emailNotification = this.data;

      if (this.data.recipientTo && this.data.recipientTo != '') {
        this.to = this.data.recipientTo.split(',');
      } else {
        this.to = this.notApplicable;
      }

      if (this.data.recipientCC && this.data.recipientCC != '') {
        this.cc = this.data.recipientCC.split(',');
      } else {
        this.cc = this.notApplicable;
      }

      if (this.data.recipientBCC && this.data.recipientBCC != '') {
        this.bcc = this.data.recipientBCC.split(',');
      } else {
        this.bcc = this.notApplicable;
      }

      if (this.data.emailFrom && this.data.emailFrom != '') {
        this.from = this.data.emailFrom.split(',');
      }

    } else {
      this.editMode = false;
      this.emailNotification = new EmailNotificationDto();
      this.emailNotification.emailNotificationConfigurationId = -1;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  clearRecipients(){
    if(this.emailNotification.recipientEditable){
      this.to = [];
      this.cc = [];
      this.bcc = [];
    }else{
      this.to = this.notApplicable;
      this.cc = this.notApplicable;
      this.bcc = this.notApplicable;
    }
  }

  validateMail(event, list, original, deleteFlag) {
    let email = event.value;

    if (!deleteFlag) {
      if (!this.isValidEmail(email)) {
        list = list.splice(list.length - 1, 1);
        return;
      }

      if (!email.includes("@cotiviti.com")) {
        list = list.splice(list.length - 1, 1);
        return;
      }
    }

    let originList = list.join(',');
    if (list.length == 0) {
      originList = null;
    }

    switch (original) {
      case 'from':
        this.emailNotification.emailFrom = originList;
        break;
      case 'to':
        this.emailNotification.recipientTo = originList;
        break;
      case 'cc':
        this.emailNotification.recipientCC = originList;
        break;
      case 'bcc':
        this.emailNotification.recipientBCC = originList;
        break;
    }
  }

  isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  save() {

    if (!this.emailNotification.emailNotificationConfigurationName || this.emailNotification.emailNotificationConfigurationName == '') {
      this.toastService.messageWarning("Warning!", "Enter a valid notification name to continue.");
      return;
    }

    if ((!this.emailNotification.recipientTo || this.emailNotification.recipientTo == '') && this.emailNotification.recipientEditable) {
      this.toastService.messageWarning("Warning!", "Enter a valid recipient (TO) to continue.");
      return;
    }

    if (!this.emailNotification.emailSubject || this.emailNotification.emailSubject == '') {
      this.toastService.messageWarning("Warning!", "Enter a valid subject to continue.");
      return;
    }

    if (!this.emailNotification.emailBody || this.emailNotification.emailBody == '') {
      this.toastService.messageWarning("Warning!", "Enter a valid body to continue.");
      return;
    }

    if (!this.emailNotification.emailFrom || this.emailNotification.emailFrom == '') {
      this.toastService.messageWarning("Warning!", "Enter a valid sender (FROM) to continue.");
      return;
    }

    if(!this.emailNotification.recipientEditable){
      this.emailNotification.recipientTo = "";
      this.emailNotification.recipientBCC = "";
      this.emailNotification.recipientCC = "";
    }

    this.emailNotification.userId = this.utils.getLoggedUserId();

    if (this.editMode) {
      this.emailNotificationService.update(this.emailNotification).subscribe((response: BaseResponse) => {
        if (response.code == 200) {
          this.toastService.messageSuccess('Success!', 'Email notification was updated successfully.', 2000).then(response => {
            this.router.navigate(['/email-notification']);
          });
        } else {
          this.toastService.messageError('Error!', 'Email notification was not updated, try again.');
        }
      });
    } else {
      this.emailNotificationService.save(this.emailNotification).subscribe((response: BaseResponse) => {
        if (response.code == 200) {
          this.toastService.messageSuccess('Success!', 'Email notification was saved successfully.', 2000).then(response => {
            this.router.navigate(['/email-notification']);
          });
        } else {
          this.toastService.messageError('Error!', 'Email notification was not saved, try again.');
        }
      });
    }

  }

}
