import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { EllSearchService } from 'src/app/modules/ell/ell-search/service/ell-search.service';

@Injectable({
  providedIn: 'root'
})
export class EllMidRuleService {

  constructor(private ellSearchService: EllSearchService) { }

  /**
   * This method is used to get the release log key,
   * 
   *  @return Promise.
  */
  loadReleaseLogKey(){
    return this.ellSearchService.loadReleaseLogKey().toPromise();
  }

  /**
   * This method is used to get By members,
   * 
   *  @return SelectItem[].
  */
  getByMembers() {
    let byMembers: SelectItem[] = [];
    byMembers.push({ label: "Mid Rules", value: "MR" });
    byMembers.push({ label: "Payers", value: "P" });
    return byMembers;
  }

}
