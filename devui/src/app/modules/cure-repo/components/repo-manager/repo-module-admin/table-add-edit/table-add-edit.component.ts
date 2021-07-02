import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclButtonTable, EclButtonTableCondition } from 'src/app/shared/components/ecl-table/model/ecl-button';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { RepoTableAdminService } from '../repo-table-admin.service';
import { TableAttributeAddEditComponent } from './table-attribute-add-edit/table-attribute-add-edit.component';
@Component({
  selector: 'app-table-add-edit',
  templateUrl: './table-add-edit.component.html',
  styleUrls: ['./table-add-edit.component.css']
})
export class TableAddEditComponent implements OnInit {

  @ViewChild('searchCriteriaTable',{static: true}) searchCriteriaTableReference: EclTableComponent;

  @ViewChild('tableForm',{static: true}) formReference: ElementRef;

  tableFormGroup: FormGroup;
  searchCriteriaTableModel: EclTableModel;
  reportTableTableModel: EclTableModel;

  formInactiveSave = false;
  tableId: number;
  dialogLeftPosition: number;
  message: string;
  headerText: string;
  saveDisplay: boolean;

  module: any;
  searchCriteriaAttributes: any = [];
  tableOwners: any;
  tableNamesDb: SelectItem[];

  formInactive = false;
  validaButtonInactive = true;
  tableNameFlag = false;
  tableOwnerFlag = false;

  tableNameSub = new Subscription();
  tableOwnerSub = new Subscription();

  blockedDocument = false;
  hasBeenSaved: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private repoTableAdminService: RepoTableAdminService,
    private dialogService: DialogService, private messageService: ToastMessageService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.tableNameSub) {
      this.tableNameSub.unsubscribe();
    }
    if (this.tableOwnerSub) {
      this.tableOwnerSub.unsubscribe();
    }

    this.tableOwners = this.repoTableAdminService.getTableOwners();

    // Initialize report table and search criteria table
    this.initializeTableModel('searchCriteriaTableModel');

    // Create the form group for the table.
    this.tableFormGroup = this.fb.group({
      tableName: new FormControl(null, Validators.required),
      tableNameInDb: new FormControl(null, Validators.required),
      tableOwnerInDb: new FormControl(null, Validators.required)
    });

    this.tableNameSub = this.tableFormGroup.get('tableNameInDb').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    ).subscribe(item => {
      this.tableNameFlag = (item && item !== '')
      this.validaButtonInactive = !this.tableNameFlag || !this.tableOwnerFlag;
    });

    this.tableOwnerSub = this.tableFormGroup.get('tableOwnerInDb').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    ).subscribe(item => {
      this.tableOwnerFlag = (item && item !== '')
      this.validaButtonInactive = !this.tableNameFlag || !this.tableOwnerFlag;
    });

    // Subscribe to router params observable.
    this.route.params.subscribe(params => {
      if (params['id'] && (this.tableId === undefined || this.tableId <= 0)) {
        this.tableId = +params['id'];
      }
      this.repoTableAdminService.setPageTitle(`${this.tableId <= 0 ? 'Add' : 'Edit'} REPO Table template`);

      if (this.tableId > 0) {
        this.repoTableAdminService.getTableById(this.tableId).subscribe((response: any) => {
          this.setFormValue(response);
          this.hasBeenSaved = true;
        });
      } else { this.formInactive = true; this.formInactiveSave = true }
    });
  }

  /**
   * Sets the form value and validity, also sets the tables value.
   * @param response contains the table info and attributes info.
   */
  setFormValue(response: any) {
    let { displayTableName, tableOwner, tableName, repoAttributes } = response.data;

    this.searchCriteriaAttributes = [...repoAttributes
      .filter(elements => elements.searchCriteria === Constants.YES)];

    this.searchCriteriaTableReference.value = this.searchCriteriaAttributes;

    if (tableOwner && tableName) {
      this.blockedDocument = true;
      this.repoTableAdminService.getTableNamesDb(tableOwner).then(tableNameDb => {
        this.tableNamesDb = tableNameDb;
        this.tableFormGroup.setValue({
          tableName: displayTableName,
          tableOwnerInDb: this.tableOwners.find(type => type.value === tableOwner),
          tableNameInDb: this.tableNamesDb.length ? this.tableNamesDb.find(type => type.value === tableName)
            : tableName
        });
        this.blockedDocument = false;
      });
    }

    this.searchCriteriaTableReference.refreshTable();

    if (response.data.status !== Constants.ACTIVE_STRING_VALUE) {
      this.tableFormGroup.disable();
      this.formInactive = true;
      this.formInactiveSave = true;
    }
  }

  /**
   * Initializes the given table model name.
   * @param tableModel to be initialized
   */
  initializeTableModel(tableModel: string) {
    this[tableModel] = new EclTableModel();
    let manager = new EclTableColumnManager();

    let eclButtonTable: EclButtonTable[] = [
      new EclButtonTable('status', true,
        [new EclButtonTableCondition(Constants.EQUAL_OPERATOR, Constants.ACTIVE_STRING_VALUE, Constants.STATUS_ACTION_DEACTIVATE),
        new EclButtonTableCondition(Constants.EQUAL_OPERATOR, Constants.INACTIVE_STRING_VALUE, Constants.STATUS_ACTION_ACTIVATE)])
    ];

    if (tableModel === 'searchCriteriaTableModel') {
      manager.addTextColumn('attributeName', "Criteria label", null, true, EclColumn.TEXT, false);
      manager.addTextColumn('uiDataType', "Criteria UI type", null, true, EclColumn.TEXT, true);
      manager.addTextColumn('columnName', "Database column linked", null, true, EclColumn.TEXT, true);
    }
    manager.addTextColumn('status', "Status", '10%', true, EclColumn.TEXT, true, 0, 'center');
    manager.addTextColumn('inReport', "In report", '10%', true, EclColumn.TEXT, true, 0, 'center');
    manager.addIconColumn('edit', 'Edit', '10%', 'fa fa-pencil purple');
    manager.addButtonsColumn('delete', 'Action', '10%', eclButtonTable);

    this[tableModel].columns = manager.getColumns();
    this[tableModel].lazy = false;
    this[tableModel].sort = false;
    this[tableModel].export = false;
    this[tableModel].filterGlobal = false;
    this[tableModel].showPaginatorOptions = true;
    this[tableModel].showPaginator = true;
    this[tableModel].data = [];
  }

  /**
   * Opens the edit attribute pop up.
   * @param event contains the row information.
   */
  onClickEditAttribute(event: any) {
    if (this.tableFormGroup.status !== Constants.DISABLED_STATUS) {
      this.showNewAttributeTemplate(event.row, this.tableId);
    }
  }

  /**
   * Changes the status attribute.
   * @param event - contains the row information.
   */
  changeStatusAttributeTemplate(event: any) {
    let row = event.row;
    if (this.tableFormGroup.status !== Constants.DISABLED_STATUS) {
      this.toggleStatusAndInReport(row);
      if (this.validateActiveAttribute()) {
        this.saveRepoTable();
      } else {
       this.toggleStatusAndInReport(row);
      }
    }
  }

  /**
   * Toggles the status and the inReport properties from the selected Row.
   * @param row to be processed.
   */
  toggleStatusAndInReport(row) {
    row.status = (row.status === Constants.ACTIVE_STRING_VALUE) ? Constants.INACTIVE_STRING_VALUE :
          (row.status === Constants.INACTIVE_STRING_VALUE) ? Constants.ACTIVE_STRING_VALUE : row.status;

        row.inReport = (row.status === Constants.ACTIVE_STRING_VALUE) ? 'Yes' :
          (row.status === Constants.INACTIVE_STRING_VALUE) ? 'No' : row.status;
  }

  /**
   * Opens the pop up for edition and process the row in the table component.
   * @param attribute element to be updated.
   * @param id table id value
   */
  showNewAttributeTemplate(attribute: any, id: number) {
    const dialogRef = this.dialogService.open(TableAttributeAddEditComponent, {
      data: {
        attribute,
        attributeList: this.searchCriteriaTableReference.value
      },
      header: `${id === 0 ? 'Add' : 'Edit'} Attribute`,
      width: '25%',
      contentStyle: { "max-height": "80%" }
    });

    dialogRef.onClose.subscribe((resultAttribute) => {
      if (resultAttribute) {
        let message = ``;

        if (Constants.ADD_MODE === resultAttribute.mode) {
          resultAttribute.mode = Constants.EDIT_MODE;
          const elementToAddSearch = { ...resultAttribute, removed: false };
          const elementToAddReport = { ...elementToAddSearch };

          if (resultAttribute.searchCriteria !== Constants.YES) {
            elementToAddSearch.removed = true;
          }

          if (resultAttribute.inReport !== Constants.YES) {
            elementToAddReport.removed = true;
          }
          this.searchCriteriaAttributes.push(elementToAddSearch);

          message += `Attribute added.`;

        } else {
          let isUpdated = false;
          let isRemoved = false;

          let isUpdatedReport = false;
          let isRemovedReport = false;

          for (let i in this.searchCriteriaAttributes) {
            let elementToAdd = { ...resultAttribute };
            elementToAdd['removed'] = false;

            let element = this.searchCriteriaAttributes[i];
            if (element.randomId) {
              if (element.randomId === resultAttribute.randomId) {

                if (resultAttribute.searchCriteria === Constants.YES) {
                  isUpdated = true;
                } else {
                  elementToAdd['removed'] = true;
                  isRemoved = true;
                }
                this.searchCriteriaAttributes.splice(+i, 1, { ...elementToAdd });

              }
            } else if (element.attributeId === resultAttribute.attributeId) {

              if (resultAttribute.searchCriteria === Constants.YES) {
                isUpdated = true;
              } else {
                elementToAdd['removed'] = true;
                isRemoved = true;
              }
              this.searchCriteriaAttributes.splice(+i, 1, { ...elementToAdd });

            }
          }

          if (isUpdated) {
            message += 'Attribute Updated in Search Criteria';
          }
          if (isRemoved) {
            message += '\nAttribute Removed in Search Criteria';
          }
          if (isUpdatedReport) {
            message += '\nAttribute Updated in Report Table';
          }
          if (isRemovedReport) {
            message += '\n Attribute Removed in Report Table';
          }
          message += '.';
        }

        this.searchCriteriaAttributes = this.searchCriteriaAttributes.filter(att => !att.removed);

        this.searchCriteriaTableReference.value = [...this.searchCriteriaAttributes];

        this.messageService.messageSuccess('Info', message);
        this.saveRepoTable();
      }
      this.searchCriteriaTableReference.refreshTable();
    });
  }

  /**
   * Checks if there is atleast one active element in the search criteria table.
   * @returns 
   */
  validateActiveAttribute() {
    let searchCriteriaActive = this.searchCriteriaTableReference.value.some(el => el.status === Constants.ACTIVE_STRING_VALUE);
    if (!searchCriteriaActive) {
      this.dialogLeftPosition = 150;
      this.message = 'Please have at least one attribute active in search criteria.';
      this.headerText = 'Information';
      this.saveDisplay = true;
    }
    return searchCriteriaActive;
  }

  /**
   * Saves the table and its attributes.
   */
  saveRepoTable() {
    if (this.tableFormGroup.invalid) {
      return;
    }

    if (!this.validateActiveAttribute()) {
      return;
    }

    const searchCriteriaElements = this.mapElements(this.searchCriteriaAttributes);
    const allAttributes = [...searchCriteriaElements.filter(elem => elem.attributeId > 0 || (elem.attributeId === 0))];

    const requestBody = {
      status: Constants.ACTIVE_STRING_VALUE,
      repoTableId: this.tableId,
      repoAttributes: allAttributes,
      tableName: this.tableFormGroup.get('tableNameInDb').value.value,
      tableOwner: this.tableFormGroup.get('tableOwnerInDb').value.value,
      displayTableName: this.tableFormGroup.get('tableName').value
    };
    
    this.repoTableAdminService.saveRepoTable(requestBody).pipe(flatMap((response: any) => {
      this.tableId = response.data;
      return this.repoTableAdminService.getTableById(response.data);
    })).subscribe((response: any) => {
      this.messageService.messageSuccess('Info', 'Table saved.');
      this.formInactiveSave = true;
      this.router.navigate(['/cure-and-repo/repo/table-add-edit', response.data.repoTableId]);
    });
  }

  /**
   * Maps the elements into a new set of objects.
   * @param elements to be formated.
   */
  mapElements(elements: any[]) {
    return elements.map(element => {
      return {
        attributeDetails: element.attributeDetails ? element.attributeDetails : null,
        attributeId: element.attributeId < 0 ? 0 : element.attributeId,
        attributeName: element.attributeName,
        columnName: element.columnName,
        inReport: element.inReport,
        mandatory: element.mandatory,
        searchCriteria: element.searchCriteria,
        status: element.status,
        uiDataType: element.uiDataType ? (element.uiDataType.length > 0 ? element.uiDataType : 'text') : 'text',
        mode: element.mode
      }
    });
  }

  /**
   * Method used to validate after click the button 'Validate'
   */
  validateRepoTable() {
    const controls = this.tableFormGroup.controls;
    const tableName = controls['tableNameInDb'].value.value;
    const tableOwner = controls['tableOwnerInDb'].value.value;
    this.repoTableAdminService.validateRepoTableCall(tableName, tableOwner).subscribe((response: any) => {
      if (response.data.length > 0) {
        this.formInactive = false;
        this.formInactiveSave = false;
        this.messageService.messageSuccess('Info', 'Table and DB owner are valid');
        this.searchCriteriaAttributes = [...response.data];
        this.searchCriteriaTableReference.value = this.searchCriteriaAttributes;
        this.searchCriteriaTableReference.refreshTable();
      } else {
        this.formInactive = true;
        this.formInactiveSave = true;
        this.messageService.messageError('Error', 'Table and/or DB owner not valid');
      }
    }, error => {
      this.formInactive = true;
      this.formInactiveSave = true;
      this.messageService.messageError('Error', 'Table and/or DB owner not valid');
    });
  }

  /**
   * Owner dropdown even, when some selection has changed.
   */
  ownerChanged() {
    this.formInactive = true;
    this.formInactiveSave = true;
    this.blockedDocument = true;
    this.tableFormGroup.get('tableNameInDb').reset();
    this.repoTableAdminService.getTableNamesDb(this.tableFormGroup.get('tableOwnerInDb').value.value).then(tableNameDb => {
      this.tableNamesDb = tableNameDb;
      this.blockedDocument = false;
    });
  }

}
