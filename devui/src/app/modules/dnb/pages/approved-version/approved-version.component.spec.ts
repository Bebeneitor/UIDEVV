import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { OktaAuthService, OKTA_CONFIG } from "@okta/okta-angular";
import { MessageService } from "primeng/api";
import { InputSwitchModule } from "primeng/inputswitch";
import { of } from "rxjs";
import { StorageService } from "src/app/services/storage.service";
import { SectionPosition } from "../../models/constants/actions.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageDrug } from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import {
  CombinationTherapyResponse,
  GeneralInformationTemplateResponse,
  ReferencesTemplateResponse,
} from "../../models/interfaces/section";
import {
  Column,
  GroupedSection,
  SearchData,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import { DnbService } from "../../services/dnb.service";
import { ApprovedVersionComponent } from "./approved-version.component";

const referenceResponse: ReferencesTemplateResponse = {
  drugVersionCode: "58714459-c73a-4240-9847-ea358f9f0b5e",
  section: {
    code: SectionCode.References,
    name: "References",
  },
  data: [
    {
      referenceSourceDto: {
        code: "",
        name: "Drug Label",
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
          feedbackItemsList: [],
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "Clinical Pharmacology",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          referenceSourceDto: {
            code: "CP1",
            name: "Clinical Pharmacology",
          },
          referenceDetails: "Clinical Pharmacology, docetaxel, January 2019",
          feedbackItemsList: [],
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "Micromedex DrugDex",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          referenceSourceDto: {
            code: "DD1",
            name: "Micromedex DrugDex",
          },
          referenceDetails: "Micromedex DrugDex, docetaxel, May 2019",
          feedbackItemsList: [],
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "NCCN",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          referenceSourceDto: {
            code: "NCCN1",
            name: "NCCN",
          },
          referenceDetails: "NCCN, docetaxel, May 2019",
          feedbackItemsList: [],
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "Lexi-Drugs",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          referenceSourceDto: {
            code: "LEXI1",
            name: "Lexi-Drugs",
          },
          referenceDetails:
            "Lexi-Drugs, docetaxel, May 2019Drug Label, Docetaxel, (docetaxel injection, solution, concentrate), May 2019",
          feedbackItemsList: [],
        },
      ],
    },
    {
      referenceSourceDto: {
        code: "",
        name: "AHFS-DI",
      },
      data: [
        {
          code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
          comments: [],
          referenceSourceDto: {
            code: "AHFS1",
            name: "AHFS-DI",
          },
          referenceDetails: "Lexi-Drugs, docetaxel, May 2019",
          feedbackItemsList: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};
const generalInformationResponse: GeneralInformationTemplateResponse = {
  drugVersionCode: "d73cdb40-c206-4109-97d5-0aa7bb631eb8",
  section: {
    code: SectionCode.GeneralInformation,
    name: "General Information",
  },
  data: [
    {
      item: {
        code: "bcda8e19-9629-46e3-a193-1fc542e46d62",
        name: "[HCPCS] (Descriptor)",
      },
      data: [
        {
          code: "111f6444-ce58-4b5b-b3d8-8285bb42e093",
          itemDetails: "9171 (Injection, docetaxel, 1 mg)",
          comments: ["Comment 01", "Comment 02", "Comment 03"],
          order: 0,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },
    {
      item: {
        code: "e06dce9e-d5cc-4480-ad1c-5739fe33e72d",
        name: "Administration codes",
      },
      data: [
        {
          code: "c2a34103-db76-4e48-b392-7c5529bf0ce0",
          itemDetails: "96413, 96415, 96417",
          comments: ["Comment 01", "Comment 02", "Comment 03"],
          order: 1,
          feedbackItemsList: [],
          documentNoteList: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
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
          feedbackItemsList: [],
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
          feedbackItemsList: [],
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

const mockGetAggregator = [
  generalInformationResponse,
  referenceResponse,
  combinationTherapyResponse,
];

// #region stubs
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
  @Input() sectionIndex: string;
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
  @Input() sectionIndex: string;
  @Input() isComparing: boolean;
  @Input() showCurrent: boolean;
  @Input() enableEditing: boolean;
}

@Component({ selector: "app-cell-editor", template: "" })
class CellEditorStubComponent {
  @Input() column: Column = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() sectionPosition: SectionPosition = null;
  @Input() highLight: number = null;
  @Input() isReadOnly = false;
  @Input() negativeDiff: any;

  getDifferences() {}
}
@Component({ selector: "app-dnb-breadcrumb", template: "" })
class DnBBreadCrumbStubComponent {}

// #endregion
fdescribe("ApprovedVersionComponent", () => {
  let component: ApprovedVersionComponent;
  let fixture: ComponentFixture<ApprovedVersionComponent>;
  let storageService: StorageService;
  let sections;
  const oktaConfig = {
    issuer: "https://{yourOktaDomain}/oauth2/default",
    clientId: "{clientId}",
    redirectUri: window.location.origin + "/login/callback",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApprovedVersionComponent,
        GroupedSectionsContainerStubComponent,
        SectionsContainerStubComponent,
        SectionNavigationStubComponent,
        CellEditorStubComponent,
        FindReplaceStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        InputSwitchModule,
        FormsModule,
      ],
      providers: [
        DnbService,
        StorageService,
        MessageService,
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (DnbService: DnbService) => {
    spyOn(DnbService, "getAggregator").and.returnValue(of(mockGetAggregator));
    fixture = TestBed.createComponent(ApprovedVersionComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(StorageService);
    storageService.set(
      storageDrug.approvedDrugVersion,
      { versionStatus: "AP", versionId: "1" },
      true
    );
    storageService.set(storageDrug.majorVersion, "1", false);
    fixture.detectChanges();
    component.sections$.subscribe((sectionsResponse) => {
      sections = sectionsResponse;
    });
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create 3 sections witn new section filled and current section empty", () => {
    const generalInformation = component.sections[0];
    const references = component.sections[1];
    const combinationTherapy = component.sections[2];
    expect(component.sections.length).toBe(3);
    expect((generalInformation.current as GroupedSection).groups.length).toBe(
      0
    );
    expect((generalInformation.new as GroupedSection).groups.length).toBe(
      generalInformationResponse.data.length
    );
    expect((references.current as GroupedSection).groups.length).toBe(0);
    expect((references.new as GroupedSection).groups.length).toBe(
      referenceResponse.data.length
    );
    expect((combinationTherapy.current as GroupedSection).groups.length).toBe(
      0
    );
    expect((combinationTherapy.new as GroupedSection).groups.length).toBe(
      combinationTherapyResponse.data.length
    );
  });

  it("should valid icd codes", () => {
    storageService.set(
      storageDrug.drugDate,
      "01/25/2021 09:18:22 PM UTC",
      false
    );
    let dataSection = {
      codesInvalid: ["C23, C45"],
      sectionCode: "Diagnosis Code",
    };
    expect(component.validIcdCodes(dataSection)).toBeUndefined();
  });
});
