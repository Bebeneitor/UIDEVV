import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DrugService } from '../../services/drug.service';
import * as jsPDF from 'jspdf';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { sqlDateConversion } from 'src/app/shared/services/utils';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  @ViewChild('contentToConvert', { static: true }) contentToConvert:ElementRef;
  showDate: any;
  showTime: any;
  daterange = [];
  allLogs = [];
  showLogs = [
    {
      activity: '',
      comments: ''
    }
  ];
  specialElementHandlers: any;

  constructor(private drugService: DrugService, private sqlDateConversion:sqlDateConversion) { }

  ngOnInit(): void {
    this.allLogs = [];
    this.drugService.getAuditLog().subscribe(
      (result: BaseResponse) => {
        let allLogs = result.response;
        if (!!allLogs) {
          this.getAllLogs(allLogs);
        }
      }
    ); 
  }

/**
* 
Method to Export audit logs as PDF
*/
  exportPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    var source = this.contentToConvert.nativeElement;
    var margins = {
      top: 10,
      bottom: 10,
      left: 10,
      width: 595
    };
    doc.fromHTML(
      source, // HTML string or DOM elem ref.
      margins.left,
      margins.top, {
      'width': margins.width,
      'elementHandlers': this.specialElementHandlers
    },

      function (dispose) {
        doc.save('Test.pdf');
      }, margins);
  }

  
/**
* 
Method to get audit logs of the web crawling functionality
*/
  getAllLogs(allLogs) {
    this.allLogs = [];
    allLogs.forEach(element => {
      let userLogs: any;
      let users = [];
      let logs = [];
      let date = this.sqlDateConversion.JSDateToSQLDate(element.date);
      if (!this.allLogs.find(res => this.sqlDateConversion.JSDateToSQLDate(res.date).split('T')[0] === date.split('T')[0])) {
        let user = element.userName;
        logs.push({ time: date.split("T")[1].split('.')[0], activity: element.activity, comments: element.comments });
        users.push({ user: user, logs: logs });
        userLogs = {
          date: date.split("T")[0], users: users
        };
        this.allLogs.push(userLogs);
      }
      else if (this.allLogs.find(res => this.sqlDateConversion.JSDateToSQLDate(res.date).split('T')[0] === date.split('T')[0])) {
        let result = this.allLogs.find(res => this.sqlDateConversion.JSDateToSQLDate(res.date).split('T')[0] === date.split('T')[0]);
        if (!!result) {
          let existingUser = result.users.find(res => res.user == element.userName);
          if (!!existingUser) {
            existingUser.logs.push({ time: date.split("T")[1].split('.')[0], activity: element.activity, comments: element.comments });
          }
          else {
            let logs = [];
            logs.push({
              time: date.split('T')[1].split('.')[0],
              activity: element.activity,
              comments: element.comments
            });
            result.users.push({ user: element.userName, logs: logs })
          }

        }
      }
    });
  }

  convertDate(fulldate) {
    var date = new Date(fulldate),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("-");
  }

/**
* 
Method to filter audit logs of the web crawling functionality based on date range
*/
  filterbyDate(daterange, values) {
    if (values.inputFieldValue.length == 23) {
      let splitdate = values.inputFieldValue.split('-');
      let fromDate = this.convertDate(splitdate[0]);
      let todate = this.convertDate(splitdate[1]);
      if (!!fromDate && !!todate) {
        this.drugService.getAuditLogByDate(fromDate, todate).subscribe((res: BaseResponse) => {
          let allLogs = res.response;
          if (!!allLogs) {
            this.getAllLogs(allLogs);
          }
        }
        );
      }
    }
  }

  clearDates(values) {
    values.inputFieldValue = '';
    this.drugService.getAuditLog().subscribe(
      (result: BaseResponse) => {
        let allLogs = result.response;
        if (!!allLogs) {
          this.getAllLogs(allLogs);
        }
      }
    );
  }

}
