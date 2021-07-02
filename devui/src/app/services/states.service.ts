import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { States } from '../shared/models/states';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
    providedIn: 'root'
})
export class StatesService {

    constructor(private http: HttpClient) {
    }

    public findAllStates(): Observable<States[]> {
        return this.http.get<States[]>(environment.restServiceUrl + RoutingConstants.STATES_URL);
    }
}