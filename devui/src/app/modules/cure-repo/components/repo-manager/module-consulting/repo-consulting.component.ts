import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { RepoTable } from '../../../models/repo-table.model';
import { RepoConsultingService } from './repo-consulting.service';

@Component({
  selector: 'app-module-consulting',
  templateUrl: './repo-consulting.component.html',
  styleUrls: ['./repo-consulting.component.css']
})
export class RepoConsultingComponent implements OnInit {
  repoConsultingForm: FormGroup;
  dataTableConfiguration: EclTableModel;
  submited = false;

  tables: SelectItem[] = [];
  dataSet: SelectItem[] = [];

  lastSelectedSearchCriteria = [];
  lastSelectedDataSource;
  blocked = true;
  blockedMessage = '';

  isRadioButtonRequired = false;
  unbTable = false;

  @ViewChild('dataSourceDropdown',{static: true}) dataSourceDropdownControl: Dropdown;
  @ViewChild('repoDataTable',{static: true}) repoDataTable: EclTableComponent;
  @ViewChild('repoForm',{static: true}) repoForm: ElementRef;
  hasRadioButtons: any;
  dialogLeftPosition: number;
  message: string;
  headerText: string;
  saveDisplay: boolean;

  get tableSourceControl() { return this.repoConsultingForm.get('tableSource'); }
  get dataSourceControl() { return this.repoConsultingForm.get('dataSet'); }
  get searchCriteriaControl() { return this.repoConsultingForm.get('searchCriteria') as FormArray; }

  searchCriteriaElements = [];

  yearValidRange = `${Constants.MIN_VALID_YEAR}:${Constants.MAX_VALID_YEAR}`;
  tableColumns: any;
  reportColumns: any;

  constructor(private repoConsultingService: RepoConsultingService, private fb: FormBuilder) { }

  ngOnInit() {
    this.blocked = true;
    this.blockedMessage = 'Loading data sources, please wait.'
    // Create the form group.
    this.repoConsultingForm = this.repoConsultingService.createRepoConsultancyForm();

    // Load the table list.
    this.repoConsultingService.getTablesSource().subscribe((response) => {
      this.tables = response;
      this.tables.unshift({ value: null, label: 'Choose' });
      this.blocked = false;
    }, error => this.errorResponse);
  }

  /**
   * Fires every time the drop down for the data source changes.
   * @param event holds the selected value.
   */
  onDataSourceChange(dataSourceId: RepoTable) {
    if (dataSourceId) {
      this.blocked = true;
      this.blockedMessage = 'Creating Search Criteria controls, please wait.';
      this.unbTable = this.isUnbTable(dataSourceId);
      if (this.lastSelectedDataSource) {
        const selectionToReplace = this.lastSelectedSearchCriteria.findIndex(last => last.dataSource === this.lastSelectedDataSource);
        if (selectionToReplace > -1) {
          this.lastSelectedSearchCriteria.splice(selectionToReplace);
        }
        this.lastSelectedSearchCriteria.unshift({ controls: { ...this.searchCriteriaControl.controls }, dataSource: this.lastSelectedDataSource });
      }

      this.repoConsultingService.getTableDetails(dataSourceId.repoTableId).subscribe((response) => {

        this.dataSet = response.data.datasets;
        this.tableColumns = response.data.repoAttributes.filter(element => element.searchCriteria === Constants.YES);
        this.reportColumns = response.data.repoAttributes.filter(element => element.inReport === Constants.YES);

        response.data.repoAttributes = response.data.repoAttributes.filter(element => element.searchCriteria === Constants.YES);

        this.hasRadioButtons = this.tableColumns.some(element => element.uiDataType === 'radio_button');

        this.createControls(response.data.repoAttributes, dataSourceId.repoTableId);
        this.submited = false;
      }, error => this.errorResponse);
    } else {
      this.removeSearchCriteriaControls();
    }
  }

  /**
   * Remove all the array controls.
   */
  removeSearchCriteriaControls() {
    this.searchCriteriaElements = [];
    for (let i = this.searchCriteriaControl.controls.length - 1; i >= 0; i--) {
      this.searchCriteriaControl.removeAt(i);
    }
  }

  /**
   * When data source drop down opens we set the last value to the last selected property.
   * @param event selected value.
   */
  onDataSourceOpen() {
    this.lastSelectedDataSource = this.tableSourceControl.value;
  }

  /**
   * Creates the search criteria form controls.
   * @param controlsToCreate that comes from the call service.
   */
  createControls(controlsToCreate, dataSourceId) {
    this.removeSearchCriteriaControls();

    // Get the last selected controls.
    const lastSelection = this.lastSelectedSearchCriteria.find(lastSelected => lastSelected.dataSource.repoTableId === dataSourceId);

    // Recreate the controls.
    controlsToCreate.forEach((element, index) => {
      let value = null;
      if (lastSelection) {
        const lastControl = lastSelection.controls[index];
        if (lastControl) {
          value = lastControl.value;
        }
      }

      if (element.mandatory && element.uiDataType !== 'radio_button') {
        if (element.uiDataType === 'number') {
          this.searchCriteriaControl.push(this.fb.control(value, [Validators.required, Validators.min(0), Validators.pattern('[0-9]+([,\.][0-9]+)?')]));
        } else {
          this.searchCriteriaControl.push(this.fb.control(value, Validators.required));
        }

      } else {
        if (element.uiDataType === 'radio_button') {
          this.searchCriteriaControl.push(this.fb.control(null));
        } else if (element.uiDataType === 'number') {
          this.searchCriteriaControl.push(this.fb.control(value, [Validators.min(0), Validators.pattern('[0-9]+([,\.][0-9]+)?')]));
        } else {
          this.searchCriteriaControl.push(this.fb.control(value));
        }
      }
      this.searchCriteriaElements.push(element);
    });

    this.blocked = false;
  }

  /**
   * Gets the repo information.
   */
  searchData() {
    if (this.repoConsultingForm.invalid) {
      return;
    }
    if (this.hasRadioButtons) {
      if (!this.isRadioButtonSelected()) {
        this.dialogLeftPosition = 150;
        this.message = 'Please select one Radio button.';
        this.headerText = 'Information';
        this.saveDisplay = true;
        return;
      }
    }


    this.blocked = true;
    this.blockedMessage = 'Getting data, please wait.';

    this.submited = true;

    const requestObject = { ...this.repoConsultingForm.value };
    this.dataTableConfiguration = this.repoConsultingService.crateTableConfiguration(requestObject, this.reportColumns, this.searchCriteriaElements);
  }

  /**
   * sets the radio button value.
   */
  setRadioButtonValue(i, element) {
    for (let index = 0; index < this.tableColumns.length; index++) {
      if (this.tableColumns[index].uiDataType === 'radio_button') {

        const currentElement = this.tableColumns[index] ? this.tableColumns[index].columnName : null;
        const penultimate = this.tableColumns[index - 1] ? this.tableColumns[index - 1].columnName : null;
        const nextElement = this.tableColumns[index + 1] ? this.tableColumns[index + 1].columnName : null;

        if (element.columnName === currentElement) {

          if (currentElement === penultimate) {
            this.searchCriteriaControl.at(index - 1).setValue(null);
          }
          if (currentElement === nextElement) {
            this.searchCriteriaControl.at(index + 1).setValue(null);

          }
        }
      }
    }

    this.searchCriteriaControl.at(i).setValue(element.attributeName);
  }

  /**
   * Checks if the radio button is selected.
   */
  isRadioButtonSelected() {
    const radiobuttonElements = this.tableColumns.filter(element => element.attributeId !== null);

    for (let index = 0; index < radiobuttonElements.length; index++) {
      if (radiobuttonElements[index].uiDataType === 'radio_button') {
        const currentElement = radiobuttonElements[index] ? radiobuttonElements[index].columnName : null;
        const penultimate = radiobuttonElements[index - 1] ? radiobuttonElements[index - 1].columnName : null;
        const nextElement = radiobuttonElements[index + 1] ? radiobuttonElements[index + 1].columnName : null;

        if ((currentElement !== nextElement) || (nextElement !== penultimate)) {
          if (radiobuttonElements[index].mandatory === true && this.repoConsultingForm.value.searchCriteria[index] !== null) {
            this.isRadioButtonRequired = true;
          }
          if (radiobuttonElements[index].mandatory === false && this.repoConsultingForm.value.searchCriteria[index] === null) {
            this.isRadioButtonRequired = true;
          }
        }

        if (currentElement === nextElement) {
          if (radiobuttonElements[index].mandatory === true && this.repoConsultingForm.value.searchCriteria[index] !== null) {
            this.isRadioButtonRequired = true;
          }
          if (radiobuttonElements[index].mandatory === false && this.repoConsultingForm.value.searchCriteria[index] === null) {
            this.isRadioButtonRequired = true;
          }
          if (radiobuttonElements[index].mandatory === true && this.repoConsultingForm.value.searchCriteria[index] === null) {
            this.isRadioButtonRequired = false;
          }
        }
        
        if (currentElement !== nextElement && currentElement !== penultimate) {
          if (radiobuttonElements[index].mandatory === true && this.repoConsultingForm.value.searchCriteria[index] === null) {
            this.isRadioButtonRequired = false;
            break;
          }
        } else if (currentElement === nextElement) {
          if (radiobuttonElements[index].mandatory === true && this.repoConsultingForm.value.searchCriteria[index] === null && this.repoConsultingForm.value.searchCriteria[index +1] === null) {
            this.isRadioButtonRequired = false;
            break;
          }
        } else if (currentElement === nextElement || currentElement === penultimate) {
          if (radiobuttonElements[index].mandatory === true && this.repoConsultingForm.value.searchCriteria[index] === null && this.repoConsultingForm.value.searchCriteria[index +1] === null && this.repoConsultingForm.value.searchCriteria[index -1] === null) {
            this.isRadioButtonRequired = false;
            break;
          }
        } else {
          this.isRadioButtonRequired = true;
          break;
        }
      }
    }
    return this.isRadioButtonRequired;
  }

  /**
   * If the service call ends remove the blocked screen.
   * @param event that ecl table fires when the call starts or ends
   */
  onServiceCall(event) {
    if (event.action === Constants.ECL_TABLE_END_SERVICE_CALL) {
      this.blocked = false;
    }
  }

  /**
   * When a service call fails we remove the loader.
   * @param error response error.
   */
  errorResponse = (error) => {
    this.blocked = false;
  }

  /**
   * Clears the form to generate new criteria.
   */
  clear() {
    this.repoConsultingForm.reset();
    this.repoForm.nativeElement.reset();
    this.submited = false;
    this.removeSearchCriteriaControls();
  }

  /**
   * Changes the dialog display property.
   */
  saveDialog() {
    this.saveDisplay = false;
  }

  /**
   * create radio buttons style inside frame. the dialog display property.
   */
  setRadioButtonStyles(key) {
    const currentElement = this.searchCriteriaElements[key];
    const penultimate = this.searchCriteriaElements[key - 1];
    const nextElement = this.searchCriteriaElements[key + 1];

    if ((penultimate && penultimate.columnName) !== currentElement.columnName) {
      return 'p-grid-group-right';
    }
    if (penultimate && currentElement && nextElement) {
      if (penultimate.columnName === currentElement.columnName && currentElement.columnName !== nextElement.columnName) {
        return 'p-grid-group-left';
      }
    }
    if (penultimate && currentElement && nextElement === undefined) {
      if (penultimate.columnName === currentElement.columnName) {
        return 'p-grid-group-left';
      }
    }
    if (penultimate && currentElement && nextElement) {
      if (penultimate.columnName === currentElement.columnName && penultimate.columnName === nextElement.columnName) {
        return 'p-grid-group-center';
      } else if (penultimate.columnName !== currentElement.columnName) {
        return 'p-grid-group-left';
      }
    }
  }

  /**
   * make radio buttons visible style inside frame.
   */
  setVisibleLabelRadioButtons(key) {
    const currentElement = this.searchCriteriaElements[key];
    const penultimate = this.searchCriteriaElements[key - 1];

    if ((penultimate && penultimate.columnName) !== currentElement.columnName) {
      return 'radio-button-visible';
    }
  }

  isUnbTable(dataSourceId: RepoTable){
    return dataSourceId !== undefined && (dataSourceId.tableName == 'PCI_EDIT_UNB' || dataSourceId.tableName == 'PCI_EDIT_UNB_OUTPT')
  }
}
