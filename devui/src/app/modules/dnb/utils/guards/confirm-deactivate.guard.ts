import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from "@angular/router";
import { DnBRoutes } from "../../models/constants/dnb-routes.constants";

export interface LockBackRefreshComponentGuard {
  canDeactivate: () => Promise<boolean>;
}

@Injectable({
  providedIn: "root",
})
export class ConfirmDeactivateGuard
  implements CanDeactivate<LockBackRefreshComponentGuard>
{
  canDeactivate(
    component: LockBackRefreshComponentGuard,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) {
    const currentUrl = currentState.url;
    const nextUrl = nextState.url;
    if (
      (currentUrl === DnBRoutes.newVersion ||
        currentUrl === DnBRoutes.newDrug) &&
      nextUrl !== (DnBRoutes.newDrug || DnBRoutes.newVersion) &&
      component.canDeactivate
    ) {
      return component.canDeactivate().then(
        () => true,
        () => false
      );
    }
    return true;
  }
}
