import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';
import { EllTopicDto } from '../shared/models/dto/ell-topic-dto';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Injectable({
    providedIn: 'root'
})
export class EllTopicDetailService {
    
    constructor(private http: HttpClient) { }

    /** 
     * This method is used to get the topic details from the back-end.
     *  @param releaseLogKey - release log Id.
     *  @param topicKey      - topic Id.
     *  @returns Promise<EllTopicDto>
    */
    getTopicDetails(releaseLogKey: number, topicKey: number) {
        return new Promise<EllTopicDto>((resolve, reject) => {
            if (!isNaN(releaseLogKey) && !isNaN(topicKey)) {
                let uri = `${environment.restServiceUrl}${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_TOPIC}/${releaseLogKey}?topicKey=${topicKey}`;
                this.http.get(uri).subscribe((baseReponse: BaseResponse) => {
                    resolve(baseReponse.data);
                });
            } else {
                reject("Please enter valid arguments, only numeric values are allowed.");
            }
        });
    }
}