import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { ConfirmationService } from 'primeng/api';
import { RoleSetupService } from 'src/app/services/role-setup.service';
import { Users } from 'src/app/shared/models/users';
import { EclTableComponent } from 'src/app/shared/components/ecl-table/ecl-table.component';
import { EclTableModel } from 'src/app/shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from 'src/app/shared/components/ecl-table/model/ecl-table-manager';
import { EclColumn } from 'src/app/shared/components/ecl-table/model/ecl-column';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';

@Component({
  selector: 'app-ecl-user-directory',
  templateUrl: './ecl-user-directory.component.html',
  styleUrls: ['./ecl-user-directory.component.css']
})

export class EclUserDirectoryComponent implements OnInit {

  @ViewChild('usersTable') usersTable: EclTableComponent;

  pageTitle: string;
  usersTableConfig: EclTableModel = null;

  successHeader: string;
  message: string;
  display: boolean = false;

  users: any[];
  selectedUser: Users;

  constructor(private route: ActivatedRoute, private usersService: UsersService, private confirmationService: ConfirmationService,
    private router: Router, private roleSetupService: RoleSetupService) { }

  ngOnInit() {
    this.route.data.subscribe(params => {
      this.pageTitle = params['pageTitle'];
    });
    let manager = new EclTableColumnManager();
    manager.addTextColumn('userId', 'User ID', '20%', true, EclColumn.TEXT, true);
    manager.addTextColumn('firstName', 'User Name', null, true, EclColumn.TEXT, true);
    manager.addTextColumn('email', 'User E-mail', null, true, EclColumn.TEXT, true);
    manager.addIconColumn('edit', 'Edit', '10%', 'fa fa-pencil purple');
    manager.addIconColumn('delete', 'Delete', '10%', 'fa fa-trash-o purple');

    this.usersTableConfig = new EclTableModel();
    this.usersTableConfig.url = RoutingConstants.USERS_URL + "/";
    this.usersTableConfig.columns = manager.getColumns();
    this.usersTableConfig.lazy = true;
    this.usersTableConfig.sortOrder = 1;
    this.usersTableConfig.export = true;
    this.usersTableConfig.excelFileName = "ECL User Directory";
    this.usersTableConfig.filterGlobal = true;
    this.usersTableConfig.checkBoxSelection = false;
  }

  onClickIcon(event: any) {
    const row = event.row;
    const field = event.field;
    switch (field) {
      case "edit":
        this.editUserAccess(row);
        break;
      case "delete":
        this.deleteUser(row);
        break;
    }
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

    sessionStorage.setItem("userAuthSetup", JSON.stringify(this.selectedUser));
    this.router.navigate(['/ecl-user-authority-setup']);
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure, you want to delete the user from ECL?',
      header: 'Deletion Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        let userId: number = user.userId;
        this.deleteSelectedUser(userId);
      },
      reject: () => {
        //Do nothing here
      }
    });
  }

  deleteSelectedUser(userId: number) {
    this.roleSetupService.deleteUserAccess(userId).subscribe(response => {
      if (response != null) {
        if (response.message == 'Success') {
          this.successHeader = "Delete Message";
          this.message = "User deleted successfully!";
          this.display = true;
          this.usersTable.refreshTable();
        }
      }
    });
  }

}
