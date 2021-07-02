import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EclLookupsDto } from '../shared/models/dto/ecl-lookups-dto';
import { AppUtils } from '../shared/services/utils';
import { Users } from '../shared/models/users';
import { RoutingConstants } from '../shared/models/routing-constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseResponse } from '../shared/models/base-response';

@Injectable({
    providedIn: 'root'
})
export class EclLookupsService {

    constructor(private http: HttpClient, private utils: AppUtils) {
    }

    public getColumns() {
        return [
            { field: 'lookupId', header: 'ID' },
            { field: 'lookupType', header: 'Type' },
            { field: 'lookupCode', header: 'Code' },
            { field: 'lookupDesc', header: 'Description' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'createdDt', header: 'Creation Date' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'updatedOn', header: 'Updated Date' },
            { field: 'statusId', header: 'Status' },
            { field: 'options', header: 'Options' }
        ];
    }

      /**
     * Returns the list of lookup codes.
     * @param type lookup type.
     * @param code Lookup code.
     * @param description Lookup description.
     * @param first element.
     * @param last element.
     * @param justActives indicatres if we just want the active elements.
     */
    public search(type: string, code: string, description: string, first: number = 0, last: number = 5, justActives = false) {
        return new Promise((resolve) => {
            this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + '/' + RoutingConstants.LOOKUPS_SEARCH_URL + '?type=' + type + '&code=' + code + '&description=' + description + '&first=' + first + '&last=' + last)
                .subscribe((response: any) => {
                    let data = [];

                    if (justActives) {
                        response.data.lookups.forEach(item => {
                            if (item.statusId === 1) {
                                data.push(item);
                            }
                        });
                    } else {
                        data = response.data.lookups;
                    }

                    response.data.lookups = data;

                    resolve(response);
                });
        })
    }

    /**
     * Returns the list of lookup codes.
     * @param type lookup type.
     * @param code Lookup code.
     * @param description Lookup description.
     * @param first element.
     * @param last element.
     * @param justActives indicatres if we just want the active elements.
     */
    searchNoPromise(type: string, code: string, description: string, first: number = 0, last: number = 5, justActives = false) {
        const url = `${environment.restServiceUrl}${RoutingConstants.LOOKUPS_URL}/${RoutingConstants.LOOKUPS_SEARCH_URL}`;
        const params = new HttpParams().append('type', type).append('code', code).append('description', description)
            .append('first', first.toString()).append('last', last.toString());

        return this.http.get(url, { params: params }).pipe(map((response: any) => {
            if (justActives) {
                return response.data.lookups.filter(element => element.statusId === 1);
            } else {
                return response.data.lookups;
            }
        }));
    }

    public save(lookup: EclLookupsDto) {
        return new Promise((resolve) => {

            if (!lookup.createdBy) {
                lookup.createdBy = new Users();
            }

            lookup.createdBy.userId = this.utils.getLoggedUserId();

            this.http.post(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + '/' + RoutingConstants.LOOKUPS_SAVE_URL, lookup).subscribe((response: any) => {
                resolve(response);
            });
        });
    }

    public update(lookup: EclLookupsDto) {
        return new Promise((resolve) => {

            if (!lookup.updatedBy) {
                lookup.updatedBy = new Users();
            }

            lookup.updatedBy.userId = this.utils.getLoggedUserId();

            this.http.post(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + '/' + RoutingConstants.LOOKUPS_UPDATE_URL, lookup).subscribe((response: any) => {
                resolve(response);
            });
        });
    }

    public deactivate(lookup: EclLookupsDto) {
        lookup.statusId = 2;

        if (!lookup.updatedBy) {
            lookup.updatedBy = new Users();
        }

        lookup.updatedBy.userId = this.utils.getLoggedUserId();

        return new Promise((resolve) => {
            this.http.post(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + '/' + RoutingConstants.LOOKUPS_UPDATE_URL, lookup).subscribe((response: any) => {
                resolve(response);
            });
        });
    }

    public activate(lookup: EclLookupsDto) {
        lookup.statusId = 1;

        if (!lookup.updatedBy) {
            lookup.updatedBy = new Users();
        }

        lookup.updatedBy.userId = this.utils.getLoggedUserId();

        return new Promise((resolve) => {
            this.http.post(environment.restServiceUrl + RoutingConstants.LOOKUPS_URL + '/' + RoutingConstants.LOOKUPS_UPDATE_URL, lookup).subscribe((response: any) => {
                resolve(response);
            });
        });
    }

    /**
     * Returns the list of lookups with a specific type.
     * @param type column on db to filter the lookups.
     */
    getLookUpsByType(type: string): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(`${environment.restServiceUrl}${RoutingConstants.LOOKUPS_URL}`, {params: new HttpParams().append('type', type)});
    }
}