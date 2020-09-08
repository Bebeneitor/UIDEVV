import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDownloadInboxComponent } from './file-download-inbox.component';

const routes: Routes = [
    {
        path: '',
        component: FileDownloadInboxComponent,
        data: { pageTitle: 'Downloads' }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileDownloadInboxRoutingModule{ }