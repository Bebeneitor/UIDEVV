import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { EclColumn } from '../model/ecl-column';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

@Injectable({
    providedIn: 'root'
})
export class EclTableService {
    constructor(private http: HttpClient) {
       }

    getData(endpoint: string, requestObject: any, isFullURL: boolean, columns?: EclColumn[]) {
        const url = isFullURL ? endpoint : environment.restServiceUrl + endpoint;
        return this.http.post(url, requestObject).pipe(map((response: BaseResponse) => {
            if (columns && response.data.dtoList) {
                response.data.dtoList.forEach(el => {
                    columns.forEach(col => {
                        if (el[col.field] === undefined) {
                            el[col.field] = '';
                        }
                        if(col.columnType === EclColumn.CALENDAR && el[col.field]) {
                            el[col.field] = new Date((new Date(el[col.field])).toDateString());
                        } 
                    });
                });
            }

            return response;
        }));
    }

    getCacheData(endpoint: string, requestObject: any, columns?: EclColumn[]) {
        return this.http.post(Constants.redisCacheUrl + endpoint, requestObject).pipe(map((response: any) => {
            if (columns && response) {
                response.data.dtoList.forEach(el => {
                    columns.forEach(col => {
                        if (el[col.field] === undefined) {
                            el[col.field] = '';
                        }
                    });
                });
            }

            return response;
        }));
    }

    getCompareGridData(endpoint: string, requestObject: any, columns?: EclColumn[]) {
        return this.http.post(Constants.redisCacheUrl + endpoint, requestObject).pipe();
    }

    createAsyncFile(requestObject: any, columns?: EclColumn[]){
        return this.http.post(`${environment.restServiceUrl}${RoutingConstants.FILE_MANAGER_URL}/${RoutingConstants.CREATE_ASYNC_FILE}`, requestObject);
    }

    addComment(url, requestObject){
        return this.http.post(url, requestObject);
    }

    getComments(url){
        return this.http.get(url);
    }

    removeComment(url){
        return this.http.delete(url);
    }
}