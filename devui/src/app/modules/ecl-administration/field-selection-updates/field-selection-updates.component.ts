import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ReferenceSourceComponent } from './reference-source/reference-source.component';
import { EclCategoryComponent } from './ecl-category/ecl-category.component';
import { EclTeamComponent } from './ecl-team/ecl-team.component';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { PolicyPackageComponent } from './policy-package/policy-package.component';

const CATEGORY = 'Category';
const REFERENCE_SOURCE = 'Reference Source';
const TEAM = 'Team';
const POLICY_PACKAGE = 'Policy Package';

@Component({
  selector: 'app-field-selection-updates',
  templateUrl: './field-selection-updates.component.html',
  styleUrls: ['./field-selection-updates.component.css']
})

export class FieldSelectionUpdatesComponent implements OnInit {

  @ViewChild(ReferenceSourceComponent,{static: false}) newReferenceSource: ReferenceSourceComponent;
  @ViewChild(EclCategoryComponent,{static: false}) eclCategoryComponent: EclCategoryComponent;
  @ViewChild(EclTeamComponent,{static: false}) teamComponent: EclTeamComponent;
  @ViewChild(PolicyPackageComponent,{static: false}) policyPackageComponent:  PolicyPackageComponent;

  categories: any[] = [];
  availableFields: any[] = [];
  selectedField: string;
  loading: boolean;
  pageTitle: string;

  //boolean values to hide and show child components
  ifCategory: boolean = false;
  ifReference: boolean = false;
  ifTeam: boolean = false;
  ifPolicyPackage = false;
  default: boolean = false;

  //boolean values to enable and disable the save and referesh button's
  fieldSaveButton: boolean = true;
  fieldRefreshButton: boolean = true;
  isCategoryDuplicate: boolean;

  constructor(private router: Router, private toast: ToastMessageService) {
    this.availableFields = [
      { label: 'Select', value: '' },
      { label: CATEGORY, value: 'category' },
      { label: REFERENCE_SOURCE, value: 'refSource' },
      { label: TEAM, value: 'team' },
      { label: POLICY_PACKAGE, value: 'policyPackage'}
    ];
  }

  ngOnInit() {
    this.selectedField = '';
    this.loading = false;
    this.fieldSaveButton = true;
    this.fieldRefreshButton = false;
    this.default = true;
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }
  /* Event Handling method to show and hide the HTML markup based on the field selection */
  showSelectedSource() {
    switch (this.selectedField) {
      case "category":
        this.ifCategory = true;
        this.ifReference = false;
        this.ifTeam = false;
        this.default = false;
        this.ifPolicyPackage = false;
        break;
      case "refSource":
        this.ifReference = true;
        this.ifCategory = false;
        this.ifTeam = false;
        this.default = false;
        this.ifPolicyPackage = false;
        break;
      case "team":
        this.ifTeam = true;
        this.ifReference = false;
        this.ifCategory = false;
        this.default = false;
        this.ifPolicyPackage = false;
        break;
      case "policyPackage":
        this.ifPolicyPackage = true;        
        this.default = false;
        this.ifTeam = false;
        this.ifReference = false;
        this.ifCategory = false;        
        break;        
      default:
        this.default = true;
        this.ifTeam = false;
        this.ifReference = false;
        this.ifCategory = false;
        this.ifPolicyPackage = false;
    }
  }
  isNewCategoryDuplicated(e) {
    this.isCategoryDuplicate = e;
  }
  /* Event Handling method to enable and disable the save button based on the validations */
  saveButtonEvent(saveEnable: boolean) {
    this.fieldSaveButton = saveEnable;
  }

  /* Method to save the selected data based on the active field selection  */
  saveFieldSelection(saveObject?: any) {
    if (this.ifReference) {
      this.newReferenceSource.saveRefValidation();
    } else if(this.ifPolicyPackage){
      this.policyPackageComponent.savePolicyPackageValidation();
    } else if (this.ifTeam) {
      this.teamComponent.saveNewTeam();
    } else if (this.ifCategory) {
      if (!this.isCategoryDuplicate) {
        this.eclCategoryComponent.saveNewCategory();
      } else {
        this.toast.messageWarning('Duplicate', 'Category already exist', 3000, false);
      }
    }
  }

  /* Method to referesh the page selected based on the active field selection  */
  refreshFieldSelection() {
    if (this.ifReference) {
      this.newReferenceSource.refreshAddReferences();
    } else if(this.ifPolicyPackage){
      this.policyPackageComponent.refreshAddPolicyPackage();
    }else if (this.ifTeam) {
      this.teamComponent.refreshScreen();
    } else if (this.ifCategory) {
      this.eclCategoryComponent.refreshAddCategory();
    }
  }

  defaultPage(event: boolean) {
    this.ifCategory = this.ifCategory ? false : this.ifCategory;
    this.ifReference = this.ifReference ? false : this.ifReference;
    this.ifPolicyPackage = this.ifPolicyPackage ? false : this.ifPolicyPackage;
    this.ifTeam = this.ifTeam ? false : this.ifTeam;
    this.default = event;
    this.selectedField = "";
  }

}
