import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResearchRequestService } from 'src/app/services/research-request.service';

@Component({
  selector: 'app-research-request-history',
  templateUrl: './research-request-history.component.html',
  styleUrls: ['./research-request-history.component.css']
})
export class ResearchRequestHistoryComponent implements OnInit {

  @Input() rrId: number;

  historyData: any;
  dateGroupMetaData: any;
  first: number = 0;
  expandedRow: object = {}
  loading: boolean = false;
  cols = [
    { field: 'screenName', header: 'Screen Name', width: '15%' },
    { field: 'fieldName', header: 'Field', width: '15%' },
    { field: 'oldValue', header: 'Old Value', width: '15%' },
    { field: 'newValue', header: 'New Value', width: '15%' },
    { field: 'updatedBy', header: 'Updated By', width: '15%' },
    { field: 'updatedOn', header: 'Updated On', width: '19%' }
  ];

  constructor(private rrService: ResearchRequestService) { }

  ngOnInit() {
    this.loading = true;
    this.loadHistoryAuditLog();
  }

  loadHistoryAuditLog() {
    this.rrService.getAuditLog(this.rrId).subscribe(resp => {
      this.historyData = resp.data;
      this.updateRowGroupMetaData();
    },
    error => {
      this.loading = false;
    })
  }

  /**
   * Updating the RowGroup Meta Data based on Date.
   */
  updateRowGroupMetaData() {
    this.dateGroupMetaData = {};
    if (this.historyData) {
      for (let i = 0; i < this.historyData.length; i++) {
        let rowData = this.historyData[i];
        let date = rowData.date;
        if (i == 0) {
          this.dateGroupMetaData[date] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.historyData[i - 1];
          let previousRowGroup = previousRowData.date;
          if (date === previousRowGroup) {
            this.dateGroupMetaData[date].size++;
          } else {
            this.dateGroupMetaData[date] = { index: i, size: 1 };
          }
        }
      }
      this.expandFirstRow();
      this.loading = false;
    }
  }

  /**
   * Expanding first row of the table.
   */
  expandFirstRow() {
    this.historyData.forEach((v, i) => {
      if (i === 0) {
        this.expandedRow[v.date] = true;
      }
    })

  }
}
