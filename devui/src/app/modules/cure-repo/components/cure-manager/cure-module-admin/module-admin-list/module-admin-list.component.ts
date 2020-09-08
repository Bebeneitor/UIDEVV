import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'primeng/api';

import { ToastMessageService } from 'src/app/services/toast-message.service';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';
import { CureModuleAdminService } from '../cure-module-admin.service';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { Constants } from 'src/app/shared/models/constants';


import { Router } from '@angular/router';
import { ModuleAddEditComponent } from '../module-add-edit/module-add-edit.component';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

@Component({
    selector: 'cure-module-admin-list',
    templateUrl: './module-admin-list.component.html',
    styleUrls: ['./module-admin-list.component.css']
})
export class ModuleAdminListComponent implements OnInit{

    @ViewChild('cureModulesTable') cureModulesTable: EclTableComponent

    cureModulesTableModel: EclTableModel;

    constructor(private fb: FormBuilder, private cureModuleAdminService: CureModuleAdminService,
        private dialogService: DialogService, private fileManagerService: FileManagerService,
        private router: Router, private messageService: ToastMessageService) { }
    
    ngOnInit(): void {
        this.cureModulesTableModel = new EclTableModel();
        this.initializeTableModel(this.cureModulesTableModel);
    }

    initializeTableModel(tableModel: EclTableModel){
        tableModel.url = `${RoutingConstants.CURE_URL}/${RoutingConstants.CURE_GET_MODULES}/filtered`;
        tableModel.lazy = true;
        tableModel.sortOrder = 1;
        tableModel.checkBoxSelection = false;

        let manager = new EclTableColumnManager();
        manager.addTextColumn('moduleName', 'Module Name', null, true, EclColumn.TEXT, true);
        manager.addTextColumn('moduleView', "Module View", null, true, EclColumn.TEXT, true);
        manager.addTextColumn('createdBy', "Created By", null, true, EclColumn.TEXT, true);
        manager.addDateColumn('creationDt', 'Creation Date', null, true, true, 'date', 'MM/dd/yyyy');
        manager.addTextColumn('updatedBy', "Updated By", null, true, EclColumn.TEXT, true);
        manager.addDateColumn('updatedOn', 'Updated On', null, true, true, 'date', 'MM/dd/yyyy');
        manager.addTextColumn('status', "Status", null, true, EclColumn.TEXT, true);
        manager.addIconColumn('edit', 'Edit', '10%', 'fa fa-pencil purple');
        manager.addIconColumn('delete', 'Delete', '10%', 'fa fa-trash-o purple');

        tableModel.export = false;
        tableModel.columns = manager.getColumns();
    }

    onClickIcon(event: any){
        const row = event.row;
        const field = event.field;

        switch(field){
            case 'edit':
                const urlArray = [`/cure-and-repo/cure/${Constants.CURE_MODULE_ADD_EDIT_PATH}`, row.cureModuleId ]
                this.router.navigate(urlArray);
                break;
            case 'delete':
                if(row.status !== Constants.INACTIVE_STRING_VALUE){
                    this.cureModuleAdminService.inactiveModule(row).subscribe(() => {
                        this.cureModulesTable.refreshTable();
                        this.messageService.messageSuccess('Info', 'Module updated.');
                    });
                }
                break;
        }
    }

    showModuleTemplate(module: any, id: number) {
        this.dialogService.open(ModuleAddEditComponent, {
            data: {
              module
            },
            header: `${id ? 'Add' : 'Edit'} CURE Module template`,
            width: '60%',
            contentStyle: { "max-height": "80%" }
          });
        }
}