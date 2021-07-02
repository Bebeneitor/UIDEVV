import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPermissionsModule } from "ngx-permissions";
import { QuillModule } from "ngx-quill";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import {
  BreadcrumbModule,
  CheckboxModule,
  DropdownModule,
  FileUploadModule,
  InputSwitchModule,
  OverlayPanelModule,
  RadioButtonModule,
  SpinnerModule,
} from "primeng/primeng";
import { EclTableModule } from "src/app/shared/components/ecl-table/ecl-table.module";
import { DnBDirectivesModule } from "../utils/directives/dnb-directives.module";
import { AutopopulateIndicationsComponent } from "./autopopulate/autopopulate-indications/autopopulate-indications.component";
import { CellEditorComponent } from "./cell-editor/cell-editor.component";
import { CommentComponent } from "./feedback/comment/comment.component";
import { FeedbackComponent } from "./feedback/feedback/feedback.component";
import { ViewFeedbackComponent } from "./feedback/view-feedback/view-feedback.component";
import { FilterListComponent } from "./filter-list/filter-list.component";
import { FindReplaceComponent } from "./find-replace/find-replace.component";
import { GroupedSectionComponent } from "./grouped-section/grouped-section.component";
import { GroupedSectionsContainerComponent } from "./grouped-sections-container/grouped-sections-container.component";
import { FeedbackMenuComponent } from "./menu-section/feedback-menu/feedback-menu.component";
import { RowMenuComponent } from "./menu-section/row-menu/row-menu.component";
import { MidRuleHistoryComponent } from "./mid-rules/mid-rule-history/mid-rule-history.component";
import { MidRulesEllSummaryComponent } from "./mid-rules/mid-rules-ell-summary/mid-rules-ell-summary.component";
import { MidRulesEllComponent } from "./mid-rules/mid-rules-ell/mid-rules-ell.component";
import { MidRulesExistComponent } from "./mid-rules/mid-rules-exist/mid-rules-exist.component";
import { MidRulesListComponent } from "./mid-rules/mid-rules-list/mid-rules-list.component";
import { MidRulesComponent } from "./mid-rules/mid-rules/mid-rules.component";
import { ResizableColComponent } from "./resizable-col/resizable-col.component";
import { SectionNavigationComponent } from "./section-navigation/section-navigation.component";
import { SectionComponent } from "./section/section.component";
import { SectionsContainerComponent } from "./sections-container/sections-container.component";
import { SectionsStickyComponent } from "./sections-sticky/sections-sticky.component";
import { SimpleCellComponent } from "./simple-cell/simple-cell.component";
import { TopicMappingComponent } from "./topic-mapping/topic-mapping.component";
import { UploadIngestionComponent } from "./upload-ingestion/upload-ingestion.component";
import { AutopopulateDiagnosisCodeSummaryComponent } from "./autopopulate/autopopulate-diagnosis-code-summary/autopopulate-diagnosis-code-summary.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
const COMPONENTS = [
  SectionComponent,
  SectionNavigationComponent,
  SectionsContainerComponent,
  SectionsStickyComponent,
  CellEditorComponent,
  RowMenuComponent,
  GroupedSectionComponent,
  GroupedSectionsContainerComponent,
  FilterListComponent,
  FindReplaceComponent,
  MidRulesComponent,
  MidRulesListComponent,
  MidRuleHistoryComponent,
  MidRulesExistComponent,
  FeedbackMenuComponent,
  SimpleCellComponent,
  FeedbackComponent,
  ViewFeedbackComponent,
  UploadIngestionComponent,
  MidRulesEllComponent,
  CommentComponent,
  MidRulesEllSummaryComponent,
  TopicMappingComponent,
  AutopopulateIndicationsComponent,
  ResizableColComponent,
  AutopopulateDiagnosisCodeSummaryComponent,
  BreadcrumbComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    QuillModule.forRoot({}),
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DialogModule,
    RadioButtonModule,
    InputSwitchModule,
    CheckboxModule,
    DnBDirectivesModule,
    EclTableModule,
    NgxPermissionsModule,
    FileUploadModule,
    OverlayPanelModule,
    SpinnerModule,
    DropdownModule,
    BreadcrumbModule,
  ],
  exports: [COMPONENTS],
  providers: [DnBDirectivesModule, DatePipe],
})
export class DnBSharedModule {}
