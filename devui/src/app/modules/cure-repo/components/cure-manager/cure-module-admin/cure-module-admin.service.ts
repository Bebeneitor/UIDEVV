import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RoutingConstants } from "src/app/shared/models/routing-constants";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Constants } from 'src/app/shared/models/constants';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Injectable({
  providedIn: "root",
})
export class CureModuleAdminService {
  baseUrl = `${environment.restServiceUrl}${RoutingConstants.CURE_URL}`;
  private setPageTitleSub = new Subject<string>();

  constructor(private http: HttpClient) {}

  getModuleById(moduleId: number) {
    return this.http.get(
      `${this.baseUrl}/${RoutingConstants.CURE_MODULE}/${moduleId}/config`
    );
  }

  getModuleViewByName(moduleView: string) {
    return this.http.get<BaseResponse>(
      `${this.baseUrl}/${RoutingConstants.CURE_MODULE}/${moduleView}`
    );
  }

  inactiveModule(module: any) {
    module.status = Constants.INACTIVE_STRING_VALUE;
    const cureModuleDto = module;
    return this.http.post(
      `${this.baseUrl}/${RoutingConstants.CURE_MODULE}`,
      cureModuleDto
    );
  }

  saveModule(module: any) {
    const cureModuleDto = module;
    return this.http.post(
        `${this.baseUrl}/${RoutingConstants.CURE_MODULE}`,
        cureModuleDto
      );
  }

  setPageTitleObs() {
    return this.setPageTitleSub.asObservable();
  }

  setPageTitle(title: string) {
    this.setPageTitleSub.next(title);
  }

  getModelViewList(){
    return this.http.get<BaseResponse>(
      `${this.baseUrl}/${RoutingConstants.CURE_MODULE_VIEW_LIST}`
    );
  }

  processModules(cureIds: number[]) {
    return this.http.post<BaseResponse>(`${this.baseUrl}/curemodules`, cureIds);
  }
}
