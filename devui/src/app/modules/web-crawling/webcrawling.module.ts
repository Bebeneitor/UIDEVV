import { NgModule } from "@angular/core";

import { WebCrawlRoutingModule } from "./webcrawl-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";

import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { InputSwitchModule } from "primeng/inputswitch";

import { CalendarModule } from "primeng/calendar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { sqlDateConversion } from "src/app/shared/services/utils";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HomepageComponent } from "./pages/drug-search/drug-search.component";
import { DruglistComponent } from "./pages/drug-list/drug-list.component";
import { AddDrugComponent } from "./pages/add-drug/add-drug.component";
import { AuditComponent } from "./pages/audit-log/audit.component";
import { DnBSharedModule } from "../dnb/shared/shared.module";

@NgModule({
  declarations: [
    HomepageComponent,
    DruglistComponent,
    AddDrugComponent,
    AuditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    WebCrawlRoutingModule,
    InputSwitchModule,
    AutoCompleteModule,
    TableModule,
    ScrollingModule,
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule,
    DropdownModule,
    ToastModule,
    TooltipModule,
    ConfirmDialogModule,
    CalendarModule,
    DnBSharedModule,
  ],
  providers: [MessageService, sqlDateConversion],
})
export class WebCrawlingModule {}
