import { Injectable } from '@angular/core';
import { storageGeneral } from '../modules/dnb/models/constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get(key, isJson: boolean) {
    try {
      if(!this.exists(key)) {
        return null;
      }
  
      if(isJson) {
        return JSON.parse(localStorage.getItem(key));
      } else {
        return localStorage.getItem(key);
      }

    } catch(e) {
      return null;
    }
  }

  set(key, data, isJson: boolean) {
    if(isJson) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data.toString());
    }
  }

  getItemListById(key, uniqueId, id) {
    let array = [];

    if(this.exists(key)) {
      array = this.get(key, true);
    }

    let data = null;

    for(let i = 0; i < array.length; i++) {
      if(array[i][uniqueId] == id) {
        data = array[i];
        break;
      }
    }

    return data;
  }

  addToList(key, data, uniqueId) {

    let array = [];

    if(this.exists(key)) {
      array = this.get(key, true);
    } 

    //Check if exists id in the array
    let existsInArray = false;
    let indexArray = -1;

    for(let i = 0; i < array.length; i++) {
      if(array[i][uniqueId] == data[uniqueId]) {
        existsInArray = true;
        indexArray = i;
        break;
      }
    }

    if(!existsInArray) {
      array.push(data);
    } else {
      array[indexArray] = data;
    }
    

    this.set(key, array, true);
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  removeAll() {
    const DnBColumnsData = this.get(storageGeneral.dnbVersionColumns, true);
    localStorage.clear();
    this.set(storageGeneral.dnbVersionColumns, DnBColumnsData, true);
  }

  exists(key) {
    return !(localStorage.getItem(key) == null || localStorage.getItem(key) == undefined);
  }

}
