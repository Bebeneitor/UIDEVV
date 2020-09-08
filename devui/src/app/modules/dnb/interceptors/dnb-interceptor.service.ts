import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { map } from "rxjs/internal/operators/map";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { StorageService } from "src/app/services/storage.service";
import { AuthService } from "../../../services/auth.service";
import { drugVersionStatus } from "../models/constants/drug.constants";

@Injectable({
  providedIn: "root",
})
export class DnbInterceptorSevice implements HttpInterceptor {
  private requestCount: number = 0;

  constructor(
    private storageService: StorageService,
    private authenticationService: AuthService,
    private loadingSpinnerService: LoadingSpinnerService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.indexOf("/dnb") > -1) {
      if (request.url.indexOf("/dnb-auth-api") === -1) {
        const tokenDnb = this.storageService.get("dnbToken", false);
        const tokenEcl = this.storageService.get("Authorization", true);
        const isTokenExpired = this.authenticationService.isTokenExpired(
          tokenDnb
        );

        if (isTokenExpired) {
          this.storageService.removeAll();
          this.router.navigate(["/login"]);
        }

        const headers = new HttpHeaders({
          Authorization: "Bearer " + tokenDnb,
          "X-ECLAuth": tokenEcl,
        });
        this.requestCount++;
        this.loadingSpinnerService.setMessage(request.method, request.url);
        this.loadingSpinnerService.isLoading.next(true);
        return next.handle(request.clone({ headers })).pipe(
          // Patch in order to filter correctly In Progress Versions, remove after API does this itself
          map((request: any) => {
            if (
              request.url &&
              request.url.indexOf("/drugs/versions/list/") > -1
            ) {
              if (request.body && request.body.data) {
                let data = request.body.data.dtoList;
                const approvedVersions = data
                  .filter(
                    (version) =>
                      version.versionStatus.code ===
                      drugVersionStatus.Approved.code
                  )
                  .sort((versionA, versionB) => {
                    return versionA.majorVersion > versionB.majorVersion
                      ? 1
                      : -1;
                  });
                const inProgressVersions = data
                  .filter(
                    (version) =>
                      version.versionStatus.code ===
                        drugVersionStatus.Draft.code ||
                      version.versionStatus.code ===
                        drugVersionStatus.InProgress.code
                  )
                  .sort((versionA, versionB) => {
                    return (versionA.revVersion || 0) <
                      (versionB.revVersion || 0)
                      ? -1
                      : 1;
                  });
                const lastRevision = inProgressVersions.pop();
                if (lastRevision) {
                  approvedVersions.unshift(lastRevision);
                }
                request.body.data.dtoList = approvedVersions;
                request.body.data.totalRecords = approvedVersions.length;
              }
            }
            return request;
          }),
          finalize(() => {
            this.removeRequest(request);
          })
        );
      }
    }
    return next.handle(request);
  }

  removeRequest(req: HttpRequest<any>) {
    this.requestCount--;
    if (this.requestCount === 0) {
      this.loadingSpinnerService.isLoading.next(false);
    }
  }
}
