import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { map, tap } from "rxjs/operators";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { Messages } from "../../models/constants/messages.constants";
import { groupedSections } from "../../models/constants/sectioncode.constant";
import { storageDrug } from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import { Column, UISection } from "../../models/interfaces/uibase";
import { DnbService } from "../../services/dnb.service";
import {
  convertSectionNameToID,
  createCurrentPlaceholder,
  createNavigation,
  versionInformation,
} from "../../utils/convertAPIToUI.utils";
import {
  getDrugVersionId,
  getVersionColumnData,
  validateVersionDrug,
} from "../../utils/tools.utils";

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
  majorVersion: string = "";
  observer: IntersectionObserver;
  sections: UISection[];
  showFindAndReplace: boolean = false;
  toggleLabel: string = Messages.showFullScreenLabel;
  validIcdCodeVersion: boolean = false;
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

    const approvedVersion = this.storageService.get(
      storageDrug.approvedDrugVersion,
      true
    );
    this.majorVersion = this.storageService.get(
      storageDrug.majorVersion,
      false
    );
    this.sections$ = this.dnbService
      .getAggregator(approvedVersion.versionId)
      .pipe(
        map((section) => {
          const sectionUI = section.map((sectionOne) => {
            return versionInformation(sectionOne, true);
          });

          const result = sectionUI.map((section, index) => {
            let headersUIWidth = getVersionColumnData(
              "",
              section,
              false,
              this.storageService
            );
            const grouped =
              groupedSections.findIndex(
                (searchSection) => section.section.code === searchSection
              ) > -1;
            return {
              id: convertSectionNameToID(section.section.name),
              current: createCurrentPlaceholder(section, grouped),
              new: {
                ...sectionUI[index],
                headersUIWidth,
              },
              hasRowHeading: false,
              grouped,
            };
          });
          this.sections = result;
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

  validIcdCodes(event) {
    if (this.validIcdCodeVersion) return;
    const version = this.storageService.get(
      storageDrug.approvedDrugVersion,
      true
    );
    let dataVersion = {
      versionStatus: {
        code: version.versionStatus,
        description: version.versionStatusDescription,
      },
    };
    if (validateVersionDrug(this.sections).length > 0) {
      this.toastService.messageWarning(
        "Warning!",
        `The Version for ${
          getDrugVersionId(dataVersion) === undefined
            ? version.versionStatusDescription
            : getDrugVersionId(dataVersion)
        } ${this.storageService.get(
          storageDrug.drugDate,
          false
        )} Drug is not compatible with the ICD-10 Manual sorting. `,
        6000,
        true
      );
      this.validIcdCodeVersion = !this.validIcdCodeVersion;
    } else {
      if (event.codesInvalid.length > 0) {
        this.toastService.messageWarning(
          "Warning!",
          `The next Code(s) in the ICD-10 Manual for ${
            getDrugVersionId(dataVersion) === undefined
              ? version.versionStatusDescription
              : getDrugVersionId(dataVersion)
          } ${this.storageService
            .get(storageDrug.drugDate, false)
            .substr(6, 4)} were not found to sort it: ` +
            event.codesInvalid.join(", ") +
            ` in the ` +
            event.sectionCode +
            ".",
          6000,
          true
        );
      }
    }
  }
}
