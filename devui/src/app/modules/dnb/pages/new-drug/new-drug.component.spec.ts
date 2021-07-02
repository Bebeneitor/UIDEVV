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
import {
  OktaAuthModule,
  OktaAuthService,
  OKTA_CONFIG,
} from "@okta/okta-angular";
import { NgxPermissionsModule } from "ngx-permissions";
import { ConfirmationService, MessageService } from "primeng/api";
import { InputSwitchModule } from "primeng/inputswitch";
import {
  CheckboxModule,
  ConfirmDialogModule,
  OverlayPanelModule,
} from "primeng/primeng";
import { of } from "rxjs";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { SectionPosition } from "../../models/constants/actions.constants";
import { arrowNavigation } from "../../models/constants/behaviors.constants";
import { Messages } from "../../models/constants/messages.constants";
import { columnPopulate } from "../../models/constants/sectionAutopopulation.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import {
  storageDrug,
  storageGeneral,
} from "../../models/constants/storage.constants";
import { GeneralInformationTemplate } from "../../models/constants/templates.constant";
import { NavigationItem } from "../../models/interfaces/navigation";
import {
  AgeTemplateResponse,
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
import { NewDrugComponent } from "./new-drug.component";
// #region stubs

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

export const ageTemplateResponse: AgeTemplateResponse = {
  drugVersionCode: "",
  section: {
    code: SectionCode.Age,
    name: "Age",
  },
  data: [
    {
      indication: {
        code: "",
        label: "",
      },
      data: [
        {
          code: "",
          comments: [],

          age: "",
        },
        {
          code: "",
          comments: [],

          age: "",
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
  referencesResponse,
  combinationTherapyResponse,
  diagnosisCodeResponse,
  globalReviewResponse,
  ageTemplateResponse,
];

const mockGetAggregator2 = [
  generalInformationResponse,
  referencesResponse,
  combinationTherapyResponse,
  diagnosisCodeResponse,
  globalReviewResponse,
  ageTemplateResponse,
];

const mockGetAggregator3 = [
  generalInformationResponse,
  referencesResponse,
  combinationTherapyResponse,
  diagnosisCodeResponse,
  globalReviewResponse,
  ageTemplateResponse,
];

@Component({ selector: "app-dnb-upload-ingestion", template: "" })
class UploadStubComponent {
  @Input() editable: boolean = false;
  @Input() isNew: boolean = false;
  @Input() drugName: string = "";
  @Input() drugCode: string = "";
}
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
  @Input() isApproverReviewing: boolean;
  @Input() feedbackComplete: boolean;
  @Input() hasRowHeading: boolean;
  @Input() showCurrent: boolean;
  @Input() enableEditing: boolean;
  @Input() focusType: boolean;
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
  @Input() sectionPosition: SectionPosition = null;
  @Input() isReadOnly = false;
  @Input() negativeDiff: any;
  @Input() focus: any;

  getDifferences() {}
}
const mockLCDResponse = {
  data: { lstValidIcd10Codes: ["10"], lstInvalidIcd10Codes: ["10"] },
};

@Component({ selector: "app-dnb-breadcrumb", template: "" })
class DnBBreadCrumbStubComponent {}

// #endregion

fdescribe("NewDrugComponent", () => {
  let component: NewDrugComponent;
  let fixture: ComponentFixture<NewDrugComponent>;
  let storageService: StorageService;
  let confirmationService: ConfirmationService;
  let toastService: ToastMessageService;
  let router: Router;
  let undoRedo: DnbUndoRedoService;
  let sections;
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
        NewDrugComponent,
        GroupedSectionsContainerStubComponent,
        SectionsContainerStubComponent,
        SectionNavigationStubComponent,
        CellEditorStubComponent,
        FindReplaceStubComponent,
        SectionsStickyComponent,
        UploadStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        InputSwitchModule,
        FormsModule,
        ConfirmDialogModule,
        RouterTestingModule,
        CheckboxModule,
        NgxPermissionsModule.forRoot(),
        OverlayPanelModule,
        OktaAuthModule,
      ],
      providers: [
        DnbService,
        StorageService,
        ConfirmationService,
        LoadingSpinnerService,
        DnbUndoRedoService,
        DnbRoleAuthService,
        MessageService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (dnbService: DnbService) => {
    spyOn(dnbService, "getAggregator").and.returnValues(
      of(mockGetAggregator),
      of(mockGetAggregator2),
      of(mockGetAggregator3),
      of(mockGetAggregator),
      of(mockGetAggregator2),
      of(mockGetAggregator3)
    );
    spyOn(dnbService, "listAutopopulateIcd10Code").and.returnValues(
      of(mockLCDResponse),
      of(mockLCDResponse),
      of(mockLCDResponse)
    );
    fixture = TestBed.createComponent(NewDrugComponent);
    fixture.componentInstance.isAutosavingActive = () => {};
    toastService = TestBed.get(ToastMessageService);
    component = fixture.componentInstance;
    storageService = TestBed.get(StorageService);
    storageService = TestBed.get(StorageService);
    component.version = { versionStatus: "IP", versionId: "123" };
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
      storageDrug.approvedDrugVersion,
      { versionStatus: "AP", versionId: "1" },
      true
    );
    storageService.set(storageDrug.majorVersion, "1", false);
    storageService.set(
      storageDrug.newDrugEditingMode,
      {
        editingMode: true,
        showButtons: true,
      },
      true
    );
    confirmationService = TestBed.get(ConfirmationService);
    router = TestBed.get(Router);
    undoRedo = TestBed.get(DnbUndoRedoService);
    fixture.detectChanges();
    component.sections$.subscribe((sectionsResponse) => {
      sections = sectionsResponse;
      undoRedo.sections = sectionsResponse;
    });
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add a sticky section", async () => {
    await fixture.whenStable();
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
    fixture.whenStable();
    fixture.detectChanges();
    component.stickySection(section);
    expect(component.stickySections.length).toBe(1);
  });

  it("should remove sticky section", async () => {
    await fixture.whenStable();
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
    fixture.whenStable();
    fixture.detectChanges();

    component.stickySections = [section];
    component.stickySection(section);
    expect(component.stickySections.length).toBe(0);
  });

  it("should re order navigation items after drag and drop", async () => {
    await fixture.whenStable();
    component.startDragItemIndex = 1;
    const UIelement = {
      item: {
        index: () => 0,
      },
    };
    fixture.whenStable();
    fixture.detectChanges();
    expect(component.navigationItems[0].name).toBe("General Information");
    component.sortNavigationItems({}, UIelement);
    expect(component.navigationItems[0].name).toBe("References");
  });

  it("should clear all sections", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[0].value = "tania";
    (
      undoRedo.sections[0].new as GroupedSection
    ).groups[0].rows[0].columns[1].value = "tania";
    component.clearAll();
    setTimeout(() => {
      expect(
        (undoRedo.sections[0].new as GroupedSection).groups[0].rows[0]
          .columns[0].value
      ).toContain(GeneralInformationTemplate.data[0].data[0].itemDetails);
      expect(
        (undoRedo.sections[0].new as GroupedSection).groups[0].rows[0]
          .columns[1].value
      ).toContain(GeneralInformationTemplate.data[1].data[0].itemDetails);
      done();
    });
  });

  it("should save new drug", inject(
    [DnbService],
    async (dnbService: DnbService) => {
      spyOn(dnbService, "createNewDrug").and.returnValue(of({ code: 1 }));
      spyOn(dnbService, "getNewDrugVersion").and.returnValue(of("1"));
      const spyAggSectionsSave = spyOn(
        dnbService,
        "postAggregatorSection"
      ).and.returnValue(of("1"));
      const spyCommit = spyOn(dnbService, "postSaveSection").and.returnValue(
        of("1")
      );
      await fixture.whenStable();
      fixture.detectChanges();
      component.drugCode = null;
      component.saveNewDrug();
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

  it("should cell navigate to sections", async () => {
    await fixture.whenStable();
    const focusTypeRight = { type: arrowNavigation.right, isTabAction: true };
    const focusTypeDown = { type: arrowNavigation.down, isTabAction: true };
    component.cellNavigate(focusTypeRight);
    expect(undoRedo.sections[0].new.focusType).toEqual(focusTypeDown);
  });

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

  it("should update sections with new ingestion data", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.getIngestedContent("1");
    setTimeout(() => {
      expect(
        (undoRedo.sections[0].new as GroupedSection).groups[0].names[0].value
      ).toContain(generalInformationResponse.data[0].item.name);
      done();
    });
  });

  it("should confirm", async () => {
    const spy = spyOn(confirmationService, "confirm");
    await fixture.whenStable();
    fixture.detectChanges();
    component.confirmSaveData();
    component.confirmClearAll();
    component.confirmReturnData();
    component.submitNewDrug();
    expect(spy).toHaveBeenCalledTimes(3);
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
    expect(component.percentage).toBe("0.00");
  });

  it("should mark all as completed", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.markUnmarkSections(true);
    expect((undoRedo.sections[0].new as Section).completed).toBe(false);
  });

  it("should unmark all as completed", async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.markUnmarkSections(false);
    expect((undoRedo.sections[0].new as Section).completed).toBe(false);
  });

  it("should validate data and notify complete all ", async () => {
    const spy = spyOn(confirmationService, "confirm");
    await fixture.whenStable();
    fixture.detectChanges();
    component.validateAllSectionCompleted();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should ask to submit data is valid ", async () => {
    const spy = spyOn(confirmationService, "confirm");
    await fixture.whenStable();
    fixture.detectChanges();
    component.markUnmarkSections(true);
    component.validateAllSectionCompleted();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should validate feedbacks for approver", async () => {
    const spy = spyOn(confirmationService, "confirm");
    fixture.whenStable();
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

  it("should validate feedbacks 2", async () => {
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

  it("should set drug code", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.drugCreated("123");
    expect(component.drugCode).toBe("123");
    done();
  });

  it("should change label", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.onSwitchChange({ originalEvent: null, checked: false });
    expect(component.toggleLabel).toBe(Messages.showFullScreenLabel);
    component.onSwitchChange({ originalEvent: null, checked: true });
    expect(component.toggleLabel).toBe(Messages.hideFullScreenLabel);
    done();
  });

  it("should undo sticky section", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.undoStickSection({ index: 1 });
    expect(component.stickySections.length).toBe(0);
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

  it("should intercept paste", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
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
    done();
  });

  it("should undo redo paste", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
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
    done();
  });
});

fdescribe("NewDrugComponent", () => {
  let component: NewDrugComponent;
  let fixture: ComponentFixture<NewDrugComponent>;
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
        NewDrugComponent,
        GroupedSectionsContainerStubComponent,
        SectionsContainerStubComponent,
        SectionNavigationStubComponent,
        CellEditorStubComponent,
        FindReplaceStubComponent,
        SectionsStickyComponent,
        UploadStubComponent,
        DnBBreadCrumbStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        InputSwitchModule,
        FormsModule,
        ConfirmDialogModule,
        RouterTestingModule,
        CheckboxModule,
        NgxPermissionsModule.forRoot(),
        OverlayPanelModule,
      ],
      providers: [
        DnbService,
        StorageService,
        ConfirmationService,
        LoadingSpinnerService,
        DnbRoleAuthService,
        MessageService,
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(inject([DnbService], (dnbService: DnbService) => {
    spyOn(dnbService, "getAggregator").and.returnValues(
      of(mockGetAggregator),
      of(mockGetAggregator2),
      of(mockGetAggregator3),
      of(mockGetAggregator),
      of(mockGetAggregator2),
      of(mockGetAggregator3)
    );
    fixture = TestBed.createComponent(NewDrugComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(StorageService);
    storageService.set(
      storageDrug.approvedDrugVersion,
      { versionStatus: "AP", versionId: "1" },
      true
    );
    storageService.set(storageDrug.majorVersion, "1", false);
    storageService.set(
      storageDrug.newDrugEditingMode,
      {
        editingMode: true,
        showButtons: true,
      },
      true
    );

    storageService.set(storageDrug.drugVersion, null, true);
    fixture.detectChanges();
    component.sections$.subscribe((sectionsResponse) => {
      sections = sectionsResponse;
    });
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should change drug name", async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.allMarkSections(true);
    component.drugNameChange("new");
    done();
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
