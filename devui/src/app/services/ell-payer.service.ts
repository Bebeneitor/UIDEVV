import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class EllPayerService {

  constructor(private http: HttpClient) { }

  loadAllPayers(){
    return this.http.get(environment.restServiceUrl + RoutingConstants.ELL_URL + '/' + RoutingConstants.ELL_PAYER + '/');
  }

}
