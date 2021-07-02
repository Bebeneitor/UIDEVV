import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FieldSelectionUpdatesComponent } from "./field-selection-updates.component";
import { FieldSelectionUpdatesRoutingModule } from "./field-selection-updates.routing";
import { PickListModule } from "primeng/picklist";
import { ListboxModule } from "primeng/listbox";
import { AccordionModule, CheckboxModule, ConfirmDialogModule } from "primeng/primeng";
import { DropdownModule } from "primeng/dropdown";
import { EclCategoryComponent } from './ecl-category/ecl-category.component';
import { ReferenceSourceComponent } from './reference-source/reference-source.component';
import { ReferenceSourceService } from 'src/app/services/reference-source.service';
import { FieldSelectionUpdatesService } from 'src/app/services/field-selection-updates.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { EclTeamComponent } from './ecl-team/ecl-team.component';
import { ToastModule } from 'primeng/toast';
import { PolicyPackageComponent } from './policy-package/policy-package.component';

@NgModule({
  declarations: [FieldSelectionUpdatesComponent, EclCategoryComponent, ReferenceSourceComponent, EclTeamComponent, PolicyPackageComponent],
  imports: [
    FieldSelectionUpdatesRoutingModule,
    FormsModule,
    CommonModule,
    TableModule,
    DialogModule,
    PickListModule,
    ListboxModule,
    CheckboxModule,
    DropdownModule,
    AccordionModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    FieldSelectionUpdatesService,
    ReferenceSourceService,
    ToastMessageService
  ]
})

export class FieldSelectionUpdatesModule { }
