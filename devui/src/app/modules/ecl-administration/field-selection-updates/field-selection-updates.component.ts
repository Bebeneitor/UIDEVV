import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ReferenceSourceComponent } from './reference-source/reference-source.component';
import { EclCategoryComponent } from './ecl-category/ecl-category.component';
import { EclTeamComponent } from './ecl-team/ecl-team.component';
import { ToastMessageService } from 'src/app/services/toast-message.service';

const CATEGORY = 'Category';
const REFERENCE_SOURCE = 'Reference Source';
const TEAM = 'Team';

@Component({
  selector: 'app-field-selection-updates',
  templateUrl: './field-selection-updates.component.html',
  styleUrls: ['./field-selection-updates.component.css']
})

export class FieldSelectionUpdatesComponent implements OnInit {

  @ViewChild(ReferenceSourceComponent) newReferenceSource: ReferenceSourceComponent;
  @ViewChild(EclCategoryComponent) eclCategoryComponent: EclCategoryComponent;
  @ViewChild(EclTeamComponent) teamComponent: EclTeamComponent;

  categories: any[] = [];
  availableFields: any[] = [];
  selectedField: string;
  loading: boolean;
  pageTitle: string;

  //boolean values to hide and show child components
  ifCategory: boolean = false;
  ifReference: boolean = false;
  ifTeam: boolean = false;
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
      { label: TEAM, value: 'team' }
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
        break;
      case "refSource":
        this.ifReference = true;
        this.ifCategory = false;
        this.ifTeam = false;
        this.default = false;
        break;
      case "team":
        this.ifTeam = true;
        this.ifReference = false;
        this.ifCategory = false;
        this.default = false;
        break;
      default:
        this.default = true;
        this.ifTeam = false;
        this.ifReference = false;
        this.ifCategory = false;
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
    } else if (this.ifTeam) {
      this.teamComponent.refreshScreen();
    } else if (this.ifCategory) {
      this.eclCategoryComponent.refreshAddCategory();
    }
  }

  defaultPage(event: boolean) {
    this.ifCategory = this.ifCategory ? false : this.ifCategory;
    this.ifReference = this.ifReference ? false : this.ifReference;
    this.ifTeam = this.ifTeam ? false : this.ifTeam;
    this.default = event;
    this.selectedField = "";
  }

}
