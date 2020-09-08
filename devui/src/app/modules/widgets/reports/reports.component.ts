import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  @Input()
  title: string = "";

  cols: any[];
  reports : any = [];

  constructor(private dashboardService : DashboardService) { }

  ngOnInit() {
    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'name', header: 'Name' },
      { field: 'options', header: 'Download' }
    ];

    this.loadData();
  }

  /**
   * Load data from service
   * (For now this is dummy data)
   */
  loadData() {
    this.reports = [];
    for(let i = 0; i < 12; i++) {
      this.reports.push({
        "id" : i,
        "name" : "REPORT TEST " + (i + 1),
        "date" : this.dashboardService.parseDate(new Date()),
        "url" : "http://test.report/" + i
      });
    }
  }

  /**
   * Refresh data in widget
   */
  refresh() {
    this.loadData();
  }

}
