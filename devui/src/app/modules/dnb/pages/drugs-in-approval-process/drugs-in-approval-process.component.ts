import { Component, ViewChild } from "@angular/core";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { InProgressComponent } from "./in-progress/in-progress.component";
import { InReviewComponent } from "./in-review/in-review.component";
import { MyWorkComponent } from "./my-work/my-work.component";
import { SubmittedForReviewComponent } from "./submited-for-review/submitted-for-review.component";

@Component({
  selector: "app-drugs-in-approval-process",
  templateUrl: "./drugs-in-approval-process.component.html",
  styleUrls: ["./drugs-in-approval-process.component.css"],
})
export class DrugsInApprovalProcessComponent {
  isEditor: boolean = true;
  isApprover: boolean = true;
  isDNBAdmin: boolean = true;
  @ViewChild("myWork",{static: false}) myWork: MyWorkComponent;
  @ViewChild("inProgress",{static: false}) inProgress: InProgressComponent;
  @ViewChild("submittedForReview",{static: false})
  submittedForReview: SubmittedForReviewComponent;
  @ViewChild("inReview",{static: false}) inReview: InReviewComponent;
  constructor(private roleAuthService: DnbRoleAuthService) {
    this.isEditor = this.roleAuthService.isAuthorizedRole("ROLE_DNBE");
    this.isApprover = this.roleAuthService.isAuthorizedRole("ROLE_DNBA");
    this.isDNBAdmin = this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN");
  }

  reloadData(event) {
    let index: number = event.index;
    if (
      !this.isEditor &&
      !this.isDNBAdmin &&
      (event.index === 1 || event.index === 2)
    ) {
      index = event.index + 1;
    }
    switch (index) {
      case 0:
        if (this.isEditor || this.isDNBAdmin) {
          
          if(this.myWork.editorTable.getColumnFilters().length===0){
            this.myWork.editorTable.loadData(null);
          }
        }
        if (this.isApprover || this.isDNBAdmin) {
          
          if(this.myWork.approverTable.getColumnFilters().length===0){
            this.myWork.approverTable.loadData(null);
          }
        }
        break;
      case 1:
        if (this.isEditor || this.isDNBAdmin) {
          
          if(this.inProgress.editorTable.getColumnFilters().length ===0){
            this.inProgress.editorTable.loadData(null);
          }
        }
        break;
      case 2:
       
      if(this.submittedForReview.submittedTable.getColumnFilters().length===0){
        this.submittedForReview.submittedTable.loadData(null);
      }                        
        break;
      case 3:
        
        if(this.inReview.versionTable.getColumnFilters().length===0){
          this.inReview.versionTable.loadData(null);
        }
        break;
    }
  }
}
