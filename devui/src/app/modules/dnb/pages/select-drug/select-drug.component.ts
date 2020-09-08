import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/internal/operators/map";
import { StorageService } from "src/app/services/storage.service";
import { EclTableComponent } from "src/app/shared/components/ecl-table/ecl-table.component";
import { EclColumn } from "src/app/shared/components/ecl-table/model/ecl-column";
import { EclTableColumnManager } from "src/app/shared/components/ecl-table/model/ecl-table-manager";
import { EclTableModel } from "src/app/shared/components/ecl-table/model/ecl-table-model";
import { FileManagerService } from "src/app/shared/services/file-manager.service";
import { environment } from "src/environments/environment";
import { apiMap, apiPath } from "../../models/path/api-path.constant";
import { DnbService } from "../../services/dnb.service";
import { storageDrug } from "../../models/constants/storage.constants";
const BASE_URL = environment.restServiceDnBUrl;
@Component({
  selector: "app-select-drug",
  templateUrl: "./select-drug.component.html",
  styleUrls: ["./select-drug.component.css"],
})
export class SelectDrugComponent implements OnInit {
  @ViewChild("rulesTable") rulesTable: EclTableComponent;
  tableConfig: EclTableModel;
  drugListUrl: string = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugListByPage}`;
  shouldOpenDownload: boolean = false;
  drugLastApprovedId: string = "";
  selectedDrug: string = "";
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
    private storageService: StorageService,
    private dnbService: DnbService,
    private fileManagerService: FileManagerService
  ) {}

  ngOnInit() {
    this.setUpTable();
    this.loadData(this.drugListUrl);
  }

  selectDrug(event: any): void {
    const row = event.row;
    const name = row.name;
    const code = row.drugCode;
    this.storageService.set(storageDrug.drugName, name, false);
    this.storageService.set(storageDrug.drugCode, code, false);
    this.router.navigate(["/dnb/drug-versions"]);
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
    let url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugFilter}`;
    url = `${BASE_URL}${apiMap.restServiceDnbAggregator}${apiPath.drugListByPage}`;
    this.updateResults(url, filter);
  }

  updateResults(url: string, filter: string = "") {
    return new Promise((resolve, reject) => {
      this.tableConfig.criteriaFilters = filter;
      this.tableConfig.export = false;
      this.rulesTable.clearFilters();
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

    manager.addLinkColumn(
      "name",
      "Drug Name",
      "50%",
      true,
      EclColumn.TEXT,
      true
    );

    manager.addTextColumn(
      "versionStatus",
      "Status",
      "40%",
      true,
      EclColumn.TEXT,
      true
    );
    manager.addIconColumn(
      "drugVersionCode",
      "Download",
      "10%",
      "fa fa-download"
    );

    this.tableConfig.columns = manager.getColumns();

    this.tableConfig.export = false;
    this.tableConfig.lazy = true;
    this.tableConfig.showRecords = true;
    this.tableConfig.paginationSize = 10;
    this.tableConfig.isFullURL = true;
  }

  openSelectType(event: any): void {
    this.drugLastApprovedId = event.row.drugVersionCode;
    this.selectedDrug = event.row.name;
    this.shouldOpenDownload = true;
  }

  downloadSelected(selectedType: string): void {
    this.shouldOpenDownload = false;
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
}
