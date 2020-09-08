import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { EclUserDirectoryRoutingModule } from './ecl-user-directory-routing.module';
import { EclUserDirectoryComponent } from './ecl-user-directory.component';
import { DialogModule } from 'primeng/dialog';
import { RoleSetupService } from 'src/app/services/role-setup.service';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [EclUserDirectoryComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    AutoCompleteModule,
    PaginatorModule,
    ConfirmDialogModule,
    MessagesModule,
    EclUserDirectoryRoutingModule,
    DialogModule,
    EclTableModule
  ],
  providers: [RoleSetupService, ConfirmationService]
})

export class EclUserDirectoryModule { }