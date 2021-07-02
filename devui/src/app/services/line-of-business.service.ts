import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LineOfBusiness } from '../shared/models/line-of-business';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
    providedIn: 'root'
})
export class LineOfBusinessService {

    constructor(private http: HttpClient) {
    }

    public findAllLob(): Observable<LineOfBusiness[]> {
        return this.http.get<LineOfBusiness[]>(environment.restServiceUrl + RoutingConstants.LOBS_URL);
    }
}