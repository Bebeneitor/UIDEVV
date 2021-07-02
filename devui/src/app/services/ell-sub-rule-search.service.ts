import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Constants } from 'src/app/shared/models/constants';


@Injectable({
  providedIn: 'root'
})
export class EllSubRuleSearchService {

  constructor() { }

  /**
   * This method is used to get Sub Rules Type (Parent Dropdown).
   * 
   *  @return SelectItem[].
  */
  getSubRulesType() {
    let subRulesType: SelectItem[] = [];
    subRulesType.push({ label: "All By..."        , value: Constants.ALL_BY_ID });
    subRulesType.push({ label: "Library Rules"    , value: Constants.LIBRARY_RULES_ID });
    subRulesType.push({ label: "Mid Rules Key"    , value: Constants.MID_RULES_KEY_ID });
    subRulesType.push({ label: "Code Resources"   , value: Constants.CODE_RESOURCES_ID });
    subRulesType.push({ label: "Mapping Tables"   , value: Constants.MAPPING_TABLES_ID });
    return subRulesType;
  }

  /**
   * This method is used to get Sub Rules Type (Son Dropdown).
   * 
   *  @return SelectItem[].
  */
  getSubRulesSecondaryType(selectedSubRuleType: string) {
    let subRulesSecondaryType: SelectItem[] = [];
    switch (selectedSubRuleType) {
      case Constants.ALL_BY_ID:
          subRulesSecondaryType.push({ label: "Midrule"              , value: Constants.MID_RULE_ID });
          subRulesSecondaryType.push({ label: "Payers"               , value: Constants.PAYER_ID });
        break;
      case Constants.CODE_RESOURCES_ID:
          subRulesSecondaryType.push({ label: "Change Log Groups"    , value: Constants.CHANGE_LOG_GROUPS_ID });
          subRulesSecondaryType.push({ label: "Change Types"         , value: Constants.CHANGE_TYPES_ID });
          subRulesSecondaryType.push({ label: "Change Sources"       , value: Constants.CHANGE_SOURCES_ID });
          subRulesSecondaryType.push({ label: "CPT Codes"            , value: Constants.CPT_CODES_ELL });
          subRulesSecondaryType.push({ label: "ICD Codes"            , value: Constants.ICD_CODES_ELL });
          subRulesSecondaryType.push({ label: "Library Status Codes" , value: Constants.LIBRARY_STATUS_CODES_ID });
          subRulesSecondaryType.push({ label: "Payers"               , value: Constants.PAYER_CATALOG });
          subRulesSecondaryType.push({ label: "Policy Types"         , value: Constants.POLICY_TYPES_ID });
          subRulesSecondaryType.push({ label: "Reason Codes"         , value: Constants.REASON_TYPES_ID });
          subRulesSecondaryType.push({ label: "Project Categories"   , value: Constants.PROJECT_CATEGORIES_ID });
          subRulesSecondaryType.push({ label: "Reference Sources"    , value: Constants.REFERENCE_SOURCES_ID });
          subRulesSecondaryType.push({ label: "Reference Titles"     , value: Constants.REFERENCE_TITLE });
          subRulesSecondaryType.push({ label: "Request Types"        , value: Constants.REQUEST_TYPE });
          subRulesSecondaryType.push({ label: "RPCD Reasons"         , value: Constants.RPCD_REASONS_TYPE });
          subRulesSecondaryType.push({ label: "Rule Headers"         , value: Constants.RULE_HEADERS_TYPE });
          subRulesSecondaryType.push({ label: "Work Status"          , value: Constants.WORK_STATUS });
          break;
      case Constants.MAPPING_TABLES_ID:
          subRulesSecondaryType.push({ label: "Sub Spec"             , value: Constants.SUB_SPEC });
          subRulesSecondaryType.push({ label: "Reason"               , value: Constants.REASON });
          subRulesSecondaryType.push({ label: "Insurance"            , value: Constants.INSURANCE });
          subRulesSecondaryType.push({ label: "POS"                  , value: Constants.ELL_POS });
          subRulesSecondaryType.push({ label: "Gender"               , value: Constants.GENDER });
          break;
      default:
    }
    return subRulesSecondaryType;
  }

}
