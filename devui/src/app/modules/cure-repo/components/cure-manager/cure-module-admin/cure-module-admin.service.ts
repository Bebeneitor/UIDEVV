import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RoutingConstants } from "src/app/shared/models/routing-constants";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Constants } from 'src/app/shared/models/constants';

@Injectable({
  providedIn: "root",
})
export class CureModuleAdminService {
  private setPageTitleSub = new Subject<string>();

  constructor(private http: HttpClient) {}

  getModuleById(moduleId: number) {
    return this.http.get(
      `${environment.restServiceUrl}${RoutingConstants.CURE_URL}/${RoutingConstants.CURE_MODULE}/${moduleId}/config`
    );
  }

  inactiveModule(module: any) {
    module.status = Constants.INACTIVE_STRING_VALUE;
    const cureModuleDto = module;
    return this.http.post(
      `${environment.restServiceUrl}${RoutingConstants.CURE_URL}/${RoutingConstants.CURE_MODULE}`,
      cureModuleDto
    );
  }

  saveModule(module: any) {
    const cureModuleDto = module;
    return this.http.post(
        `${environment.restServiceUrl}${RoutingConstants.CURE_URL}/${RoutingConstants.CURE_MODULE}`,
        cureModuleDto
      );
  }

  setPageTitleObs() {
    return this.setPageTitleSub.asObservable();
  }

  setPageTitle(title: string) {
    this.setPageTitleSub.next(title);
  }
}
