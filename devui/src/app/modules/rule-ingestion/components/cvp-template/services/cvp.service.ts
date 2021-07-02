import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CvpService {

  constructor(private http: HttpClient) { }

  /**
   * Save or update template in database
   * @param cvpIngestionId 
   * @param screenData 
   */
  saveTemplate(cvpIngestionId: number, screenData: any) {
    return this.http.post(environment.restServiceUrl + RoutingConstants.CVP_INGESTION_TEMPLATE + '/' + RoutingConstants.SAVE_CVP_INGESTION_TEMPLATE, {
      cvpIngestionId: cvpIngestionId,
      cvpTemplateDetails: screenData,
      submitted: false
    });
  }

  /**
   * Retrieve all template information from backend
   * @param cvpIngestionId 
   */
  getTemplate(cvpIngestionId: number) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.CVP_INGESTION_TEMPLATE + '/' + cvpIngestionId);
  }
  
  /**
   * Load catalogs about cvp template
   */
  loadUIData() {
    return this.http.get(environment.restServiceUrl + RoutingConstants.CVP_INGESTION_TEMPLATE + '/' + RoutingConstants.LOAD_DATA_CVP_TEMPLATE);
  }

  /**
   * Service call to construct CVP Templates Excel File
   * @param cvpIngestionIds 
   */
  exportRules(cvpIngestionIds: any[]): Observable<any> {
    return this.http.post(environment.restServiceUrl + RoutingConstants.CVP_INGESTION_TEMPLATE + "/"
      + RoutingConstants.EXPORT_CVP_RULES_TEMPLATE, cvpIngestionIds, {responseType: 'blob'});
  }

}
