import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { Messages } from "../../models/constants/messages.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import {
  storageCompareCodes,
  storageDrug,
} from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import { Column, UISection } from "../../models/interfaces/uibase";
import { DnbService } from "../../services/dnb.service";
import {
  convertSectionNameToID,
  createNavigation,
  versionInformation,
} from "../../utils/convertAPIToUI.utils";
import { drugVersionStatus } from "../../models/constants/drug.constants";

@Component({
  selector: "app-compare-versions",
  templateUrl: "./compare-versions.component.html",
  styleUrls: ["./compare-versions.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CompareVersionsComponent implements OnInit, OnDestroy {
  drugNameColumn: Column;
  navigationItems: NavigationItem[];
  sections$: Observable<UISection[]>;
  isNavigationOpen: boolean = true;
  scrollPosition: number = 0;
  versionA: string = "";
  versionB: string = "";
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
    this.versionA = this.storageService.get(
      storageCompareCodes.drugVersionCompareNameOne,
      false
    );
    this.versionB = this.storageService.get(
      storageCompareCodes.drugVersionCompareNameTwo,
      false
    );
    const versionOneId = this.storageService.get(
      storageCompareCodes.drugVersionCompareIdOne,
      false
    );
    const versionTwoId = this.storageService.get(
      storageCompareCodes.drugVersionCompareIdTwo,
      false
    );
    const versionTwostatus = this.storageService.get(
      storageCompareCodes.drugVersionCompareStatusTwo,
      true
    );
    this.versionB =
      versionTwostatus.code !== drugVersionStatus.Approved.code
        ? drugVersionStatus.Draft.description
        : `Version ${this.versionB}`;
    this.sections$ = forkJoin(
      this.dnbService.getAggregator(versionOneId),
      this.dnbService.getAggregator(versionTwoId)
    ).pipe(
      map(([sectionOne, SectionTwo]) => {
        const sectionOneUI = sectionOne.map((sectionOne) => {
          return versionInformation(sectionOne);
        });
        const sectionTwoUI = SectionTwo.map((SectionTwo) => {
          return versionInformation(SectionTwo);
        });
        const result = sectionOneUI.map((section, index) => {
          const groupedSections = [
            SectionCode.SecondaryMalignancy,
            SectionCode.DosingPatterns,
            SectionCode.CombinationTherapy,
          ];
          return {
            id: convertSectionNameToID(section.section.name),
            current: section,
            new: sectionTwoUI[index],
            hasRowHeading: false,
            grouped:
              groupedSections.findIndex(
                (searchSection) => section.section.code === searchSection
              ) > -1,
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
}
