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
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { StorageService } from "src/app/services/storage.service";
import { AuthService } from "../../../services/auth.service";

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
      if (
        request.url.indexOf("/dnb-auth-api") === -1 ||
        request.url.indexOf("/roles") > -1
      ) {
        this.requestCount++;
        if (!this.storageService.exists("isAutosaveActive")) {
          this.loadingSpinnerService.setMessage(request.method, request.url);
          this.loadingSpinnerService.isLoading.next(true);
        } else {
          this.loadingSpinnerService.isLoading.next(false);
        }

        return next.handle(request).pipe(
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
