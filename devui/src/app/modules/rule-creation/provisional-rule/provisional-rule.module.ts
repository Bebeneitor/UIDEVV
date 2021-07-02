import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule, CalendarModule, CheckboxModule, MessageModule, BlockUIModule, MessageService, PanelModule, EditorModule } from 'primeng/primeng';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { TooltipModule } from 'primeng/tooltip';
import { ProvisionalRuleService } from 'src/app/services/provisional-rule.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MarkerFavoritesModule } from 'src/app/shared/components/marker-favorites/marker-favorites.module';
import { KeyLimitService, sqlDateConversion, DateUtils } from 'src/app/shared/services/utils';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClaimsComponent } from './claims/claims.component';
import { DifMarkupsEditorComponent } from "./components/dif-markups-editor/dif-markups-editor.component";
import { RuleApplicationComponent } from './components/rule-application/rule-application.component';
import { RuleDetailsComponent } from "./components/rule-details/rule-details.component";
import { IcmsTemplateChangeComponent } from './icms-template-change/icms-template-change.component';
import { IcmsTemplateComponent } from './icms-template/icms-template.component';
import { ImpactsComponent } from './impacts/impacts.component';
import { OpportunityValueComponent } from './opportunity-value/opportunity-value.component';
import { ProvisionalReferencesComponent } from './provisional-references/provisional-references.component';
import { ProvisionalRuleCodesComponent } from './provisional-rule-codes/provisional-rule-codes.component';
import { ProvisionalRuleProvidersComponent } from './provisional-rule-providers/provisional-rule-providers.component';
import { ProvisionalRuleComponent } from './provisional-rule.component';
import { RationaleComponent } from './rationale/rationale.component';
import { RuleHistoryComponent } from './rule-history/rule-history.component';
import { claimService } from 'src/app/services/claim-service';
import { GoodIdeasModule } from 'src/app/shared/components/good-ideas/good-ideas.module';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { AuditLogComponent } from './audit-log/audit-log.component';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { MessagesModule } from 'primeng/messages';
import { ProcedureCodeBoxComponent } from './components/procedure-code-box/procedure-code-box.component';
import { ProcedureCodesService } from 'src/app/services/procedure-codes.service';
import { CurrencyBoxComponent } from './components/currency-box/currency-box.component';
import { DatePipe } from '@angular/common';
import { ProvisionalRuleHcpcsCptCodesComponent } from './provisional-rule-hcpcs-cpt-codes/provisional-rule-hcpcs-cpt-codes.component';
import { ProvisionalRuleIndividualCodesComponent } from './provisional-rule-hcpcs-cpt-codes/provisional-rule-individual-codes/provisional-rule-individual-codes.component';
import { ErrorCodesComponent } from './provisional-rule-hcpcs-cpt-codes/error-codes/error-codes.component';
import { NewlyAddedCodesTableComponent } from './provisional-rule-hcpcs-cpt-codes/newly-added-codes-table/newly-added-codes-table.component';
import { ProvisionalRuleCopyPasteComponent } from './provisional-rule-hcpcs-cpt-codes/provisional-rule-copy-paste/provisional-rule-copy-paste.component';
import { ProccodesUploadComponent } from './provisional-rule-hcpcs-cpt-codes/provrule-proccodes-upload/provrule-proccodes-upload.component';
import { NotesCommentsComponent } from './notes-comments/notes-comments.component';
import { RuleNotesService } from 'src/app/services/rule-notes.service';
import { IcdComponent } from './icd/icd.component';
import { IndividuallyCodesComponent } from './icd/individually-codes/individually-codes.component';
import { IcdCopyPasteComponent } from './icd/icd-copy-paste/icd-copy-paste.component';
import { PdgTemplateComponent } from './pdg-template/pdg-template.component';
import { ReferenceComponent } from './pdg-template/reference/reference.component';
import { PdgFileAttachmentsComponent } from './pdg-template/pdg-additional-info/pdg-file-attachments/pdg-file-attachments.component';
import { PdgTemplateService } from 'src/app/services/pdg-template.service';
import { TemplateNroHPPComponent } from './pdg-template/template-nro-hpp/template-nro-hpp.component';
import { PrimSecDetailsComponent } from './pdg-template/prim-sec-details/prim-sec-details.component';
import { PdgRefAttachmentsComponent } from './pdg-template/pdg-ref-attachments/pdg-ref-attachments.component';
import { PdgUtil } from './pdg-template/pdg-util';
import { PdgAdditionalInfoComponent } from './pdg-template/pdg-additional-info/pdg-additional-info.component';
import { PdgPreviewInfoComponent } from './pdg-template/pdg-preview-info/pdg-preview-info.component';
import { PdgPreviewFileComponent } from './pdg-template/pdg-preview-info/pdg-preview-file/pdg-preview-file.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    ProvisionalRuleComponent,
    ProvisionalRuleCodesComponent,
    NotesCommentsComponent,
    RationaleComponent,
    ClaimsComponent,
    ImpactsComponent,
    ProvisionalReferencesComponent,
    ProvisionalRuleProvidersComponent,
    RuleDetailsComponent,
    DifMarkupsEditorComponent,
    RuleHistoryComponent,
    RuleApplicationComponent,
    IcmsTemplateComponent,
    OpportunityValueComponent,
    IcmsTemplateChangeComponent,
    AuditLogComponent,
    ProcedureCodeBoxComponent,
    CurrencyBoxComponent,
    ProvisionalRuleHcpcsCptCodesComponent,
    ProvisionalRuleIndividualCodesComponent,
    ErrorCodesComponent,
    NewlyAddedCodesTableComponent,
    ProvisionalRuleCopyPasteComponent,
    ProccodesUploadComponent,
    IcdComponent,
    IndividuallyCodesComponent,
    IcdCopyPasteComponent,
    PdgTemplateComponent,
    ReferenceComponent,
    PdgFileAttachmentsComponent,
    TemplateNroHPPComponent,
    PrimSecDetailsComponent,
    PdgRefAttachmentsComponent,
    PdgAdditionalInfoComponent,
    PdgPreviewInfoComponent,
    PdgPreviewFileComponent
  ],
  exports: [
    ProvisionalRuleComponent,
    ProvisionalRuleCodesComponent,
    RationaleComponent,
    ClaimsComponent,
    ImpactsComponent,
    ProvisionalReferencesComponent,
    ProvisionalRuleProvidersComponent,
    RuleDetailsComponent,
    DifMarkupsEditorComponent,
    RuleHistoryComponent,
    RuleApplicationComponent,
    OpportunityValueComponent,
    ProcedureCodeBoxComponent,
    CurrencyBoxComponent,
    NotesCommentsComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    MultiSelectModule,
    TooltipModule,
    DialogModule,
    ListboxModule,
    CalendarModule,
    MarkerFavoritesModule,
    CheckboxModule,
    DynamicDialogModule,
    FileUploadModule,
    RadioButtonModule,
    ScrollPanelModule,
    DataViewModule,
    ToastModule,
    ReactiveFormsModule,
    MessageModule,
    SharedModule,
    ProgressSpinnerModule,
    BlockUIModule,
    GoodIdeasModule,
    EclTableModule,
    ConfirmDialogModule,
    MessagesModule,
    PanelModule,
    NgxMaskModule.forRoot(options),
    AccordionModule,
    EditorModule
  ],
  providers: [
    UtilsService,
    ProvisionalRuleService,
    sqlDateConversion,
    KeyLimitService,
    claimService,
    ConfirmationService,
    MessageService,
    ProcedureCodesService,
    RuleNotesService,
    CurrencyPipe,
    DatePipe,
    DateUtils,
    PdgTemplateService,
    PdgUtil
  ],
  entryComponents: [IcmsTemplateComponent, IcmsTemplateChangeComponent]
})

export class ProvisionalRuleModule {

}
