import { Directive, TemplateRef, ViewContainerRef, Input } from "@angular/core";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";

@Directive({
  selector: "[appDnbRoles]",
})
export class DnbRolesDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private dnbRoleService: DnbRoleAuthService
  ) {}

  userRoles: string[];

  @Input()
  set appDnbRoles(roles: string[]) {
    if (!roles || !roles.length) {
      throw new Error("Roles value is empty or missed");
    }
    this.userRoles = roles;
  }

  ngOnInit() {
    let hasAccess = true;

    hasAccess = this.userRoles.some((r) => this.dnbRoleService.isAuthorized(r));

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
