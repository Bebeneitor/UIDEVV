import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EclLookupsService } from 'src/app/services/ecl-lookups.service';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class ImpactsService {

  constructor(private eclLookupsService: EclLookupsService) { }

  /**
   * Return the list of cv codes.
   */
  getCvCodes(): Observable<any> {
    return this.eclLookupsService.getLookUpsByType('ICMS_CV_CODE').pipe(map((response: any) => {
      return response.map(element => {
        const cvElement = {
          id: +element.lookupId, 
          description: `${element.lookupCode} - ${element.lookupDesc}` 
        };

        return cvElement;
      });
    }));
  }
}
