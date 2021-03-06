import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule, ButtonModule, ConfirmationService, ConfirmDialogModule, InputTextModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { SharedModule } from '../../shared/shared.module';
import { CureManagerComponent } from './components/cure-manager/cure-manager.component';
import { CureModuleAdminService } from './components/cure-manager/cure-module-admin/cure-module-admin.service';
import { ModuleAddEditComponent } from './components/cure-manager/cure-module-admin/module-add-edit/module-add-edit.component';
import { ModuleAttributeAddEditComponent } from './components/cure-manager/cure-module-admin/module-add-edit/module-attribute-add-edit/module-attribute-add-edit.component';
import { ModuleAdminListComponent } from './components/cure-manager/cure-module-admin/module-admin-list/module-admin-list.component';
import { ModuleConsultingComponent } from './components/cure-manager/module-consulting/module-consulting.component';
import { RepoConsultingComponent } from './components/repo-manager/module-consulting/repo-consulting.component';
import { RepoConsultingService } from './components/repo-manager/module-consulting/repo-consulting.service';
import { RepoManagerComponent } from './components/repo-manager/repo-manager.component';
import { RepoTableAdminService } from './components/repo-manager/repo-module-admin/repo-table-admin.service';
import { TableAddEditComponent } from './components/repo-manager/repo-module-admin/table-add-edit/table-add-edit.component';
import { TableAttributeAddEditComponent } from './components/repo-manager/repo-module-admin/table-add-edit/table-attribute-add-edit/table-attribute-add-edit.component';
import { TableAdminListComponent } from './components/repo-manager/repo-module-admin/table-admin-list/table-admin-list.component';
import { CureRoutingModule } from './cure-repo-routing.module';



@NgModule({
  declarations: [
    CureManagerComponent,
    ModuleConsultingComponent,
    ModuleAdminListComponent,
    ModuleAddEditComponent,
    ModuleAttributeAddEditComponent,
    RepoManagerComponent,
    RepoConsultingComponent,
    TableAdminListComponent,
    TableAddEditComponent,
    RepoManagerComponent,
    RepoConsultingComponent,
    TableAttributeAddEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CureRoutingModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    AccordionModule,
    BlockUIModule,
    CalendarModule,
    FieldsetModule,
    EclTableModule,
    CheckboxModule,
    TriStateCheckboxModule,
    EclTableModule,
    DialogModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    FormsModule,
    SharedModule
  ],
  entryComponents: [ModuleAddEditComponent, ModuleAttributeAddEditComponent, TableAttributeAddEditComponent],
  providers: [ConfirmationService, DialogService, CureModuleAdminService, RepoConsultingService, RepoTableAdminService]
})
export class CureAndRepoModule { }
