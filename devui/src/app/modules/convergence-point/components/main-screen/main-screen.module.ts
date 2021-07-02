import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainScreenRoutingModule } from './main-screen-routing.module';
import { MainScreenComponent } from './main-screen.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { DownloadComponent } from '../download/download.component';
import { UploadComponent } from '../upload/upload.component';
import { TemplateComponent } from '../template/template.component';
import { ApproversComponent } from '../approvers/approvers.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CheckboxModule, BlockUIModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { DeletionComponent } from '../deletion/deletion.component';
import { CloneComponent } from '../clone/clone.component';
import { AssociateComponent } from '../associate/associate.component';
import { ExportComponent } from '../export/export.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [MainScreenComponent, DownloadComponent, UploadComponent, TemplateComponent, ApproversComponent, DeletionComponent, CloneComponent, AssociateComponent, ExportComponent],
  imports: [
    CommonModule,
    MainScreenRoutingModule,
    SharedModule,
    TabViewModule,
    RadioButtonModule,
    FormsModule,
    TreeTableModule,
    DialogModule,
    OverlayPanelModule,
    DropdownModule,
    RadioButtonModule,
    TabViewModule,
    NgxPermissionsModule,
    CheckboxModule,
    ProgressBarModule,
    TooltipModule,
    BlockUIModule,
    ConfirmDialogModule
  ],
  providers: [
    ConvergencePointService
  ]
})

export class MainScreenModule { }