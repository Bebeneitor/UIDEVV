import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService, DynamicDialogConfig, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextareaModule, InputTextModule, TooltipModule, CalendarModule, MessageModule, OverlayPanelModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ReturnDialogComponent } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.component';
import { ReturnDialogModule } from 'src/app/modules/rule-creation/new-idea-research/components/return-dialog/return-dialog.module';
import { ProvisionalRuleComponent } from '../provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../provisional-rule/provisional-rule.module';
import { NewIdeaResearchDuplicateCheckComponent } from './components/nir-duplicate-chk/nir-duplicate-chk.component';
import { NirReferenceDetailComponent } from './components/nir-reference-detail/nir-reference-detail.component';
import { NirSearchFormComponent } from './components/nir-search-form.component/nir-search-form.component';
import { NewIdeaResearchComponent } from './new-idea-research.component';
import { NewIdeaResearchRoutingModule } from './new-idea-research.routing';
import { StorageService } from 'src/app/services/storage.service';
import { IdeaService } from 'src/app/services/idea.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { sqlDateConversion } from 'src/app/shared/services/utils';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        NewIdeaResearchComponent,
        NewIdeaResearchDuplicateCheckComponent,
        NirReferenceDetailComponent,
        NirSearchFormComponent
    ],
    exports: [
        NewIdeaResearchComponent,
        NewIdeaResearchDuplicateCheckComponent,
        NirReferenceDetailComponent,
        NirSearchFormComponent
    ],
    imports: [
        CalendarModule,
        ProvisionalRuleModule,
        ReturnDialogModule,
        DialogModule,
        DynamicDialogModule,
        TooltipModule,
        FormsModule,
        TableModule,
        DropdownModule,
        PaginatorModule,
        AutoCompleteModule,
        CommonModule,
        ReactiveFormsModule,
        TabViewModule,
        MultiSelectModule,
        CheckboxModule,
        PaginatorModule,
        InputTextModule,
        InputTextareaModule,
        NewIdeaResearchRoutingModule,
        SharedModule,
        FileUploadModule,
        ConfirmDialogModule,
        ToastModule,
        MessageModule,
        OverlayPanelModule
    ],
    providers: [
        DialogService, 
        IdeaService,
        StorageService,
        sqlDateConversion,
        DynamicDialogConfig,
        ConfirmationService
    ],
    entryComponents: [
        ProvisionalRuleComponent,
        ReturnDialogComponent
    ]
})

export class NewIdeaResearchModule {

}
