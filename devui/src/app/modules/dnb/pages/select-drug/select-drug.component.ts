import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/internal/operators/map";
import { StorageService } from "src/app/services/storage.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { FileManagerService } from "src/app/shared/services/file-manager.service";
import { environment } from "src/environments/environment";
import { dnbCodes } from "../../models/constants/actionCodes.constants";
import { DnBRoutes } from "../../models/constants/dnb-routes.constants";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import { storageDrug } from "../../models/constants/storage.constants";
import { ListDrug } from "../../models/interfaces/drugversion";
import { apiMap, apiPath } from "../../models/path/api-path.constant";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbService } from "../../services/dnb.service";

const BASE_URL = environment.restServiceDnBUrl;
@Component({
  selector: "app-select-drug",
  templateUrl: "./select-drug.component.html",
  styleUrls: ["./select-drug.component.css"],
})
export class SelectDrugComponent implements OnInit {
  @ViewChild("rulesTable",{static: true}) rulesTable: EclTableComponent;
  tableConfig: EclTableModel;
  drugListUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugListByPage}`;
  drugLastApprovedId: string = "";
  selectedDrug: string = "";
  editingMode: any = { editingMode: true, showButtons: true };
  openEllMapping: boolean = false;
  ellTopic: string = "";
  constructor(
    private router: Router,
    private storageService: StorageService,
    private dnbService: DnbService,
    private fileManagerService: FileManagerService,
    private roleAuthService: DnbRoleAuthService
  ) {}

  ngOnInit() {
    this.setUpTable();
    this.loadData(this.drugListUrl);
    let filterABC = this.storageService.get(
      storageDrug.filterSelectDrugABC,
      false
    );
    if (filterABC) this.filter(filterABC);
  }

  selectDrug(event: any): void {
    const row = event.row;
    const name = row.name;
    const code = row.drugCode;
    const latestVersion = row.version;
    this.storageService.set(storageDrug.drugName, name, false);
    this.storageService.set(storageDrug.drugCode, code, false);
    this.storageService.set(
      storageDrug.drugLatestVersion,
      latestVersion,
      false
    );

    if (!this.roleAuthService.isAuthorized(dnbCodes.EDIT_DRDS)) {
      this.editingMode = { editingMode: false, showButtons: false };
    }

    this.storageService.set(
      storageDrug.newVersionEditingMode,
      this.editingMode,
      true
    );
    this.router.navigate([DnBRoutes.drugVersions]);
  }

  loadData(url: string) {
    return new Promise((resolve, reject) => {
      this.tableConfig.criteriaFilters = null;
      this.tableConfig.url = url;
      this.tableConfig.sortBy = "name";
      resolve();
    });
  }

  filter(filter: string) {
    this.storageService.set(storageDrug.filterSelectDrugABC, filter, false);
    let url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugFilter}`;
    url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugListByPage}`;
    this.updateResults(url, filter);
  }

  updateResults(url: string, filter: string = "") {
    return new Promise((resolve, reject) => {
      this.tableConfig.criteriaFilters = filter;
      this.tableConfig.export = false;
      this.rulesTable.totalRecords = 0;
      this.tableConfig.url = url;
      this.rulesTable.loadData(null);
      resolve();
    });
  }

  setUpTable() {
    const manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();
    const url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugListByPage}`;

    if (
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBA") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBE") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBVIEWER")
    ) {
      manager.addTextColumn(
        "name",
        "Drug Name",
        "30%",
        true,
        EclColumn.TEXT,
        true
      );
    } else {
      manager.addLinkColumn(
        "name",
        "Drug Name",
        "30%",
        true,
        EclColumn.TEXT,
        true
      );
    }
    manager.addTextColumn(
      "versionStatus",
      "Status",
      "30%",
      true,
      EclColumn.TEXT,
      true
    );

    manager.addDateColumn(
      "reviewDt",
      "Date",
      "15%",
      true,
      true,
      null,
      null,
      EclColumn.DATE_TIME_ZONE,
      null,
      new Date()
    );

    if (
      this.roleAuthService.isAuthorizedRole("ROLE_DNBA") ||
      this.roleAuthService.isAuthorizedRole("ROLE_DNBE") ||
      this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN")
    ) {
      let iconVisible = null;
      iconVisible = (row: ListDrug) => {
        return row.wcDrugExists;
      };

      manager.addIconColumn(
        "referencesCompare",
        "References Compare",
        "10%",
        "fa fa-folder",
        [],
        iconVisible
      );
    }

    manager.addTextColumn(
      "ellTopicName",
      "ELL Topic",
      "10%",
      true,
      EclColumn.TEXT,
      true
    );

    if (this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN")) {
      manager.addIconColumn(
        "ellMapping",
        "Edit ELL Mapping",
        "10%",
        "fa fa-link"
      );
    }

    if (
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBA") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBE") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN")
    ){
      let checkVisible = null;
      checkVisible = (row: ListDrug) => {
        return row.versionStatus === drugVersionStatus.Approved.description
      };
    
      manager.addIconColumn(
        "drugVersionCode",
        "Download",
        "10%",
        "fa fa-download",
        [],
        checkVisible
      );
    }else{    
    manager.addIconColumn(
      "drugVersionCode",
      "Download",
      "10%",
      "fa fa-download"
    );
    }

    this.tableConfig.columns = manager.getColumns();
    this.tableConfig.export = false;
    this.tableConfig.lazy = true;
    this.tableConfig.storageFilterKey = storageDrug.filterSelectDrug;
    this.tableConfig.showRecords = true;
    this.tableConfig.paginationSize = 10;
    this.tableConfig.isFullURL = true;
  }

  openSelectType(event: any): void {
    let isAuthorized: boolean = false;
    let drdType: string;

    switch (event.row.versionStatus.code) {
      case drugVersionStatus.InProgress.code: {
        drdType = `an ${drugVersionStatus.InProgress.description} DRD`;
        break;
      }
      case drugVersionStatus.Approved.code: {
        drdType = `an ${drugVersionStatus.Approved.description} DRD`;
        break;
      }
      case drugVersionStatus.PendingApproval.code: {
        drdType = `a ${drugVersionStatus.PendingApproval.description} DRD`;
        break;
      }
      case drugVersionStatus.inReview.code: {
        drdType = `an ${drugVersionStatus.inReview.description} DRD`;
        break;
      }
      case drugVersionStatus.submitedReview.code: {
        drdType = `a ${drugVersionStatus.submitedReview.description} DRD`;
        break;
      }
      default: {
        drdType = "DRDs";
        break;
      }
    }

    isAuthorized = this.roleAuthService.isAuthorized(
      dnbCodes.DOWNLOAD_APPROVED_DRD,
      `You do not have permissions to download ${drdType}.`
    );

    if (isAuthorized) {
      this.drugLastApprovedId = event.row.drugVersionCode;
      this.selectedDrug = event.row.name;
      this.downloadSelected("docx");
    }
  }

  downloadSelected(selectedType: string): void {
    this.dnbService
      .downloadVersion(this.drugLastApprovedId, selectedType)
      .pipe(
        map((response) => {
          this.fileManagerService.createDownloadFileElement(
            response,
            `${this.selectedDrug}.${selectedType}`
          );
        })
      )
      .subscribe();
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.storageService.remove(storageDrug.filterSelectDrug);
    this.storageService.remove(storageDrug.filterSelectDrugABC);
  }

  createNewDrug(): void {
    this.storageService.set(storageDrug.drugVersion, null, true);
    this.storageService.set(storageDrug.drugCode, null, true);

    if (!this.roleAuthService.isAuthorized(dnbCodes.EDIT_DRDS)) {
      this.editingMode = { editingMode: false, showButtons: false };
    }

    this.storageService.set(
      storageDrug.newDrugEditingMode,
      this.editingMode,
      true
    );
    this.router.navigate([DnBRoutes.newDrug]);
  }

  openEllMappingDialog(event: any) {
    const row = event.row;
    const name = row.name;
    const code = row.drugCode;
    const latestVersion = row.version;

    this.storageService.remove(storageDrug.drugCode);
    this.storageService.remove(storageDrug.drugName);
    this.storageService.remove(storageDrug.drugLatestVersion);
    this.storageService.set(storageDrug.drugName, name, false);
    this.storageService.set(storageDrug.drugCode, code, false);
    this.storageService.set(
      storageDrug.drugLatestVersion,
      latestVersion,
      false
    );
    this.ellTopic = row.ellTopicName;
    this.openEllMapping = true;
  }

  actionIcon(event: any) {
    switch (event.field) {
      case "drugVersionCode":
        this.openSelectType(event);
        break;
      case "referencesCompare":
        this.navigateWebCrawling(event);
        break;
      case "ellMapping":
        this.openEllMappingDialog(event);
        break;
      default:
        break;
    }
  }

  navigateWebCrawling(event) {
    let url = `${window.location.origin}/ecl/#${DnBRoutes.webCrawling}${event.row.wcDrugName}`;
    url = url.replace('(','%28')
    url = url.replace(')','%29')    
    window.open(`${url}`, "_blank");
  }
}
