import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap, throttleTime } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { RepoTableAdminService } from '../../repo-table-admin.service';

@Component({
  selector: 'app-table-attribute-add-edit',
  templateUrl: './table-attribute-add-edit.component.html',
  styleUrls: ['./table-attribute-add-edit.component.css']
})
export class TableAttributeAddEditComponent implements OnInit, OnDestroy {
  get attributeLabelControl() { return this.attributeTemplateForm.get('attributeLabel') as FormControl; }
  get databaseColumnLinkedControl() { return this.attributeTemplateForm.get('databaseColumnLinked') as FormControl; }
  get isReportColumnControl() { return this.attributeTemplateForm.get('isReportColumn') as FormControl; }
  get mandatoryControl() { return this.attributeTemplateForm.get('mandatory') as FormControl; }
  get uiDataTypesControl() { return this.attributeTemplateForm.get('uiDataTypes') as FormControl; }
  get radioButtonsControl() { return this.attributeTemplateForm.get('radioButtons') as FormArray; }
  get dropDownOptionsControl() { return this.attributeTemplateForm.get('dropDownOptions') as FormArray; }

  attributeTemplateForm: FormGroup;
  attribute: any;
  uiDataTypes: any;
  formInactiveFlag = false;
  buttonFlag = false;
  updatedValue = false;
  columnNameInvalid = false;

  columnNameSub = new Subscription;

  constructor(private fb: FormBuilder, private config: DynamicDialogConfig,
    private ref: DynamicDialogRef, private repoTableAdminService: RepoTableAdminService,
    private messageService: ToastMessageService) { }

  ngOnInit(): void {
    // Get the data types from service.
    this.uiDataTypes = this.repoTableAdminService.getUiDataTypes();

    const radioButtonsElements = [];
    if (this.config.data.attribute && this.config.data.attribute.attributeDetails && this.config.data.attribute.attributeDetails.radioButtonOptions) {
      for (const property in this.config.data.attribute.attributeDetails.radioButtonOptions) {
        radioButtonsElements.push(this.config.data.attribute.attributeDetails.radioButtonOptions[property]);
      }
    }

    const dropDownOptions = [];
    if (this.config.data.attribute && this.config.data.attribute.attributeDetails && this.config.data.attribute.attributeDetails.dropDownOptions) {
      for (const property in this.config.data.attribute.attributeDetails.dropDownOptions) {
        dropDownOptions.push(this.config.data.attribute.attributeDetails.dropDownOptions[property]);
      }
    }

    // Get the form structure from service.
    this.attributeTemplateForm = this.repoTableAdminService.createAttributeFormGroup(radioButtonsElements.length, dropDownOptions.length);

    this.columnNameSub = this.attributeTemplateForm.get('databaseColumnLinked').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    ).subscribe(item => {
      if (item && item !== '') {
        if(this.updatedValue){
          let filteredData = this.config.data.attributeList.filter(attr => attr.columnName.toUpperCase()=== item.toUpperCase());
          if(filteredData && filteredData.length > 0 ){
            this.messageService.messageError('Error', "Column name already exists, please change it to another");
            this.columnNameInvalid = true;
          }else {
            this.columnNameInvalid = false;
          }
        }
      }
      this.updatedValue = true;
    });
    
    if (this.config.data.attribute) {
      // getting the attribute from config object.
      const uiDataType = this.uiDataTypes.find(type => type.value === this.config.data.attribute.uiDataType);


      this.attribute = {
        attributeId: this.config.data.attribute.attributeId,
        attributeLabel: this.config.data.attribute.attributeName,
        databaseColumnLinked: this.config.data.attribute.columnName,
        isSearchCriteria: this.config.data.attribute.searchCriteria === Constants.YES ? [undefined] : null,
        isReportColumn: this.config.data.attribute.inReport === Constants.YES ? [undefined] : null,
        mandatory: this.config.data.attribute.mandatory,
        uiDataTypes: uiDataType,
        radioButtons: radioButtonsElements.length <= 0 ? [null, null] : radioButtonsElements,
        dropDownOptions: dropDownOptions.length <= 0 ? [] : dropDownOptions,
        mode: this.config.data.attribute.mode,
        randomId: this.config.data.attribute.randomId,
        status: this.config.data.attribute.status
      };
      this.formInactiveFlag = this.attribute.status !== Constants.ACTIVE_STRING_VALUE;

      this.onUiDataTypeChange(uiDataType.value);
    } else {
      this.attribute = {
        attributeId: 0,
        attributeLabel: null,
        databaseColumnLinked: null,
        isSearchCriteria: null,
        isReportColumn: null,
        mandatory: null,
        uiDataTypes: null,
        radioButtons: [],
        dropDownOptions: [],
        status: Constants.ACTIVE_STRING_VALUE,
        mode: Constants.ADD_MODE,
        randomId: Math.floor(Math.random() * 5000)
      }
    }

    this.prepareForm();
  }

  ngOnDestroy(): void {
    this.columnNameSub.unsubscribe();
  }

  /**
   * Gets all the values from the attribute property and sets the value to the form.
   */
  prepareForm() {
    const { attributeLabel, databaseColumnLinked, isSearchCriteria, isReportColumn, mandatory, uiDataTypes, radioButtons,
      dropDownOptions } = this.attribute;

    this.attributeTemplateForm.patchValue({
      attributeLabel, databaseColumnLinked,
      isSearchCriteria, isReportColumn, mandatory,
      uiDataTypes, radioButtons, dropDownOptions
    });

    if (this.formInactiveFlag) {
      this.attributeTemplateForm.disable();
    }
    this.buttonFlag = this.attribute.attributeId === 0 && this.attribute.mode === Constants.ADD_MODE ? true : false;

  }

  /**
   * Crates the attribute object to be returned to the parent component.
   */
  updateAttribute() {
    if (this.attributeTemplateForm.invalid) {
      return;
    }
    let attributeDetails = null;
    if (this.uiDataTypesControl.value && this.uiDataTypesControl.value.value === 'radio_button') {
      attributeDetails = { radioButtonOptions: { ...this.radioButtonsControl.value } };
    }
    else if (this.uiDataTypesControl.value && this.uiDataTypesControl.value.value === 'dropdown') {
      attributeDetails = { dropDownOptions: { ...this.dropDownOptionsControl.value } }
    }

    const result = {
      attributeId: this.attribute.attributeId,
      attributeName: this.attributeLabelControl.value,
      columnName: this.databaseColumnLinkedControl.value,
      inReport: (this.isReportColumnControl.value) ? (this.isReportColumnControl.value.length > 0 ? Constants.YES : Constants.NO) : Constants.NO,
      mandatory: this.mandatoryControl.value,
      searchCriteria: Constants.YES,
      status: Constants.ACTIVE_STRING_VALUE,
      uiDataType: this.uiDataTypesControl.value ? this.uiDataTypesControl.value.value : '',
      attributeDetails: attributeDetails
    };

    result['mode'] = this.attribute.mode;
    result['randomId'] = this.attribute.randomId;

    this.ref.close(result);
  }

  /**
   * Sets the validity for the controls depending on the selection.
   * @param event the value from the checkbox
   */
  onReportCheckBoxChange(event) {
    this.updateValueAndValidity(event, 'report');
  }

  /**
   * Sets the validity for the controls depending on the selection.
   * @param event the value from the checkbox
   */
  onSearchCriteriaCheckBoxChange(event) {
    this.updateValueAndValidity(event, 'searchCriteria');
  }

  /**
   * Updates the value and validity for the form controls.
   */
  updateValueAndValidity(event: boolean, controlName: string) {
    if (this.uiDataTypesControl.value && (this.uiDataTypesControl.value.value === 'radio_button')) {
      this.setRadioButtonsValidators();
    } else {
      this.clearRadioButtonsValidators();
    }
  }

  /**
   * Add or remove validators depending on the selection.
   * @param event the selected item.
   */
  onUiDataTypeChange(event) {
    switch (event) {
      case 'radio_button':
        this.setRadioButtonsValidators();
        this.clearDropDownOptionsValidators();
        break;
      case 'range_text':
        this.clearRadioButtonsValidators();
        this.clearDropDownOptionsValidators();
        break;
      case 'dropdown':
        this.setDropDownOptionsValidators();
        this.clearRadioButtonsValidators();
        break;
      case 'checkbox':
        this.clearRadioButtonsValidators();
        this.clearDropDownOptionsValidators();
        break;
      default:
        this.clearRadioButtonsValidators();
        this.clearDropDownOptionsValidators();
        break;
    }
  }

  /**
   * Removes the radio button controls validators.
   */
  clearRadioButtonsValidators() {
    for (let index = 0; index < this.radioButtonsControl.length; index++) {
      const control = this.radioButtonsControl.at(index) as FormControl;
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  /**
  * Removes the drop down controls validators.
  */
  clearDropDownOptionsValidators() {
    for (let index = 0; index < this.dropDownOptionsControl.length; index++) {
      const control = this.dropDownOptionsControl.at(index) as FormControl;
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  /**
   * Adds the radio button controls validators.
   */
  setRadioButtonsValidators() {
    for (let index = 0; index < this.radioButtonsControl.length; index++) {
      const control = this.radioButtonsControl.at(index) as FormControl;
      control.setValidators(Validators.required);
      control.updateValueAndValidity();
    }
  }

  /**
   * Adds the radio button controls validators.
   */
  setDropDownOptionsValidators() {
    this.dropDownOptionsControl.setValidators(Validators.required);
    for (let index = 0; index < this.dropDownOptionsControl.length; index++) {
      const control = this.dropDownOptionsControl.at(index) as FormControl;
      control.setValidators(Validators.required);
      control.updateValueAndValidity();
    }
  }

  /**
   * Inserts a new control to the radio buttons form array.
   */
  addRadioButton() {
    this.radioButtonsControl.push(this.fb.control(null, Validators.required));
  }

  /**
    * Remove control from the radio buttons form array.
    */
  removeRadioButton(index: number) {
    this.radioButtonsControl.removeAt(index);
  }

  /**
   * Inserts a new control to the dropdown form array.
   */
  addDropDownElement() {
    this.dropDownOptionsControl.push(this.fb.control(null, Validators.required));
  }

  /**
   * removes the control from  the dropdown form array based on index.
   */
  removeDropDownElement(index: number) {
    this.dropDownOptionsControl.removeAt(index);
  }
}
