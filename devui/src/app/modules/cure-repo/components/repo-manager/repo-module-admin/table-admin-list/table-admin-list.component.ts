import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService, ConfirmationService } from 'primeng/api';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { RepoTableAdminService } from '../repo-table-admin.service';
import { TableAddEditComponent } from '../table-add-edit/table-add-edit.component';
import { EclButtonTable, EclButtonTableCondition } from 'src/app/shared/components/ecl-table/model/ecl-button';

@Component({
  selector: 'app-table-admin-list',
  templateUrl: './table-admin-list.component.html',
  styleUrls: ['./table-admin-list.component.css']
})
export class TableAdminListComponent implements OnInit {


  @ViewChild('cureModulesTable',{static: true}) cureModulesTable: EclTableComponent

  cureModulesTableModel: EclTableModel;

  selectedRecords: any[];

  constructor(private fb: FormBuilder, private repoTableAdminService: RepoTableAdminService,
    private dialogService: DialogService, private fileManagerService: FileManagerService,
    private router: Router, private messageService: ToastMessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.cureModulesTableModel = new EclTableModel();
    this.initializeTableModel(this.cureModulesTableModel);
  }

  initializeTableModel(tableModel: EclTableModel) {
    tableModel.url = `${RoutingConstants.REPO_URL}/${RoutingConstants.REPO_TABLES}/filtered`;
    tableModel.lazy = true;
    tableModel.sortOrder = 1;
    tableModel.checkBoxSelection = true;
    tableModel.export = false;

    let eclButtonTable: EclButtonTable[] = [
      new EclButtonTable('status', true,
        [new EclButtonTableCondition(Constants.EQUAL_OPERATOR, Constants.ACTIVE_STRING_VALUE, Constants.STATUS_ACTION_DEACTIVATE),
        new EclButtonTableCondition(Constants.EQUAL_OPERATOR, Constants.INACTIVE_STRING_VALUE, Constants.STATUS_ACTION_ACTIVATE)])
    ];

    let manager = new EclTableColumnManager();
    manager.addTextColumn('displayTableName', 'Edit/Table Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('createdBy', "Created By", null, true, EclColumn.TEXT, true);
    manager.addDateColumn('creationDt', 'Creation Date', null, true, true, 'date', Constants.DATE_FORMAT_IN_ECL_TABLE);
    manager.addTextColumn('updatedBy', "Updated By", null, true, EclColumn.TEXT, true);
    manager.addDateColumn('updatedOn', 'Updated On', null, true, true, 'date', Constants.DATE_FORMAT_IN_ECL_TABLE);
    manager.addTextColumn('status', "Status", '10%', true, EclColumn.TEXT, true, 0, 'center');
    manager.addIconColumn('edit', 'Edit', '10%', 'fa fa-pencil purple');
    manager.addButtonsColumn('delete', 'Action', '10%', eclButtonTable);

    tableModel.columns = manager.getColumns();
  }

  /**
   * Switch the status in the selected item, separately.
   * 
   * @param event - Event that contains the row information.
   */
  switchStatusAttributeTemplate(event: any) {
    const row = event.row;
    let repoTableId  = [row.repoTableId];

    this.repoTableAdminService.switchStatus(repoTableId).subscribe(() => {
      this.cureModulesTable.refreshTable();
      this.messageService.messageSuccess(Constants.TOAST_SEVERITY_INFO, 
        Constants.INACTIVE_STRING_VALUE === row.status 
        ? Constants.TABLE_ACTIVATED : Constants.TABLE_DEACTIVATED);
    });
  }
  
  /**
   * Open the edit attribute pop up.
   * 
   * @param event - Event that contains the row information.
   */
  onClickEditAttribute(event: any) {
    const row = event.row;
    const urlArray = [`/cure-and-repo/repo/${Constants.REPO_TABLE_ADD_EDIT_PATH}`, row.repoTableId]
    this.router.navigate(urlArray);
  }
  
   /**
   * Switch the status in each one of the selected items.
   * 
   * @param selectedTableRepoIds - Selected table repo ids.
   */
  processModule() {
    if (this.selectedRecords && this.selectedRecords.length) {
      let repoTableIds = this.selectedRecords.map(module => module.repoTableId);
      this.repoTableAdminService.switchStatus(repoTableIds).subscribe(() => {
        this.cureModulesTable.refreshTable();
        this.messageService.messageSuccess(Constants.TOAST_SEVERITY_INFO, Constants.TABLES_UPDATED);
      });
    }
  }

  showModuleTemplate(module: any, id: number) {
    this.dialogService.open(TableAddEditComponent, {
      data: {
        module
      },
      header: `${id ? 'Add' : 'Edit'} CURE Module template`,
      width: '60%',
      contentStyle: { "max-height": "80%" }
    });
  }

  setSelectRules(event: any) {
    this.selectedRecords = event;
  }

}
