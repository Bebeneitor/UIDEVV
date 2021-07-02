import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { NewIdeaService } from 'src/app/services/new-idea.service';
import { NewIdeaRoutingModule } from './newIdea.routing';
import {NewIdeaComponent} from "./newIdea.component";
import { ToastModule } from 'primeng/toast';
import { MessageModule, DynamicDialogConfig, DynamicDialogRef, MultiSelectModule } from 'primeng/primeng';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BlockUIModule } from 'primeng/primeng';


@NgModule({
  declarations: [NewIdeaComponent],
  exports: [NewIdeaComponent],
  imports: [
    NewIdeaRoutingModule,
    FormsModule,
    CommonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    FileUploadModule,
    ToastModule,
    MessageModule,
    DynamicDialogModule,
    BlockUIModule,
    MultiSelectModule
  ],
  providers: [
    NewIdeaService,
    DynamicDialogConfig,
    DynamicDialogRef
  ]
})
export class NewIdeaModule { }
