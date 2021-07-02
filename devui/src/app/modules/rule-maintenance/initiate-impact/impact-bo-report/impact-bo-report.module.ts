import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EclTableModule } from "src/app/shared/components/ecl-table/ecl-table.module";
import { ImpactBoReportComponent } from "./impact-bo-report.component";

@NgModule({
    declarations: [ImpactBoReportComponent],
    imports: [
        CommonModule,
        FormsModule,
        EclTableModule
        ],
    exports: [ImpactBoReportComponent]
})
export class ImpactBoReportModule { }