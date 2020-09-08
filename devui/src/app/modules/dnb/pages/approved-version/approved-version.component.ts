import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { map, tap } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { Messages } from "../../models/constants/messages.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageDrug } from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import {
  BaseSectionResponse,
  Column,
  GroupedSection,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import { DnbService } from "../../services/dnb.service";
import {
  convertSectionNameToID,
  createNavigation,
  versionInformation,
} from "../../utils/convertAPIToUI.utils";

@Component({
  selector: "app-approved-version",
  templateUrl: "./approved-version.component.html",
  styleUrls: ["./approved-version.component.css"],
})
export class ApprovedVersionComponent implements OnInit, OnDestroy {
  drugNameColumn: Column;
  navigationItems: NavigationItem[];
  sections$: Observable<UISection[]>;
  isNavigationOpen: boolean = true;
  scrollPosition: number = 0;
  majorVersion: string = "";
  observer: IntersectionObserver;
  sections: UISection[];
  showFindAndReplace: boolean = false;
  toggleLabel: string = Messages.showFullScreenLabel;

  @HostListener("window:scroll", ["$event"]) getScrollHeight(event) {
    if (event.type === "scroll") {
      this.scrollPosition = document.documentElement.scrollTop;
    }
  }
  constructor(
    private dnbService: DnbService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.drugNameColumn = {
      value: this.storageService.get(storageDrug.drugName, false),
      isReadOnly: true,
    };

    const approvedVersion = this.storageService.get(
      storageDrug.approvedDrugVersion,
      true
    );
    this.majorVersion = this.storageService.get(storageDrug.majorVersion, false);
    this.sections$ = this.dnbService
      .getAggregator(approvedVersion.versionId)
      .pipe(
        map((section) => {
          const sectionUI = section.map((sectionOne) => {
            return versionInformation(sectionOne);
          });

          const result = sectionUI.map((section, index) => {
            const groupedSections = [
              SectionCode.SecondaryMalignancy,
              SectionCode.DosingPatterns,
              SectionCode.CombinationTherapy,
            ];
            const grouped =
              groupedSections.findIndex(
                (searchSection) => section.section.code === searchSection
              ) > -1;
            return {
              id: convertSectionNameToID(section.section.name),
              current: this.createCurrentPlaceholder(section, grouped),
              new: sectionUI[index],
              hasRowHeading: false,
              grouped,
            };
          });
          this.sections = result;
          this.navigationItems = createNavigation(result);
          return result;
        }),
        tap(() => {
          setTimeout(() => {
            this.startObserver();
          });
        })
      );
  }

  ngOnDestroy() {
    this.observer && this.observer.disconnect();
  }

  startObserver(): void {
    const pageContentEl = document.querySelector(".dnb-page");
    const stickytTriggerEl = document.querySelector(".sentinal");
    this.observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        pageContentEl.classList.add("has-sticky-header");
      } else {
        pageContentEl.classList.remove("has-sticky-header");
      }
    });
    this.observer.observe(stickytTriggerEl);
  }

  onSwitchChange(event: { originalEvent: MouseEvent; checked: true }) {
    this.toggleLabel = !event.checked
      ? Messages.showFullScreenLabel
      : Messages.hideFullScreenLabel;
  }

  createCurrentPlaceholder(
    section: BaseSectionResponse,
    grouped: boolean
  ): Section | GroupedSection {
    return grouped
      ? {
          drugVersionCode: section.drugVersionCode,
          section: {
            code: section.section.code,
            name: section.section.name,
          },
          headers: [],
          codes: [],
          id: convertSectionNameToID(section.section.name),
          groups: [],
        }
      : {
          drugVersionCode: section.drugVersionCode,
          section: {
            code: section.section.code,
            name: section.section.name,
          },
          codes: [],
          headers: [],
          id: convertSectionNameToID(section.section.name),
          rows: [],
        };
  }
}
