import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangeLogGroupsService {

  constructor(private http: HttpClient) { }

  /**
   * Gets the change logs data observable.
   */
  getChangeLogs(): Observable<BaseResponse> {
    const url = `${environment.restServiceUrl}${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_CHANGE_RESOURCE}/${RoutingConstants.ELL_CHANGE_LOGS}`;
    return this.http.get<BaseResponse>(url);
  }
}
