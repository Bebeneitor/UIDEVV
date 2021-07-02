import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import {BaseResponse} from "../shared/models/base-response";
import { RoutingConstants as rc} from '../shared/models/routing-constants';


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
export class CrosswalkService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST'
    })
  };

  constructor(private http: HttpClient) { }

  getAllEclRuleEngineMapping(ruleEngineShortDesc: any): Observable<BaseResponse> {
    const url = `${environment.restCrossWalkServiceUrl}${rc.CROSS_WALK_URL}/${rc.RULES_URL}/${ruleEngineShortDesc}`;
    return this.http.get<BaseResponse>(url);

  }

  getAllInvalidMidRuleIds(requestBody: any): Observable<any> {
    const url = `${environment.restCrossWalkServiceUrl}${rc.CROSS_WALK_URL}/${rc.MID_RULE_VALIDTION}`;
    return this.http.post<any>(url, requestBody);
  }
}
