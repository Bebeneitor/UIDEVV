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
import { CalendarModule, CheckboxModule, MessageModule, BlockUIModule, MessageService, PanelModule } from 'primeng/primeng';
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
import { KeyLimitService, sqlDateConversion } from 'src/app/shared/services/utils';
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

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
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
    IcmsTemplateComponent,
    OpportunityValueComponent,
    IcmsTemplateChangeComponent,
    AuditLogComponent,
    ProcedureCodeBoxComponent,
    CurrencyBoxComponent
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
    CurrencyBoxComponent
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
    NgxMaskModule.forRoot(options)
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
    CurrencyPipe,
    DatePipe
  ],
  entryComponents: [IcmsTemplateComponent, IcmsTemplateChangeComponent]
})

export class ProvisionalRuleModule {

}
