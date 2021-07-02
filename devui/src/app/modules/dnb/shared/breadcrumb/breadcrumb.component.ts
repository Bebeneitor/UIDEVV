import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from "src/app/services/storage.service";
import { storageGeneral } from "../../models/constants/storage.constants";

@Component({
  selector: "app-dnb-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.css"],
})
export class BreadcrumbComponent implements OnInit {
  @Input() canNavigate: boolean = true;
  ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
  MAIN_PAGE: string = "mainPage";
  items: any[] = [];
  newItem: [] = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.resetBreadcrumb();
    this.loadData();
  }

  loadData() {
    this.items = this.storageService.get(
      storageGeneral.breadcrumsStorage,
      true
    );
    this.newItem = this.createBreadcrumbs(this.activatedRoute.root);

    this.newItem.map((item: any) => {
      if (!this.validateExist(item.label)) {
        this.items.splice(item.index, 0, item);
      }
    });

    this.storageService.set(storageGeneral.breadcrumsStorage, this.items, true);

    this.items = this.items.map((item) => {
      return item;
    });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: any = []
  ): [] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      let routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join("/");
      if (routeURL !== "") {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data[this.ROUTE_DATA_BREADCRUMB];
      this.resetBreadcrumb(child.snapshot.data[this.MAIN_PAGE]);

      if (label && !this.validateExist(label)) {
        let index: number = 0;

        index = this.items.length;
        breadcrumbs.push({ label, urlNavigation: url, index });
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

  resetBreadcrumb(isMainPage = false) {
    if (
      !this.storageService.get(storageGeneral.breadcrumsStorage, true) ||
      this.storageService.get(storageGeneral.breadcrumsStorage, true).length ===
        0 ||
      isMainPage
    ) {
      this.storageService.set(
        storageGeneral.breadcrumsStorage,
        [{ label: "Home", urlNavigation: "#/home", index: 0 }],
        true
      );
      this.items = this.storageService.get(
        storageGeneral.breadcrumsStorage,
        true
      );
    }
  }

  validateExist(item) {
    if (this.items) {
      this.items.map((itemPreview, index) => {
        if (itemPreview.label === item) {
          this.items.splice(index, this.items.length + 1);
          return true;
        }
      });
    }
    return false;
  }

  itemClicked(itemSelected) {
    this.items.map((item) => {
      if (item.label === itemSelected.toElement.innerText) {
        this.router.navigate([item.urlNavigation]);
      }
    });
  }
}
