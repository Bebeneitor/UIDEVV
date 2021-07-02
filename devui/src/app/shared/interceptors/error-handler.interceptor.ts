import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from 'primeng/api';
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorFilter implements HttpInterceptor {

  lastTimeMessage = 0;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const xhr = req.clone();
    const isVersionErrorResponse = req.url.includes('version.json');

    return next.handle(xhr).pipe(
      catchError((err) => {
        
        if (err instanceof HttpErrorResponse) {
          let errorMessage = "";
          const currentTimestamp = new Date().getTime();
          if (currentTimestamp - this.lastTimeMessage >= 3000) {
            if (!isVersionErrorResponse) 
              this.lastTimeMessage = currentTimestamp;
            
            errorMessage = err.error ? (err.error.message ? err.error.message : err.message) : err.message;            
            if(errorMessage.startsWith('MidRuleKey')){              
              return throwError('Backend error: ' + errorMessage);;
            }
            // If is not a checkVersion Error then we show the message.
            if (!isVersionErrorResponse) {
              this.messageService.add({ key: 'globalToast', severity: 'error', detail: errorMessage });
            }

            if (err.error.details != null && err.error.details.length > 0 && !isVersionErrorResponse) {
              if (Array.isArray(err.error.details)) {
                for (let subError of err.error.details) {
                  if (subError.data) {
                    this.messageService.add({ key: 'globalToast', severity: 'error', detail: subError.data + " - " + subError.message });
                  } else {
                    this.messageService.add({ key: 'globalToast', severity: 'error', detail: subError.message });
                  }
                }
              }
            }
          }

          return throwError('Backend error: ' + errorMessage);
        }
      })
    );
  }
}

export const HttpErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpErrorFilter,
  multi: true,
};
