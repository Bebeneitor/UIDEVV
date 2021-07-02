import { Component, OnInit } from "@angular/core";
import { GroupedSection, Section } from "../../models/interfaces/uibase";

@Component({
  selector: "app-pinned-sections",
  templateUrl: "./pinned-sections.component.html",
  styleUrls: ["./pinned-sections.component.css"],
})
export class PinnedSectionsComponent implements OnInit {
  stickySections: (Section | GroupedSection)[] = [];
  channel = new BroadcastChannel("PINNED_SECTIONS");
  pageLoadedChannel = new BroadcastChannel("PINNED_SECTION_LOADED");
  constructor() {
    this.channel.addEventListener("message", (event) => {
      this.stickySections = event.data;
    });
  }

  ngOnInit() {
    this.pageLoadedChannel.postMessage("true");
  }

  undoStickSection(event) {
    this.stickySections.splice(event.index, 1);
    this.channel.postMessage(this.stickySections);
  }
}
