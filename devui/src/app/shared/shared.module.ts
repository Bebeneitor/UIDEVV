import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { BreadcrumbModule, ButtonModule, ConfirmationService, ConfirmDialogModule, DialogModule, DialogService, DropdownModule, DynamicDialogConfig, InputTextModule, TooltipModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { ExcelService } from '../services/excel.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CreateFilterComponent } from './components/create-filter/create-filter.component';
import { CreateTagComponent } from './components/create-tag/create-tag.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { GridToolsComponent } from './components/grid-tools/grid-tools.component';
import { PridFormComponent } from './components/prid-form/prid-form.component';
import { UpdateFilterTagComponent } from './components/update-filter-tag/update-filter-tag.component';
import { ThrottleTimeClickDirective } from './directives/throttle-time-click.directive';
import { TextToUppercaseDirective } from './directives/text-to-uppercase.directive';
import { FileLoaderComponent } from '../modules/convergence-point/components/file-loader/file-loader.component';
import { TableModule } from 'primeng/table';
import { ResearchRequestService } from '../services/research-request.service';

@NgModule({
  declarations: [
    GridToolsComponent,
    BreadcrumbComponent,
    ThrottleTimeClickDirective,
    FileUploaderComponent,
    CreateFilterComponent,
    CreateTagComponent,
    UpdateFilterTagComponent,
    PridFormComponent,
    TextToUppercaseDirective,
    FileLoaderComponent
  ],
  exports: [GridToolsComponent,
    BreadcrumbComponent,
    ThrottleTimeClickDirective,
    FileUploaderComponent,
    PridFormComponent,
    DynamicDialogModule,
    TextToUppercaseDirective,
    FileLoaderComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    DropdownModule,
    DataViewModule,
    TableModule,
    InputTextareaModule,
    DialogModule,
    DynamicDialogModule,
    MessagesModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    ExcelService,
    DialogService,
    DynamicDialogConfig,
    ConfirmationService,
    ResearchRequestService
  ],
  entryComponents: [UpdateFilterTagComponent]
})
export class SharedModule { }
