import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/internal/operators/map";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { Constants } from "src/app/shared/models/constants";
import { FileManagerService } from "src/app/shared/services/file-manager.service";
import { environment } from "src/environments/environment";
import { RuleManagerService } from "../../../industry-update/rule-process/services/rule-manager.service";
import { dnbCodes } from "../../models/constants/actionCodes.constants";
import { DnBRoutes } from "../../models/constants/dnb-routes.constants";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import {
  storageCompareCodes,
  storageDrug,
} from "../../models/constants/storage.constants";
import {
  DrugVersionsInProcessResponse,
  DrugVersionsResponse,
  DrugVersionsUI,
  ListDrugVersion,
} from "../../models/interfaces/drugversion";
import { apiMap, apiPath } from "../../models/path/api-path.constant";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbService } from "../../services/dnb.service";

const DRUG_BASE_URL = environment.restServiceDnBUrl;
@Component({
  selector: "app-drug-versions-list",
  templateUrl: "./drug-versions-list.component.html",
  styleUrls: ["./drug-versions-list.component.css"],
})
export class DrugVersionsListComponent implements OnInit {
  @ViewChild("versionTable", { static: true }) versionTable: EclTableComponent;
  tableConfig: EclTableModel;
  drugListUrl: string = `${DRUG_BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugVersionList}`;
  drugName: string;
  versions: DrugVersionsUI[];

  versionId: string = "";
  shouldEnableCompare: boolean = false;
  versionOne: DrugVersionsUI = null;
  versionTwo: DrugVersionsUI = null;
  shouldEnabledCreate: boolean = false;
  isNewDrug: boolean = false;
  editingMode: any = { editingMode: true, showButtons: true };
  isEditor: boolean = true;
  isApprover: boolean = true;
  isAdmin: boolean = true;
  currentUser = null;
  constructor(
    private router: Router,
    private dnbService: DnbService,
    private storageService: StorageService,
    private ruleManagerService: RuleManagerService,
    private fileManagerService: FileManagerService,
    private roleAuthService: DnbRoleAuthService,
    private toastService: ToastMessageService
  ) {
    this.isEditor = this.roleAuthService.isAuthorizedRole("ROLE_DNBE");
    this.isApprover = this.roleAuthService.isAuthorizedRole("ROLE_DNBA");
    this.isAdmin = this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN");
    this.currentUser = this.storageService.get("userSession", true);
  }

  ngOnInit() {
    this.drugName = this.storageService.get(storageDrug.drugName, false);
    const drugVersion = this.storageService.get(
      storageDrug.drugLatestVersion,
      false
    );
    this.isNewDrug = drugVersion === "0.0";
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
    const approver = version.approverUser;
    const editor = version.editorUser;
    this.storageService.set(storageDrug.drugDate, version.reviewDt, false);
    if (version.versionStatus.code === drugVersionStatus.Approved.code) {
      this.setApprovedVersion(version);
      this.router.navigate([DnBRoutes.approvedVersion]);
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

    if (!this.roleAuthService.isAuthorized(dnbCodes.EDIT_DRDS)) {
      this.editingMode = { editingMode: false, showButtons: false };
    }

    const isInReview =
      version.versionStatus.code === drugVersionStatus.inReview.code;
    const isSubmittedForReview =
      version.versionStatus.code === drugVersionStatus.submitedReview.code;
    const isInProgress =
      version.versionStatus.code === drugVersionStatus.InProgress.code;

    if (isInProgress) {
      if (this.isEditor) {
        this.editingMode = {
          editingMode: editor.userId === this.currentUser.userId,
          showButtons: editor.userId === this.currentUser.userId,
          approvalMode: false,
        };
      } else if (this.isAdmin) {
        this.editingMode = { editingMode: false, showButtons: false };
      } else if (this.isApprover) {
        this.toastService.messageWarning(
          "Warning!",
          "Sorry, no action allowed, the Editor is working with the Draft.",
          6000,
          true
        );
        return;
      }
    } else if (isSubmittedForReview) {
      this.editingMode = { editingMode: false, showButtons: false };
    } else if (isInReview) {
      if (this.isApprover) {
        this.editingMode = {
          editingMode: false,
          showButtons: approver.userId === this.currentUser.userId,
          approvalMode: approver.userId === this.currentUser.userId,
        };
      } else if (this.isAdmin) {
        this.editingMode = { editingMode: false, showButtons: false };
      } else if (this.isEditor) {
        this.toastService.messageWarning(
          "Warning!",
          "Sorry, no action allowed, the Approver is working with the Draft.",
          6000,
          true
        );
        return;
      }
    }

    if (this.isNewDrug) {
      this.storageService.set(
        storageDrug.newDrugEditingMode,
        this.editingMode,
        true
      );

      this.router.navigate([DnBRoutes.newDrug]);
    } else {
      this.setApprovedVersion();
      this.storageService.set(
        storageDrug.newVersionEditingMode,
        this.editingMode,
        true
      );

      this.router.navigate([DnBRoutes.newVersion]);
    }
  }

  loadData(url: string) {
    return new Promise((resolve, reject) => {
      this.tableConfig.criteriaFilters = null;
      this.tableConfig.url = url;
      this.tableConfig.sortBy = "majorVersion";
      resolve();
    });
  }

  setUpTable() {
    const manager = new EclTableColumnManager();
    this.tableConfig = new EclTableModel();

    if (
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBA") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBE") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN")
    ) {
      manager.addDnbVersionColumn(
        "majorVersion",
        "Drug Version",
        "10%",
        !this.isNewDrug,
        EclColumn.TEXT,
        !this.isNewDrug,
        null,
        "center"
      );
    } else {
      manager.addDnbVersionLinkColumn(
        "majorVersion",
        "Drug Version",
        "10%",
        !this.isNewDrug,
        EclColumn.TEXT,
        !this.isNewDrug
      );
    }

    manager.addTextColumn(
      "versionStatus.description",
      "Status",
      "10%",
      !this.isNewDrug,
      EclColumn.TEXT,
      !this.isNewDrug
    );

    manager.addMultiLineTextColumn(
      "midRules?midRule",
      "Mid Rules",
      "15%",
      !this.isNewDrug,
      EclColumn.TEXT,
      !this.isNewDrug,
      0,
      "left",
      "integer"
    );

    manager.addMultiLineTextColumn(
      "midRules?midRule",
      "Mid Rule Version",
      "15%",
      false,
      EclColumn.TEXT,
      false,
      0,
      "left",
      "decimal"
    );
    manager.addMultiLineLinkColumn(
      "midRules?ruleCode",
      "ECL Rule I.d",
      "15%",
      false,
      EclColumn.TEXT,
      false
    );

    manager.addDateColumn(
      "reviewDt",
      "Date",
      "13%",
      !this.isNewDrug,
      !this.isNewDrug,
      null,
      null,
      EclColumn.DATE_TIME_ZONE,
      null,
      new Date()
    );

    manager.addTextColumn(
      "drugEditType",
      "Edit Type",
      "10%",
      !this.isNewDrug,
      EclColumn.TEXT,
      !this.isNewDrug
    );

    let  checkVisible = (row: ListDrugVersion) => {
      return true;
    };
    if (
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBA") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBE") &&
      !this.roleAuthService.isAuthorizedRole("ROLE_DNBADMIN")
    ) {
      checkVisible = (row: ListDrugVersion) => {
        return (
          row.versionStatus.description ===
          drugVersionStatus.Approved.description
        );
      };
    } 

    manager.addIconColumn(
      "drugVersionCode",
      "Download",
      "10%",
      "fa fa-download",
      [],
      checkVisible
    );

    if (!this.isNewDrug) {
      manager.addCheckColumn(
        "",
        "Compare",
        "10%",
        false,
        EclColumn.CHECK,
        false,
        2,
        false,
        checkVisible
      );
    }
    this.tableConfig.columns = manager.getColumns();

    this.tableConfig.export = false;
    this.tableConfig.lazy = true;
    this.tableConfig.isFullURL = true;
    this.tableConfig.filterGlobal = false;
    this.tableConfig.storageFilterKey = storageDrug.filterSelectDrugList;
    this.tableConfig.sortOrder = -1;
    this.tableConfig.isFullURL = true;
  }

  openDetails(event: any) {
    let rowData = event.row;
    let midRule = rowData.midRules.filter(
      (val) => val.ruleCode === event.event
    );
    this.ruleManagerService.showRuleIdDetailsScreen(midRule[0].ruleId, true);
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
      this.versionId = event.row.drugVersionCode;
      this.downloadSelected("docx");
    }
  }

  downloadSelected(selectedType: string): void {
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
    this.router.navigate([DnBRoutes.newVersion]);
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
      storageCompareCodes.drugVersionCompareStatusOne,
      this.versionOne.versionStatus,
      true
    );
    this.storageService.set(
      storageCompareCodes.drugVersionCompareDateOne,
      this.versionOne.reviewDt,
      true
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
    this.storageService.set(
      storageCompareCodes.drugVersionCompareDateTwo,
      this.versionTwo.reviewDt,
      true
    );
    this.router.navigate([DnBRoutes.compareVersions]);
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
    if (approvedVersion === undefined) return;
    const approvedVersionId = approvedVersion.drugVersionCode;
    const approvedVersionStatus = approvedVersion.versionStatus.code;
    const approvedVersionMajorVersion = approvedVersion.majorVersion;
    this.storageService.set(
      storageDrug.approvedDrugVersion,
      {
        versionId: approvedVersionId,
        versionStatus: approvedVersionStatus,
        versionStatusDescription: approvedVersion.versionStatus.description,
      },
      true
    );
	this.storageService.set(storageDrug.drugDate, approvedVersion.reviewDt, false);
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

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.storageService.remove(storageDrug.filterSelectDrugList);
  }
}
