import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';


@Injectable({
  providedIn: 'root'
})
export class RuleEngineTemplateService {

  constructor(private http: HttpClient) {
  }

  public getICMSRulesByRule(rule: number): Observable<any> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/'
      + RoutingConstants.ICMS_RULES_BY_RULE_URL + '/' + RoutingConstants.RULES_URL + '/' + rule);
  }

  public getICMSTemplateByRule(rule: number): Observable<any> {
    return this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/'
      + RoutingConstants.ICMS_TEMPLATE_URL + '/' + RoutingConstants.RULES_URL + '/' + rule);
  }

  public getICMSTemplate(ruleId, submitted, rmrType): Observable<any> {
    const requestBody = {
      ruleId: ruleId,
      rmrType: rmrType,
      submitted: submitted
    }

    const requestUrl = `${environment.restServiceUrl}${RoutingConstants.RULE_ENGINE_URL}/${RoutingConstants.ICMS_TYPE_TEMPLATE_URL}`;

    return this.http.post<any[]>(requestUrl, requestBody);
  }

  public getClientInfo(ruleEngineName: string) {
    const requestURL = `${environment.restServiceUrl}${RoutingConstants.RULE_ENGINE_URL}/${RoutingConstants.CLIENT_INFO_URL}`;
    return this.http.get<any>(requestURL, { params: new HttpParams().append('ruleEngineName', ruleEngineName) });
  }

  public saveIcmsRules(eclIcmsNotifiedRuleObj: any): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/'
      + RoutingConstants.SAVE_ICMS_TEMPLATE_URL + '/', eclIcmsNotifiedRuleObj);
  }
  public submitIcmsRules(eclIcmsNotifiedRuleObj: any): Observable<any> {
    return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULE_ENGINE_URL + '/'
      + RoutingConstants.SUBMIT_ICMS_TEMPLATE_URL + '/', eclIcmsNotifiedRuleObj);
  }

  /**
   * Creates the prid for the icms template, also returns the url for the lotus notes link.
   * @param creationForm post body element.
   */
  submitProjectCreation(creationForm) {
    return this.http.post<any>(`${environment.restServiceUrl}${RoutingConstants.RMR_URL}/${RoutingConstants.RMR_CREATE_PROJECT}`, creationForm);
  }
}
