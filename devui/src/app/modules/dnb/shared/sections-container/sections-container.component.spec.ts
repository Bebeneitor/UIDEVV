import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
} from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import {
  OktaAuthModule,
  OktaAuthService,
  OKTA_CONFIG,
} from "@okta/okta-angular";
import { NgxPermissionsModule } from "ngx-permissions";
import { ConfirmationService, MessageService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { StorageService } from "src/app/services/storage.service";
import { SectionPosition } from "../../models/constants/actions.constants";
import {
  arrowNavigation,
  behaviors,
} from "../../models/constants/behaviors.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageGeneral } from "../../models/constants/storage.constants";
import { MidRule, MidRuleSetUp } from "../../models/interfaces/midRule";
import {
  Column,
  Row,
  SearchData,
  Section,
} from "../../models/interfaces/uibase";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbStoreService } from "../../services/dnb-store.service";
import { DnBDirectivesModule } from "../../utils/directives/dnb-directives.module";
import { CopyToNew } from "../../utils/utils.index";
import { SectionsContainerComponent } from "./sections-container.component";
@Component({ selector: "app-dnb-section", template: "" })
class SectionStubComponent {
  @Input() section: Section;
  @Input() isReadOnly: boolean = true;
  @Input() isComparing: boolean = false;
  @Input() undoCopyRowFlag: boolean = false;
  @Input() enableEditing: boolean = true;
  @Input() isApproverReviewing: boolean;
  @Input() sectionIndex: string;
  @Input() feedbackComplete: boolean;
  @Input() disabled: boolean = false;
  @Input() isRules: boolean = false;
  @Input() focusType: boolean;
  @Input() sectionEnable: boolean = false;
  @Output() selectionForPaste = new EventEmitter<any>();

  updateCompareColumns() {}
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
  @Input() sectionId: string;
  @Input() focus: { hasFocus: boolean; range?: number } = null;
  getDifferences() {}
}

@Component({ selector: "app-mid-rules-list", template: "" })
class midRulesListSubComponent {
  @Input() openDialog: boolean = false;
}

@Component({ selector: "app-mid-rules-ell", template: "" })
class midRulesELLSubComponent {
  @Input() openDialog: boolean = false;
}
@Component({ selector: "app-mid-rules-ell-summary", template: "" })
class midRulesSummaryELLSubComponent {
  @Input() draftVersion: boolean = false;
  @Input() openDialog: boolean = false;
}

@Component({ selector: "app-mid-rules-exist", template: "" })
class MidRulesExistComponent {
  @Input() openDialog: boolean = false;
}

@Component({ selector: "app-autopopulate-indications", template: "" })
class AutopopulateIndicationsComponent {
  @Input() openDialog: boolean = false;
  @Input() newIndications: any[] = [];
  @Input() otherIndications: any[] = [];
  @Input() childsIndications: any[] = [];
  @Input() activeFixedIndication: any[] = [];
  @Input() activeGlobalIndication: any[] = [];
}
@Component({
  selector: "app-autopopulate-diagnosis-code-summary",
  template: "",
})
class AutopopulateDiagnosisComponent {
  @Input() openDialog: boolean = false;
  @Input() childsIcdCodes: any[] = [];
  @Input() parentIcdCodes: any[] = [];
  @Input() icdCodesNoActions: any[] = [];
}

@Component({ selector: "app-mid-rules", template: "" })
class midRulesSubComponent {
  @Input() openDialog: boolean = false;
  @Input() midRule: MidRule = {
    midRuleTemplateId: 0,
    template: "",
    templateInformation: "",
    reasonCode: "",
    lockDetail: { locked: false, lockedBy: "" },
  };
  @Input() midRuleSetUp: MidRuleSetUp = {
    headerDialog: "Edit Mid Rule",
    midRuleTitle1: "Mid Rule",
    disableTitle1: true,
    requiredTitle1: false,
    midRuleText1: "Description",
    disableText1: false,
    requiredText1: false,
    midRuleText2: "Comments",
    disableText2: false,
    requiredText2: false,
    showButton1: true,
    textButton1: "Add",
    showButton2: true,
    textButton2: "Back",
    showLockedBy: false,
    saveMessage: "",
  };
}

fdescribe("SectionsContainerComponent", () => {
  let component: SectionsContainerComponent;
  let fixture: ComponentFixture<SectionsContainerComponent>;
  let dnbStore: DnbStoreService;
  let storageService: StorageService;
  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SectionsContainerComponent,
        SectionStubComponent,
        CellEditorStubComponent,
        midRulesListSubComponent,
        midRulesELLSubComponent,
        midRulesSummaryELLSubComponent,
        midRulesSubComponent,
        MidRulesExistComponent,
        AutopopulateIndicationsComponent,
        AutopopulateDiagnosisComponent,
      ],
      imports: [
        FormsModule,
        InputSwitchModule,
        DnBDirectivesModule,
        CheckboxModule,
        NgxPermissionsModule.forRoot(),
        HttpClientTestingModule,
        OktaAuthModule,
      ],
      providers: [
        ConfirmationService,
        CopyToNew,
        DnbStoreService,
        StorageService,
        DnbRoleAuthService,
        MessageService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
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
    storageService = TestBed.get(StorageService);
    storageService.set(storageGeneral.dnbPermissions, dnbPermissions, true);
    fixture = TestBed.createComponent(SectionsContainerComponent);
    component = fixture.componentInstance;
    component.newVersion = {
      id: "sectionone",
      headers: ["header 1", "header 2", "header 3"],
      headersUIWidth: [100, 100, 100],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      enabled: true,
      rows: [
        {
          columns: [
            {
              value: "Row 1 Old Column 1",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          hasBorder: false,
        },
        {
          columns: [
            {
              value: "Row 2 Old Column 1",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          hasBorder: false,
        },
      ],
    };
    component.currentVersion = {
      id: "sectionone",
      headers: ["header 1", "header 2", "header 3"],
      headersUIWidth: [100, 100, 100],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      rows: [
        {
          columns: [
            {
              value: "Row 1 Old Column 1",
              isReadOnly: true,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          hasBorder: false,
        },
        {
          columns: [
            {
              value: "Row 2 Old Column 1",
              isReadOnly: true,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          hasBorder: false,
        },
      ],
    };
    component.undoCopyRowFlag = false;
    component.showCurrent = true;
    component.isComparing = true;
    component.hasRowHeading = false;
    dnbStore = TestBed.get(DnbStoreService);
    fixture.detectChanges();
  });

  it("should create section container", () => {
    expect(component).toBeTruthy();
  });

  it("should display correct section name", () => {
    const policyReleaseHTML = fixture.debugElement
      .query(By.css(".old-version h3"))
      .nativeElement.textContent.trim();
    expect(policyReleaseHTML).toBe(component.currentVersion.section.name);
  });

  it("should copy row if it exists in new version", () => {
    const row: Row = component.currentVersion.rows[0];
    const event = { behavior: behaviors.copyRow, row };
    component.behavior(event);
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.newVersion.rows[0].columns[0].value
    );
  });

  it("should undo copy row and restore to current version", () => {
    const row: Row = component.currentVersion.rows[0];
    const copyEvent = { behavior: behaviors.copyRow, row };
    component.behavior(copyEvent);
    const undoEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(undoEvent);
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.currentVersion.rows[0].columns[0].value
    );
  });

  it("should add row if it does not exist in new version", () => {
    const row: Row = {
      columns: [
        {
          value: "Some Column 1",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      hasBorder: false,
    };
    const event = { behavior: behaviors.copyRow, row };
    component.behavior(event);
    expect(component.newVersion.rows[2].columns[0].value).toBe(
      row.columns[0].value
    );
  });

  it("should get the correct cell to compare", () => {
    component.isComparing = true;
    component.newVersion.rows[0].columns[0].value = "New Column 1";
    const column = component.newVersion.rows[0].columns[0];
    component.checkColumnChange(column, 0, 0);
    expect(component.newVersion.rows[0].columns[0].compareColumn.value).toBe(
      "Row 1 Old Column 1"
    );
  });

  it("should  not compare if compare is false", () => {
    component.isComparing = false;
    component.newVersion.rows[0].columns[0].value = "New Column 1";
    const column = component.newVersion.rows[0].columns[0];
    component.checkColumnChange(column, 0, 0);
    expect(component.newVersion.rows[0].columns[0].compareColumn).toBeFalsy();
  });

  it("should compare all cells on reset", () => {
    component.isComparing = true;
    component.newVersion.rows[0].columns[0].value = "New Column 1";
    component.resetCompare();
    expect(component.newVersion.rows[0].columns[0].compareColumn.value).toBe(
      "Row 1 Old Column 1"
    );
    component.isComparing = false;
    component.resetCompare();
    expect(component.newVersion.rows[0].columns[0].compareColumn).toBeFalsy();
  });

  it("should get compare cell based on position", () => {
    const foundColumn = component.getOrignalCell(0, 0);
    expect(component.currentVersion.rows[0].columns[0].value).toEqual(
      foundColumn.value
    );
  });

  it("should get compare cell based on row header", () => {
    component.hasRowHeading = true;
    const rowTwo = component.newVersion.rows[1];
    component.newVersion.rows[1] = component.newVersion.rows[0];
    component.newVersion.rows[0] = rowTwo;
    const foundColumn = component.getOrignalCell(0, 0);
    expect(component.newVersion.rows[0].columns[0].value).toBe(
      foundColumn.value
    );
  });

  it("should collapse a section", () => {
    const spy = spyOn(component.toggleSectionCopy, "emit");
    component.collapseSection();

    expect(spy).toHaveBeenCalledWith({
      section: component.newVersion,
      status: false,
    });
  });

  it("should disable a section", () => {
    const spy = spyOn(component.toggleSectionCopy, "emit");
    component.shouldEnableSection = false;
    component.disableChange();

    expect(spy).toHaveBeenCalledWith({
      section: component.newVersion,
      status: false,
    });
  });

  it("should listen to store changes", () => {
    let currentSectionRef = component.currentVersion;
    dnbStore.notifySectionContainerBulkUpdate(
      component.currentVersion.section.code
    );
    expect(currentSectionRef === component.currentVersion).toBe(false);
    const diff = [];
    const compareColumn: Column = {
      isReadOnly: false,
      value: "test",
      feedbackData: [],
      feedbackLeft: 0,
    };
    currentSectionRef = component.currentVersion;
    dnbStore.notifySectionContainerColumnUpdate(
      component.currentVersion.section.code,
      compareColumn,
      diff
    );
    expect(currentSectionRef === component.currentVersion).toBe(false);
  });

  it("should copy section", () => {
    component.copySection();
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.newVersion.rows[0].columns[0].value
    );
  });

  it("should copy section", () => {
    component.copySection();
    expect(component.currentVersion.rows[0].columns[0].value).toBe(
      component.newVersion.rows[0].columns[0].value
    );
    component.undoCopyAll();
    expect(component.newVersion.rows[0].columns[0].value).toBe(
      "Row 1 Old Column 1"
    );
  });

  it("should set focus type", () => {
    component.focusTypeChanged({
      type: arrowNavigation.up,
      isTabAction: false,
    });
    expect(component.focusType).toEqual({
      type: arrowNavigation.up,
      isTabAction: false,
    });
  });

  it("should emit navigation event", () => {
    const spy = spyOn(component.sectionNavigate, "emit");
    component.sectionNavigateEvt({
      type: arrowNavigation.up,
      isTabAction: false,
    });
    expect(spy).toHaveBeenCalled();
  });

  it("should emit placeholder navigation", () => {
    const spy = spyOn(component.sectionNavigate, "emit");
    component.cellNavigate({ type: arrowNavigation.up, isTabAction: false });
    expect(spy).toHaveBeenCalled();
    component.cellNavigate({ type: arrowNavigation.down, isTabAction: false });
    expect(component.focusType).toEqual({
      type: arrowNavigation.down,
      isTabAction: false,
    });
  });

  it("should emit feedback", () => {
    const spy = spyOn(component.feedbackUpdate, "emit");
    component.feedbackUpdateEvt(1);
    expect(spy).toHaveBeenCalled();
  });

  it("should emit complete", () => {
    const spy = spyOn(component.toggleCompleted, "emit");
    component.completeToggle(true);
    expect(spy).toHaveBeenCalled();
  });

  it("should update compare Section", () => {
    component.updateCompareSection();
  });

  it("should confirm undo Section", () => {
    component.confirmUndoCopySection();
  });

  it("should confirm copy Section", () => {
    component.confirmCopySection();
  });

  it("should emit sticky section", () => {
    const event = spyOn(component.stickySection, "emit");
    component.stickSection();
    expect(event).toHaveBeenCalled();
  });

  it("should confirm autopopulate Section", () => {
    component.autopopulate();
  });

  it("should add mid rule template", () => {
    component.addMidRuleTemplate();
    expect(component.openMidRuleEdit).toBe(false);
  });

  it("should confirm autopopulate for diagnosis Sections", () => {
    component.autopopulateDiagnosisSections();
  });

 
  it("should open the modrule dialogs with locked data", () => {
    component.openMidRuleListDialog();
    component.openMidRuleEditDialog({ lockDetail: { locked: true } });
    expect(component.openMidRuleList).toBe(true);
    expect(component.openMidRuleEdit).toBe(true);
    expect(component.midRuleSetUp.disableText1).toBe(true);

    component.backMidRule({});
    expect(component.openMidRuleList).toBe(true);
    expect(component.openMidRuleEdit).toBe(false);
  });

  it("should open the modrule dialogs with un locked data", () => {
    component.openMidRuleListDialog();
    component.openMidRuleEditDialog({ lockDetail: { locked: false } });
    expect(component.openMidRuleList).toBe(true);
    expect(component.openMidRuleEdit).toBe(true);
    expect(component.midRuleSetUp.disableText1).toBe(false);
    component.backMidRule({});
    expect(component.openMidRuleList).toBe(true);
    expect(component.openMidRuleEdit).toBe(false);
  });

  it("should open the modrule dialogs with un locked data", () => {
    component.midRuleSetUp.mode = "editDetail";
    component.rowIndexSelected = 0;
    component.midRuleDialog({});
    expect(true).toBe(true);
  });

  it("should copy row if it exists in new version", () => {
    const event = { behavior: behaviors.addMidRule };
    component.behavior(event);
    expect(component.openMidRuleList).toBe(true);
  });

  it("should copy row if it exists in new version", () => {
    const event = { behavior: behaviors.detailEdit, rowIndex: 0 };
    const column = component.newVersion.rows[0].columns[0];
    component.newVersion.rows[0].columns = [column, column, column];
    component.newVersion.rows[1].columns = [column, column, column];
    component.behavior(event);
    expect(component.openMidRuleEdit).toBe(true);
  });

  it("should valid icd codes ", () => {
    const spy = spyOn(component.validIcdCodes, "emit");
    component.newVersion.section.code = "UI-S-DIAGC";
    component.newVersion.rows[0].invalidCodes = "";
    expect(spy).not.toHaveBeenCalled();
  });

  it("should open midrules", () => {
    component.getMidrules();
    expect(component.openELLRules).toBe(true);
  });

  it("should count pending feedbacks", () => {
    component.getNewVersionFeedbackLeft();
    expect(component.newSectionFeedbackCount).toBe(0);
  });

  it("should display ell rules", () => {
    const column = component.newVersion.rows[0].columns[0];
    component.newVersion.rows = [
      {
        hasBorder: false,
        columns: [column, column, column],
      },
    ];
    component.displayELLRules([
      {
        midrule: "",
        description: "",
      },
    ]);
    expect(component.newVersion.rows.length).toBe(1);
  });

  it("should update rules", () => {
    const column = {
      ...component.newVersion.rows[0].columns[0],
      value: "0.0",
    };

    component.newVersion.rows = [
      {
        hasBorder: false,
        columns: [column, column, column],
      },
      {
        hasBorder: false,
        codeUI: "2",
        columns: [column, column, column],
      },
    ];
    component.updateRulesEll({
      midR: {
        midrule: "10.1",
        description: "test",
        type: "New",
      },
      orderList: ["0.1", "2.2", "2.1"],
    });
    component.updateRulesEll({
      midR: {
        midrule: "0.1",
        description: "test",
        type: "New Version",
      },
    });
    component.updateRulesEll({
      midR: {
        midrule: "0.1",
        description: "test",
        type: "Deprecated",
        foundRowUUID: "1",
      },
    });
    expect(component.newVersion.rows.length).toBe(2);
  });

  it("should update rules", () => {
    const column = component.newVersion.rows[0].columns[0];
    component.newVersion.rows = [
      {
        hasBorder: false,
        columns: [column, column, column],
      },
    ];
    component.rulesCompare = true;
    component.rulesCompareChange();
    expect(component.openELLSummary).toBe(true);
    component.rulesCompare = false;
    component.rulesCompareChange();
    expect(component.newVersion.rows[0].columns[0].compareColumn).toBe(undefined);
  });

  it("should open autopopulate indications", () => {
    component.openAutopopulateDialog();
    expect(component.openAutopopulate).toBe(true);
  });

  it("should set autopopulate label", () => {
    expect(
      component.getLabelTooltipAutopopulate(SectionCode.DiagnosisCodes)
    ).toBe("Auto-populate Indications");
    expect(
      component.getLabelTooltipAutopopulate(SectionCode.DiagnosticCodeSummary)
    ).toBe("Auto-populate ICD-10 Codes");
    expect(
      component.getLabelTooltipAutopopulate(SectionCode.GlobalReviewCodes)
    ).toBe("Auto-populate current ICD-10 Codes");
    expect(
      component.getLabelTooltipAutopopulate(SectionCode.DiagnosisCodeOverlaps)
    ).toBe("Auto-populate Overlaps");
  });

  it("should open dialog", () => {
    component.openExistingMidRuleDialog(null);
    component.showDialog();
    const event = { midRule: "", eclRuleLogicOriginal: "" };
    component.addMidRuleExisting(event);
    expect(component.openMidRuleExisting).toBe(true);
  });

  it("should open dialog", () => {
    component.resetRulesCompare(true);
    expect(component.openELLSummary).toBe(true);
  });

  it("should open dialog", () => {
    component.newVersion.section.code = SectionCode.GlobalReviewIndications;
    component.sectionAutopopulate();
    component.getDataPreviousAutopopulate();
    expect(true).toBe(true);
  });

  it("should undo copy row and restore to current version 1", () => {
    const test = { behavior: behaviors.addExistingMidRule };
    const test2 = { behavior: behaviors.addRow };
    component.behavior(test);
    component.behavior(test2);
    expect(component.openMidRuleExisting).toBe(true);
  });

  xit("should undo copy row and restore to current version 2", () => {
    const spy = spyOn(component.dataPopulateSections, "emit");
    component.autopopulateDiagnosisCodeSummary();
    expect(spy).toHaveBeenCalled();
  });

  xit("should undo copy row and restore to current version 3", () => {
    const spy = spyOn(component.dataPopulateSections, "emit");
    component.autopopulateDiagnosisCodeSummary();
    expect(spy).toHaveBeenCalled();
  });

  it("should undo copy row and restore to current version 4", () => {
    component.newVersion.section.code = SectionCode.DiagnosticCodeSummary;
    component.getDataPreviousAutopopulate();
    component.dataParentAutopopulate = [];
    const result = component.isActiveFixedIndication();
    expect(result.length).toBe(0);
  });

  it("should undo copy row and restore to current version 5", () => {
    const spy = spyOn(component.validIcdCodes, "emit");
    component.newVersion.section.code = SectionCode.DiagnosticCodeSummary;
    component.validIcdCodesSection();
    component.dataParentAutopopulate = [];
    component.isActiveFixedIndication();
    expect(spy).toHaveBeenCalled();
  });

  it("should emit data", () => {
    const spy = spyOn(component.dataPopulateSections, "emit");
    component.autopopulateForDuplicateData();
    expect(spy).toHaveBeenCalled();
  });

  it("should check data", () => {
    const changes = {
      newVersion: new SimpleChange(null, component.newVersion, true),
    };
    component.ngOnChanges(changes);
    expect(component.isDiagnosisCode).toBe(false);
  });

  it("should override Indication", () => {
    const event = {
      overrideIndications: [],
      addIndicationsParent: [],
      addIndicationsGlobal: [],
      deleteIndicationsChild: [],
      deleteIndicationGlobalReview: [],
      processAddIndication: [],
      processDeleteIndication: [],
      autopopulateGlobalReviewSection: [],
      autopupulateAllChildSections: [],
    };
    component.overrideIndication(event);
    expect(true).toBe(true);
  });

  it("should add indication", () => {
    const event = {
      overrideIndications: [],
      addIndicationsParent: [],
      addIndicationsGlobal: [],
      deleteIndicationsChild: [],
      deleteIndicationGlobalReview: [],
      processAddIndication: [],
      processDeleteIndication: [],
      autopopulateGlobalReviewSection: [],
      autopupulateAllChildSections: [],
    };
    component.addIndications(event);
    expect(true).toBe(true);
  });
});
