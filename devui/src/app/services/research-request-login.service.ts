import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BaseResponse} from "../shared/models/base-response";
import {environment} from "../../environments/environment";
import {RoutingConstants} from "../shared/models/routing-constants";

const baseURL = `${environment.researchRequestServiceUrl}${RoutingConstants.JIRA_REQUEST_URL}`;

@Injectable({
  providedIn: 'root'
})
export class ResearchRequestLoginService {

  constructor(private http: HttpClient) { }


  public submitCIJiraLogin(researchRequestBody: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${baseURL}${RoutingConstants.CI_JIRA_LOGIN}`, researchRequestBody);
  }

}
