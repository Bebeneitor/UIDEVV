import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from "@angular/router";

export interface LockBackRefreshComponentGuard {
  canDeactivate: () => Promise<boolean>;
}

@Injectable({
  providedIn: "root",
})
export class ConfirmDeactivateGuard
  implements CanDeactivate<LockBackRefreshComponentGuard> {
  canDeactivate(
    component: LockBackRefreshComponentGuard,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) {
    const currentUrl = currentState.url;
    const nextUrl = nextState.url;
    if (
      currentUrl === "/dnb/new-version" &&
      nextUrl === "/dnb/drug-versions" &&
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
