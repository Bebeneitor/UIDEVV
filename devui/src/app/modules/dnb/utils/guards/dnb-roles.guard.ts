import { Injectable, Injector } from "@angular/core";
import { RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { dnbCodes } from "../../models/constants/actionCodes.constants";
import { Router } from "@angular/router";
import { Messages } from "../../models/constants/messages.constants";
import { OktaHashBasedAuthGuard } from "src/app/shared/guards/okta-hash-based.guard";
import { OktaAuthService } from "@okta/okta-angular";

@Injectable({
  providedIn: "root",
})
export class DnbRolesGuard extends OktaHashBasedAuthGuard {
  constructor(
    private roleAuthService: DnbRoleAuthService,
    private router: Router,
    private oktaAuthHash_: OktaAuthService,
    injectorHash_: Injector
  ) {
    super(oktaAuthHash_, injectorHash_);
    oktaAuthHash_.$authenticationState.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const oktaGuardCanActivate: boolean = await super.canActivate(route, state);
    if (!oktaGuardCanActivate) {
      return false;
    }

    const url = state.url.split("/")[2];

    switch (url) {
      case "select-drug":
      case "drug-versions":
      case "new-version":
        return this.isAuthorized(
          dnbCodes.LIST_DRUGS,
          Messages.guardMessageNoAllowed
        );
    }
  }

  isAuthorized(code: string, message: string = null) {
    if (this.roleAuthService.isAuthorized(code, message)) {
      return true;
    } else {
      this.router.navigate(["/home"]);
      return false;
    }
  }
}
