import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/primeng';
import { AppUtils } from 'src/app/shared/services/utils';
import { RuleIngestionService } from '../../services/rule-ingestion.service';

@Component({
  selector: 'app-ingestion-process',
  templateUrl: './ingestion-process.component.html',
  styleUrls: ['./ingestion-process.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IngestionProcessComponent implements OnInit {
  @ViewChild('uploadControl') uploadControl: FileUpload;
  // General component properties.
  pageTitle: string = '';
  userId: number;
  ruleEngines: any[] = [{ label: 'ICMS', value: 2 }, { label: 'Generic', value: 1 }];
  selecteRuleEngine = 2;
  public uploadProgress = 0;

  /**
   * Component contructor.
   * @param route from the activated route we get the page title.
   * @param utils service from where we get the loged user.
   * @param ruleIngestionService service that we use to send the data to the backend rest api.
   */
  constructor(private route: ActivatedRoute, private utils: AppUtils,
    public ruleIngestionService: RuleIngestionService,
    private messageService: MessageService) { }

  /**
   * Ones the component is created we get the title property and the user from the utils service.
   */
  ngOnInit() {
    this.userId = this.utils.getLoggedUserId();
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
    });

  }

  /**
   * It fires when we click on upload button and send the file to the service.
   * @param file to be uploaded to the rest api service.
   */
  onFileUpload(file) {
    this.ruleIngestionService.uploadFile(file, this.userId, this.selecteRuleEngine).subscribe((res) => {
      if (res) {
        if (res.code === 200 && res.message === 'Upload Succesful.') {
          this.uploadProgress = 100;
          this.messageService.add({ severity: 'success', summary: 'Rule Ingestion', detail: res.message });
          setTimeout(() => this.uploadProgress = 0, 1000);
        } else {
          if (!isNaN(res)) {
            this.uploadProgress = res;
          }
        }
      }
      this.ruleIngestionService.clearFileUploadSelection(this.uploadControl);
    }, (err) => {
      this.uploadProgress = 0;
      this.ruleIngestionService.clearFileUploadSelection(this.uploadControl);
    });
  }
}
