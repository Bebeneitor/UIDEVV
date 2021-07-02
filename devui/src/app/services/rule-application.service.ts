import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
    providedIn: 'root'
})
export class RuleApplicationService {

    constructor(private http: HttpClient) {
        
    }

    public getAllRuleApplicationUrl(requestData: any): Observable<BaseResponse> {
        const url = `${environment.restServiceUrl}${RoutingConstants.GET_RULE_APPLICATION_URL}/${requestData}`;
        return this.http.get<BaseResponse>(url);
        
    }
    
    public rcaCols = [
        { header: 'Ecl Rule Id'},
        { header: 'Concept Name'},
        { header: 'Date of Service Start'},
        { header: 'Date of Service End'},
        { header: 'Implementation Date'}
      ];
  
      public icmsCols = [
        { header: 'Ecl Rule Id'},
        { header: 'Mid Rule'},
        { header: 'Version'},
        { header: 'Sub Rule'},
        { header: 'Implementation Date'},
        { header: 'Rule Description'},
        { header: 'Work Order Number'}
      ];
  
      public rpeCols = [
        { header: 'Ecl Rule Id'},
        { header: 'Rule Sequence No'},
        { header: 'Start Date'},
        { header: 'End Date'},
        { header: 'Implementation Date'}
      ];
  
      public ccvCols = [
        { header: 'Ecl Rule Id'},
        { header: 'Version'},
        { header: 'Implementation Date'}
      ];
  
      public cvpCols = [
        { header: 'Ecl Rule Id'},
        { header: 'Rule Category ID'},
        { header: 'Start Date'},
        { header: 'End Date'},
        { header: 'Implementation Date'}
      ];
	
}