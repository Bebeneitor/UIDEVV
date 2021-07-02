import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Categories } from '../shared/models/categories';
import { RoutingConstants } from '../shared/models/routing-constants';
@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    constructor(private http: HttpClient) {
    }

    public findAllCategory(): Observable<Categories[]> {
        return this.http.get<Categories[]>(environment.restServiceUrl + RoutingConstants.CATEGORIES_URL);
    }
}