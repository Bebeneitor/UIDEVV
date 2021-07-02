import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReferenceSource } from '../shared/models/reference-source';
import { RoutingConstants } from '../shared/models/routing-constants';
import { ReferenceSourceDto } from '../shared/models/dto/reference-source-dto';

@Injectable({
    providedIn: 'root'
})
export class ReferenceSourceService {

    constructor(private http: HttpClient) {
    }

    public findAllReferenceSource(refName:string = null): Observable<ReferenceSource[]> {
        if (refName) {
            return this.http.get<ReferenceSource[]>(encodeURI(`${environment.restServiceUrl}${RoutingConstants.REFERENCE_SOURCE_URL}?sourceDesc=${refName}`));    
        }
        return this.http.get<ReferenceSource[]>(environment.restServiceUrl + RoutingConstants.REF_SOURCES_URL);
    }

    public saveReferenceSource(data:ReferenceSourceDto[]): Observable<any> {
        return this.http.post(environment.restServiceUrl + RoutingConstants.REF_SOURCES_URL, data);
    }

    public getAllReferenceSources() {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.REFERENCE_SOURCE_URL + "/");
    }
    public saveRefSource(refSourceDto: ReferenceSourceDto): Observable<any> {
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.REFERENCE_SOURCE_URL + "/", refSourceDto);
    }
}