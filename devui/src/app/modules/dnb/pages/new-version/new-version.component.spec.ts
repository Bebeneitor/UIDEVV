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
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { ListboxModule } from "primeng/listbox";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { of } from "rxjs/internal/observable/of";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
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
import { SectionsStickyComponent } from "../../shared/sections-sticky/sections-sticky.component";
import { NewVersionComponent } from "./new-version.component";

const mockGetDrugLastVersion = {
  drugVersionCode: "1",
};

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

@Component({ selector: "dnb-app-dialog", template: "" })
class DialogStubComponent {
  @Input() openDialog: boolean;
  @Input() setUpDialog: {
    header: string;
    container: [];
    buttonCancel: boolean;
    valueDefault: string;
  };
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

@Component({ selector: "app-find", template: "" })
class FindReplaceStubComponent {
  @Input() sections: UISection[] = null;
  @Input() showFindAndReplace: boolean = false;
  @Input() showButtonReplace: boolean = true;
  @Input() drugNameColumn: Column = null;
  @Input() shouldShowCurrent: boolean = true;
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

fdescribe("NewVersionComponent", () => {
  let component: NewVersionComponent;
  let fixture: ComponentFixture<NewVersionComponent>;
  let storageService: StorageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewVersionComponent,
        SectionNavigationStubComponent,
        SectionsContainerStubComponent,
        GroupedSectionsContainerStubComponent,
        SectionsStickyComponent,
        CellEditorStubComponent,
        FindReplaceStubComponent,
        DialogStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        InputSwitchModule,
        FormsModule,
        ConfirmDialogModule,
        OverlayPanelModule,
        ListboxModule,
        RouterTestingModule,
      ],
      providers: [
        DnbService,
        ConfirmationService,
        MessageService,
        ToastMessageService,
        StorageService,
        LoadingSpinnerService,
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (dnbService: DnbService) => {
    spyOn(dnbService, "getDrugLastVersion").and.returnValue(
      of(mockGetDrugLastVersion)
    );
    spyOn(dnbService, "getAggregator").and.returnValues(
      of(mockGetAggregator),
      of(mockGetAggregator2)
    );

    fixture = TestBed.createComponent(NewVersionComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(StorageService);
    storageService.set(
      storageDrug.drugVersion,
      { versionStatus: "DRAFT", versionId: "empty" },
      true
    );
    storageService.set(
      storageDrug.approvedDrugVersion,
      { versionStatus: "AP", versionId: "empty" },
      true
    );

    fixture.detectChanges();
  }));

  it("should create new-version", () => {
    expect(component).toBeTruthy();
  });

  it("should add a sticky section", () => {
    const section: Section = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "test",
        name: "test",
      },
      headers: [],
      rows: [],
    };
    component.stickySection(section);
    expect(component.stickySections.length).toBe(1);
  });

  it("should remove sticky section", () => {
    const section: Section = {
      drugVersionCode: "test",
      id: "test",
      section: {
        code: "test",
        name: "test",
      },
      headers: [],
      rows: [],
    };
    component.stickySections = [section];
    component.stickySection(section);
    expect(component.stickySections.length).toBe(0);
  });

  it("should re order navigation items after drag and drop", () => {
    component.startDragItemIndex = 1;
    const UIelement = {
      item: {
        index: () => 0,
      },
    };
    expect(component.navigationItems[0].name).toBe("General Information");
    expect(component.navigationItems[1].name).toBe("References");
    component.sortNavigationItems({}, UIelement);
    expect(component.navigationItems[0].name).toBe("References");
    expect(component.navigationItems[1].name).toBe("General Information");
  });

  it("should copy selected sections", () => {
    expect(
      (component.sections[0].current as Section).rows[0].columns[2].value
    ).not.toBe((component.sections[0].new as Section).rows[0].columns[0].value);
    expect(
      (component.sections[1].current as Section).rows[0].columns[2].value
    ).not.toBe((component.sections[1].new as Section).rows[0].columns[0].value);
    expect(
      (component.sections[2].current as GroupedSection).groups[0].rows[0]
        .columns[2].value
    ).not.toBe(
      (component.sections[2].new as GroupedSection).groups[0].rows[0].columns[0]
        .value
    );
    component.selectedSections = [
      "references",
      "general_information",
      "combination_therapy",
    ];
    component.copyAll();
    setTimeout(() => {
      expect(
        (component.sections[0].current as Section).rows[0].columns[0].value
      ).toBe((component.sections[0].new as Section).rows[0].columns[0].value);
      expect(
        (component.sections[1].current as Section).rows[0].columns[0].value
      ).toBe((component.sections[1].new as Section).rows[0].columns[0].value);
      expect(
        (component.sections[2].current as GroupedSection).groups[0].rows[0]
          .columns[0].value
      ).toBe(
        (component.sections[2].new as GroupedSection).groups[0].rows[0]
          .columns[0].value
      );
    });
  });

  it("should undo copy selected sections after being copied", () => {
    expect(
      (component.sections[0].current as Section).rows[0].columns[2].value
    ).not.toBe((component.sections[0].new as Section).rows[0].columns[0].value);
    expect(
      (component.sections[1].current as Section).rows[0].columns[2].value
    ).not.toBe((component.sections[1].new as Section).rows[0].columns[0].value);
    expect(
      (component.sections[2].current as GroupedSection).groups[0].rows[0]
        .columns[2].value
    ).not.toBe(
      (component.sections[2].new as GroupedSection).groups[0].rows[0].columns[0]
        .value
    );
    component.selectedSections = [
      "references",
      "general_information",
      "combination_therapy",
    ];

    component.copyAll();
    setTimeout(() => {
      expect(
        (component.sections[0].current as Section).rows[0].columns[0].value
      ).toBe((component.sections[0].new as Section).rows[0].columns[0].value);
      expect(
        (component.sections[1].current as Section).rows[0].columns[0].value
      ).toBe((component.sections[1].new as Section).rows[0].columns[0].value);
      expect(
        (component.sections[2].current as GroupedSection).groups[0].rows[0]
          .columns[0].value
      ).toBe(
        (component.sections[2].new as GroupedSection).groups[0].rows[0]
          .columns[0].value
      );
    });
    component.undoCopyAll();
    setTimeout(() => {
      expect(
        (component.sections[0].current as Section).rows[0].columns[2].value
      ).not.toBe(
        (component.sections[0].new as Section).rows[0].columns[0].value
      );
      expect(
        (component.sections[1].current as Section).rows[0].columns[2].value
      ).not.toBe(
        (component.sections[1].new as Section).rows[0].columns[0].value
      );
      expect(
        (component.sections[2].current as GroupedSection).groups[0].rows[0]
          .columns[2].value
      ).not.toBe(
        (component.sections[2].new as GroupedSection).groups[0].rows[0]
          .columns[2].value
      );
    });
  });

  it("Should add collapse section", () => {
    const section: Section = {
      drugVersionCode: "",
      id: "general_information",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      codesColumn: { isReadOnly: false, value: "" },
      headers: [],
      rows: [],
    };
    component.toggleSectionCopy({ section: section, status: false });
    expect(component.notToCopySections.length).toBe(1);
  });

  it("Should remove collapse section", () => {
    const section: Section = {
      drugVersionCode: "",
      id: "general_information",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      codesColumn: { isReadOnly: false, value: "" },
      headers: [],
      rows: [],
    };
    const section2: Section = {
      drugVersionCode: "",
      id: "general_information",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      codesColumn: { isReadOnly: false, value: "" },
      headers: [],
      rows: [],
    };

    component.toggleSectionCopy({ section: section, status: false });
    component.toggleSectionCopy({ section: section2, status: true });
    expect(component.notToCopySections.length).toBe(0);
  });

  it("should clear all sections", () => {
    (component.sections[0].new as Section).rows[0].columns[0].value = "test";
    (component.sections[0].new as Section).rows[0].columns[1].value = "test";
    component.clearAll();
    setTimeout(() => {
      expect(
        (component.sections[0].new as Section).rows[0].columns[0].value
      ).toBe("[HCPCS] (Descriptor)\n");
      expect(
        (component.sections[0].new as Section).rows[0].columns[1].value
      ).toBe("\n");
    });
  });

  it("should call save", inject([DnbService], (dnbService: DnbService) => {
    spyOn(dnbService, "getNewDrugVersion").and.returnValue(of("1"));
    const spyAggSectionsSave = spyOn(
      dnbService,
      "postAggregatorSection"
    ).and.returnValue(of("1"));
    const spyCommit = spyOn(dnbService, "postCommitSection").and.returnValue(
      of("1")
    );

    component.saveData();
    const generalInfoAPI = spyAggSectionsSave.calls.all()[0].args[0].section;
    const referencesAPI = spyAggSectionsSave.calls.all()[1].args[0].section;
    const combinationTAPI = spyAggSectionsSave.calls.all()[2].args[0].section;
    expect(generalInfoAPI).toEqual(component.sections[0].current.section);
    expect(referencesAPI).toEqual(component.sections[1].current.section);
    expect(combinationTAPI).toEqual(component.sections[2].current.section);
    expect(spyCommit).toHaveBeenCalled();
  }));
});

fdescribe("NewVersionComponent", () => {
  let component: NewVersionComponent;
  let fixture: ComponentFixture<NewVersionComponent>;
  let storageService: StorageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewVersionComponent,
        SectionNavigationStubComponent,
        SectionsContainerStubComponent,
        GroupedSectionsContainerStubComponent,
        SectionsStickyComponent,
        CellEditorStubComponent,
        FindReplaceStubComponent,
        DialogStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        InputSwitchModule,
        FormsModule,
        ConfirmDialogModule,
        OverlayPanelModule,
        ListboxModule,
        RouterTestingModule,
      ],
      providers: [
        DnbService,
        ConfirmationService,
        MessageService,
        ToastMessageService,
        StorageService,
        LoadingSpinnerService,
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (DnbService: DnbService) => {
    (mockGetAggregator2[1] as ReferencesTemplateResponse).data[0].referenceDetails =
      "test value";

    spyOn(DnbService, "getDrugLastVersion").and.returnValue(
      of(mockGetDrugLastVersion)
    );
    spyOn(DnbService, "getAggregator").and.returnValues(
      of(mockGetAggregator),
      of(mockGetAggregator2)
    );

    fixture = TestBed.createComponent(NewVersionComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(StorageService);
    storageService.set(
      storageDrug.drugVersion,
      { versionStatus: "DRAFT", versionId: "1" },
      true
    );
    storageService.set(
      storageDrug.approvedDrugVersion,
      { versionStatus: "AP", versionId: "1" },
      true
    );

    fixture.detectChanges();
  }));

  it("should build editable sections from api", () => {
    const references = component.sections[1].new as Section;
    expect(references.rows[0].columns[1].value).toContain(
      (mockGetAggregator2[1] as ReferencesTemplateResponse).data[0]
        .referenceDetails
    );
  });
});
