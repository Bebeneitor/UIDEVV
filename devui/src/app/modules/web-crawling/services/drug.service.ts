import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from "src/app/shared/models/routing-constants";
import { Observable, of } from 'rxjs';
import { BaseResponse } from 'src/app/shared/models/base-response';
const SERVICE_URL = environment.webCrawlingServiceUrl;

@Injectable({
  providedIn: 'root'
})
export class DrugService {
  drug: any;
  drugClicked: any;
  searchedDrugCode: any;

  constructor(private http: HttpClient) { }

  /**
   * 
  Method to search drug by drugName/alternateName/drugCode
  */
  public drugSearch(drugName): Observable<BaseResponse> {
    if (!!drugName) {
      return this.http.get<BaseResponse>(`${SERVICE_URL}${RoutingConstants.geDrugByName}${drugName}`);
    }
    else {
      return of({ status: 200, message: 'Drug not found', response: null, code: null, data: null, details: null });
    }
  }

  /**
   * 
  Method to find drug by it's ID
  */
  public getDrugById(id): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${SERVICE_URL}${RoutingConstants.getDrugById}${id}`);
  }

  /**
   * 
  Method to fetch the drugs list
  */
  public drugList(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${SERVICE_URL}${RoutingConstants.getAllDrugs}`);
  }

  /**
   * 
  Method to update Run status for drug
  */
  public updateRunStatus(request): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${SERVICE_URL}${RoutingConstants.updateDrug}`, request);
  }

  /**
   * 
  Method to add new drug
  */
  public addDrug(request): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${SERVICE_URL}${RoutingConstants.addNewDrug}`, request);
  }

  /**
   * 
  Method to delete the drug by drugCode
  */
  public deleteDrug(drugCode): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${SERVICE_URL}${RoutingConstants.deleteDrug}${drugCode}`);
  }

  /**
   * 
  Method to delete the Biosimilar by it's name
  */
  public deleteBiosimilarDrug(drugName): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${SERVICE_URL}${RoutingConstants.deleteBiosimilar}${drugName}`);
  }

  /**
   * 
  Method to add new biosimilars
  */
  public addBiosimilars(request): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${SERVICE_URL}${RoutingConstants.addNewBiosimilar}`, request);
  }

  /**
   * 
  Method to update the existing Biosimilar details
  */
  public updateBiosimilars(request): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${SERVICE_URL}${RoutingConstants.updateBiosimilar}`, request);
  }

  /**
   * 
  Method to get data for document comparison
  */
  public getDocumentCompareData(request): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${SERVICE_URL}${RoutingConstants.getComparisonData}`, request);
  }

  /**
   * 
  Method to save the audit logs
  */
  public saveAuditLog(request): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${SERVICE_URL}${RoutingConstants.addAuditLog}`, request);
  }

  /**
   * 
  Method to get all the audit logs
  */
  public getAuditLog(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${SERVICE_URL}${RoutingConstants.getAuditLogs}`);
  }

  /**
   * 
  Method to filter audit logs by date range
  */
  public getAuditLogByDate(fromdate, todate): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${SERVICE_URL}${RoutingConstants.getAuditLogs}/${fromdate}/${todate}`);
  }

/**
   * 
   * Method used to change date format from yyyy-mm-dd to mm yyyy
   */
  public getDrugLastRunDateFormat(date):string{
    return date.split('-')[1] + " " + date.split('-')[0];
  }
   /**
   * 
   * Method used to change date format from yyyymm to mm yyyy
   */
  public getRevisionDateFormat(date):string{
    return date.substr(4, 6) + " " + date.substr(0, 4);
  }

  // array to populate drug list table heading
  public drugListColumns = [
    { field: 'drugCode', header: 'Drug Code' },
    { field: 'drugName', header: 'Drug Name' },
    { field: 'clinicalpharma', header: 'Clinical Pharma' },
    { field: 'micromedex', header: 'Micromedex' },
    { field: 'nccn', header: 'NCCN' },
    { field: 'lexidrug', header: 'LexiDrug' },
    { field: 'ahfsdi', header: 'AHFS-DI' },
    { field: 'lexipn', header: 'Lexi PN' },
    { field: 'lcdlca', header: 'LCD-LCA' },
    { field: 'lastrun', header: 'Last Run' }
  ];

  // array to populate search drug table heading
  public drugDataCols = [
    { field: 'runDrug', header: 'Run Drug' },
    { field: 'drugName', header: 'BioSimilar/Brand' },
    { field: 'portal', header: 'Website' },
    { field: 'druglabel', header: 'Drug Label' },
    { field: 'nccn', header: 'NCCN' },
    { field: 'runbiosimilar', header: 'Run BioSimilar' },
    { field: 'clinicalpharma', header: 'Clinical Pharma' },
    { field: 'micromedex', header: 'Micromedex' },
    { field: 'lexidrug', header: 'LexiDrug' },
    { field: 'ahfsdi', header: 'AHFS-DI' },
    { field: 'lexipn', header: 'Lexi PN' },
    { field: 'lcdlca', header: 'LCD-LCA' },
    { field: 'lastRun', header: 'Last Run' }
  ];

  // array to populate add biosimilar table heading
  public bioSimilarCols = [
    { field: 'biosimilarname', header: 'Biosimilar/Brand name' },
    { field: 'website', header: 'Manufacture website' },
    { field: 'nccname', header: 'NCCN Name' },
    { field: 'dailymedAvailability', header: 'DailyMed Availability' },
    { field: 'drugfdaAvailability', header: 'DrugFDA Availability' },
    { field: 'action', header: 'Special action' }
  ];

  // array to populate add drug table heading
  public addDrugCols = [
    { field: 'clinicalpharmaAvailability', header: 'Clinical Pharma' },
    { field: 'micromedexAvailability', header: 'Micromedex' },
    { field: 'nccnAvailability', header: 'NCCN' },
    { field: 'lexidrugAvailability', header: 'LexiDrug' },
    { field: 'ahfsdiAvailability', header: 'AHFS-DI' },
    { field: 'lexipnAvailability', header: 'Lexi PN' },
    { field: 'lcdlcaAvailability', header: 'LCD-LCA' }
  ];
}

