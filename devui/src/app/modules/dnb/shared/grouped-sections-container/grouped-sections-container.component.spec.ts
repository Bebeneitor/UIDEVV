import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
} from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { StorageService } from "src/app/services/storage.service";
import {
  arrowNavigation,
  behaviors,
} from "../../models/constants/behaviors.constants";
import { storageGeneral } from "../../models/constants/storage.constants";
import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  SearchData,
} from "../../models/interfaces/uibase";
import { DnbRoleAuthService } from "../../services/dnb-role-auth.service";
import { DnbStoreService } from "../../services/dnb-store.service";
import { DnBDirectivesModule } from "../../utils/directives/dnb-directives.module";
import { CopyToNew } from "../../utils/utils.index";
import { GroupedSectionsContainerComponent } from "./grouped-sections-container.component";
import {
  OKTA_CONFIG,
  OktaAuthService,
  OktaAuthModule,
} from "@okta/okta-angular";
import { SectionPosition } from "../../models/constants/actions.constants";
@Component({ selector: "app-dnb-grouped-section", template: "" })
class SectionSubComponent {
  @Input() section: GroupedSection;
  @Input() isReadOnly: boolean = true;
  @Input() undoCopyRowFlag: boolean = false;
  @Input() undoCopyRowGroupFlag: boolean = false;
  @Input() hasRowHeading: boolean = false;
  @Input() isComparing: boolean = false;
  @Input() isApproverReviewing: boolean;
  @Input() sectionIndex: string;
  @Input() feedbackComplete: boolean;
  @Input() showCurrent: boolean = false;
  @Input() disabled: boolean = false;
  @Input() enableEditing: boolean = true;
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

fdescribe("GroupedSectionsContainerComponent", () => {
  let component: GroupedSectionsContainerComponent;
  let fixture: ComponentFixture<GroupedSectionsContainerComponent>;
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
        GroupedSectionsContainerComponent,
        SectionSubComponent,
        CellEditorStubComponent,
      ],
      imports: [
        FormsModule,
        InputSwitchModule,
        DnBDirectivesModule,
        CheckboxModule,
        OktaAuthModule,
      ],
      providers: [
        ConfirmationService,
        CopyToNew,
        DnbStoreService,
        DnbRoleAuthService,
        StorageService,
        MessageService,
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedSectionsContainerComponent);
    component = fixture.componentInstance;
    component.currentVersion = {
      id: "sectionotwo",
      headers: ["header 1", "header 2", "header 3"],
      headersUIWidth: [100, 100, 100],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      groups: [
        {
          names: [
            {
              value: "Group One",
              isReadOnly: true,
              feedbackData: [],
              feedbackLeft: 0,
            },
            {
              value: "Group Tewo",
              isReadOnly: true,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Old Column 1",
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
                  value: "Row 2 new Column 1",
                  isReadOnly: true,
                  feedbackData: [],
                  feedbackLeft: 0,
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.newVersion = {
      id: "sectionone",
      headers: ["header 1", "header 2", "header 3"],
      headersUIWidth: [100, 100, 100],
      section: { code: "code", name: "Section Name" },
      drugVersionCode: "id",
      enabled: true,
      groups: [
        {
          names: [
            {
              value: "Group One",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
            },
            {
              value: "Group Tewo",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          rows: [
            {
              columns: [
                {
                  value: "Row 1 new Column 11",
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
        },
      ],
    };

    component.hasRowHeading = false;
    component.isComparing = false;
    component.showCurrent = false;
    component.enableEditing = true;
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
    dnbStore = TestBed.get(DnbStoreService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add row if it does not exist in new version", () => {
    const row: Row = {
      columns: [
        {
          value: "Row 1 new Column 11",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      hasBorder: false,
    };
    const event = { behavior: behaviors.copyRow, row };
    component.behavior(event);
    expect(component.newVersion.groups[0].rows[0].columns[0].value).toBe(
      row.columns[0].value
    );
  });

  it("should undo copy row and restore to current version", () => {
    const row: Row = component.currentVersion.groups[0].rows[0];
    const copyEvent = { behavior: behaviors.copyRow, row, groupIndex: 0 };
    component.behavior(copyEvent);
    const undoEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(undoEvent);
    expect(component.currentVersion.groups[0].rows[0].columns[0].value).toBe(
      component.currentVersion.groups[0].rows[0].columns[0].value
    );
  });

  it("should add new group if it does not exist in new version", () => {
    const groupRow: GroupRow = {
      names: [
        {
          value: "Old Column 1",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          value: "Old Column 1",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      rows: [
        {
          columns: [
            {
              value: "Old Column 2",
              isReadOnly: true,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          hasBorder: false,
        },
      ],
    };
    const indexGroup: number = 0;
    const event = { behavior: behaviors.copyGroup, groupRow, indexGroup };
    component.behavior(event);
    expect(component.newVersion.groups[1].rows[0].columns[0].value).toBe(
      groupRow.rows[0].columns[0].value
    );
  });

  it("should undo copy group", () => {
    const groupRow: GroupRow = {
      names: [
        {
          value: "Old Column 1",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
        {
          value: "Old Column 1",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      rows: [
        {
          columns: [
            {
              value: "Old Column 2",
              isReadOnly: true,
              feedbackData: [],
              feedbackLeft: 0,
            },
          ],
          hasBorder: false,
        },
      ],
    };
    const indexGroup: number = 0;
    const event = { behavior: behaviors.copyGroup, groupRow, indexGroup };
    component.behavior(event);
    const event2 = {
      behavior: behaviors.undoCopyGroup,
    };
    component.behavior(event2);
    expect(component.newVersion.groups[1]).toBeFalsy();
  });

  it("should copy the row of a group", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    component.behavior(event);
    expect(component.newVersion.groups[0].rows[2].columns[0].value).toBe(
      groupRow.columns[0].value
    );
  });

  it("should copy the to the first empty group", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    component.newVersion.groups[0].names.forEach((col) => {
      col.value = "";
    });
    component.newVersion.groups[0].rows.forEach((row) => {
      row.columns.forEach((col) => {
        col.value = "";
      });
    });

    component.behavior(event);
    expect(component.newVersion.groups[0].rows[0].columns[0].value).toBe(
      groupRow.columns[0].value
    );
  });

  it("should add a new group if no space is found", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    const column = {
      isReadOnly: false,
      value: "test",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.newVersion.groups = [
      {
        names: [column],
        rows: [{ columns: [column], hasBorder: false }],
      },
    ];

    component.behavior(event);
    expect(component.newVersion.groups[1].rows[0].columns[0].value).toBe(
      groupRow.columns[0].value
    );
  });

  it("should undo copy the row of a group", () => {
    const groupRow: Row = {
      columns: [
        {
          value: "New Copied Column 2",
          isReadOnly: true,
          feedbackData: [],
          feedbackLeft: 0,
        },
      ],
      hasBorder: false,
    };
    const indexGroup: number = 0;
    const event = {
      behavior: behaviors.copyRowGroup,
      row: groupRow,
      groupIndex: indexGroup,
    };
    component.behavior(event);

    const event2 = {
      behavior: behaviors.undoCopyRowGroup,
    };
    component.behavior(event2);
    expect(component.newVersion.groups[0].rows[2]).toBeFalsy();
  });

  it("should  not compare if compare is false", () => {
    component.isComparing = false;
    component.newVersion.groups[0].rows[0].columns[0].value = "New Column 1";
    const column = component.newVersion.groups[0].rows[0].columns[0];
    component.checkColumnChange(column, 0, 0, 0);
    expect(
      component.newVersion.groups[0].rows[0].columns[0].compareColumn
    ).toBeFalsy();
  });

  it("should compare all cells on reset", () => {
    component.isComparing = true;
    component.resetCompare();
    expect(
      component.newVersion.groups[0].rows[0].columns[0].compareColumn.value
    ).toBe("Old Column 1");
    component.isComparing = false;
    component.resetCompare();
    expect(
      component.newVersion.groups[0].rows[0].columns[0].compareColumn
    ).toBeFalsy();
  });

  it("should get compare cell based on position", () => {
    const foundColumn = component.getOrignalCell(0, 0, 0);
    expect(component.currentVersion.groups[0].rows[0].columns[0].value).toEqual(
      foundColumn.value
    );
  });

  it("should emit sticky section", () => {
    const event = spyOn(component.stickySection, "emit");
    component.stickSection();
    expect(event).toHaveBeenCalled();
  });

  it("should emit toggle section copy", () => {
    const event = spyOn(component.toggleSectionCopy, "emit");
    component.collapseSection();
    expect(event).toHaveBeenCalled();
  });

  it("should confirm Copy Section", () => {
    component.confirmCopySectionGroup();
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

  it("should focus placeholder", () => {
    component.isSecondaryMalignancy = true;
    component.newVersion.codesColumn = {
      value: "",
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.sectionNavigateEvt({
      type: arrowNavigation.up,
      isTabAction: false,
    });
    expect(component.newVersion.codesColumn.focus.hasFocus).toBe(true);
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
    component.confirmUndoCopySectionGroup();
  });

  it("should confirm autopopulate for overlaps Section", () => {
    component.autopopulateOverlapsSection();
  });

  it("should focus if secondary malignancy", () => {
    component.focusType = { type: arrowNavigation.down, isTabAction: false };
    component.isSecondaryMalignancy = true;
    component.newVersion.codesColumn = {
      value: "",
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
    };
    const changes = {
      focusType: new SimpleChange(
        null,
        { type: arrowNavigation.down, isTabAction: false },
        true
      ),
    };
    component.ngOnChanges(changes);
    expect(component.focusType).toBe(null);
  });
});
