import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { InputSwitchModule, RadioButtonModule } from "primeng/primeng";
import { CellEditorComponent } from "./cell-editor/cell-editor.component";
import { FilterListComponent } from "./filter-list/filter-list.component";
import { FindReplaceComponent } from "./find-replace/find-replace.component";
import { GroupedSectionComponent } from "./grouped-section/grouped-section.component";
import { GroupedSectionsContainerComponent } from "./grouped-sections-container/grouped-sections-container.component";
import { RowMenuComponent } from "./menu-section/row-menu/row-menu.component";
import { SectionNavigationComponent } from "./section-navigation/section-navigation.component";
import { SectionComponent } from "./section/section.component";
import { SectionsContainerComponent } from "./sections-container/sections-container.component";
import { SectionsStickyComponent } from "./sections-sticky/sections-sticky.component";
import { DialogComponent } from "./dialog/dialog.component";

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
  DialogComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    QuillModule.forRoot({
      modules: { toolbar: false },
      placeholder: "",
      formats: ["background-color", "color", "strike", "underline"],
    }),
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DialogModule,
    RadioButtonModule,
    InputSwitchModule,
  ],
  exports: [COMPONENTS],
})
export class DnBSharedModule {}
