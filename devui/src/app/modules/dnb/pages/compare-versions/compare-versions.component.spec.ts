import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { InputSwitchModule } from "primeng/inputswitch";
import { of } from "rxjs/internal/observable/of";
import { StorageService } from "src/app/services/storage.service";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageCompareCodes } from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import {
  CombinationTherapyResponse,
  GeneralInformationTemplateResponse,
  ReferencesTemplateResponse,
} from "../../models/interfaces/section";
import {
  Column,
  SearchData,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import { DnbService } from "../../services/dnb.service";
import { CompareVersionsComponent } from "./compare-versions.component";

const referenceResponse: ReferencesTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.References,
    name: "References",
  },
  data: [
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: ["Comment 1", "Comment 2"],
      referenceSourceDto: {
        code: "PI1",
        name: "Drug Label",
      },
      referenceDetails:
        "Drug Label, Docetaxel, (docetaxel injection, solution, concentrate), May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "CP1",
        name: "Clinical Pharmacology",
      },
      referenceDetails: "Clinical Pharmacology, docetaxel, January 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "DD1",
        name: "Micromedex DrugDex",
      },
      referenceDetails: "Micromedex DrugDex, docetaxel, May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "NCCN1",
        name: "NCCN",
      },
      referenceDetails: "NCCN, docetaxel, May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "LEXI1",
        name: "Lexi-Drugs",
      },
      referenceDetails:
        "Lexi-Drugs, docetaxel, May 2019Drug Label, Docetaxel, (docetaxel injection, solution, concentrate), May 2019",
    },
    {
      code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
      comments: [],
      referenceSourceDto: {
        code: "AHFS1",
        name: "AHFS-DI",
      },
      referenceDetails: "Lexi-Drugs, docetaxel, May 2019",
    },
  ],
};

const generalInformationResponse: GeneralInformationTemplateResponse = {
  drugVersionCode: "d73cdb40-c206-4109-97d5-0aa7bb631eb8",
  section: {
    code: SectionCode.GeneralInformation,
    name: "General Information",
  },
  data: [
    {
      code: "111f6444-ce58-4b5b-b3d8-8285bb42e093",
      comments: ["Comment 01", "Comment 02", "Comment 03"],
      item: {
        code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
        name: "[HCPCS] (Descriptor)",
      },
      itemDetails: "9171 (Injection, docetaxel, 1 mg)",
    },
    {
      code: "c2a34103-db76-4e48-b392-7c5529bf0ce0",
      comments: [],
      item: {
        code: "e06dce9e-d5cc-4480-ad1c-5739fe33e72d",
        name: "Administration codes",
      },
      itemDetails: "96413, 96415, 96417",
    },
  ],
};
const combinationTherapyResponse: CombinationTherapyResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.CombinationTherapy,
    name: "Combination Therapy",
  },
  data: [
    {
      indication: {
        code: "",
        label: "Occult primary",
      },
      data: [
        {
          code: "",
          comments: ["some comment"],
          combination: "Carboplatin/Cisplatin",
          codes: [
            {
              code: "J9045",
            },
            {
              code: "J0960",
            },
          ],
        },
        {
          code: "",
          comments: [""],
          combination: "Some Test Combination",
          codes: [
            {
              code: "J1234",
            },
          ],
        },
      ],
    },
  ],
};

const mockGetAggregator = [
  generalInformationResponse,
  referenceResponse,
  combinationTherapyResponse,
];

const mockGetAggregator2 = [
  generalInformationResponse,
  referenceResponse,
  combinationTherapyResponse,
];

@Component({ selector: "app-find", template: "" })
class FindReplaceStubComponent {
  @Input() sections: UISection[] = null;
  @Input() showFindAndReplace: boolean = false;
  @Input() showButtonReplace: boolean = true;
  @Input() drugNameColumn: Column = null;
  @Input() shouldShowCurrent: boolean = true;
}

@Component({ selector: "app-dnb-section-navigation", template: "" })
class SectionNavigationStubComponent {
  @Input() navigationItems: NavigationItem[];
  @Input() isFullScreen: boolean = false;
  @Input() isNavigationOpen: boolean = false;
}
@Component({ selector: "app-dnb-sections-container", template: "" })
class SectionsContainerStubComponent {
  @Input() currentVersion: Section;
  @Input() newVersion: Section;
  @Input() id: string;
  @Input() isComparing: boolean;
  @Input() hasRowHeading: boolean;
  @Input() showCurrent: boolean;
  @Input() enableEditing: boolean;
}

@Component({ selector: "app-dnb-grouped-sections-container", template: "" })
class GroupedSectionsContainerStubComponent {
  @Input() currentVersion: Section;
  @Input() newVersion: Section;
  @Input() id: string;
  @Input() isComparing: boolean;
  @Input() showCurrent: boolean;
  @Input() enableEditing: boolean;
}

@Component({ selector: "app-cell-editor", template: "" })
class CellEditorStubComponent {
  @Input() column: Column = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() highLight: number = null;
  @Input() isReadOnly = false;
  @Input() negativeDiff: any;

  getDifferences() {}
}

fdescribe("CompareVersionsComponent", () => {
  let component: CompareVersionsComponent;
  let fixture: ComponentFixture<CompareVersionsComponent>;
  let sections;
  let storageService: StorageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompareVersionsComponent,
        GroupedSectionsContainerStubComponent,
        SectionsContainerStubComponent,
        SectionNavigationStubComponent,
        CellEditorStubComponent,
        FindReplaceStubComponent,
      ],
      imports: [HttpClientTestingModule, InputSwitchModule, FormsModule],
      providers: [DnbService, StorageService],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (DnbService: DnbService) => {
    (mockGetAggregator2[1] as ReferencesTemplateResponse).data[0].referenceDetails =
      "test value";

    spyOn(DnbService, "getAggregator").and.returnValues(
      of(mockGetAggregator),
      of(mockGetAggregator2)
    );

    storageService = TestBed.get(StorageService);
    storageService.set(storageCompareCodes.drugVersionCompareIdOne, "1", false);
    storageService.set(
      storageCompareCodes.drugVersionCompareNameOne,
      "1",
      false
    );
    storageService.set(storageCompareCodes.drugVersionCompareIdTwo, "2", false);
    storageService.set(
      storageCompareCodes.drugVersionCompareNameTwo,
      "2",
      false
    );
    storageService.set(
      storageCompareCodes.drugVersionCompareStatusTwo,
      "AP",
      true
    );

    fixture = TestBed.createComponent(CompareVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.sections$.subscribe((sectionsResponse) => {
      sections = sectionsResponse;
    });
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should convert both version from API to UI", () => {
    expect(
      (sections[1].current as Section).rows[0].columns[0].value.trim()
    ).toEqual(
      (mockGetAggregator[1] as ReferencesTemplateResponse).data[0].referenceSourceDto.name.trim()
    );
    expect(
      (sections[1].new as Section).rows[0].columns[0].value.trim()
    ).toEqual(
      (mockGetAggregator2[1] as ReferencesTemplateResponse).data[0].referenceSourceDto.name.trim()
    );
  });
});
