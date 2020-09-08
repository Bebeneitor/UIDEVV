import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { EmailNotificationService } from 'src/app/services/email-notification.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';


@Component({
  selector: 'app-email-notification-list',
  templateUrl: './email-notification-list.component.html',
  styleUrls: ['./email-notification-list.component.css']
})
export class EmailNotificationListComponent implements OnInit, OnDestroy {

  cols: any = [];
  data: any = [];
  tableConfig: EclTableModel;

  keywordSearch: string = '';

  constructor(private storageService: StorageService, private router: Router, private emailNotificationService: EmailNotificationService, private toastService: ToastMessageService) {
    
  }

  ngOnInit() {
    let manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();

    manager.addTextColumn('emailNotificationConfigurationName', 'Name', null, true, EclColumn.TEXT, true);

    manager.addTextColumn('emailSubject', 'Subject', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('emailFrom', 'FROM', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('recipientTo', 'TO', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('recipientCC', 'CC', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('recipientBCC', 'BCC',null, true, EclColumn.TEXT, true);
    manager.addIconColumn('emailBody', 'Body', null, 'fa fa-envelope');
    manager.addIconColumn('edit', 'Edit', null,  'fa fa-pencil');
    manager.addIconColumn('delete', 'Delete', null,  'fa fa-trash');



    this.tableConfig.columns = manager.getColumns();
    this.tableConfig.url = RoutingConstants.EMAIL_CONFIGURATIONS_URL+'/'+RoutingConstants.EMAIL_CONFIGURATIONS_ALL_URL;
    this.tableConfig.filterGlobal = true;
    this.tableConfig.lazy = true;
    this.tableConfig.export = true;
    this.tableConfig.excelFileName = "Email Configurations";
    this.tableConfig.dataKey = 'emailNotificationConfigurationName';
    
  }

  ngOnDestroy() {
  }

  onClicIcon(event: any){
    switch(event.field) { 
      case 'edit': { 
        this.edit(event.row)
         break; 
      } 
      case 'delete': { 
        this.remove(event.row.emailNotificationConfigurationId);
         break; 
      } 
      default: { 
        console.log(event);
         break; 
      } 
   } 

  }

  create() {
    this.storageService.remove('EMAIL_NOTIFICATION_DATA');
    this.router.navigate(['/email-notification-setup']);
  }

  edit(data) {
    this.storageService.set('EMAIL_NOTIFICATION_DATA', data, true);
    this.router.navigate(['/email-notification-setup']);
  }

  remove(emailNotificationConfigurationId) {

    this.emailNotificationService.remove(emailNotificationConfigurationId).subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        let index = -1;
        let i = 0;

        this.data.forEach((element) => {
          if (element.emailNotificationConfigurationId == emailNotificationConfigurationId) {
            index = i;
          }

          i++;
        });

        this.data.splice(index, 1);

        this.toastService.messageSuccess('Success!', 'Email notification was removed successfully.');

        this.data = JSON.parse(JSON.stringify(this.data));
      } else {
        this.toastService.messageError('Error!', 'Email notification was not removed successfully.');
      }
    });
  }

  parseList(emails: string) {
    let list = '<ul>';

    if (emails == null) {
      return 'N/A';
    }

    emails.split(',').forEach(element => {
      list += '<li>' + element + '</li>';
    });

    return list + '</ul>';
  }

}
