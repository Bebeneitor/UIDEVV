import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/internal/operators/map";
import { StorageService } from "src/app/services/storage.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { Constants } from "src/app/shared/models/constants";
import { FileManagerService } from "src/app/shared/services/file-manager.service";
import { environment } from "src/environments/environment";
import { RuleManagerService } from "../../../industry-update/rule-process/services/rule-manager.service";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import {
  storageCompareCodes,
  storageDrug,
} from "../../models/constants/storage.constants";
import {
  DrugVersionsResponse,
  DrugVersionsUI,
} from "../../models/interfaces/drugversion";
import { apiMap, apiPath } from "../../models/path/api-path.constant";
import { DnbService } from "../../services/dnb.service";

const DRUG_BASE_URL = environment.restServiceDnBUrl;
@Component({
  selector: "app-drug-versions-list",
  templateUrl: "./drug-versions-list.component.html",
  styleUrls: ["./drug-versions-list.component.css"],
})
export class DrugVersionsListComponent implements OnInit {
  @ViewChild("versionTable") versionTable: EclTableComponent;
  tableConfig: EclTableModel;
  drugListUrl: string = `${DRUG_BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugVersionList}`;

  drugName: string;
  versions: DrugVersionsUI[];
  shouldOpenDownload: boolean = false;
  versionId: string = "";
  shouldEnableCompare: boolean = false;
  versionOne: DrugVersionsUI = null;
  versionTwo: DrugVersionsUI = null;
  shouldEnabledCreate: boolean = false;
  setUpDialog = {
    header: "Select Type",
    container: [
      {
        value: "docx",
        label: "Word",
      },
      { value: "pdf", label: "PDF" },
    ],
    buttonCancel: false,
    valueDefault: "docx",
  };
  constructor(
    private router: Router,
    private dnbService: DnbService,
    private storageService: StorageService,
    private ruleManagerService: RuleManagerService,
    private fileManagerService: FileManagerService
  ) {}

  ngOnInit() {
    this.drugName = this.storageService.get(storageDrug.drugName, false);
    this.setUpTable();
    this.loadData(
      this.drugListUrl + this.storageService.get(storageDrug.drugCode, false)
    );
  }

  getAllVersionDrug() {
    this.shouldEnabledCreate = this.versions.every(
      (version) =>
        version.versionStatus.code === drugVersionStatus.Approved.code
    );
  }

  serviceCall(event) {
    if (event.action !== Constants.ECL_TABLE_END_SERVICE_CALL) {
      return;
    }

    this.versions = this.versionTable.value;
    this.getAllVersionDrug();
    this.setApprovedVersion();
  }

  selectDrug(event: any): void {
    const version = event.row;
    if (version.versionStatus.code === drugVersionStatus.Approved.code) {
      this.setApprovedVersion(version);
      this.router.navigate(["/dnb/approved-version"]);
      return;
    }
    const versionId = version.drugVersionCode;
    const versionStatus = version.versionStatus.code;
    const versionStatusDescription = version.versionStatus.description;

    this.storageService.set(
      storageDrug.drugVersion,
      { versionId, versionStatus, versionStatusDescription },
      true
    );

    this.setApprovedVersion();
    this.router.navigate(["/dnb/new-version"]);
  }

  loadData(url: string) {
    return new Promise((resolve, reject) => {
      this.tableConfig.criteriaFilters = null;
      this.tableConfig.url = url;
      resolve();
    });
  }

  setUpTable() {
    const manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();

    manager.addDnbVersionLinkColumn(
      "majorVersion",
      "Drug Version",
      "10%",
      true,
      EclColumn.TEXT,
      true
    );

    manager.addTextColumn(
      "versionStatus.description",
      "Status",
      "10%",
      true,
      EclColumn.TEXT,
      true
    );

    manager.addMultiLineTextColumn(
      "midRules?midRule",
      "Mid Rules",
      "15%",
      true,
      EclColumn.TEXT,
      true
    );

    manager.addMultiLineTextColumn(
      "midRules?ruleCode",
      "Mid Rule Version",
      "15%",
      false,
      EclColumn.TEXT,
      false
    );
    manager.addMultiLineLinkColumn(
      "midRules?ruleId",
      "ECL Rule I.d",
      "15%",
      false,
      EclColumn.TEXT,
      false
    );

    manager.addTextColumn(
      "reviewDt",
      "Date",
      "15%",
      true,
      EclColumn.TEXT,
      true
    );

    manager.addIconColumn("", "Download", "10%", "fa fa-download");

    manager.addCheckColumn(
      "",
      "Compare",
      "10%",
      true,
      EclColumn.CHECK,
      false,
      2,
      true
    );

    this.tableConfig.columns = manager.getColumns();

    this.tableConfig.export = false;
    this.tableConfig.lazy = false;
    this.tableConfig.isFullURL = true;
    this.tableConfig.sortBy = "majorVersion";
    this.tableConfig.sortOrder = -1;
  }

  openDetails(ruleId: any) {
    this.ruleManagerService.showRuleIdDetailsScreen(ruleId, true);
  }

  openSelectType(event: any): void {
    this.versionId = event.row.drugVersionCode;
    this.shouldOpenDownload = true;
  }

  downloadSelected(selectedType: string): void {
    this.shouldOpenDownload = false;
    this.dnbService
      .downloadVersion(this.versionId, selectedType)
      .pipe(
        map((response) => {
          this.fileManagerService.createDownloadFileElement(
            response,
            `${this.drugName}.${selectedType}`
          );
        })
      )
      .subscribe();
  }

  createNewVersion(): void {
    this.storageService.set(
      storageDrug.drugVersion,
      {
        versionId: "empty",
        versionStatus: drugVersionStatus.Draft.code,
        versionStatusDescription: drugVersionStatus.Draft.description,
      },
      true
    );
    this.setApprovedVersion();
    this.router.navigate(["/dnb/new-version"]);
  }

  toggledVersion(event: any): void {
    let state: boolean = event.event;
    let version: DrugVersionsUI = event.row;
    if (state) {
      if (!this.versionOne) {
        this.versionOne = version;
      } else if (!this.versionTwo) {
        this.versionTwo = version;
      } else {
        this.versionTwo.checked = false;
        this.versionTwo = this.versionOne;
        this.versionOne = version;
      }
    }

    if (!state) {
      if (this.versionOne && !this.versionOne.checked) {
        this.versionOne = null;
      }
      if (this.versionTwo && !this.versionTwo.checked) {
        this.versionTwo = null;
      }
    }

    this.shouldEnableCompare =
      this.versionOne !== null &&
      this.versionOne.checked &&
      this.versionTwo !== null &&
      this.versionTwo.checked;
  }

  compare(): void {
    this.sortVersions();
    this.storageService.set(
      storageCompareCodes.drugVersionCompareIdOne,
      this.versionOne.drugVersionCode,
      false
    );
    this.storageService.set(
      storageCompareCodes.drugVersionCompareNameOne,
      this.versionOne.majorVersion,
      false
    );
    this.storageService.set(
      storageCompareCodes.drugVersionCompareIdTwo,
      this.versionTwo.drugVersionCode,
      false
    );
    this.storageService.set(
      storageCompareCodes.drugVersionCompareNameTwo,
      this.versionTwo.majorVersion,
      false
    );
    this.storageService.set(
      storageCompareCodes.drugVersionCompareStatusTwo,
      this.versionTwo.versionStatus,
      true
    );
    this.router.navigate(["/dnb/compare-versions"]);
  }

  setApprovedVersion(version: DrugVersionsResponse = null) {
    let approvedVersion = null;
    if (version) {
      approvedVersion = version;
    } else {
      const approvedVersions = this.versions
        .filter(
          (version) =>
            version.versionStatus.code == drugVersionStatus.Approved.code
        )
        .sort((versionA, versionB) => {
          return versionA.majorVersion > versionB.majorVersion ? -1 : 1;
        });
      approvedVersion = approvedVersions[0];
    }
    const approvedVersionId = approvedVersion.drugVersionCode;
    const approvedVersionStatus = approvedVersion.versionStatus.code;
    const approvedVersionMajorVersion = approvedVersion.majorVersion;
    this.storageService.set(
      storageDrug.approvedDrugVersion,
      {
        versionId: approvedVersionId,
        versionStatus: approvedVersionStatus,
      },
      true
    );

    this.storageService.set(
      storageDrug.majorVersion,
      approvedVersionMajorVersion,
      false
    );
  }

  sortVersions(): void {
    const majorOne = this.versionOne.majorVersion;
    const majorTwo = this.versionTwo.majorVersion;
    let switchVersions = majorOne > majorTwo;
    if (
      majorOne === majorTwo &&
      (this.versionOne.revVersion || 0) > (this.versionTwo.revVersion || 0)
    ) {
      switchVersions = true;
    }
    if (switchVersions) {
      const save = this.versionTwo;
      this.versionTwo = this.versionOne;
      this.versionOne = save;
    }
  }
}
