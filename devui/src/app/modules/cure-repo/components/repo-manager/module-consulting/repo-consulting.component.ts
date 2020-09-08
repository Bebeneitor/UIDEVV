import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  @ViewChild('dataSourceDropdown') dataSourceDropdownControl: Dropdown;
  @ViewChild('repoDataTable') repoDataTable: EclTableComponent;
  @ViewChild('repoForm') repoForm: ElementRef;

  get tableSourceControl() { return this.repoConsultingForm.get('tableSource'); }
  get dataSourceControl() { return this.repoConsultingForm.get('dataSet'); }
  get searchCriteriaControl() { return this.repoConsultingForm.get('searchCriteria') as FormArray; }

  searchCriteriaElements = [];

  yearValidRange = `${Constants.MIN_VALID_YEAR}:${Constants.MAX_VALID_YEAR}`;
  tableColumns: any;

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

      if (this.lastSelectedDataSource) {
        const selectionToReplace = this.lastSelectedSearchCriteria.findIndex(last => last.dataSource === this.lastSelectedDataSource);
        if (selectionToReplace > -1) {
          this.lastSelectedSearchCriteria.splice(selectionToReplace);
        }
        this.lastSelectedSearchCriteria.unshift({ controls: { ...this.searchCriteriaControl.controls }, dataSource: this.lastSelectedDataSource });
      }

      this.repoConsultingService.getTableDetails(dataSourceId.repoTableId).subscribe((response) => {
        this.dataSet = response.data.datasets;
        this.tableColumns = response.data.repoAttributes;

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

      if (element.mandatory) {
        this.searchCriteriaControl.push(this.fb.control(value));
      } else {
        this.searchCriteriaControl.push(this.fb.control(value));
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
    this.blocked = true;
    this.blockedMessage = 'Getting data, please wait.';

    this.submited = true;

    const requestObject = { ...this.repoConsultingForm.value };
    this.dataTableConfiguration = this.repoConsultingService.crateTableConfiguration(requestObject, this.tableColumns);
    if (this.repoDataTable) {
      this.repoDataTable.resetDataTable();
    }
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
}