import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { OktaAuthService, OKTA_CONFIG } from "@okta/okta-angular";
import { NgxPermissionsModule } from "ngx-permissions";
import { ConfirmationService, MessageService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { ListboxModule } from "primeng/listbox";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { of } from "rxjs/internal/observable/of";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { SectionPosition } from "../../models/constants/actions.constants";
import { arrowNavigation } from "../../models/constants/behaviors.constants";
import { columnPopulate } from "../../models/constants/sectionAutopopulation.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import {
  storageDrug,
  storageGeneral,
} from "../../models/constants/storage.constants";
import { NavigationItem } from "../../models/interfaces/navigation";
import {
  CombinationTherapyResponse,
  DiagnosisCodesTemplateResponse,
  GeneralInformationTemplateResponse,
  GlobalReviewCodesResponse,
  ReferencesTemplateResponse,
} from "../../models/interfaces/section";
import {
  Column,
  FeedBackData,
  GroupedSection,
  Row,
  SearchData,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbService } from "../../services/dnb.service";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import { SectionsStickyComponent } from "../../shared/sections-sticky/sections-sticky.component";
import { DnBDirectivesModule } from "../../utils/directives/dnb-directives.module";
import { NewVersionComponent } from "./new-version.component";

const mockGetDrugLastVersion = {
  drugVersionCode: "1",
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

const diagnosisCodeResponse: DiagnosisCodesTemplateResponse = {
  drugVersionCode: "d73cdb40-c206-4109-97d5-0aa7bb631eb8",
  section: {
    code: SectionCode.DiagnosisCodes,
    name: "Diagnosis Code",
  },
  data: [
    {
      code: "111f6444-ce58-4b5b-b3d8-8285bb42e093",
      comments: [],
      feedbackItemsList: [],
      documentNoteList: [],
      indication: "",
      nccnIcdsCodes: [
        {
          icd10CodeId: 0,
          icd10Code: "",
          description: "",
        },
      ],
      nccnIcdsCodesInvalid: [
        {
          icd10CodeId: 0,
          icd10Code: "",
          description: "",
        },
      ],
      lcdIcdsCodes: [
        {
          icd10CodeId: 0,
          icd10Code: "",
          description: "",
        },
      ],
      lcdIcdsCodesInvalid: [
        {
          icd10CodeId: 0,
          icd10Code: "",
          description: "",
        },
      ],
    },
  ],
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
    warningMessagesList: [],
  },
};

const globalReviewResponse: GlobalReviewCodesResponse = {
  drugVersionCode: "d73cdb40-c206-4109-97d5-0aa7bb631eb8",
  section: {
    code: SectionCode.GlobalReviewCodes,
    name: "Global Review Codes",
  },
  data: [
    {
      code: "111f6444-ce58-4b5b-b3d8-8285bb42e093",
      comments: [],
      feedbackItemsList: [],
      documentNoteList: [],
      currentIcd10CodeRange: {
        icd10CodeId: 0,
        icd10Code: "test",
      },
      globalReviewIcd10Code: {
        icd10CodeId: 0,
        icd10Code: "test",
      },
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
  uiDecorator: {
    sectionActive: true,
    sectionComplete: false,
    deletedRowFeedbackItemList: [],
  },
};

const referencesResponse: ReferencesTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.References,
    name: "References",
  },
  data: [
    {
      referenceSourceDto: {
        code: "",
        name: "References",
      },
      data: [
        {
          code: "test",
          comments: [],
          referenceSourceDto: {
            code: "test",
            name: "test",
          },
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
  combinationTherapyResponse,
  diagnosisCodeResponse,
  globalReviewResponse,
  referencesResponse,
];

const mockGetAggregator2 = [
  generalInformationResponse,
  combinationTherapyResponse,
  diagnosisCodeResponse,
  globalReviewResponse,
  referencesResponse,
];

@Component({ selector: "app-dnb-upload-ingestion", template: "" })
class UploadStubComponent {
  @Input() editable: boolean = false;
  @Input() isNew: boolean = false;
  @Input() drugName: string = "";
  @Input() drugCode: string = "";
}

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
  @Input() sectionIndex: string;
  @Input() isComparing: boolean;
  @Input() isApproverReviewing: boolean;
  @Input() feedbackComplete: boolean;
  @Input() hasRowHeading: boolean;
  @Input() showCurrent: boolean;
  @Input() enableEditing: boolean;
  @Input() focusType: boolean;
  @Input() showEllOpts: boolean;
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
  @Input() sectionIndex: string;
  @Input() isComparing: boolean;
  @Input() isApproverReviewing: boolean;
  @Input() feedbackComplete: boolean;
  @Input() showCurrent: boolean;
  @Input() enableEditing: boolean;
  @Input() focusType: boolean;
}

@Component({ selector: "app-cell-editor", template: "" })
class CellEditorStubComponent {
  @Input() column: Column = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() highLight: number = null;
  @Input() isReadOnly = false;
  @Input() sectionPosition: SectionPosition = null;
  @Input() negativeDiff: any;
  @Input() focus: any;

  getDifferences() {}
}

const mockLCDResponse = {
  data: { lstValidIcd10Codes: ["10"], lstInvalidIcd10Codes: ["10"] },
};

@Component({ selector: "app-dnb-breadcrumb", template: "" })
class DnBBreadCrumbStubComponent {}

fdescribe("NewVersionComponent", () => {
  let component: NewVersionComponent;
  let fixture: ComponentFixture<NewVersionComponent>;
  let storageService: StorageService;
  let confirmationService: ConfirmationService;
  let toastService: ToastMessageService;
  let undoRedo: DnbUndoRedoService;
  let router: Router;
  const feedback: FeedBackData = {
    itemId: 0,
    sectionRowUuid: "1",
    feedback: "test",
    sourceText: "tania",
    beginIndex: 0,
    endIndex: 5,
    uiColumnAttribute: "header 1",
    uiSectionCode: "test",
    createdBy: "test",
    createdById: 0,
    createdOn: "test",
    isSectionFeedback: false,
    resolved: false,
  };
  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };
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
        UploadStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        InputSwitchModule,
        FormsModule,
        ConfirmDialogModule,
        OverlayPanelModule,
        ListboxModule,
        RouterTestingModule,
        DnBDirectivesModule,
        CheckboxModule,
        NgxPermissionsModule.forRoot(),
      ],
      providers: [
        DnbService,
        ConfirmationService,
        MessageService,
        ToastMessageService,
        StorageService,
        LoadingSpinnerService,
        DnbRoleAuthService,
        OktaAuthService,
        DnbRoleAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (dnbService: DnbService) => {
    spyOn(dnbService, "getDrugLastVersion").and.returnValue(
      of(mockGetDrugLastVersion)
    );
    spyOn(dnbService, "listAutopopulateIcd10Code").and.returnValue(
      of(mockLCDResponse)
    );
    spyOn(dnbService, "postApproveSection").and.returnValue(of({}));
    spyOn(dnbService, "getAggregator").and.returnValues(
      of(mockGetAggregator2),
      of(mockGetAggregator)
    );
    fixture = TestBed.createComponent(NewVersionComponent);
    fixture.componentInstance.isAutosavingActive = () => {};
    confirmationService = TestBed.get(ConfirmationService);
    toastService = TestBed.get(ToastMessageService);
    component = fixture.componentInstance;
    storageService = TestBed.get(StorageService);

    const dnbPermissions = {
      userId: 1,
      authorities: [
        "ROLE_DNBADMIN",
        "ROLE_CPEA",
        "ROLE_CVPE",
        "ROLE_EBR",
        "ROLE_DNBA",
        "ROLE_DNBE",
        "ROLE_PO",
        "ROLE_CVPA",
        "ROLE_MD",
        "ROLE_TA",
        "ROLE_CVPAP",
        "ROLE_OTH",
        "ROLE_BSC",
        "ROLE_EA",
        "ROLE_CCA",
        "ROLE_CVPU",
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
      actions: [
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
    };

    storageService.set(storageGeneral.dnbPermissions, dnbPermissions, true);
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
    component.version = { versionStatus: "IP", versionId: "123" };
    storageService.set(
      storageDrug.newVersionEditingMode,
      {
        editingMode: true,
        showButtons: true,
      },
      true
    );
    component.drugCode = "";
    router = TestBed.get(Router);
    fixture.detectChanges();
    undoRedo = TestBed.get(DnbUndoRedoService);
    component.sections$.subscribe((sectionsResponse) => {
      undoRedo.sections = sectionsResponse;
    });
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
      headersUIWidth: [],
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
      headersUIWidth: [],
      rows: [],
    };
    component.stickySections = [section];
    component.stickySection(section);
    expect(component.stickySections.length).toBe(0);
  });

  it("should re order navigation items after drag and drop", async (done) => {
    component.startDragItemIndex = 1;
    const UIelement = {
      item: {
        index: () => 0,
      },
    };
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.navigationItems[0].name).toBe("General Information");
    expect(component.navigationItems[1].name).toBe("Combination Therapy");
    component.sortNavigationItems({}, UIelement);
    expect(component.navigationItems[0].name).toBe("Combination Therapy");
    expect(component.navigationItems[1].name).toBe("General Information");
    done();
  });

  it("should copy selected sections", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.validIcdCodeVersion = true;
    component.onCurrentChange();
    await fixture.whenStable();
    component.selectedSections = ["general_information", "combination_therapy"];
    component.copyAll();
    await fixture.whenStable();
    console.log(undoRedo.sections);
    setTimeout(() => {
      expect(
        (undoRedo.sections[1].new as GroupedSection).groups[0].names.length
      ).toBe(1);
      done();
    });
  });

  it("Should add collapse section", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const section: Section = {
      drugVersionCode: "",
      id: "general_information",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      codesColumn: {
        isReadOnly: false,
        value: "",
        feedbackData: [],
        feedbackLeft: 0,
      },
      headers: [],
      headersUIWidth: [],
      rows: [],
    };
    component.toggleSectionCopy({ section: section, status: false });
    expect(component.notToCopySections.length).toBe(1);
  });

  it("Should remove collapse section", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const section: Section = {
      drugVersionCode: "",
      id: "general_information",
      section: {
        code: "",
        name: "",
      },
      codes: [],
      codesColumn: {
        isReadOnly: false,
        value: "",
        feedbackData: [],
        feedbackLeft: 0,
      },
      headers: [],
      headersUIWidth: [],
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
      codesColumn: {
        isReadOnly: false,
        value: "",
        feedbackData: [],
        feedbackLeft: 0,
      },
      headers: [],
      headersUIWidth: [],
      rows: [],
    };

    component.toggleSectionCopy({ section: section, status: false });
    component.toggleSectionCopy({ section: section2, status: true });
    expect(component.notToCopySections.length).toBe(0);
  });

  it("should clear all sections", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].value = "test";
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[1].value = "test";
    component.clearAll();
    setTimeout(() => {
      expect(
        (undoRedo.sections[0].new as GroupedSection).groups[0].names[0].value
      ).toBe("[HCPCS] (Descriptor)\n");
      expect(
        (undoRedo.sections[0].new as GroupedSection).groups[0].rows[0]
          .columns[0].value
      ).toBe("\n");
      done();
    });
  });

  it("should call save", inject(
    [DnbService],
    async (dnbService: DnbService) => {
      await fixture.whenStable();
      fixture.detectChanges();
      spyOn(dnbService, "getNewDrugVersion").and.returnValue(of("1"));
      const spyAggSectionsSave = spyOn(
        dnbService,
        "postAggregatorSection"
      ).and.returnValue(of("1"));
      const spyCommit = spyOn(dnbService, "postSaveSection").and.returnValue(
        of("1")
      );
      component.saveData();
      const generalInfoAPI = spyAggSectionsSave.calls.all()[0].args[0].section;
      const combinationTAPI = spyAggSectionsSave.calls.all()[1].args[0].section;
      expect(generalInfoAPI).toEqual(undoRedo.sections[0].current.section);
      expect(combinationTAPI).toEqual(undoRedo.sections[1].current.section);
      expect(spyCommit).toHaveBeenCalled();
    }
  ));

  it("should submit new drug", inject(
    [DnbService],
    async (dnbService: DnbService) => {
      await fixture.whenStable();
      fixture.detectChanges();
      spyOn(dnbService, "createNewDrug").and.returnValue(of({ code: 1 }));
      spyOn(dnbService, "getNewDrugVersion").and.returnValue(of("1"));
      spyOn(dnbService, "postSubmitForReview").and.returnValue(of("1"));
      const spyAggSectionsSave = spyOn(
        dnbService,
        "postAggregatorSection"
      ).and.returnValue(of("1"));
      const spyCommit = spyOn(dnbService, "postSaveSection").and.returnValue(
        of("1")
      );
      component.submitData();
      const generalInfoAPI = spyAggSectionsSave.calls.all()[0].args[0].section;
      const combinationTAPI = spyAggSectionsSave.calls.all()[1].args[0].section;
      expect(generalInfoAPI).toEqual(undoRedo.sections[0].current.section);
      expect(combinationTAPI).toEqual(undoRedo.sections[1].current.section);
      expect(spyCommit).toHaveBeenCalled();
    }
  ));

  it("should submit new drug from approver", inject(
    [DnbService],
    async (dnbService: DnbService) => {
      await fixture.whenStable();
      fixture.detectChanges();
      spyOn(dnbService, "createNewDrug").and.returnValue(of({ code: 1 }));
      spyOn(dnbService, "getNewDrugVersion").and.returnValue(of("1"));
      spyOn(dnbService, "postSubmitForReview").and.returnValue(of("1"));
      const spyAggSectionsSave = spyOn(
        dnbService,
        "postAggregatorSection"
      ).and.returnValue(of("1"));
      const spyCommit = spyOn(dnbService, "postSaveSection").and.returnValue(
        of("1")
      );
      component.approveData("E", true);
      const generalInfoAPI = spyAggSectionsSave.calls.all()[0].args[0].section;
      const combinationTAPI = spyAggSectionsSave.calls.all()[1].args[0].section;
      expect(generalInfoAPI).toEqual(undoRedo.sections[0].current.section);
      expect(combinationTAPI).toEqual(undoRedo.sections[1].current.section);
      expect(spyCommit).toHaveBeenCalled();
    }
  ));

  it("should navigate to sections", async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const focusTypeDown = { type: arrowNavigation.down, isTabAction: true };
    const focusTypeUp = { type: arrowNavigation.up, isTabAction: true };

    component.sectionNavigateEvt(focusTypeDown, 0);
    expect(undoRedo.sections[1].new.focusType).toEqual(focusTypeDown);
    component.sectionNavigateEvt(focusTypeUp, 1);
    expect(undoRedo.sections[0].new.focusType).toEqual(focusTypeUp);
  });

  it("should update feedback in navigation", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.feedbackUpdate(1, 0);
    expect(component.navigationItems[0].feedbackLeft).toBe(1);
  });

  it("should update feedback in navigation", inject(
    [DnbService],
    async (dnbService: DnbService) => {
      storageService.set(
        storageDrug.drugVersion,
        { versionStatus: "IP", versionId: "1" },
        true
      );
      spyOn(dnbService, "verifyFeedback").and.returnValue(of({}));
      await fixture.whenStable();
      fixture.detectChanges();
      component.addMoreFeedback();
      expect((undoRedo.sections[0].new as Section).feedbackLeft).toBe(0);
    }
  ));

  it("should update sections with new ingestion data", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.getIngestedContent("1");
    expect(
      (undoRedo.sections[0].new as GroupedSection).groups[0].rows[0].columns[0]
        .value
    ).toContain(generalInformationResponse.data[0].data[0].itemDetails);
  });

  it("should mark all as completed", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.markUnmarkSections(true);
    expect((undoRedo.sections[0].new as GroupedSection).completed).toBe(false);
  });

  it("should unmark all as completed", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.markUnmarkSections(false);
    expect((undoRedo.sections[0].new as GroupedSection).completed).toBe(false);
  });

  it("should display confirm service", async () => {
    const spy = spyOn(confirmationService, "confirm");
    await fixture.whenStable();
    fixture.detectChanges();
    component.confirmSaveData();
    component.confirmClearAll();
    component.confirmReturnData();
    component.submitReviewButton("E");
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("should validate data and notify complete all ", async () => {
    const spy = spyOn(confirmationService, "confirm");
    await fixture.whenStable();
    fixture.detectChanges();
    component.validateAllSectionCompleted();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should ask to submit data is valid ", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.markUnmarkSections(true);
    component.validateAllSectionCompleted();
    expect(component.openDialog).toBe(false);
  });

  it("should validate feedbacks for approver", async () => {
    const spy = spyOn(confirmationService, "confirm");
    await fixture.whenStable();
    fixture.detectChanges();
    component.isApproverReviewing = true;
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].feedbackData = [feedback];
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].feedbackLeft = 1;
    component.validateFeedback();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should validate feedbacks", async () => {
    const spy = spyOn(toastService, "messageError");
    await fixture.whenStable();
    fixture.detectChanges();
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].feedbackData = [feedback];
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].feedbackLeft = 1;
    component.validateFeedback();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should validate feedbacks", async () => {
    const spy = spyOn(confirmationService, "confirm");
    await fixture.whenStable();
    fixture.detectChanges();
    feedback.resolved = true;
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].feedbackData = [feedback];
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].feedbackLeft = 1;
    component.validateFeedback();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should check autopo for diagnosis codes", async (done) => {
    const backUp: Row[] = [
      {
        hasBorder: false,
        code: "",
        columns: [
          {
            isReadOnly: true,
            value: "C21",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    await fixture.whenStable();
    fixture.detectChanges();
    const event = {
      activeSection: SectionCode.DiagnosisCodes,
      dataCopy: backUp,
      dataAdd: [],
      dataCopyGlobal: columnPopulate.GlobalReviewIndication,
      indicationOverride: [],
      indicationAdd: [],
      dataAddGlobal: [],
      dataDelete: [],
      dataDeleteGlobalReview: [],
      processAddIndication: false,
      processDeleteIndication: false,
      autopopulateGlobalReviewSection: false,
      autopupulateAllChildSections: true,
      duplicateDataParentSection: [],
      duplicateDataGlobalSection: [],
      considerSpaceInGlobalReviewSection: true,
    };
    component.dataPopulateSections(event);
    setTimeout(() => {
      expect(component.isCompleteAutopopulate).toBe(false);
      done();
    });
  });

  it("should check autopo for diagnosis codes summary", async (done) => {
    const backUp: Row[] = [
      {
        hasBorder: false,
        code: "",
        columns: [
          {
            isReadOnly: true,
            value: "C21",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    await fixture.whenStable();
    fixture.detectChanges();
    const event = {
      activeSection: SectionCode.DiagnosticCodeSummary,
      dataCopy: backUp,
      dataAdd: [],
      dataCopyGlobal: columnPopulate.GlobalReviewIndication,
      indicationOverride: [],
      indicationAdd: [],
      dataAddGlobal: [],
      dataDelete: [],
      dataDeleteGlobalReview: [],
      processAddIndication: false,
      processDeleteIndication: false,
      autopopulateGlobalReviewSection: false,
      autopupulateAllChildSections: true,
      duplicateDataParentSection: [],
      duplicateDataGlobalSection: [],
      considerSpaceInGlobalReviewSection: true,
    };
    component.dataPopulateSections(event);
    setTimeout(() => {
      expect(component.isCompleteAutopopulate).toBe(false);
      done();
    });
  });

  it("should check autopo for diagnosis codes summary", async (done) => {
    const backUp: Row[] = [
      {
        hasBorder: false,
        code: "",
        columns: [
          {
            isReadOnly: true,
            value: "C21",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    await fixture.whenStable();
    fixture.detectChanges();
    const event = {
      activeSection: SectionCode.DiagnosticCodeSummary,
      dataCopy: backUp,
      dataAdd: [],
      dataCopyGlobal: columnPopulate.GlobalReviewIndication,
      indicationOverride: [],
      indicationAdd: [],
      dataAddGlobal: [],
      dataDelete: [],
      dataDeleteGlobalReview: [],
      processAddIndication: false,
      processDeleteIndication: false,
      autopopulateGlobalReviewSection: false,
      autopupulateAllChildSections: true,
      duplicateDataParentSection: [],
      duplicateDataGlobalSection: [],
      considerSpaceInGlobalReviewSection: true,
    };
    component.dataPopulateSections(event);
    expect(component.isCompleteAutopopulate).toBe(false);
    done();
  });

  it("should get current data", async (done) => {
    const backUp: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "",
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "C21",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    const backUp2 = backUp.map((r) => {
      return {
        ...r,
        columns: r.columns.map((c) => {
          return { ...c, value: "CC" };
        }),
      };
    });
    await fixture.whenStable();
    fixture.detectChanges();
    (undoRedo.sections[3].current as Section).rows = backUp;
    (undoRedo.sections[3].new as Section).rows = backUp2;
    component.validIcdCodeVersion = true;
    component.getCurrentData(SectionCode.GlobalReviewCodes);
    fixture.detectChanges();
    await fixture.whenStable();
    component.getCurrentData(SectionCode.GlobalReviewCodes);
    expect(component.approvedDataFetched).toBe(true);
    done();
  });

  it("should get current data but finish since there is no data", async (done) => {
    const backUp: Row[] = [
      {
        hasBorder: false,
        columns: [
          {
            isReadOnly: true,
            value: "",
            feedbackData: [],
            feedbackLeft: 0,
          },
          {
            isReadOnly: true,
            value: "",
            feedbackData: [],
            feedbackLeft: 0,
          },
        ],
      },
    ];
    const backUp2 = backUp.map((r) => {
      return {
        ...r,
        columns: r.columns.map((c) => {
          return { ...c, value: "" };
        }),
      };
    });
    await fixture.whenStable();
    fixture.detectChanges();
    (undoRedo.sections[3].current as Section).rows = backUp;
    (undoRedo.sections[3].current as Section).rows[0].columns[0].value = "";
    (undoRedo.sections[3].new as Section).rows = backUp2;
    component.validIcdCodeVersion = true;
    component.getCurrentData(SectionCode.GlobalReviewCodes);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.approvedDataFetched).toBe(true);
    done();
  });

  it("should compare data", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.sectionsBackup = JSON.parse(JSON.stringify(undoRedo.sections));
    const result = component.comparigDataToAutosave();
    expect(result).toBe(true);
    done();
  });

  it("should undo sticky section", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.undoStickSection({ index: 1 });
    expect(component.stickySections.length).toBe(0);
    done();
  });

  it("should should return data", inject(
    [DnbService],
    async (dnbService: DnbService) => {
      const navigateSpy = spyOn(router, "navigate");
      spyOn(dnbService, "postReturnSection").and.returnValue(of({}));
      fixture.whenStable();
      fixture.detectChanges();
      component.returnData();
      expect(navigateSpy).toHaveBeenCalled();
    }
  ));

  it("should approve", inject([DnbService], async (dnbService: DnbService) => {
    const navigateSpy = spyOn(router, "navigate");
    spyOn(dnbService, "verifyFeedback").and.returnValue(of({}));
    spyOn(dnbService, "postApproveForApprover").and.returnValue(of({}));
    fixture.whenStable();
    fixture.detectChanges();
    component.approveForApprover(4);
    expect(navigateSpy).toHaveBeenCalled();
  }));

  it("should display sections", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.getDrugData(null);
    expect(undoRedo.sections.length).toBe(5);
    done();
  });

  it("should validate navigation", async (done) => {
    await fixture.whenStable();
    component.sectionsBackup = undoRedo.sections;
    fixture.detectChanges();
    component.canDeactivate();
    expect(undoRedo.sections.length).toBe(5);
    done();
  });

  it("should prevent navigation", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.preventRefresh({ returnValue: true });
    expect(undoRedo.sections.length).toBe(5);
    done();
  });

  it("should intercept paste", () => {
    let evt = {
      clipboardData: { getData: () => "<table><tr><td>test</td></tr></table>" },
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    const data = {
      colIndex: 0,
      rowIndex: 0,
      groupIndex: 0,
      isGroupHeader: false,
      sectionIndex: 0,
    };
    storageService.set(storageDrug.copySectionSource, data, true);
    component.interceptPaste(evt as any);
    expect(
      (undoRedo.sections[0].new as GroupedSection).groups[0].rows[0].columns[0]
        .value
    ).toBe("test");
  });

  it("should undo toggle", () => {
    component.allMarkSections(true);
    component.openSectionSelect({});
    component.toggleCompleted(true, 0);
    component.undo();
    component.toggleCompleted(true, 0);
    component.redo();
    component.onSwitchFullChange({ originalEvent: null, checked: true });
    component.onSwitchFullChange({ originalEvent: null, checked: false });
    component.onSwitchChange({ originalEvent: null, checked: true });
    component.onSwitchChange({ originalEvent: null, checked: false });
  });

  it("should undo redo paste", () => {
    let evt = {
      clipboardData: { getData: () => "<table><tr><td>test</td></tr></table>" },
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    const data = {
      colIndex: 0,
      rowIndex: 0,
      groupIndex: 0,
      isGroupHeader: false,
      sectionIndex: 0,
    };
    storageService.set(storageDrug.copySectionSource, data, true);
    component.interceptPaste(evt as any);
    component.undo();
    component.redo();
    expect(
      (undoRedo.sections[0].new as GroupedSection).groups[0].rows[0].columns[0]
        .value
    ).toBe("test");
  });
});

fdescribe("NewVersionComponent", () => {
  let component: NewVersionComponent;
  let fixture: ComponentFixture<NewVersionComponent>;
  let storageService: StorageService;
  let confirmationService: ConfirmationService;
  const oktaConfig = {
    issuer: "https://{yourOktaDomain}/oauth2/default",
    clientId: "{clientId}",
    redirectUri: window.location.origin + "/login/callback",
  };
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
        UploadStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        InputSwitchModule,
        FormsModule,
        ConfirmDialogModule,
        OverlayPanelModule,
        ListboxModule,
        RouterTestingModule,
        DnBDirectivesModule,
        CheckboxModule,
        NgxPermissionsModule.forRoot(),
      ],
      providers: [
        DnbService,
        ConfirmationService,
        MessageService,
        ToastMessageService,
        StorageService,
        LoadingSpinnerService,
        DnbRoleAuthService,
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (DnbService: DnbService) => {
    spyOn(DnbService, "getDrugLastVersion").and.returnValue(
      of(mockGetDrugLastVersion)
    );
    spyOn(DnbService, "getAggregator").and.returnValues(
      of(mockGetAggregator),
      of(mockGetAggregator2)
    );

    fixture = TestBed.createComponent(NewVersionComponent);
    component = fixture.componentInstance;
    confirmationService = TestBed.get(ConfirmationService);
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
    const dnbPermissions = {
      userId: 1,
      authorities: [
        "ROLE_DNBADMIN",
        "ROLE_CPEA",
        "ROLE_CVPE",
        "ROLE_EBR",
        "ROLE_DNBA",
        "ROLE_DNBE",
        "ROLE_PO",
        "ROLE_CVPA",
        "ROLE_MD",
        "ROLE_TA",
        "ROLE_CVPAP",
        "ROLE_OTH",
        "ROLE_BSC",
        "ROLE_EA",
        "ROLE_CCA",
        "ROLE_CVPU",
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
      actions: [
        "DNB_READ_MIDRULE_TEMPLATE",
        "DNB_REASSIGN_APPROVER",
        "DNB_EDIT_MIDRULE_TEMPLATE",
        "DNB_READ_DRDS",
        "DNB_EDIT_DRDS",
        "DNB_REVIEW_APPROVE_DRD",
        "DNB_LIST_DRUGS",
        "DNB_DOWNLOAD_DRAFT_DRD",
        "DNB_REASSIGN_EDITOR",
        "DNB_DOWNLOAD_APPROVED_DRD",
      ],
    };
    storageService.set(storageGeneral.dnbPermissions, dnbPermissions, true);
    component.drugCode = "";
    component.version = { versionStatus: "IP", versionId: "123" };

    fixture.detectChanges();
  }));

  it("should valid icd codes", () => {
    storageService.set(storageDrug.drugDate, "14/14/2020", false);
    let dataSection = {
      codesInvalid: ["C23", "C45"],
      sectionCode: "Diagnosis Code",
    };
    expect(component.validIcdCodes(dataSection)).toBeUndefined();
  });

  it("should valid icd codes", () => {
    storageService.set(storageDrug.drugDate, "14/14/2020", false);
    let dataSection = {
      codesInvalid: ["C23", "C45"],
      sectionCode: "Diagnosis Code",
    };
    expect(component.validIcdCodes(dataSection)).toBeUndefined();
  });
});
