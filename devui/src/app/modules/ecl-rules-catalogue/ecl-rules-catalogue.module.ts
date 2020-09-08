import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EclRulesCatalogueRoutingModule } from './ecl-rules-catalogue.routing';
import { EclRulesCatalogueComponent } from './ecl-rules-catalogue.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ExcelService } from 'src/app/services/excel.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule, CalendarModule, BlockUIModule, OverlayPanelModule, CheckboxModule } from 'primeng/primeng';
import { LibraryViewService } from 'src/app/services/library-view.service';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { DialogService } from 'primeng/api';
import { CreateFilterComponent } from 'src/app/shared/components/create-filter/create-filter.component';
import { CreateTagComponent } from 'src/app/shared/components/create-tag/create-tag.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [EclRulesCatalogueComponent],
  imports: [
    CommonModule,
    FormsModule,
    EclRulesCatalogueRoutingModule,
    MultiSelectModule,
    PanelModule,
    TableModule,
    AccordionModule,
    SliderModule,
    RadioButtonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    BlockUIModule,
    OverlayPanelModule,
    EclTableModule,
    ConfirmDialogModule,
    CheckboxModule
  ],
  providers: [
    ExcelService,
    LibraryViewService,
    DialogService
  ],
  entryComponents: [
    CreateFilterComponent, CreateTagComponent
  ]
})
export class EclRulesCatalogueModule { }
