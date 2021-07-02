import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoutingConstants } from '../shared/models/routing-constants';
import { SavingsResponse } from '../shared/models/savings-response';
import { SavingsRequest } from '../shared/models/savings-request';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST'
    })
  };

  constructor(private http: HttpClient) { }

  getFirstFieldValues(ruleEngine: string, firstField: string): Observable<SavingsResponse> {
    return this.http.get<SavingsResponse>(environment.restServiceSavingsUrl + firstField + "?ruleEngine=" + ruleEngine);
  }

  getICMSPayerNames(firstField: string, secondField: string, selectedFirstFieldValues: string[]): Observable<string[]> {
    if(secondField == null) {
      return this.http.get<string[]>(environment.restServiceSavingsUrl + firstField);
    } else {
      return this.http.post<string[]>(environment.restServiceSavingsUrl + firstField + "/" + secondField, selectedFirstFieldValues);
    }
  }

  getSecondFieldValues(firstField: string, secondField: string, savingsRequest: SavingsRequest): Observable<any> {
    return this.http.post<any[]>(environment.restServiceSavingsUrl + firstField + "/" + secondField, savingsRequest);
  }

  getCPEData(field: string, savingsRequest: SavingsRequest): Observable<SavingsResponse> {
    return this.http.post<SavingsResponse>(environment.restServiceSavingsUrl + RoutingConstants.CVP_SAVINGS_URL + "/" + field, savingsRequest);
  }

  generateExcelReport(engineName: string, requestBody: any): Observable<any> {
    return this.http.post(environment.restServiceUrl + RoutingConstants.ENGINE_SAVINGS_REPORT_URL + "/" + engineName, requestBody, { responseType: 'blob' });
  }

}