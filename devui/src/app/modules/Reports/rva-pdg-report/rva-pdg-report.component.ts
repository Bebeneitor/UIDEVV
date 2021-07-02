import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EclButtonTable } from 'src/app/shared/components/ecl-table/model/ecl-button';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { FileManagerService } from 'src/app/shared/services/file-manager.service';

@Component({
  selector: 'app-rva-pdg-report',
  templateUrl: './rva-pdg-report.component.html',
  styleUrls: ['./rva-pdg-report.component.css']
})
export class RvaPdgReportComponent implements OnInit {

  tableConfig: EclTableModel;

  constructor(private fileManager: FileManagerService) { }

  ngOnInit() {
    this.generateECLTable();
  }

  generateECLTable() {
    this.tableConfig = new EclTableModel();

    this.tableConfig.lazy = true;
    this.tableConfig.sortOrder = 1;
    this.tableConfig.checkBoxSelection = false;
    this.tableConfig.export = false;
    this.tableConfig.url = RoutingConstants.RVA_PDG_REPORT + '/' + RoutingConstants.RVA_GET_REPORT;

    let manager = new EclTableColumnManager();

    manager.addTextColumn('fileId', 'File ID', '10%', true, EclColumn.TEXT, true,  0, 'center');
    manager.addTextColumn('fileName', 'File Name', '40%', true, EclColumn.TEXT, true,  0, 'left');
    manager.addTextColumn('generationDate', 'Generation Date', '20%', true, EclColumn.TEXT, true,  0, 'center');
    manager.addTextColumn('fileSize', 'File Size', '20%', false, EclColumn.TEXT, false,  0, 'center');
    manager.addButtonsColumn('downloadFile', 'Download', '10%', [new EclButtonTable('download', true, null, 'fa fa-download')]);

    this.tableConfig.columns = manager.getColumns();
  }

  onAcctionButton(event) {
    if(event.field == 'downloadFile') {
      console.log(event.row.fileId);
      this.fileManager.downloadFile(event.row.fileId).subscribe(response => {
        console.log(response);
        console.log(event.row.fileName);
        this.fileManager.createDownloadFileElement(response, event.row.fileName);
      });
    }
  }

}
