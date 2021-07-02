import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Jurisdiction } from '../shared/models/jurisdiction';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
    providedIn: 'root'
})
export class JuridictionService {


    constructor(private http: HttpClient) {
    }

    public findAllJuridictions(): Observable<Jurisdiction[]> {
        return this.http.get<Jurisdiction[]>(environment.restServiceUrl + RoutingConstants.JURISDICTIONS_URL);
    }
}