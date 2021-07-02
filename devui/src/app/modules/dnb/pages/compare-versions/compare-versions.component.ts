import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { drugVersionStatus } from "../../models/constants/drug.constants";
import { Messages } from "../../models/constants/messages.constants";
import {
  groupedSections,
  SectionCode,
} from "../../models/constants/sectioncode.constant";
import {
  storageCompareCodes,
  storageDrug,
} from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import { Column, Section, UISection } from "../../models/interfaces/uibase";
import { DnbService } from "../../services/dnb.service";
import {
  convertSectionNameToID,
  createNavigation,
  versionInformation,
} from "../../utils/convertAPIToUI.utils";
import { getVersionColumnData } from "../../utils/tools.utils";

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
  versionA: string = "";
  versionB: string = "";
  observer: IntersectionObserver;
  sections: UISection[];
  showFindAndReplace: boolean = false;
  toggleLabel: string = Messages.showFullScreenLabel;
  validIcdCodeVersion: boolean = false;
  drugVersions: any[] = [];
  constructor(
    private dnbService: DnbService,
    private toastService: ToastMessageService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.drugNameColumn = {
      value: this.storageService.get(storageDrug.drugName, false),
      isReadOnly: true,
      feedbackData: [],
      feedbackLeft: 0,
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
    const versionOnestatus = this.storageService.get(
      storageCompareCodes.drugVersionCompareStatusOne,
      true
    );

    const versionOneDate = this.storageService.get(
      storageCompareCodes.drugVersionCompareDateOne,
      true
    );
    const versionTwoDate = this.storageService.get(
      storageCompareCodes.drugVersionCompareDateTwo,
      true
    );

    this.drugVersions = [
      {
        drugId: versionOneId,
        versionStatus: {
          code: versionOnestatus.code,
          description: versionOnestatus.description,
        },
        date: versionOneDate,
      },
      {
        drugId: versionTwoId,
        versionStatus: {
          code: versionTwostatus.code,
          description: versionTwostatus.description,
        },
        date: versionTwoDate,
      },
    ];

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
          return versionInformation(sectionOne, true);
        });
        const sectionTwoUI = SectionTwo.map((SectionTwo) => {
          return versionInformation(SectionTwo, true);
        });
        const result = sectionOneUI.map((section, index) => {
          let headersUIWidth = getVersionColumnData(
            "",
            section,
            false,
            this.storageService
          );
          return {
            id: convertSectionNameToID(section.section.name),
            current: {
              ...section,
              headersUIWidth: [...headersUIWidth],
            },
            new: {
              ...sectionTwoUI[index],
              headersUIWidth: [...headersUIWidth],
            },
            hasRowHeading: false,
            grouped:
              groupedSections.findIndex(
                (searchSection) => section.section.code === searchSection
              ) > -1,
          };
        });
        this.sections = result;
        this.validIcdCodes();
        this.navigationItems = createNavigation(result).map((item) => {
          return {
            ...item,
            completed: false,
          };
        });
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

  getInvalidCodeSection(section: Section): string[] {
    return section.rows
      .map((item) => item.invalidCodes)
      .filter(function (item) {
        return item !== "";
      });
  }

  validIcdCodesVersion(section: Section) {
    if (
      section.messages.length > 0 &&
      section.messages[0].includes("1005") &&
      !this.validIcdCodeVersion
    ) {
      const versionDrug = this.drugVersions.find((item) => {
        return item.drugId === section.drugVersionCode;
      });
      let version =
        versionDrug.versionStatus.code == "IP"
          ? "Draft"
          : versionDrug.versionStatus.description;
      this.toastService.messageWarning(
        "Warning!",
        `The Version for ${version} ${section.messages[0].substr(
          17,
          4
        )} Drug is not compatible with the ICD-10 Manual sorting. `,
        6000,
        true
      );
      this.validIcdCodeVersion = !this.validIcdCodeVersion;
    } else {
      const versionDrug = this.drugVersions.find((item) => {
        return item.drugId === section.drugVersionCode;
      });
      const invalidCodes = this.getInvalidCodeSection(section);
      let version =
        versionDrug.versionStatus.code == "IP"
          ? "Draft"
          : versionDrug.versionStatus.description;
      if (invalidCodes.length > 0) {
        this.toastService.messageWarning(
          "Warning!",
          `The next Code(s) in the ICD-10 Manual for ${version} ${versionDrug.date.substr(
            6,
            4
          )} were not found to sort it: ${invalidCodes.join(",")} in the ` +
            section.section.name +
            ".",
          6000,
          true
        );
      }
    }
  }

  validIcdCodes() {
    this.sections.map((section) => {
      if (
        section.new.section.code === SectionCode.DiagnosisCodes ||
        section.new.section.code === SectionCode.DiagnosticCodeSummary
      ) {
        this.validIcdCodesVersion(section.new as Section);
        this.validIcdCodesVersion(section.current as Section);
      }
    });
  }
}
