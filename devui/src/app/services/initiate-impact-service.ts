import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RoutingConstants } from '../shared/models/routing-constants';
import { BaseResponse } from "../shared/models/base-response";

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
export class InitiateImpactService {

  constructor(private http: HttpClient) {

  }

  getAllReferenceInfo(refSourceIds: any): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.REFERENCE_INFO_BY_REF_SOURCSE_URL, refSourceIds);
  }

  deletePreImpact(preImpactId:number):Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PRE_IMPACT_ANALYSIS}/${preImpactId}`);
  }

  registerPreImpactAnalysis(file: File):Observable<BaseResponse> {
    let body = new FormData()
    body.append('file', file);
    return this.http.post<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.PRE_IMPACT_ANALYSIS}`, body);
  }
}