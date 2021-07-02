import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants as rc } from 'src/app/shared/models/routing-constants';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { SelectItem } from 'primeng/api';
import { UpdateInstanceDto } from '../shared/models/dto/update-instance-dto';
import { MwfReportRequestDto } from '../shared/models/dto/mwf-report-request-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicaidReportService {

  private baseURL = `${environment.mwfReportServiceUrl}${rc.MWF_REPORT_URL}`
  constructor(private http: HttpClient) { }

  /**
   * This method is used to get the Update Instance Names.
   *  @return Promise<SelectItem[]>.
  */
  getAllUpdateInstanceNames(selectedStartDate:any, selctedEndDate:any) {
    let fromToDate: any;
    fromToDate = {
      fromDate: selectedStartDate,
      toDate: selctedEndDate
    };

    return new Promise<SelectItem[]>((resolve) => {
      let updateInstanceNames: SelectItem[] = [];
      this.http.post<BaseResponse>(`${this.baseURL}/${rc.MWF_REPORT_UPDATE_INSTANCE_URL}`, fromToDate)
              .subscribe((baseReponse: BaseResponse) => {
          let allUpdateInstances: UpdateInstanceDto[] = baseReponse.data;
          allUpdateInstances.forEach(updateInstance => {
            updateInstanceNames.push({ label: updateInstance.updateInstanceName, value: updateInstance.updateInstanceKey });
          });
          updateInstanceNames = updateInstanceNames.sort((a, b) => {
            return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1;
          });
          resolve(updateInstanceNames);
        });
    });
  }

  /**
   * This method is used to get the Update Instance Names.
   *  @return Promise<SelectItem[]>.
  */
 getClientsByUpdateInstanceKey(requestObj: any) {
    return new Promise<SelectItem[]>((resolve) => {
      let clients: SelectItem[] = [];
      this.http.post<BaseResponse>(`${this.baseURL}/${rc.MWF_REPORT_CLIENTS_URL}`, requestObj)
        .subscribe(({ data }) => {
          if (data !== undefined && data !== null) {
            clients = data.map(client => {
              return { label: client.clientName, value: client.clientName };
            }).sort((a, b) => {
              return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1;
            });
            resolve(clients);
          } else {
            resolve([]);
          }
        });
    });
  }

  /**
  * This method is used to get the Update Instance Names.
  *  @return Promise<SelectItem[]>.
 */
  getPayersByClient(client: any) {
    return new Promise<SelectItem[]>((resolve) => {
      let payers: SelectItem[] = [];
      this.http.post<BaseResponse>(`${this.baseURL}/${rc.MWF_REPORT_PAYERS_URL}`, client)
        .subscribe(({ data }) => {
          if (data !== undefined || data !== null) {
            payers = data.map(payer => {
              return { label: payer, value: payer };
            }).sort((a, b) => {
              return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1
            });
            resolve(payers);
          } else {
            resolve([]);
          }
        });
    });
  }

  getMwfReport(mwfReportRequestDto: any): Observable<MwfReportRequestDto> {
    let uri = `${this.baseURL}/${rc.MWF_REPORT_VIEW_RESULT_URL}`;
    return this.http.post<any>(uri, mwfReportRequestDto);
  }

  getGenerateReport(mwfReportRequest: any): Observable<any> {
    let uri = `${this.baseURL}/${rc.MWF_GENERATE_REPORT_URL}`;
    return this.http.post(uri, mwfReportRequest, { responseType: 'blob' });
  }

}


