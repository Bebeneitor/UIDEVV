import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RuleInfo } from '../shared/models/rule-info';
import { AppUtils } from 'src/app/shared/services/utils';
import { RoutingConstants } from '../shared/models/routing-constants';
import { RuleNotes } from '../shared/models/rule-notes';

@Injectable({
    providedIn: 'root'
})
export class RuleNotesService {

    constructor(private http: HttpClient, private utils: AppUtils) {

    }

    public getRuleNotes(ruleId: number): Observable<any> {
        return this.http.get(`${environment.restServiceUrl}${RoutingConstants.RULE_NOTES_URL}${RoutingConstants.NOTES}${ruleId}`);
    
    }
    
    public getRuleComments(ruleId: number): Observable<any> {
        return this.http.get(`${environment.restServiceUrl}${RoutingConstants.RULE_NOTES_URL}${RoutingConstants.COMMENTS}${ruleId}`);
    }


}