import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';
import { EllDecisionPointDto } from '../shared/models/dto/ell-decision-point-dto';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Injectable({
    providedIn: 'root'
})
export class EllDecisionPointService {
    
    constructor(private http: HttpClient) { }

    /** 
     * This method is used to get the decision details from the back-end.
     *  @param releaseLogKey - release log Id.
     *  @param decisionKey - decision Id.
     *  @returns Promise<EllDecisionPointDto>
    */
    getDecisionDetails(releaseLogKey: number, decisionKey: number) {
        return new Promise<EllDecisionPointDto>((resolve, reject) => {
            if (!isNaN(releaseLogKey) && !isNaN(decisionKey)) {
                let uri = `${environment.restServiceUrl}${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_DECISION_URL}/${releaseLogKey}?decisionKey=${decisionKey}`;
                this.http.get(uri).subscribe((baseReponse: BaseResponse) => {
                    resolve(baseReponse.data);
                });
            } else {
                reject("Please enter valid arguments, only numeric values are allowed.");
            }
        });
    }
}