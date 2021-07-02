import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { RoleSetupService } from 'src/app/services/role-setup.service';
import { Users } from 'src/app/shared/models/users';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { Constants } from 'src/app/shared/models/constants';
import { EclButtonTable } from 'src/app/shared/components/ecl-table/model/ecl-button';

@Component({
  selector: 'app-ecl-user-directory',
  templateUrl: './ecl-user-directory.component.html',
  styleUrls: ['./ecl-user-directory.component.css']
})

export class EclUserDirectoryComponent implements OnInit {

  @ViewChild('usersTable',{static: true}) usersTable: EclTableComponent;

  pageTitle: string;
  usersTableConfig: EclTableModel = null;

  successHeader: string;
  message: string;
  display: boolean = false;

  users: any[];
  selectedUser: Users;

  constructor(private route: ActivatedRoute, private confirmationService: ConfirmationService,
    private router: Router, private roleSetupService: RoleSetupService) { }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
    });
    this.usersTable.iconOptions = [Constants.STATUS_ACTIVE, Constants.STATUS_INACTIVE];
    let manager = new EclTableColumnManager();
    manager.addTextColumn('userId', 'User ID', '10%', true, EclColumn.TEXT, true, 10, "center");
    manager.addTextColumn('userName', 'Login User Name', null, true, EclColumn.TEXT, true, 300, "center");
    manager.addTextColumn('firstName', 'Full Name', null, true, EclColumn.TEXT, true, 300, "center");
    manager.addTextColumn('email', 'e-mail', null, true, EclColumn.TEXT, true, 300, "center");
    manager.addIconColumn('edit', 'Edit', '10%', 'fa fa-pencil purple');
    manager.addTextColumn('statusDesc', 'ECL User Status', '10%', false, EclColumn.TEXT, false, 300, "center");
    manager.addButtonsColumn('changeStatus', 'Modify Status', '10%', [new EclButtonTable("statusAction", true)]);

    this.usersTableConfig = new EclTableModel();
    this.usersTableConfig.url = RoutingConstants.USERS_URL + "/";
    this.usersTableConfig.columns = manager.getColumns();
    this.usersTableConfig.lazy = true;
    this.usersTableConfig.sortOrder = 1;
    this.usersTableConfig.export = true;
    this.usersTableConfig.excelFileName = "ECL User Directory";
    this.usersTableConfig.filterGlobal = true;
    this.usersTableConfig.checkBoxSelection = false;

    setTimeout(() => {
      this.usersTable.fillCustomFilterOptions("statusDesc", [
        { label: "Select", value: "" },
        { label: Constants.ACTIVE_STRING_VALUE, value: Constants.STATUS_ACTIVE },
        { label: Constants.INACTIVE_STRING_VALUE, value: Constants.STATUS_INACTIVE }
      ]);
    }, 200);
  }

  onClickIcon(event: any) {
    this.editUserAccess(event.row);
  }

  onAcctionButton(event: any) {
    this.updateUser(event.row);
  }

  setupUser() {
    let userSetup: boolean = true;
    sessionStorage.setItem("newUserSetUp", JSON.stringify(userSetup));
    this.router.navigate(['/ecl-user-authority-setup']);
  }

  editUserAccess(user) {
    this.confirmationService.confirm({
      message: 'Are you sure, you want to edit the user access from ECL?',
      header: 'Edit Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.editSelectedUser(user);
      },
      reject: () => {
        //Do nothing here
      }
    });

  }

  editSelectedUser(user: any) {
    this.selectedUser = new Users();
    this.selectedUser.userId = user.userId;
    this.selectedUser.firstName = user.firstName;
    this.selectedUser.lastName = user.lastName;
    this.selectedUser.email = user.email;
    this.selectedUser.initials =user.initials;
    sessionStorage.setItem("userAuthSetup", JSON.stringify(this.selectedUser));
    this.router.navigate(['/ecl-user-authority-setup']);
  }

  updateUser(user: any) {
    switch (user.status) {
      case Constants.STATUS_ACTIVE:
        this.confirmationService.confirm({
          message: 'Are you sure, you want to mark as inactive the user from ECL?',
          header: 'Inactive Confirmation',
          icon: 'pi pi-info-circle',
          accept: () => {
            //Deactivate user
            this.updateSelectedUser(user, Constants.STATUS_CODE_INACTIVE);
          },
          reject: () => {
            //Do nothing here
          }
        });
        break;
      case Constants.STATUS_INACTIVE:
        //Activate user
        this.updateSelectedUser(user, Constants.STATUS_CODE_ACTIVE);
    }
  }

  updateSelectedUser(user, status: string) {
    this.roleSetupService.updateUserStatus(user.userId, status).subscribe(response => {
      if (response.code) {
        this.successHeader = "Updated Message";
        this.message = "User updated successfully!";
        this.display = true;

        if(user.status == Constants.STATUS_INACTIVE) {
          //Change status to active
          user.status = Constants.STATUS_ACTIVE;
          user.statusDesc = Constants.ACTIVE_STRING_VALUE;
          user.statusAction = Constants.STATUS_ACTION_DEACTIVATE;
        } else {
          //Change status to inactive
          user.status = Constants.STATUS_INACTIVE;
          user.statusDesc = Constants.INACTIVE_STRING_VALUE;
          user.statusAction = Constants.STATUS_ACTION_ACTIVATE;
        } 
      }
    });
  }

}