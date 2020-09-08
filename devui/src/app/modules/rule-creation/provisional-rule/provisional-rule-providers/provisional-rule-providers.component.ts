import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/models/constants';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { RuleInfo } from 'src/app/shared/models/rule-info';

const MATCHED_SPECIALITY_TYPE_LENGTH = 3;
const SWITCH_FILTER_TYPE = 1;
const SPECIALITY_TYPE = 'SPECIALITY_TYPES';
const SUBSPECIALITY_TYPE = 'SUB_SPECIALITY_TYPES';
const IN_RIGHT = 1,
  EX_RIGHT = 2,
  IN_LEFT = 3,
  EX_LEFT = 4;

@Component({
  selector: 'app-provisional-rule-providers',
  templateUrl: './provisional-rule-providers.component.html',
  styleUrls: ['./provisional-rule-providers.component.css'],
  providers: [ProvisionalRuleService]
})
export class ProvisionalRuleProvidersComponent implements OnInit {
  currRuleInfo: RuleInfo = new RuleInfo;
  parentRuleInfo: RuleInfo;
  @Input() set ruleInfo(rule: RuleInfo) {
    if (rule && rule.ruleId) {
      this.currRuleInfo = rule;
      this.loadProvidersTabData(rule);
    }
  }
  @Input() set ruleInfoOriginal(rule: RuleInfo) {
    if (rule && rule.ruleId) {
      if (rule.ruleStatusId.ruleStatusId === Constants.RULE_IMPACTED_VALUE) {
        this.parentRuleInfo = rule;
        this.loadProvidersTabData(rule, true);
      } else {
        this.currRuleInfo = rule;
        this.loadProvidersTabData(rule);
      }
    }
  }
  @Input() ruleReadOnly: boolean;
  @Input() maintenanceOnly: boolean;
  @Input() fromMaintenanceProcess: boolean;
  @Input() provDialogDisable: boolean;
  @Input() includedSpecialityTypes: any[];
  @Input() excludedSpecialityTypes: any[];
  @Input() includedSubspecialityTypes: any[];
  @Input() excludedSubspecialityTypes: any[];

  specialityInd: number = 0;
  providerTypeInd: number = 0;

  specialityTypes: any[] = [];
  selectedspecialityTypes: any[];
  selectedIncludedTypes: any[] = [];
  selectedExcludedTypes: any[] = [];

  subspecialityTypes: any[] = [];
  subspecialityTypesFiltered: any[] = [];
  selectedSubspecialityTypes: any[];
  selectedIncludedSubspecialityTypes: any[] = [];
  selectedExcludedSubspecialityTypes: any[] = [];


  label: string;
  value: string;
  disableSpecialityList: boolean = true;
  specialityListboxDisable: boolean = true;

  constructor(private utilService: UtilsService, private provisionalRuleService: ProvisionalRuleService) {
    this.selectedspecialityTypes = null;
    this.selectedIncludedTypes = null;
    this.selectedExcludedTypes = null;
    this.includedSpecialityTypes = [];
    this.excludedSpecialityTypes = [];
  }

  ngOnInit() {
    this.getAllSpecialityTypes(SPECIALITY_TYPE);
    this.getAllSubspecialityTypes(SUBSPECIALITY_TYPE);
  }

  /**
   * Check if the following are not undefined
   * includedSpecialityTypes
   * excludedSpecialityTypes
   * includedSubspecialityTypes
   * excludedSubspecialityTypes
   */
  checkTypesHasData() {
    if (!this.checkAnyArray(this.includedSpecialityTypes)) {
      this.includedSpecialityTypes = [];
    }
    if (!this.checkAnyArray(this.excludedSpecialityTypes)) {
      this.excludedSpecialityTypes = []
    }
    if (!this.checkAnyArray(this.includedSubspecialityTypes)) {
      this.includedSubspecialityTypes = [];
    }
    if (!this.checkAnyArray(this.excludedSubspecialityTypes)) {
      this.excludedSubspecialityTypes = [];
    }
  }

  /**
   * LoadProvidersTab to display Specialty and Sub-Specialty values
   * @param ruleInfo Object contain information to display
   */
  loadProvidersTabData(ruleInfo: RuleInfo, loadOriginal?: boolean) {
    this.checkTypesHasData();
    if (ruleInfo && ruleInfo.ruleId) {
      if (loadOriginal) {
        this.getAllExistingSpecialityTypes(ruleInfo.ruleId);
        this.getAllExistingSubspecialityTypes(ruleInfo.ruleId);
      } else {
        this.checkSpecialityType();
        this.getAllExistingSpecialityTypes(ruleInfo.ruleId).then(res => {
          this.removeExistingSpecialitiesFromParent();
        });
        this.getAllExistingSubspecialityTypes(ruleInfo.ruleId);
      }
    }
  }

  /**
   * checkSpecialityType will enable/disable the fields.
   */
  checkSpecialityType() {
    if (!this.currRuleInfo.specialityInd) { this.currRuleInfo.specialityInd = 0 }
    if (!this.currRuleInfo.providerTypeInd) { this.currRuleInfo.providerTypeInd = 0 }
    const specialityInd = this.currRuleInfo.specialityInd;
    !specialityInd ? this.changeDisable(true, true) : this.changeDisable(false, false);
  }

  /**
   * changeDisable
   * @param disableSpec flag to disable the Specialty List Radio
   * @param disableBox  flag to disable the list-box for specialty
   */
  changeDisable(disableSpec: boolean, disableBox: boolean) {
    this.disableSpecialityList = disableSpec;
    this.specialityListboxDisable = disableBox;
  }

  /**
   * removeExisitingSpecialitiesFromParent
   * This function will remove the exisiting specialties if
   * Include or Exclude already has the values.
   */
  removeExistingSpecialitiesFromParent() {
    let arr = [];

    for (let i = 0; i < this.specialityTypes.length; i++) {
      //If exists in excluded or included array discard the item
      let exists = false;
      for (let j = 0; j < this.includedSpecialityTypes.length; j++) {
        if (this.specialityTypes[i].label == this.includedSpecialityTypes[j].label) {
          exists = true;
        }
      }
      for (let j = 0; j < this.excludedSpecialityTypes.length; j++) {
        if (this.specialityTypes[i].label == this.excludedSpecialityTypes[j].label) {
          exists = true;
        }
      }
      if (!exists) {
        arr.push(this.specialityTypes[i]);
      }
    }
    this.specialityTypes = JSON.parse(JSON.stringify(arr));
  }

  checkAnyArray(anyArray: any[]) {
    return (anyArray !== null && anyArray !== undefined && anyArray.length > 0)
  }

  /**
   * RemoveSubIncExcCascade
   * This function will remove the exisiting sub-specialties if
   * Include or Exclude already has the values.
   */
  RemoveSubIncExcCascade(selectedType) {
    if (this.includedSubspecialityTypes) {
      for (let i = 0; i < this.includedSubspecialityTypes.length; i++) {
        let subsps = this.subspecialityTypes.filter(subs => this.includedSubspecialityTypes[i].value === subs.value);
        if (selectedType === subsps[0].type.substring(0, 3)) {
          this.includedSubspecialityTypes = this.includedSubspecialityTypes.filter(subs => subsps[0].value !== subs.value);
          i--;
        }
      }
    }
    if (this.excludedSubspecialityTypes) {
      for (let i = 0; i < this.excludedSubspecialityTypes.length; i++) {
        let excsubs = this.subspecialityTypes.filter(subs => this.excludedSubspecialityTypes[i].value === subs.value);
        if (selectedType === excsubs[0].type.substring(0, 3)) {
          this.excludedSubspecialityTypes = this.excludedSubspecialityTypes.filter(subs => excsubs[0].value !== subs.value);
          i--;
        }
      }
    }
    if (this.subspecialityTypesFiltered) {
      for (let i = 0; i < this.subspecialityTypesFiltered.length; i++) {
        let subFiltereds = this.subspecialityTypes.filter(subs => this.subspecialityTypesFiltered[i].value === subs.value);
        if (selectedType === subFiltereds[0].type.substring(0, 3)) {
          this.subspecialityTypesFiltered = this.subspecialityTypesFiltered.filter(subs => !subFiltereds[0].value === subs.value);
          i--;
        }
      }
    }
  }

  moveToIncludeR(value) {
    for (const splTyp of this.specialityTypes) {
      for (const selectedType of this.selectedspecialityTypes) {
        if (selectedType === splTyp.value) {
          this.includedSpecialityTypes.push(splTyp);
          break;
        }
      }
    }
    for (const splTyp of this.includedSpecialityTypes) {
      const index: number = this.specialityTypes.indexOf(splTyp, 0);
      if (index > -1) {
        this.specialityTypes.splice(index, 1);
      }
    }
  }

  moveToExcludeR(value) {
    for (const splTyp of this.specialityTypes) {
      for (const selectedType of this.selectedspecialityTypes) {
        if (selectedType === splTyp.value) {
          this.excludedSpecialityTypes.push(splTyp);
          break;
        }
      }
    }
    for (const splTyp of this.excludedSpecialityTypes) {
      const index: number = this.specialityTypes.indexOf(splTyp, 0);
      if (index > -1) {
        this.specialityTypes.splice(index, 1);
      }
    }
  }

  moveToIncludeL(value) {
    for (const splTyp of this.includedSpecialityTypes) {
      for (const selectedType of this.selectedIncludedTypes) {
        if (selectedType === splTyp.value) {
          this.specialityTypes.push(splTyp);
          this.RemoveSubIncExcCascade(selectedType);
          break;
        }
      }
    }
    this.selectedspecialityTypes = [];
    this.selectedIncludedTypes = [];
    for (const splTyp of this.specialityTypes) {
      const index: number = this.includedSpecialityTypes.indexOf(splTyp, 0);
      if (index > -1) {
        this.includedSpecialityTypes.splice(index, 1);
      }
    }
    this.specialityTypes = this.sortSpecialtyList(this.specialityTypes);
  }

  moveToExcludeL(value) {
    for (const splTyp of this.excludedSpecialityTypes) {
      for (const selectedType of this.selectedExcludedTypes) {
        if (selectedType === splTyp.value) {
          this.specialityTypes.push(splTyp);
          this.RemoveSubIncExcCascade(selectedType);
          break;
        }
      }
    }
    this.selectedspecialityTypes = [];
    this.selectedExcludedTypes = [];
    for (const splTyp of this.specialityTypes) {
      const index: number = this.excludedSpecialityTypes.indexOf(splTyp, 0);
      if (index > -1) {
        this.excludedSpecialityTypes.splice(index, 1);
      }
    }
    this.specialityTypes = this.sortSpecialtyList(this.specialityTypes);
  }

  getAllSpecialityTypes(specialityType) {
    return new Promise((resolve, reject) => {
      this.utilService.getAllLookUps(specialityType).subscribe((response: any[]) => {
        this.specialityTypes = [];
        response.forEach(splType => {
          this.specialityTypes.push({
            "label": splType.lookupDesc.toUpperCase(),
            "value": splType.lookupCode
          });
        });
        this.specialityTypes = this.sortSpecialtyList(this.specialityTypes)
        resolve();
      });
    })
  }

  getAllExistingSpecialityTypes(ruleId: any) {
    return new Promise((resolve, reject) => {
      this.provisionalRuleService.findSpecialityTypesById(ruleId).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          if (response.data !== null && response.data !== undefined) {
            this.excludedSpecialityTypes = [];
            this.includedSpecialityTypes = [];
            response.data.forEach(element => {
              this.assignIncludeExclude(element);
            });
            resolve();
          }
        }
      });
    });
  }


  assignIncludeExclude(element: any) {
    if (element != null) {
      if (element.inclusionStatus === 0) {
        this.excludedSpecialityTypes.push({ "label": element.specialityTypeDesc.toUpperCase(), "value": element.specialityTypeCode });
      } else {
        this.includedSpecialityTypes.push({ "label": element.specialityTypeDesc.toUpperCase(), "value": element.specialityTypeCode });
      }
    }
  }

  getAllExistingSubspecialityTypes(ruleId: any) {
    this.provisionalRuleService.findSubspecialityTypesById(ruleId).subscribe((response: any) => {
      if (response !== null && response !== undefined) {
        if (response.data !== null && response.data !== undefined) {
          this.excludedSubspecialityTypes = [];
          this.includedSubspecialityTypes = [];
          response.data.forEach(element => {
            this.assignIncludeExcludeSub(element);
            this.displaySubspeciality();
          });
        }
      }
    });
  }


  assignIncludeExcludeSub(element: any): void {
    if (element != null) {
      if (element.inclusionStatus === 0) {
        this.excludedSubspecialityTypes.push({ "label": element.subspecialityTypeDesc.toUpperCase(), "value": element.subspecialityTypeCode, 'type': element.subspecialityTypeType });
      } else {
        this.includedSubspecialityTypes.push({ "label": element.subspecialityTypeDesc.toUpperCase(), "value": element.subspecialityTypeCode, 'type': element.subspecialityTypeType });
      }
    }
  }


  private getAllSubspecialityTypes(subspecialityType) {
    return new Promise((resolve, reject) => {
      this.utilService.getAllLookUpsSubspeciality(subspecialityType).subscribe(response => {
        this.subspecialityTypes = [];
        response.forEach(splType => {
          this.subspecialityTypes.push({
            "label": splType.lookupDesc.toUpperCase(),
            "value": splType.lookupCode,
            'type': splType.lookupType
          });
        });
        this.subspecialityTypes = this.sortSpecialtyList(this.subspecialityTypes);
        resolve();
      });
    })
  }


  /**
   * setToMoveSub will move which path for SubSpecialty to be moved to or from Include/Exclude & List of Specialty
   * @param setup Determine the movement of the setup.
   */
  setToMoveSub(setup: number) {
    let { filterSubs, selectedSubs, typeSubs } = this.setupSubs(setup);
    const selectedSubTypes = filterSubs && filterSubs.filter(subsp => selectedSubs.includes(subsp.value));
    this.fillSubSpecialty(setup, filterSubs, selectedSubs, typeSubs, selectedSubTypes);
  }
  /**
   * fillSubSpecialty for setting up the variables and displaying
   * @param setup - Determine which setup that needs to be run/executed
   * @param filterSubs - SubSpecialty for filtered values in the setup
   * @param selectedSubs  - SubSpecialty for selected values in the seutp
   * @param typeSubs  - SubSpecialty of type which one is being used for
   * @param selectedSubTypes  - Same as types Subs but used differently.
   */
  fillSubSpecialty(setup: number, filterSubs: any[], selectedSubs: any[], typeSubs: any[], selectedSubTypes) {
    switch (setup) {
      case (IN_RIGHT):
        this.includedSubspecialityTypes = [...typeSubs, ...selectedSubTypes];
        this.subspecialityTypesFiltered = this.filterTypes(filterSubs, selectedSubs, SWITCH_FILTER_TYPE)
        this.selectedIncludedSubspecialityTypes = [];
        break;
      case (EX_RIGHT):
        this.excludedSubspecialityTypes = [...typeSubs, ...selectedSubTypes];
        this.subspecialityTypesFiltered = this.filterTypes(filterSubs, selectedSubs, SWITCH_FILTER_TYPE)
        this.selectedSubspecialityTypes = [];
        break;
      case (IN_LEFT):
        this.subspecialityTypesFiltered = [...typeSubs, ...selectedSubTypes];
        this.includedSubspecialityTypes = this.filterTypes(filterSubs, selectedSubs, SWITCH_FILTER_TYPE)
        this.selectedSubspecialityTypes = [];
        this.subspecialityTypesFiltered = this.sortSpecialtyList(this.subspecialityTypesFiltered);
        break;
      case (EX_LEFT):
        this.subspecialityTypesFiltered = [...typeSubs, ...selectedSubTypes];
        this.excludedSubspecialityTypes = this.filterTypes(filterSubs, selectedSubs, SWITCH_FILTER_TYPE)
        this.selectedExcludedSubspecialityTypes = [];
        this.subspecialityTypesFiltered = this.sortSpecialtyList(this.subspecialityTypesFiltered);
        break;
      default:
        // Error handling
        break;
    }
  }

  /**
   * Sorting Sub-specialty
   */
  sortSpecialtyList(data: any[]): any[] {
    return data.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * setupCreationSub will run to setup the require variable for use.
   * @param setup  Detemines which setup to used for data.
   */
  setupSubs(setup: number) {
    let subs = (filterSubs, selectedSubs, typeSubs) => ({
      filterSubs,
      selectedSubs,
      typeSubs
    })
    switch (setup) {
      case (IN_RIGHT):
        return subs(this.subspecialityTypesFiltered, this.selectedSubspecialityTypes, this.includedSubspecialityTypes);
      case (EX_RIGHT):
        return subs(this.subspecialityTypesFiltered, this.selectedSubspecialityTypes, this.excludedSubspecialityTypes);
      case (IN_LEFT):
        return subs(this.includedSubspecialityTypes, this.selectedIncludedSubspecialityTypes, this.subspecialityTypesFiltered);
      case (EX_LEFT):
        return subs(this.excludedSubspecialityTypes, this.selectedExcludedSubspecialityTypes, this.subspecialityTypesFiltered);
      default:
        // Error handling goes here
        break;
    }

  }

  /**
   * Displaysubspeciality will run to load in the data for the list of Sub-Speciality if Specialty contains either Include or Exclude.
   */
  displaySubspeciality() {
    let totalSubTemps = this.filterTypes(this.fillTotalSubTempsDisplay(SWITCH_FILTER_TYPE), this.mapTypes(this.includedSubspecialityTypes), SWITCH_FILTER_TYPE);
    this.subspecialityTypesFiltered = this.filterTypes(totalSubTemps, this.mapTypes(this.excludedSubspecialityTypes), SWITCH_FILTER_TYPE);
  }

  /**
   * onCLickSpeciality will run when List of Speciality option that has been selected.
   */
  onClickSpeciality() {
    if (!this.provDialogDisable) {
      let totalSubTemps = this.fillTotalSubTempsClick();
      const excludedSubTemp = this.filterTypes(totalSubTemps, this.mapTypes(this.excludedSubspecialityTypes), SWITCH_FILTER_TYPE);
      const includedSubTemp = this.filterTypes(excludedSubTemp, this.mapTypes(this.includedSubspecialityTypes), SWITCH_FILTER_TYPE);
      this.subspecialityTypesFiltered = includedSubTemp;
    }
  }

  /**
   * fillTotalSubTempsClick - Run for the onClickSpeciality() function
   * @param switchValue Determine if values needs to be mapped or not
   */
  fillTotalSubTempsClick(switchValue?: number) {
    let subTypes = this.subspecialityTypes,
      selectInTypes = this.selectedIncludedTypes,
      selectExTypes = this.selectedExcludedTypes;
    if (switchValue) {
      let subTotal = [...this.filterTypes(subTypes, this.mapTypes(selectInTypes)), ...this.filterTypes(subTypes, this.mapTypes(selectExTypes))];
      return subTotal;
    } else {
      let subTotal = [...this.filterTypes(subTypes, selectInTypes), ...this.filterTypes(subTypes, selectExTypes)];
      return subTotal;
    }
  }
  /**
   * fillTotalSubTempsDisplay will run for displaySubspeciality() funciton
   * @param switchValue  A switch to determine if it needs flatten or not.
   */
  fillTotalSubTempsDisplay(switchValue?: number) {
    let subTypes = this.subspecialityTypes,
      selectInTypes = this.includedSpecialityTypes,
      selectExTypes = this.excludedSpecialityTypes;
    if (switchValue) {
      let subTotal = [...this.filterTypes(subTypes, this.mapTypes(selectInTypes)), ...this.filterTypes(subTypes, this.mapTypes(selectExTypes))];
      return subTotal;
    } else {
      let subTotal = [...this.filterTypes(subTypes, selectInTypes), ...this.filterTypes(subTypes, selectExTypes)];
      return subTotal;
    }
  }

  /**
   * mapTypes to flatten object by one value. (Must contain property 'value')
   * @param arrayOfTypes Array to be flatten for.
   */
  mapTypes(arrayOfTypes: any[]) {
    const newArray = arrayOfTypes && arrayOfTypes.map(ele => ele.value);
    return newArray;
  }

  /**
   * Filtering the array of their respective Speciality
   * @param arrayOfTypes Which type of speciality it will be filtering out
   * @param arrayValues Value for the types to check againist
   * @param typeFilter  A switch to determine if type isn't flatten.
   */
  filterTypes(arrayOfTypes: any[], arrayValues: any[], typeFilter?: number) {
    if (typeFilter) {
      const newArray = arrayOfTypes.filter(subsp => arrayValues && !arrayValues.includes(subsp.value));
      return newArray;
    } else {
      const newArray = arrayOfTypes.filter(({ type }) => arrayValues && arrayValues.includes(type.substring(0, MATCHED_SPECIALITY_TYPE_LENGTH)));
      return newArray;
    }
  }

}