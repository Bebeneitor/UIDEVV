import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  GroupedSection,
  GroupRow,
  Section,
} from "../../models/interfaces/uibase";

@Component({
  selector: "app-sections-sticky",
  templateUrl: "./sections-sticky.component.html",
  styleUrls: ["./sections-sticky.component.css"],
})
export class SectionsStickyComponent {
  @Input() stickySection: (Section | GroupedSection)[] = [];
  @Output() behaviorEvnt: EventEmitter<any> = new EventEmitter();

  undoStickySection(index: number) {
    this.behaviorEvnt.emit({
      behavior: "undoStickySection",
      index,
    });
  }

  groupHasBorder(group: GroupRow): boolean {
    const lastIndex = group.rows.length - 1;
    return group.rows[lastIndex].hasBorder;
  }
}
