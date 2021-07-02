import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { DnBRoutingModule } from "./dnb-routing.module";
import { DnbInterceptorSevice } from "./interceptors/dnb-interceptor.service";
import { Messages } from "./models/constants/messages.constants";
import { ApprovedVersionModule } from "./pages/approved-version/approved-version.module";
import { CompareVersionsModule } from "./pages/compare-versions/compare-versions.module";
import { DrugVersionsListModule } from "./pages/drug-versions-list/drug-versions-list.module";
import { DrugsInApprovalProcessModule } from "./pages/drugs-in-approval-process/drugs-in-approval-process.module";
import { MidRuleAdminModule } from "./pages/mid-rule-admin/mid-rule-admin.module";
import { NewDrugModule } from "./pages/new-drug/new-drug.module";
import { NewVersionModule } from "./pages/new-version/new-version.module";
import { SelectDrugModule } from "./pages/select-drug/select-drug.module";
import { DnbStoreService } from "./services/dnb-store.service";
import { DnBSharedModule } from "./shared/shared.module";
import { CopyToNew } from "./utils/utils.index";
import { TemplateFlagsModule } from "./pages/template-flags/template-flags.module";
import { PinnedSectionsComponent } from "./pages/pinned-sections/pinned-sections.component";

@NgModule({
  imports: [
    CommonModule,
    DnBRoutingModule,
    DnBSharedModule,
    NewVersionModule,
    SelectDrugModule,
    DrugVersionsListModule,
    CompareVersionsModule,
    DrugsInApprovalProcessModule,
    ApprovedVersionModule,
    NewDrugModule,
    MidRuleAdminModule,
    TemplateFlagsModule,
  ],
  providers: [
    CopyToNew,
    DnbStoreService,
    Messages,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DnbInterceptorSevice,
      multi: true,
    },
  ],
  declarations: [PinnedSectionsComponent],
})
export class DnBModule {}
