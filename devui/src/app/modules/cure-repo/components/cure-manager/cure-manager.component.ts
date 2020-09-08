import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CureModuleAdminService } from "./cure-module-admin/cure-module-admin.service";

@Component({
  selector: "app-cure-manager",
  templateUrl: "./cure-manager.component.html",
  styleUrls: ["./cure-manager.component.css"],
})
export class CureManagerComponent implements OnInit, OnDestroy {
  title: string = "";
  titleSubs: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cureModuleAdminService: CureModuleAdminService
  ) {}

  ngOnInit() {
    this.activatedRoute.url.subscribe((url) => {
      if (this.activatedRoute.children.length === 0) {
        this.router.navigate(['/cure-and-repo/cure/module-consulting']);
      }
      this.title = this.activatedRoute.snapshot.children[0].data.pageTitle;
    });
    this.titleSubs = this.cureModuleAdminService
      .setPageTitleObs()
      .subscribe((title) => {
        this.title = title;
      });
  }

  ngOnDestroy(): void {
    this.titleSubs.unsubscribe();
  }
}
