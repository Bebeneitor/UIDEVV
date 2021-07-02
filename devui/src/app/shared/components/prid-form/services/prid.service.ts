import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class PridService {

    constructor(private http: HttpClient) {
    }

    /**
   * Creates the prid for the icms template, also returns the url for the lotus notes link.
   * @param creationForm post body element.
   */
    submitProjectCreation(creationForm) {
        return this.http.post<any>(`${environment.restServiceUrl}${RoutingConstants.RMR_URL}/${RoutingConstants.RMR_INDUSTRY_UPDATE_PROCESS}`, creationForm);
    }
  

}