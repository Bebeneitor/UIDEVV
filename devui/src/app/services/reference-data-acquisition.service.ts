import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {RoutingConstants} from "../shared/models/routing-constants";
import {FileInfoDto} from "../shared/models/dto/file-info-dto";
import {FileTypeDetailsDto} from "../shared/models/dto/file-type-details-dto";


@Injectable({
  providedIn: 'root'
})
export class ReferenceDataAcquisitionService {

  constructor(private http: HttpClient) {
  }

  public getAllRdaFileInfoDetails(): Observable<FileInfoDto[]> {
    return this.http.get<FileInfoDto[]>(environment.referenceDataAcqServiceUrl + RoutingConstants.FILE_INFO + '/' + RoutingConstants.FILE_LOG_INFO);
  }

  getReferenceSources() {
    return new Promise((resolve) => {
      let referenceTypes: any[] = [];
      let finalReferences = [{label: 'Select', value: ''}];
      this.getAllReferenceSources().subscribe(response => {
        let allReferences: any[] = response;
        allReferences.forEach(re => {
          if (re.fileType != null) {
            let duplicateReference = referenceTypes.find(item => item.label === re.fileType);
            if (duplicateReference === null || duplicateReference === undefined) {
              referenceTypes.push({label: re.fileType, value: re.fileType});
            }
          }
        });
        referenceTypes = referenceTypes.sort((a, b) => {
          if (a.label != null && b.label != null) {
            return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1;
          }
        });
        referenceTypes.forEach( ref => {
          finalReferences.push(ref);
        });
        resolve(finalReferences);
      });
    });
  }


  public getAllReferenceSources(): Observable<FileTypeDetailsDto[]> {
      return this.http.get<FileTypeDetailsDto[]>(environment.referenceDataAcqServiceUrl + RoutingConstants.FILE_INFO + '/' + RoutingConstants.FILE_TYPE_DETAILS);
  }

  getFrequencyByFileType(fileType: string) {
    return new Promise((resolve) => {
      this.getAllFrequencyByFileType(fileType).subscribe(response => {
        let availableFrequencies: any[] = response;
        let frequencies = [];
        let finalFrequencies = [{label: 'Select', value: ''}];
        if (availableFrequencies != null || availableFrequencies !== undefined || availableFrequencies !== []) {
          availableFrequencies.forEach(frq => {
            if (frq.period != null) {
              let duplicateReference = frequencies.find(item => item.label === frq.period);
              if (duplicateReference === null || duplicateReference === undefined) {
                frequencies.push({label: frq.period, value: frq.period});
              }
            }
          });
          frequencies = frequencies.sort((a, b) => {
            if (a.label != null && b.label != null) {
              return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1;
            }
          });
          frequencies.forEach(fq => {
            finalFrequencies.push(fq);
          });
          resolve(finalFrequencies);
        }
      });
    });
  }

  public getAllFrequencyByFileType(fileType: string): Observable<FileTypeDetailsDto[]> {
    return this.http.get<FileTypeDetailsDto[]>(environment.referenceDataAcqServiceUrl + RoutingConstants.FILE_INFO + '/' + RoutingConstants.FILE_TYPE_DETAILS + '/' + fileType);
  }

  public getAllDataByFileTypeAndPeriod(fileType: string, period: string): Observable<FileTypeDetailsDto[]> {
    return this.http.get<FileTypeDetailsDto[]>(environment.referenceDataAcqServiceUrl + RoutingConstants.FILE_INFO + '/' + RoutingConstants.FILE_TYPE_DETAILS + '/' + fileType + '/' + RoutingConstants.FILE_PERIOD + '/' + period);
  }

  public getFileDownload(filePath: string): Observable<any>  {
    return this.http.get(environment.referenceDataAcqServiceUrl + RoutingConstants.FILE_INFO + '/' + RoutingConstants.FILE_DOWNLOAD + '?filePath=' + filePath,  {responseType: 'blob'});
  }


  getFilterReferenceSources(period: string) {
    return new Promise((resolve) => {
      let referenceTypes: any[] = [];
      let finalReferences = [{label: 'Select', value: ''}];
      this.getAllReferenceSources().subscribe(response => {
        let allReferences: any[] = response;
        allReferences.forEach(re => {
          if (re.fileType != null && re.period === period) {
            let duplicateReference = referenceTypes.find(item => item.label === re.fileType);
            if (duplicateReference === null || duplicateReference === undefined) {
              referenceTypes.push({label: re.fileType, value: re.fileType});
            }
          }
        });
        referenceTypes = referenceTypes.sort((a, b) => {
          if (a.label != null && b.label != null) {
            return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1;
          }
        });
        referenceTypes.forEach( ref => {
          finalReferences.push(ref);
        });
        resolve(finalReferences);
      });
    });
  }
}
