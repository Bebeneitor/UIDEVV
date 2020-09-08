import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleInfoService } from 'src/app/services/rule-info.service';

@Component({
  selector: 'app-saving-client-adopted-rule',
  templateUrl: './saving-client-adopted-rule.component.html',
  styleUrls: ['./saving-client-adopted-rule.component.css']
})
export class SavingClientAdoptedRuleComponent implements OnInit {

  eclRuleId: any[];
  client: any[];
  payerShort: any[];
  ruleEngine: any[];
  ruleEngineId: any[];
  business: SelectItem[];
  categories: SelectItem[];
  states: SelectItem[];
  jurisdictions: SelectItem[];

  selecteEclRuleId: any[];
  selecteClient: any[];
  selectePayerShort: any[];
  selecteRuleEngine: any[];
  selecteRuleEngineId: any[];
  selectedBusiness: any[];
  selectedCategory: any[];
  selectedState: any[];
  selectedJurisdiction: any[];

  displayEclRuleId: any[];
  displayClient: any[];
  displayPayerShort: any[];
  displayRuleEngine: any[];
  displayRuleEngineId: any[];
  displayLob: any[] = [];
  displayState: any[] = [];
  displayCat: any[] = [];
  displayJur: any[] = [];

  userId: number;

  constructor( private util: AppUtils, 
    private rule: RuleInfoService,
    public route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.userId = this.util.getLoggedUserId()
    });

    this.business = [];
    this.categories = [];
    this.states = [];
    this.jurisdictions = [];

    this.buscatstatejur();

  }

  private buscatstatejur(): void {
    this.util.getAllLobsValue(this.business, true);
    this.util.getAllCategoriesValue(this.categories, true);
    this.util.getAllStatesValue(this.states, true);
    this.util.getAllJurisdictionsValue(this.jurisdictions, true);
  }

  businessCheck() {
    this.displayLob.length = 0;
    this.selectedBusiness.forEach((item: any) => {
      if (item !== undefined) {
        this.displayLob.push(item.name);
      }
    })
  }

  stateCheck() {
    this.displayState.length = 0;
    this.selectedState.forEach((item: any) => {
      if (item !== undefined) {
        this.displayState.push(item.name);
      }
    })
  }

  categoryCheck() {
    this.displayCat.length = 0;
    this.selectedCategory.forEach((item: any) => {
      if (item !== undefined || item !== null) {
        this.displayCat.push(item.name);
      }
    })
  }

  // Note to future dev: jurisdictionValue utils need to match with the other utils to work. lobValue, catValue and stateValue
  jurisdictionCheck() {
    console.log(this.selectedJurisdiction);
    // this.displayJur.length = 0;
    // this.selectedJurisdiction.forEach((item: any) => {
    //   if (item !== undefined || item !== null) {
    //     this.displayJur.push(item.name);
    //   }
    // })
  }

};