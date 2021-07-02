import { Injectable } from "@angular/core";
import { StorageService } from "src/app/services/storage.service";
import { storageGeneral } from "../models/constants/storage.constants";
import { ToastMessageService } from "src/app/services/toast-message.service";

@Injectable({
  providedIn: "root",
})
export class DnbRoleAuthService {
  private storage = new StorageService();
  private dnbPermissions = this.storage.get(
    storageGeneral.dnbPermissions,
    true
  );

  constructor(private toastService: ToastMessageService) {}

  private validatePermissionCode(
    code: string,
    message: string = null
  ): boolean {
    this.storage.get(storageGeneral.dnbPermissions, true);
    if (this.dnbPermissions.actions.find((codeA) => codeA === code)) {
      return true;
    } else {
      if (message) {
        this.toastService.messageWarning("Warning!", message, 6000, true);
      }
      return false;
    }
  }

  private validatePermissionRole(code: string): boolean {
    this.dnbPermissions = this.storage.get(storageGeneral.dnbPermissions, true);
    if (this.dnbPermissions.authorities.find((codeA) => codeA === code)) {
      return true;
    } else {
      return false;
    }
  }

  isAuthorized(codeAction: string, message: string = null) {
    return this.validatePermissionCode(codeAction, message);
  }

  isAuthorizedRole(codeAction: string) {
    return this.validatePermissionRole(codeAction);
  }
}
