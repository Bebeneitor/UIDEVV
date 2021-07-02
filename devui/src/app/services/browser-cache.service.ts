import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserCacheService {

  items: any;

  constructor() { 
    this.items = {};
  }

  set(key: string, data: any) {
    this.items[key] = data;
  }

  get(key: string) {
    return this.items[key];
  }

  remove(key: string) {
    delete this.items[key];
  }

  removeAll() {
    this.items = {};
  }

  exists(key: string) {
    return this.items[key] != undefined;
  }
}
