import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Column } from "../models/interfaces/uibase";

@Injectable({
  providedIn: "root",
})
export class DnbStoreService {
  updateCurrentColumn = new BehaviorSubject(null);
  updateCurrentSection = new BehaviorSubject(null);

  notifySectionContainerBulkUpdate(sectionId): void {
    this.updateCurrentSection.next(sectionId);
  }

  notifySectionContainerColumnUpdate(
    sectionId: string,
    compareColumn: Column,
    diff
  ): void {
    this.updateCurrentColumn.next({ sectionId, compareColumn, diff });
  }
}
