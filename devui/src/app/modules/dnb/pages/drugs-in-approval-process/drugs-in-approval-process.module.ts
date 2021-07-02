import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPermissionsModule } from "ngx-permissions";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/primeng";
import { TabViewModule } from "primeng/tabview";
import { EclTableModule } from "src/app/shared/components/ecl-table/ecl-table.module";
import { DnbInterceptorSevice } from "../../interceptors/dnb-interceptor.service";
import { DrugsInApprovalProcessComponent } from "./drugs-in-approval-process.component";
import { MyWorkComponent } from "./my-work/my-work.component";
import { InProgressComponent } from "./in-progress/in-progress.component";
import { SubmittedForReviewComponent } from "./submited-for-review/submitted-for-review.component";
import { InReviewComponent } from "./in-review/in-review.component";
import { DnBSharedModule } from "../../shared/shared.module";
@NgModule({
  declarations: [
    DrugsInApprovalProcessComponent,
    MyWorkComponent,
    InProgressComponent,
    SubmittedForReviewComponent,
    InReviewComponent,
  ],
  imports: [
    CommonModule,
    EclTableModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule,
    ConfirmDialogModule,
    DnBSharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DnbInterceptorSevice,
      multi: true,
    },
  ],
})
export class DrugsInApprovalProcessModule {}
