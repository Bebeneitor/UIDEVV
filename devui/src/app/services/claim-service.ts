import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoutingConstants } from '../shared/models/routing-constants';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response';
import { EclLookupsService } from './ecl-lookups.service';
import { map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class claimService {

    constructor(public http: HttpClient, private eclLookupsService: EclLookupsService) {

    }

    getAllRuleRevenueCodes(ruleId: number): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.REVENUE_CODE_URL + "/" + ruleId);
    }

    /**
     * Returns the list of claimTypes.
     */
    getClaimTypes(): Observable<SelectItem[]> {
        return this.eclLookupsService.getLookUpsByType('ICMS_CLAIM_TYPE').pipe(map((response: any) => {
            return response.map(element => {
                const selectItem: SelectItem = {
                    value: element.lookupId,
                    label: `${element.lookupCode} - ${element.lookupDesc}`
                }

                return selectItem;
            })
        }));
    }

    getParentSelectedClaimTypes(parentRuleId:number): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(environment.restServiceUrl + RoutingConstants.PROVISIONAL_RULE_URL +"/"+ RoutingConstants.CLAIM_TYPES + "/" + parentRuleId);
    }
}