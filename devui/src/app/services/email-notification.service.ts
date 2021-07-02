import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmailNotificationDto } from '../shared/models/dto/email-notifications-dto';
import { BaseResponse } from '../shared/models/base-response';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class EmailNotificationService {

  constructor(private http: HttpClient) { }

  getColumns() {
    return [
      { field: 'emailNotificationConfigurationName', header: 'Name', width: '16%' },
      { field: 'emailSubject', header: 'Subject', width: '15%' },
      { field: 'emailFrom', header: 'FROM', width: '18%' },
      { field: 'recipientTo', header: 'TO', width: '18%' },
      { field: 'recipientCC', header: 'CC', width: '18%' },
      { field: 'recipientBCC', header: 'BCC', width: '18%' },
      { field: 'emailBody', header: 'Body', width: '5%' },
      { field: 'options', header: 'Options', width: '10%' },
    ];
  }

  get() {
    return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.EMAIL_CONFIGURATIONS_URL + '/');
  }

  save(emailNotification: EmailNotificationDto) {
    return this.http.post<BaseResponse>(environment.restServiceUrl + RoutingConstants.EMAIL_CONFIGURATIONS_URL + '/', emailNotification);
  }

  update(emailNotification: EmailNotificationDto) {
    return this.http.put<BaseResponse>(environment.restServiceUrl + RoutingConstants.EMAIL_CONFIGURATIONS_URL + '/' + emailNotification.emailNotificationConfigurationId, emailNotification);
  }

  remove(emailNotificationConfigurationId: number) {
    return this.http.delete<BaseResponse>(environment.restServiceUrl + RoutingConstants.EMAIL_CONFIGURATIONS_URL + '/' + emailNotificationConfigurationId, {});
  }
}
