import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { RoutingConstants } from '../shared/models/routing-constants';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST'
    })
};

@Injectable({
    providedIn: 'root'
})
export class IndustryUpdateService {

    constructor(private http: HttpClient) {
    }

    public getIndustryUpdateHistoryDetails(): Observable<any> {
        const url = `${environment.industryUpdateServiceUrl}${RoutingConstants.INDUSTRY_UPDATE_URL}`;
        return this.http.get<any>(url);
    }

    public initiateIndustryUpdate(request: any): Observable<any>{
      const url = `${environment.industryUpdateServiceUrl}${RoutingConstants.INITIATE_INDUSTRY_UPDATE_URL}`;
      return this.http.post<any>(url, request);
    }
};
