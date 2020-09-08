import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileDownloadInboxComponent } from './file-download-inbox.component';
import { FileDownloadInboxService } from './file-download-inbox.service';
import { FileDownloadInboxRoutingModule } from './file-download-inbox-routing.module';
import { CardModule } from 'primeng/card';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { BlockUIModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    declarations: [FileDownloadInboxComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        FileDownloadInboxRoutingModule,
        EclTableModule,
        BlockUIModule,
        ConfirmDialogModule
    ],
    providers: [FileDownloadInboxService, ConfirmationService]
})
export class FileDownloadInboxModule{ }