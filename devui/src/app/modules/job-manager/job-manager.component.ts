import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobInfo } from 'src/app/shared/models/job-info';
import { JobManagementService } from 'src/app/services/job-management-service';
import { MessageService, DialogService } from 'primeng/api';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { JobCreationComponent } from './job-creation/job-creation.component';
import { JobSchedulerComponent } from './job-scheduler/job-scheduler.component';

@Component({
  selector: 'app-job-manager',
  templateUrl: './job-manager.component.html',
  styleUrls: ['./job-manager.component.css']
})
export class JobManagerComponent implements OnInit {

  @ViewChild('viewGrid') viewGrid: any;
  @ViewChild(JobCreationComponent) jobCreation: JobCreationComponent;

  pageName: string;
  cols: any[];
  jobInfo: JobInfo[];
  selectedJobs: JobInfo[];
  keywordSearch: string;
  jobCreationDisplay: boolean = false;
  jobModalTitle: string = '';
  jobModalCron: JobInfo = new JobInfo();

  constructor(public route: ActivatedRoute, private jobService: JobManagementService, private messageService: MessageService, 
      private dialogService: DialogService) {

    this.cols = [
      { field: 'jobName', header: 'Job Name', width: '11%' },
      { field: 'jobGroup', header: 'Job Group', width: '11%' },
      { field: 'jobCronExpression', header: 'Cron Expression', width: '8%' },
      { field: 'jobStatus', header: 'Status', width: '4%'},
      { field: 'jobLastExecution', header: 'Last Execution', width: '8%' },
      { field: 'jobNextExecution', header: 'Next Execution', width: '8%' }
    ];
    this.keywordSearch = '';
    this.selectedJobs = [];
    this.loadData();
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageName = params['pageTitle'];
    });
  }

  private getAllScheduledJobs() {
    return new Promise((resolve) => {
      let value: any = [];
      this.jobService.getAllScheduledJobs().subscribe((response: BaseResponse) => {
        value = response.data;
        resolve(value);
      });
    });
  }

  loadData(loadPage: boolean = false) {
    this.getAllScheduledJobs().then((response: any) => {
      let values: any = response;
      this.jobInfo = [];
      for (let job of values) {
        this.jobInfo.push(
          {
            "jobName": job.jobName,
            "jobGroup": job.jobGroup,
            "jobCronExpression": job.jobCronExpression,
            "jobStatus": job.jobStatus,
            "jobLastExecution": job.jobLastExecution,
            "jobNextExecution": job.jobNextExecution,
            "jobData": job.jobData
          }
        )
      }

      if(loadPage) {
        setTimeout(null, 500);
        this.selectCurrentPage(this.viewGrid);
      }
    })
  }

  selectCurrentPage(viewGrid: any): void {
    let selectedData = this.selectedJobs;
    this.selectedJobs = selectedData.slice(viewGrid.first, viewGrid.first + viewGrid.rows);
  }

  executeJob() {
    if (this.selectedJobs.length > 0) {
      this.jobService.executeScheduledJob(this.selectedJobs).subscribe((response: BaseResponse) => {
        if (response.code == 200) {
          setTimeout(null, 500);
          this.loadData();
          this.messageService.add({ severity: 'success', summary: 'Info', detail: response.data, life: 5000, closable: true });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.data, life: 5000, closable: true });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Please select jobs to execute`, life: 5000, closable: true });
    }
  }

  deleteJob() {
    if (this.selectedJobs.length > 0) {
      this.jobService.removeScheduledJob(this.selectedJobs).subscribe((response: BaseResponse) => {
        if (response.code == 200) {
          setTimeout(null, 500);
          this.loadData();
          this.messageService.add({ severity: 'success', summary: 'Info', detail: response.data, life: 5000, closable: true });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.data, life: 5000, closable: true });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Please select jobs to remove`, life: 5000, closable: true });
    }
  }

  updateCronExpression(job: JobInfo) {
    this.jobModalTitle = 'Edit Schedule';
    this.jobCreation.jobCreationDisplay = true;
    if(job.jobData != null && job.jobData != undefined && job.jobData != '') {
      job.jobData = JSON.stringify(JSON.parse(job.jobData), undefined, 4);
    }
    this.jobModalCron = job;
  }

  createJob() {
    this.jobModalTitle = 'New Schedule';
    this.jobCreation.jobCreationDisplay = true;
    this.jobModalCron = new JobInfo();
  }

  closeModal(event) {
    this.jobCreationDisplay = false;
    this.loadData(true);
  }

}
