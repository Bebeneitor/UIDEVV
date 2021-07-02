import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { RoutingConstants } from '../shared/models/routing-constants';
import { Constants } from '../shared/models/constants';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private _observerMenu = new Subject<any>();
  private _observerSettings = new Subject<any>();

  constructor() { }

  listen(): Observable<any> {
    return this._observerMenu.asObservable();
  }

  toogle(toogleBy: boolean) {
    this._observerMenu.next(toogleBy);
  }

  listenSettings() : Observable<any> {
    return this._observerSettings.asObservable();
  }

  closeSettings() {
    this._observerSettings.next(Math.random());
  }

  getHelpPage() {
    const helpHost = window.location.hostname;
    window.open(Constants.HTTP_NAME + helpHost + '/' + RoutingConstants.ECL_HELP);
  }

  getHelpDnb(){
    const helpHost = window.location.hostname;
    window.open(Constants.HTTP_NAME + helpHost + '/' + RoutingConstants.DNB_HELP);
  }
}
