import { LibraryStatusCodesComponent } from './library-status-codes/library-status-codes.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EllSubRuleSearchService } from 'src/app/services/ell-sub-rule-search.service';
import { SelectItem } from 'primeng/api';
import { EllSearchDto } from 'src/app/shared/models/dto/ell-search-dto';
import { Constants } from 'src/app/shared/models/constants';
import { MidRuleComponent } from './mid-rule/mid-rule.component';
import { MidRuleKeyComponent } from './mid-rule-key/mid-rule-key.component';
import { PayerRuleComponent } from './payer-rule/payer-rule.component';
import { LibraryRuleComponent } from './library-rule/library-rule.component';
import { ChangeTypesComponent } from './change-types/change-types.component';
import { ChangeSourcesComponent } from './change-sources/change-sources.component';
import { ChangeLogGroupsComponent } from './change-log-groups/change-log-groups.component';
import { CptCodeComponent } from './cpt-code/cpt-code.component';
import { IcdCodeComponent } from './icd-code/icd-code.component';

@Component({
  selector: 'app-sub-rule-search',
  templateUrl: './sub-rule-search.component.html',
  styleUrls: ['./sub-rule-search.component.css']
})
export class SubRuleSearchComponent implements OnInit {

  @ViewChild('midRules') midRules: MidRuleComponent;
  @ViewChild('midRulesKey') midRulesKey: MidRuleKeyComponent;
  @ViewChild('payerRules') payerRules: PayerRuleComponent;
  @ViewChild('libraryRule') libraryRule: LibraryRuleComponent;
  @ViewChild('changeLogGroup') changeLogGroup: ChangeLogGroupsComponent;
  @ViewChild('changeTypes') changeTypes: ChangeTypesComponent;
  @ViewChild('changeSources') changeSources: ChangeSourcesComponent;
  @ViewChild('cptCode') cptCode: CptCodeComponent;
  @ViewChild('icdCode') icdCode: IcdCodeComponent;
  @ViewChild('libraryStatusCodes') libraryStatusCodes: LibraryStatusCodesComponent;

  //Search attributes
    keywordSearch           : string;
    ellSearchDto            : EllSearchDto;
  //Seach attributes

  localConstants = Constants;

  //Parent dropdown
  subRuleTypes                : SelectItem[];
  selectedSubRuleType         : string;

  //Son dropdown
  isVisibleSubRuleSecondary    : boolean;
  subRuleSecondaryLabel        : string;
  subRuleSecondaryTypes        : SelectItem[];
  selectedSubRuleSecondaryType : string;

  selectedScreen               : string;
  isVisibleSearchComponent    : boolean;
  expandedFilters: boolean = true;

  constructor(private ellSubRuleSearchService: EllSubRuleSearchService) { }

  ngOnInit() {
    this.isVisibleSearchComponent = false;
    this.cleanSearchComponent();
    this.subRuleTypes = this.ellSubRuleSearchService.getSubRulesType();
    this.isVisibleSubRuleSecondary = false;
  }

 /**
   * This method is used for clean the data of seach component
   */
  private cleanSearchComponent(){
    this.keywordSearch = Constants.EMPTY_STRING;
    this.ellSearchDto = null;
  }

  /**
   * This method is used when the user changes the sub rule type (Parent dropdown)
   */
  changeSubRuleType(){  
    this.selectedScreen = undefined;
    this.selectedSubRuleSecondaryType = undefined;
    this.cleanSearchComponent();
    this.subRuleSecondaryTypes = this.ellSubRuleSearchService.getSubRulesSecondaryType(this.selectedSubRuleType);
    if (!this.subRuleSecondaryTypes || this.subRuleSecondaryTypes.length === 0){
      this.isVisibleSearchComponent  = true;
      this.isVisibleSubRuleSecondary = false; 
      this.searchSubRules(this.selectedSubRuleType, Constants.NA_TYPE_SEARCH);
    }else{
      let selectedItem = this.subRuleTypes.find(tm => tm.value == this.selectedSubRuleType);
      this.subRuleSecondaryLabel = selectedItem.label.replace('...', Constants.EMPTY_MESSAGE) + ':';
      this.isVisibleSearchComponent  = false;
      this.isVisibleSubRuleSecondary = true;
    }
  }

  /**
   * This method is used when the user changes the sub rule secondary type (Son dropdown)
   */
  changeSubRuleSecondaryType(){ 
    this.selectedScreen = undefined;
    this.isVisibleSearchComponent = true;   
    this.cleanSearchComponent();
    this.searchSubRules(this.selectedSubRuleSecondaryType, Constants.NA_TYPE_SEARCH);

    //This line of code is temporal, while the seach functionality to Code Resources screens is activated.    
    this.isVisibleSearchComponent = !(this.selectedSubRuleSecondaryType === Constants.ICD_CODES_ELL 
      || this.selectedSubRuleSecondaryType === Constants.LIBRARY_STATUS_CODES_ID);
  }

  /**
   * This method is used to search the sub rules
   */
  searchSubRules(selectedSubRuleType: string, type: string) {
    this.ellSearchDto = this.createEllSeachDto(type);
    switch (selectedSubRuleType) {
      case Constants.MID_RULE_ID:
        if (this.midRules) {
          this.midRules.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.MID_RULES_KEY_ID:
        if (this.midRulesKey) {
          this.midRulesKey.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.PAYER_ID:
        if (this.payerRules) {
          this.payerRules.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.LIBRARY_RULES_ID:
        if (this.libraryRule) {
          this.libraryRule.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.CHANGE_LOG_GROUPS_ID:
        if (this.changeLogGroup) {
          this.changeLogGroup.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.CHANGE_TYPES_ID:
        if (this.changeTypes) {
          this.changeTypes.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.CHANGE_SOURCES_ID:
        if (this.changeSources) {
          this.changeSources.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.CPT_CODES_ELL:
        if(this.cptCode){
          this.cptCode.showResultSearch(this.ellSearchDto);
        }
        break;
      case Constants.ICD_CODES_ELL:
        if(this.icdCode){
          this.icdCode.showResultSearch(this.ellSearchDto);
        }
        break; 
      case Constants.LIBRARY_STATUS_CODES_ID:
          if(this.libraryStatusCodes){
            this.libraryStatusCodes.showResultSearch(this.ellSearchDto);
          }
          break;       
      default:
    }
    this.selectedScreen = selectedSubRuleType;
  }

  /**
   * This method is used to create Ell-search-dto
   */
  createEllSeachDto(type: string){
    let  ellSearchDto  : EllSearchDto;
    switch(type){
      case Constants.NA_TYPE_SEARCH:
          ellSearchDto = {
            type: type,
          }; 
        break;
      case Constants.KEYWORD_TYPE_SEARCH:
          ellSearchDto = {
            type: type,
            keyword : this.keywordSearch
          }; 
        break;
    }  
    return ellSearchDto;
  }

  expandFilters() {
    this.expandedFilters = !this.expandedFilters;
  }
  
}
