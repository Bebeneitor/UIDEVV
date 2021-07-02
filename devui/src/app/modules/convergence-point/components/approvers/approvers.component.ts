import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { ConvergencePointService } from '../../services/convergence-point.service';

@Component({
  selector: 'app-cvp-approvers',
  templateUrl: './approvers.component.html',
  styleUrls: ['./approvers.component.css']
})
export class ApproversComponent implements OnInit {

  selectedUser: any = null;
  users: any[] = [];
  loadedApprovers: any[] = [];

  @Input() moduleInstanceId: number;
  @Input() approvers;
  @Output() onChange = new EventEmitter();

  constructor(private toastService: ToastMessageService,
    private utils: AppUtils,
    private convergencePointService: ConvergencePointService) { }

  ngOnInit() {
    this.utils.getAllUsers(this.users);

    this.loadedApprovers = this.approvers
  }

  addApprover() {
    if (this.selectedUser == null) {
      this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, 'Please enter a valid user.');
      return;
    }

    //Validate if user exists in approvers list
    let exists = false;

    this.loadedApprovers.forEach(item => {
      if (item.userId == this.selectedUser) {
        exists = true;
      }
    });

    if (exists) {
      this.selectedUser = null;
      this.toastService.messageError(Constants.TOAST_SUMMARY_ERROR, 'The selected user alredy exists in approvers list.');
      return;
    }

    let firstName = '';
    
    this.users.forEach(item => {
      if (item.value == this.selectedUser) {
        firstName = item.label;
      }
    });

    this.convergencePointService.addApprover(this.moduleInstanceId, this.selectedUser).subscribe(() => {

      //Put approver in list
      this.loadedApprovers.push({
        userId: this.selectedUser,
        firstName: firstName
      });

      this.selectedUser = null;

      this.onChange.emit(this.loadedApprovers);

      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'PO/CCA added successfully.');
    });
  }

  removeApprover(index, userId) {
    this.convergencePointService.removeApprover(this.moduleInstanceId, userId).subscribe(() => {
      this.loadedApprovers.splice(index, 1);
      this.onChange.emit(this.loadedApprovers);
      this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, 'PO/CCA removed successfully.');
    });
  }

}
