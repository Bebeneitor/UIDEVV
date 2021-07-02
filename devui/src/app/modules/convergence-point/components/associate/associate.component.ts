import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { Constants } from 'src/app/shared/models/constants';
import { BaseResponse } from 'src/app/shared/models/base-response';

@Component({
  selector: 'app-cvp-associate',
  templateUrl: './associate.component.html',
  styleUrls: ['./associate.component.css']
})
export class AssociateComponent implements OnInit {

  @Input('cvpModuleInstance') cvpModuleInstance;
  @Input('parentPage') parentPage: string; //To load primary modules (always will be from first screen 'CRC')
  @Input('sectionCode') sectionCode: string; //To load submodules

  modules: any[] = [];
  subModules: any[] = [];

  @Output() onCancel = new EventEmitter();

  selectedModule: string;
  selectedSubModule: string;

  isLoading: boolean = false;

  constructor(private convergencePointService: ConvergencePointService, private toastService: ToastMessageService) { }

  ngOnInit() {
    //Load dropdowns

    this.isLoading = true;

    this.convergencePointService.getModulesByScreen(Constants.CLINICAL_REQUIREMENTS_SCREEN).subscribe((response: BaseResponse) => {
      this.modules = [];
      response.data.forEach(item => {
        this.modules.push({
          'label': item.cvpModule.moduleName,
          'value': item.cvpModule.cvpModuleId.toString()
        });
      });

      this.convergencePointService.getSubModulesBySection(this.sectionCode).subscribe((responseSub: BaseResponse) => {
        this.subModules = [];
        responseSub.data.forEach(item => {
          this.subModules.push({
            'label': item.cvpModule.moduleName,
            'value': item.cvpModule.cvpModuleId.toString()
          });
        });

        setTimeout(() => {
          if(this.cvpModuleInstance != null) {
            if(this.cvpModuleInstance.parent) {
              this.selectedModule = this.cvpModuleInstance.id.toString();
            } else {
              this.selectedSubModule = this.cvpModuleInstance.id.toString();
            }            
          }

          this.isLoading = false;
        }, 100);
      });
    });
  }

  cancel(reload: boolean = false) {
    this.onCancel.emit(reload);
  }

  associate() {
    this.convergencePointService.associateSubModule(this.selectedModule, this.selectedSubModule).subscribe(() => {
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'Section was associated successfully!.');
      this.cancel(true);
    });
  }

}
