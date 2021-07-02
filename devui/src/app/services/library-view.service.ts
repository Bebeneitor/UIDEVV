import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RoutingConstants } from '../shared/models/routing-constants';
import { BaseResponse } from '../shared/models/base-response';
import { Observable } from 'rxjs';
import { Constants } from '../shared/models/constants';

@Injectable({
  providedIn: 'root'
})
export class LibraryViewService {

  constructor(private http: HttpClient, private dashboardService: DashboardService) { }

  getRulesCatalogueByCategory(activeIndex: number, categoryName: string = null, filter: string = null): Observable<BaseResponse> {
    const url = `${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.RULES_CATALOGUE_URL}`;
    const params = new HttpParams().append("activeIndex", activeIndex.toString())
      .append("categoryName", categoryName != null ? categoryName.toString() : "")
      .append("filter", filter != null ? filter.toString() : "");
    return this.http.get<BaseResponse>(url,{params:params});
  }

  getRulesCatalogueByCategoryFromCache(categoryName: string = null, categoryStatus: string = null): Observable<BaseResponse> {
    const url = `${Constants.redisCacheUrl}${RoutingConstants.CATEGORIES_URL}/${RoutingConstants.RULES_CATALOGUE_URL}/${RoutingConstants.CATEGORY_NAME_URL}/${categoryName}/${RoutingConstants.CATEGORY_STATUS_URL}/${categoryStatus}`;
    return this.http.get<BaseResponse>(url);
  } 

  getRulesByFilters(request) {
    return new Promise((resolve, reject) => {

      let result = [];

      return this.http.post(environment.restServiceUrl + RoutingConstants.RULES_URL + '/' + RoutingConstants.LIBRARY_VIEW_CATALOGUE_URL + '/', request).subscribe((response: any) => {

        if (response.code == 200) {
          //Parse response to internal structure
          let dtoList = response.data.dtoList;
          for (let i = 0; i < dtoList.length; i++) {
            result.push({
              "ruleCode": dtoList[i].ruleCode,
              "ruleDescription": dtoList[i].ruleDescription,
              "ruleName": dtoList[i].ruleName == undefined || dtoList[i].ruleName == null ? dtoList[i].ruleDesc : dtoList[i].ruleName,
              "lob": dtoList[i].lob,
              "jurisdiction": dtoList[i].jurisdiction,
              "state": dtoList[i].state,
              "category": dtoList[i].category,
              "implemented": dtoList[i].implemented,
              "notImplemented": dtoList[i].notImplemented,
              "referenceSource": dtoList[i].referenceSource,
              "referenceDocument": dtoList[i].referenceDocument,
              "logicDate": this.dashboardService.parseDate(new Date(dtoList[i].logicEffectiveDate)),
              "saving": dtoList[i].saving,
              "ruleDd": dtoList[i].ruleId,
              "ruleLogic": dtoList[i].ruleLogic,
              "procedureCodes": dtoList[i].procedureCodes,
              "clientRationale": dtoList[i].clientRationale == undefined ? '' : dtoList[i].clientRationale,
              "internalRationale": dtoList[i].scriptRationale == undefined ? '' : dtoList[i].scriptRationale,
              "opportunityValue": dtoList[i].opportunityValue == undefined ? '' : dtoList[i].opportunityValue
            });
          }
        }

        resolve(result);
      });
    });
  }

  getLibraryViewRulesCatalogFromCache(request) {
    const url = `${Constants.redisCacheUrl}${RoutingConstants.CATEGORIES_URL}/${RoutingConstants.RULE_CATALOG_SEARCH}`;
    return this.http.post(url, request);   
  }
}
