import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip, forkJoin } from 'rxjs';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Constants } from 'src/app/shared/models/constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleConsultingService {
  constructor(private http: HttpClient, private fileManagerService: FileManagerService) { }

  /**
   * Returns the modules list as observable.
   */
  getModules(): Observable<any> {
    let originalResponse;
    return this.http.get(`${environment.restServiceUrl}${RoutingConstants.CURE_URL}/${RoutingConstants.CURE_GET_MODULES}`).pipe(map(this.mapModule), switchMap((response: any) => {
      const obs = [];
      originalResponse = response;
      response.forEach(element => {
        obs.push(this.getSavedQueryByModuleId(element.value.cureModuleId));
      });
      return forkJoin(obs);
    }), map(values => {
      let index = 0;
      return values.map(element => {
        let el = originalResponse[index];
        index++;
        return { ...el, value: { savedQuery: { ...element.data[0] }, ...el.value } }
      });
    }));
  }



  /**
   * Saves the selected query.
   * @param value to be saved.
   */
  saveQuery(module, dataToSave: { attributes: any[], selectedAttributes: any[] }): Observable<BaseResponse> {
    const body = this.createRequestObject(dataToSave, module, true);
    return this.http.post<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.CURE_URL}/${RoutingConstants.CURE_SAVE_QUERY}`,
      body).pipe(map(response => {
        return { ...response, data: { ...response.data, ...body } }
      }));
  }

  /**
   * Exports the module data.
   * @param value to be exported
   */
  exportModuleData(module, dataToSave: { attributes: any[], selectedAttributes: any[]}) {
    return this.fileManagerService.createAsyncFileRequest(this.createRequestObject(dataToSave, module));
  }

  /**
   * Create the request object body for the save and export query.
   * @param dataToSave 
   * @param module 
   */
  private createRequestObject(dataToSave, module, isSave = false) {
    const queryTemplate = [];
    if (dataToSave.attributes) {
      for (let index = 0; index < dataToSave.attributes.length; index++) {
        const attribute = dataToSave.attributes[index];

        let value = dataToSave.selectedAttributes[index];
        if (Object.prototype.toString.call(value) === '[object Date]') {
          value = this.parseDate(value);
        }
        queryTemplate.push({
          attributeId: attribute.attributeId,
          value: value,
          name: attribute.attributeName
        });
      }
    }
    
    const serviceParams = {
      cureModuleId: module.cureModuleId,
      cureModuleName: module.moduleName,
      queryName: 'Query 1',
      queryId: (module.savedQuery && module.savedQuery.hasOwnProperty('queryId')) ? module.savedQuery.queryId : 0,
      queryTemplate: { queryAttributes: queryTemplate, exactMatch: dataToSave.exactMatch },
      sqlQuery: 'N/A'
    }
    
    return isSave ? serviceParams : {
        processCode: Constants.CURE_QUERY_PROCESS,
        fileName: `CURE_${module.moduleName.replace(" ", "_")}_Report.csv`,
        serviceParams: serviceParams 
    };
  }

  /**
   * Gets the saved query by module.
   * @param moduleId 
   */
  getSavedQueryByModuleId(moduleId: number) {
    return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.CURE_URL}/${RoutingConstants.CURE_MODULE}/${moduleId}/${RoutingConstants.CURE_GET_QUERIES}`);
  }

  /**
   * Maps the modules response into a SelectItem from primeng.
   * @param response from the get modules.
   */
  mapModule = (response: BaseResponse) => {
    return response.data.map(module => {
      let attributesPerModule;

      if (module.moduleAttributes) {
        // Map evrey module attribute to the SelectItem interface.
        attributesPerModule = module.moduleAttributes.map(this.mapAttribute);
      }

      // Map evrey module to the SelectItem interface.
      // And pull out every module property into the value propertie.
      return {
        value: {
          ...module,
          attributes: attributesPerModule
        },
        label: module.moduleName
      };
    });
  }

  /**
   * Maps the attribute response into a SelectItem from primeng.
   * @param attribute to be mapped.
   */
  mapAttribute = attribute => {
    return { value: { ...attribute }, label: attribute.attributeName };
  };

  /**
   * Parse date to traditional format
   * @param date 
   */
  parseDate(date) {
    if (date == null) { return null; }
    if (typeof date === 'string') {
      date = new Date(date);
    }
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let strMonth = "";

    switch (month) {
      case 0:
        strMonth = "JAN";
        break;
      case 1:
        strMonth = "FEB";
        break;
      case 2:
        strMonth = "MAR";
        break;
      case 3:
        strMonth = "APR";
        break;
      case 4:
        strMonth = "MAY";
        break;
      case 5:
        strMonth = "JUN";
        break;
      case 6:
        strMonth = "JUL";
        break;
      case 7:
        strMonth = "AUG";
        break;
      case 8:
        strMonth = "SEP";
        break;
      case 9:
        strMonth = "OCT";
        break;
      case 10:
        strMonth = "NOV";
        break;
      case 11:
        strMonth = "DEC";
        break;
    }

    return day + "-" + strMonth + "-" + year;
  }

  /**
   * Parse date to traditional format
   * @param date 
   */
  parseDateFromString(date: string) {
    if (date == null) { return null; }
    const dateSplit = date.split('-');

    let day = +dateSplit[0]
    let month = dateSplit[1];
    let year = +dateSplit[2];

    let strMonth;

    switch (month) {
      case 'JAN':
        strMonth = 0;
        break;
      case 'FEB':
        strMonth = 1;
        break;
      case 'MAR':
        strMonth = 2;
        break;
      case 'APR':
        strMonth = 3;
        break;
      case 'MAY':
        strMonth = 4;
        break;
      case 'JUN':
        strMonth = 5;
        break;
      case 'JUL':
        strMonth = 6;
        break;
      case 'AUG':
        strMonth = 7;
        break;
      case 'SEP':
        strMonth = 8;
        break;
      case 'OCT':
        strMonth = 9;
        break;
      case 'NOV':
        strMonth = 10;
        break;
      case 'DEC':
        strMonth = 11;
        break;
    }

    return new Date(year, strMonth, day);
  }
}