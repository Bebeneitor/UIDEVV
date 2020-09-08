import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobManagementService } from 'src/app/services/job-management-service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { MessageService, DialogService, DynamicDialogRef } from 'primeng/api';
import { JobSchedulerComponent } from '../job-scheduler/job-scheduler.component';
import { JobInfo } from 'src/app/shared/models/job-info';

@Component({
  selector: 'app-job-creation',
  templateUrl: './job-creation.component.html',
  styleUrls: ['./job-creation.component.css']
})

export class JobCreationComponent implements OnInit {

  @Input() jobCreationDisplay: boolean;
  @Input() jobTitle: string;
  @Input() jobModalCron: JobInfo = new JobInfo();
  @Input() ref: DynamicDialogRef;

  @Output() onClose = new EventEmitter<string>();

  pageName: string;
  jobs: any[] = [{ label: 'Available Jobs', value: null }];
  groups: any[] = [{ label: 'Available Groups', value: null }];
  selectedJob: string = '';

  constructor(public route: ActivatedRoute, private jobService: JobManagementService, private messageService: MessageService,
    private dialogService: DialogService) {    
    this.fillJobNames();
  }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageName = params['pageTitle'];
    });
  }

  fillJobNames() {
    this.jobService.getAllJobs().subscribe((response: BaseResponse) => {
      if (response.code == 200) {
        let values: any = response.data;
        for (let job of values) {
          this.jobs.push({ label: job, value: job });
        }
      }
    });
  }

  generateCronExpression() {
    if (this.jobTitle == 'New Schedule') {
      this.ref = this.dialogService.open(JobSchedulerComponent, {
        data: {
          screen: 'Job Manager',
          cronExpression: this.jobModalCron.jobCronExpression
        },
        header: 'Cron Expression Composer',
        footer: '    ',
        width: '70%',
        contentStyle: { 'max-height': '95%', 'overflow': 'visible' }
      });
      this.ref.onClose.subscribe((cronExpression: string) => {
        this.jobModalCron.jobCronExpression = cronExpression;
      });
    } else {
      this.ref = this.dialogService.open(JobSchedulerComponent, {
        data: {
          screen: 'Job Manager',
          cronExpression: this.jobModalCron.jobCronExpression
        },
        header: 'Cron Expression Composer',
        footer: '    ',
        width: '70%',
        contentStyle: { 'max-height': '95%', 'overflow': 'visible' },
        closable: false,
        transitionOptions: "400ms cubic-bezier(0.25, 0.8, 0.25, 1)"
      });
      this.ref.onClose.subscribe((cronExpression: string) => {
        this.jobModalCron.jobCronExpression = cronExpression;
      });
    }
  }

  cancelJobCreation() {
    this.jobCreationDisplay = false;
  }

  applySchedule() {
    let allDataFilledOut: boolean = true;

    if (this.jobTitle == 'New Schedule' && this.selectedJob == '') {
      allDataFilledOut = false;
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Please select a job`, life: 5000, closable: true });
    }

    if (this.jobModalCron.jobCronExpression == '') {
      allDataFilledOut = false;
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Please type the cronExpression`, life: 5000, closable: true });
    }

    if(this.jobModalCron.jobData != null && this.jobModalCron.jobData != undefined && this.jobModalCron.jobData.trim() != '') {
      try {
        JSON.parse(this.jobModalCron.jobData);
      } catch(e) {
        allDataFilledOut = false;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Please type a valid Job Data`, life: 5000, closable: true });
      }
    }

    if (allDataFilledOut) {
      if (this.jobTitle == 'New Schedule') {
        this.jobService.createJob(this.selectedJob, this.jobModalCron.jobCronExpression, this.jobModalCron.jobData).subscribe((response: BaseResponse) => {
          if (response.code == 200) {
            this.messageService.add({ severity: 'success', summary: 'Info', detail: response.data, life: 5000, closable: true });
            this.jobCreationDisplay = false;
            this.onClose.emit();
          }
        });
      } else {
        if(this.jobModalCron.jobData != null && this.jobModalCron.jobData != undefined && this.jobModalCron.jobData.trim() != '') {
          this.jobModalCron.jobData = JSON.stringify(JSON.parse(this.jobModalCron.jobData));
        }
        this.jobService.updateScheduledJob([this.jobModalCron]).subscribe((response: BaseResponse) => {
          if (response.code == 200) {
            this.messageService.add({ severity: 'success', summary: 'Info', detail: response.data, life: 5000, closable: true });
            this.jobCreationDisplay = false;
            this.onClose.emit();
          }
        });
      }
      
    }
  }

}