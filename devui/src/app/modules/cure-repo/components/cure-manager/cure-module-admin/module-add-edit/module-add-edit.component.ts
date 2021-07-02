import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/api';
import { flatMap } from 'rxjs/operators';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { CureModuleAdminService } from '../cure-module-admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModuleAttributeAddEditComponent } from './module-attribute-add-edit/module-attribute-add-edit.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { Constants } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';
import { Dropdown } from 'primeng/primeng';
import { EclButtonTable } from 'src/app/shared/components/ecl-table/model/ecl-button';

@Component({
    selector: 'module-add-edit',
    templateUrl: './module-add-edit.component.html',
    styleUrls: ['./module-add-edit.component.css']
})
export class ModuleAddEditComponent implements OnInit {

    @ViewChild('attributesTable',{static: true}) attributesTable: EclTableComponent;
    @ViewChild('modelViewSelector',{static: true}) modelViewSelector: Dropdown;

    moduleTemplateForm: FormGroup;

    attributesTableModel: EclTableModel;

    module: any;
    id: number;
    formInactive = null;
    tableData = [];
    availableModelViewNames: any[] = [];

    saveDisplay = false;
    message = '';
    headerText = '';
    dialogLeftPosition = 0;

    saveButtonInactive=true;


    constructor(private fb: FormBuilder, private cureModuleAdminService: CureModuleAdminService,
        private route: ActivatedRoute, private router: Router,
        private dialogService: DialogService, private messageService: ToastMessageService,private utils: AppUtils) {
    }

    ngOnInit(): void {
        this.saveButtonInactive=true;
        this.initializeAttributesTableModel();
        this.moduleTemplateForm = this.fb.group({
            moduleName: new FormControl(null, Validators.required),
            moduleView: new FormControl(null, Validators.required)
        });

        //This call is for get all module views names available in DB.
        this.cureModuleAdminService.getModelViewList().subscribe((response: any) => {            
            response.data.forEach(item => {               
                this.availableModelViewNames.push({ label: item, value: item})
            });
        });        

        this.route.params.subscribe(params => {
            this.id = parseInt(params['id'], 10);
            this.cureModuleAdminService.setPageTitle(`${this.id === 0 ? 'Add' : 'Edit'} CURE Module template`);
            if (this.id !== 0) {
                this.cureModuleAdminService.getModuleById(this.id).subscribe((response: any) => {
                    this.module = response.data;
                    this.formInactive = this.module.status !== Constants.ACTIVE_STRING_VALUE ? true : null;
                    this.saveButtonInactive= this.module.status !== Constants.ACTIVE_STRING_VALUE ? true : null;
                    this.attributesTable.value = this.module.moduleAttributes;
                    this.moduleTemplateForm.setValue({ moduleName: this.module.moduleName, moduleView: this.module.moduleView });
                    //This line is for populate the dropdown accordin with the moduleview value
                    if (this.module.moduleView) {
                        this.modelViewSelector.value = [this.module.moduleView];                       
                    }
                });
            } else {
                this.module = {
                    cureModuleId: 0,
                    moduleName: '',
                    moduleView: '',
                    status: Constants.ACTIVE_STRING_VALUE,
                    moduleAttributes: [],
                };
            }

        });

    }

    initializeAttributesTableModel() {
        this.attributesTableModel = new EclTableModel();
        let manager = new EclTableColumnManager();

        manager.addTextColumn('attributeName', "Attribute Name", null, true, EclColumn.TEXT, false);
        manager.addTextColumn('columnName', "Column Name", null, true, EclColumn.TEXT, true);
        manager.addTextColumn('uiDataType', "UI Data Type", null, true, EclColumn.TEXT, true);
        manager.addTextColumn('mandatory', "Mandatory", null, true, EclColumn.TEXT, true);
        manager.addTextColumn('status', "Status", null, true, EclColumn.TEXT, true);
        manager.addIconColumn('edit', 'Edit', '10%', 'fa fa-pencil purple');        
        manager.addButtonsColumn('delete', 'Action', '10%', [new EclButtonTable("statusAction", true)]);

        this.attributesTableModel.columns = manager.getColumns();
        this.attributesTableModel.lazy = false;
        this.attributesTableModel.sort = false;
        this.attributesTableModel.export = false;
        this.attributesTableModel.filterGlobal = false;
        this.attributesTableModel.showPaginatorOptions = true;
        this.attributesTableModel.showPaginator = true;
        this.attributesTableModel.data = this.tableData;
    }

    validateModuleView(moduleView: string): boolean {
        const controls = this.moduleTemplateForm.controls;
        controls[moduleView].value;
        if (!controls[moduleView].invalid && controls[moduleView].touched) {
            this.cureModuleAdminService.getModuleViewByName(controls[moduleView].value).subscribe((response: any) => {
                let moduleViewAttributes = response.data;
                if (moduleViewAttributes.length === 0) {
                    this.messageService.messageError('Info', 'Invalid View name.');
                    this.module.moduleAttributes = this.module.moduleAttributes.filter(attribute => attribute.attributeId > 0 );
                    controls[moduleView].setValue('');
                    this.saveButtonInactive = false;

                } else {

                    if (this.id > 0) {
                        this.module.moduleAttributes = this.module.moduleAttributes.filter(attribute => attribute.attributeId > 0 );
                       this.module.moduleAttributes.map(element => element.status = 'Inactive');                  
                    }

                    this.module.moduleAttributes = [ ...moduleViewAttributes.map(attribute => {
                        return {
                            "attributeId": Math.floor(Math.random() * 5000) * -1,
                            "attributeName": attribute,
                            "columnName": attribute.toLowerCase(),
                            "uiDataType": "text",
                            "cureModuleId": this.id,
                            "status": "Active",
                            "mandatory": false ,
                            "statusAction" : Constants.STATUS_ACTION_DEACTIVATE
                        };
                    }), ...this.module.moduleAttributes];
                    this.attributesTable.value = this.module.moduleAttributes;
                    this.saveButtonInactive = false;

                }
            });
            return true;
        }
        return false;
    }

    onClickEditAttribute(event: any) {
        if (!this.formInactive) {
            let row = event.row;
            let field = event.field;
            switch (field) {
                case 'edit':
                    this.showNewAttributeTemplate(row, this.id);
                    break;
                case 'delete':
                    if (row.status !== Constants.INACTIVE_STRING_VALUE) {
                        row.status = Constants.INACTIVE_STRING_VALUE;
                        this.messageService.messageSuccess('Info', 'Attribute updated.');
                    }
                    break;
            }
        } else {
            this.messageService.messageWarning('Warning' , this.module.moduleName + ' CURE Module is inactivate');
        }
    }

    /**
     * This method is for show activate button instead of Delete icon
     * Story : ECL-17845
     * @param event 
     */
    onAcctionButton(event: any) {

        if (!this.formInactive) {

            let row = event.row;
            let status = row.statusAction;

            if (status === Constants.STATUS_ACTION_ACTIVATE) {               
                row.statusAction = Constants.STATUS_ACTION_DEACTIVATE;
                row.status = Constants.ACTIVE_STRING_VALUE;
            } else {                
                row.statusAction = Constants.STATUS_ACTION_ACTIVATE;
                row.status = Constants.INACTIVE_STRING_VALUE;
            }
            this.messageService.messageSuccess('Info', 'Attribute updated.');
        } else {
            this.messageService.messageWarning('Warning' , this.module.moduleName + ' CURE Module is inactivate');
        }

    }

    showNewAttributeTemplate(attribute: any, id: number) {
        const dialogRef = this.dialogService.open(ModuleAttributeAddEditComponent, {
            data: {
                attribute
            },
            header: `${id === 0 ? 'Add' : 'Edit'} Attribute`,
            width: '25%',
            contentStyle: { "max-height": "80%" }
        });
        dialogRef.onClose.subscribe((resultAttribute) => {
            if (resultAttribute) {
                if (Constants.ADD_MODE === resultAttribute.mode) {
                    resultAttribute.mode = Constants.EDIT_MODE
                    this.module.moduleAttributes.push(resultAttribute);
                    this.messageService.messageSuccess('Info', 'Attribute added.');
                } else {
                    for (let i in this.module.moduleAttributes) {
                        let element = this.module.moduleAttributes[i];
                        if (element.randomId) {
                            if (element.randomId === resultAttribute.randomId) {
                                this.module.moduleAttributes[i] = { ...resultAttribute };
                                this.messageService.messageSuccess('Info', 'Attribute updated.');
                            }
                        } else if (element.attributeId === resultAttribute.attributeId) {
                            this.module.moduleAttributes[i] = { ...resultAttribute };
                            this.messageService.messageSuccess('Info', 'Attribute updated.');
                        }
                    }

                }
            }
            this.attributesTable.value = [...this.module.moduleAttributes];
            this.attributesTable.refreshTable();
        });
    }

    activateModule() {
        this.formInactive = null;
        this.saveButtonInactive = null;
        this.module.status = 'Active';
    }

    inactiveSaveButton() {

        if(this.modelViewSelector.value.length > 0 ){
            this.validateModuleView('moduleView');
            this.saveButtonInactive = false;
        } else{//clean table when there is not selected value in dropdown
            this.attributesTable.value = [];
            this.attributesTable.refreshTable();
            this.saveButtonInactive = true;
        }

    }

    saveCureModule() {

        if(!this.moduleTemplateForm.value.moduleName || 
            this.utils.validateStringContaintOnlyWhiteSpaces(this.moduleTemplateForm.value.moduleName)){
            this.dialogLeftPosition = 150;
            this.message = 'Please add one module name';
            this.headerText = 'Information';
            this.saveDisplay = true;
            return;
        } 

        if (this.moduleTemplateForm.invalid || this.module.moduleAttributes.length <= 0) {
            Object.keys(this.moduleTemplateForm.controls).forEach(key => {
                this.moduleTemplateForm.controls[key].markAsTouched();
            });
            if (this.module.moduleAttributes.length <= 0) {
                this.dialogLeftPosition = 150;
                this.message = 'Please add at least one attribute.';
                this.headerText = 'Information';
                this.saveDisplay = true;
            }
            return;
        }

        let activeAttribute = false;
        this.module.moduleAttributes.forEach(attribute => {
            if (attribute.status == Constants.ACTIVE_STRING_VALUE) {
                activeAttribute = true;
            }
        });
        if (!activeAttribute) {
            this.dialogLeftPosition = 150;
            this.message = 'Please have at least one attribute active.';
            this.headerText = 'Information';
            this.saveDisplay = true;
            return;
        }

        let resultModule = { ...this.module };
        Object.keys(this.moduleTemplateForm.controls).forEach(key => {
            resultModule = { ...resultModule, [key]: this.moduleTemplateForm.get(key).value }
        });

        if( this.modelViewSelector.value instanceof Array ) {
            resultModule.moduleView = this.modelViewSelector.value[0]; 
        } else {
            resultModule.moduleView = this.modelViewSelector.value;   
        }
    
        this.module.moduleAttributes.map(attribute => {
            if (attribute.attributeId < 0)
                attribute.attributeId = 0;
        });

        this.cureModuleAdminService.saveModule(resultModule).pipe(flatMap((response: any) => {
            this.messageService.messageSuccess('Info', 'Module saved.');
            return this.cureModuleAdminService.getModuleById(response.data);
        })).subscribe((module: any) => {
            this.module = { ...module.data };
        });
    }

    saveDialog() {
        this.saveDisplay = false;
    }

    isInvalidElement(name: string): boolean {
        const controls = this.moduleTemplateForm.controls;
        if (controls[name].invalid && controls[name].touched) {
            return true;
        }
        return false;
    }
}