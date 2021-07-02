import { Component, Input, SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { SectionPosition } from "../../models/constants/actions.constants";
import {
  arrowNavigation,
  behaviors,
} from "../../models/constants/behaviors.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageCopy } from "../../models/constants/storage.constants";
import {
  Column,
  CommentData,
  FeedBackData,
  GroupedSection,
  GroupRow,
  SearchData,
  Section,
} from "../../models/interfaces/uibase";
import { DnBDirectivesModule } from "../../utils/directives/dnb-directives.module";
import { GroupedSectionComponent } from "./grouped-section.component";

@Component({ selector: "app-cell-editor", template: "" })
class CellEditorStubComponent {
  @Input() column: Column = null;
  @Input() isComparing: boolean = false;
  @Input() searchInfo: SearchData = null;
  @Input() comments: CommentData[] = [];
  @Input() highLight: number = null;
  @Input() sectionPosition: SectionPosition = {
    sectionIndex: 0,
    isGrouped: false,
    isName: false,
    isDrugName: false,
    isSectionCodes: false,
    groupIndex: 0,
    rowIndex: 0,
    columnIndex: 0,
    oldVal: "",
  };
  @Input() compareSide: number = null;
  @Input() isReadOnly = false;
  @Input() showAllChanges = false;
  @Input() negativeDiff: any;
  @Input() sectionId: string;
  @Input() isLastSectionColumn: boolean;
  @Input() focus: { hasFocus: boolean; range?: number } = null;
  getDifferences() {}
}

@Component({ selector: "p-spinner", template: "" })
class spinnerSubComponent {
  @Input() ngModel: any;
  @Input() min: Input;
  @Input() max: Input;
}

@Component({ selector: "app-comment", template: "" })
class CommentStubComponent {
  @Input() comment;
  @Input() sectionName;
  @Input() versionId: string;
}

@Component({ selector: "p-checkbox", template: "" })
class checkBoxSubComponent {
  @Input() name: string;
  @Input() ngModel: any;
  @Input() value: string;
}

@Component({ selector: "app-feedback", template: "" })
class FeedBackStubComponent {
  @Input() versionId: boolean = false;
  @Input() feedback: Section | GroupedSection;
  @Input() selectedFeedback: boolean = false;
}

@Component({ selector: "app-view-feedback", template: "" })
class ViewFeedBacksStubComponent {
  @Input() feedbacks: FeedBackData[];
  @Input() viewOnly: boolean;
}
@Component({ selector: "app-simple-cell", template: "" })
class SimpleCellStubComponent {
  @Input() column: Column = null;
  @Input() feedbackData: FeedBackData = null;
}
@Component({ selector: "app-dnb-row-menu", template: "" })
class RowMenuStubComponent {
  @Input() section: Section | GroupedSection;
  @Input() isGrouped: boolean = false;
  @Input() rowIndex: number = 0;
  @Input() groupIndex: number = 0;
  @Input() visible: boolean = true;
  @Input() undoItems: any = {
    undoFlag: false,
    backUpIndexRow: null,
    backUpIndexGroup: null,
    wasGroupRemoved: false,
    backUpRow: null,
    backUpGroup: null,
  };
  @Input() menuPermissions: any = {
    separation: true,
    addRow: true,
    removeRow: true,
    moveUp: true,
    moveDown: true,
    undo: true,
    addDosing: false,
    duplicateDosing: false,
  };
  @Input() cancelMultiSelect: boolean = false;
  @Input() typeRemoveMultiple: string = "";
}
@Component({ selector: "app-feedback-menu", template: "" })
class FeedbackMenuStubComponent {
  @Input() visible: boolean = true;
  @Input() menuPermissions: any = {
    separation: true,
    addRow: true,
    removeRow: true,
    moveUp: true,
    moveDown: true,
    undo: true,
    addDosing: false,
    duplicateDosing: false,
  };
}

fdescribe("GroupedSectionComponent", () => {
  let component: GroupedSectionComponent;
  let fixture: ComponentFixture<GroupedSectionComponent>;
  let storageService: StorageService;
  const feedback: FeedBackData = {
    itemId: 0,
    sectionRowUuid: "1",
    feedback: "test",
    sourceText: "tania",
    beginIndex: 0,
    endIndex: 5,
    uiColumnAttribute: "header 2",
    uiSectionCode: "test",
    createdBy: "test",
    createdById: 0,
    createdOn: "test",
    isSectionFeedback: false,
  };
  const commentData: CommentData = {
    beginIndex: 0,
    endIndex: 2,
    sectionRowUuid: "test",
    uiSectionCode: "",
    comment: "",
    uiColumnAttribute: "Item",
    elementId: "1",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupedSectionComponent,
        CellEditorStubComponent,
        SimpleCellStubComponent,
        FeedbackMenuStubComponent,
        FeedBackStubComponent,
        RowMenuStubComponent,
        ViewFeedBacksStubComponent,
        checkBoxSubComponent,
        spinnerSubComponent,
        CommentStubComponent,
      ],
      imports: [
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        DnBDirectivesModule,
      ],
      providers: [ToastMessageService, MessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedSectionComponent);
    component = fixture.componentInstance;
    component.sectionIndex = 0;
    component.section = {
      headers: ["header 1", "header 2", "header 3"],
      headersUIWidth: [100, 100, 100],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      feedbackData: [],
      feedbackLeft: 0,
      id: "id",
      groups: [
        {
          codeGroupUI: "d499f329-2d4c-4673-ae88-5fd5c8b9d58c",
          names: [
            {
              value: "Group1",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
          ],
          rows: [
            {
              code: "1",
              codeUI: "3cc48e60-5f07-4772-b060-2dfb3056bb6a",
              columns: [
                {
                  value: "Row1",
                  isReadOnly: false,
                  feedbackData: [],
                  feedbackLeft: 0,
                  comments: [],
                },
              ],
              hasBorder: false,
            },
            {
              code: "1",
              codeUI: "2cff275f-3f64-40af-b02a-85851e80185f",
              columns: [
                {
                  value: "Row2",
                  isReadOnly: false,
                  feedbackData: [],
                  feedbackLeft: 0,
                  comments: [],
                },
              ],
              hasBorder: false,
            },
          ],
        },
      ],
    };
    component.isApproverReviewing = false;
    component.feedbackComplete = false;
    storageService = TestBed.get(StorageService);
    component.rowReference = { getBoundingClientRect: () => 0 };
    component.sectionReference = { getBoundingClientRect: () => 0 };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit copy row", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.copyRow };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy row", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const undoCopyEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(undoCopyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit copy Row Group", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const undoCopyEvent = { behavior: behaviors.copyRowGroup };
    component.behavior(undoCopyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy Group", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const undoCopyEvent = { behavior: behaviors.copyGroup };
    component.behavior(undoCopyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit copyGroup", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const group: GroupRow = { names: [], rows: [] };
    const groupIndex: number = 0;
    component.copyGroup(group, groupIndex);
    expect(event).toHaveBeenCalled();
  });

  it("should open menu context", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.currentRange = { index: 0, length: 2 };
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context and check comments", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
      comments: [commentData],
    };
    component.isReadOnly = false;
    component.currentRange = { index: 0, length: 0 };
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context for dosign patterns", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.section.section.code = SectionCode.DosingPatterns;
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context for secondary malignancy", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.section.section.code = SectionCode.SecondaryMalignancy;
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context on feedback", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [feedback],
      feedbackLeft: 1,
    };
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context for approver", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.isApproverReviewing = true;
    component.shouldCheckFeedback = true;
    component.currentFeedback = feedback;
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    column.feedbackData = [feedback];
    column.feedbackLeft = 1;
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context for approver", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.isApproverReviewing = true;
    component.shouldCheckFeedback = false;
    component.currentFeedback = feedback;
    component.selectedFeedback = "feedback";
    component.currentColumn = component.section.groups[0].rows[0].columns[0];
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    column.feedbackData = [feedback];
    column.feedbackLeft = 1;
    component.openRowMenu(mouseEvent, 1, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should copy column", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.openRowMenu(mouseEvent, 0, 0, 0, column);
    const event = { behavior: behaviors.copyColumn };
    component.behavior(event);
    const value = storageService.get(storageCopy.copyColumn, false);
    expect(value).toBe("Row1");
  });

  it("should paste content", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.openRowMenu(mouseEvent, 0, 0, 0, column);
    const copyEvent = { behavior: behaviors.copyColumn };
    component.behavior(copyEvent);
    component.openRowMenu(mouseEvent, 0, 1, 0, column);
    const pasteEvent = { behavior: behaviors.pasteColumn };
    component.behavior(pasteEvent);
    const newValue =
      component.section.groups[component.selectedGroupIndex].rows[
        component.selectedRowIndex
      ].columns[component.selectedColumnIndex].value;
    expect(newValue).toBe("Row1");
  });

  it("should navigate in headers", () => {
    const spySectionNav = spyOn(component.sectionNavigate, "emit");
    const spyGroupsNav = spyOn(component, "groupsNavigate");
    component.cellHeaderNavigate(
      { type: arrowNavigation.right, isTabAction: false },
      0,
      0
    );
    const lastColumn = component.section.groups[0].rows[0].columns[0];
    expect(lastColumn.focus.hasFocus).toBe(true);
    component.cellHeaderNavigate(
      { type: arrowNavigation.left, isTabAction: false },
      0,
      0
    );
    expect(spySectionNav).toHaveBeenCalled();
    component.cellHeaderNavigate(
      { type: arrowNavigation.up, isTabAction: false },
      0,
      0
    );
    expect(spyGroupsNav).toHaveBeenCalled();
    component.cellHeaderNavigate(
      { type: arrowNavigation.down, isTabAction: false },
      0,
      0
    );
    expect(spyGroupsNav).toHaveBeenCalled();
  });

  it("should navigate in group", () => {
    component.cellGroupNavigate(
      { type: arrowNavigation.right, isTabAction: false },
      0,
      0,
      0
    );
    const lastColumn = component.section.groups[0].rows[1].columns[0];
    expect(lastColumn.focus.hasFocus).toBe(true);
    component.cellGroupNavigate(
      { type: arrowNavigation.left, isTabAction: false },
      0,
      1,
      0
    );
    const firstColumn = component.section.groups[0].rows[0].columns[0];
    expect(firstColumn.focus.hasFocus).toBe(true);
    component.cellGroupNavigate(
      { type: arrowNavigation.up, isTabAction: false },
      0,
      1,
      0
    );
    expect(firstColumn.focus.hasFocus).toBe(true);
    component.cellGroupNavigate(
      { type: arrowNavigation.down, isTabAction: false },
      0,
      0,
      0
    );
    expect(lastColumn.focus.hasFocus).toBe(true);
  });

  it("should open/close feedback", () => {
    component.openFeedback();
    expect(component.showFeedback).toBe(true);
    component.closeFeedback();
    expect(component.showFeedback).toBe(false);
  });

  it("should save/remove feedback", () => {
    component.openFeedback();
    component.currentColumn = component.section.groups[0].rows[0].columns[0];
    component.savedFeedback(feedback);
    expect(component.currentColumn.feedbackData[0]).toEqual(feedback);
    component.openFeedback();
    component.removedFeedback(feedback);
    expect(component.currentColumn.feedbackData.length).toBe(0);
  });

  it("should set selection", () => {
    const selection = { endIndex: 5, beginIndex: 0, text: "tania" };
    const column = component.section.groups[0].rows[0].columns[0];
    const row = component.section.groups[0].rows[0];
    const rowRef = {
      getBoundingClientRect: () => {
        return { x: 0, y: 0 };
      },
    };
    const sectionRef = {
      getBoundingClientRect: () => {
        return { x: 0, y: 0 };
      },
    };
    component.selectionSet(selection, column, 0, rowRef, row, sectionRef);
    expect(component.currentFeedback.beginIndex).toBe(0);
    expect(component.currentFeedback.endIndex).toBe(5);
  });

  it("should set a feedback", () => {
    const column = component.section.groups[0].rows[0].columns[0];
    const rowRef = {
      getBoundingClientRect: () => {
        return { x: 0, y: 0 };
      },
    };
    component.feedbackClicked(feedback, column, rowRef);
    expect(component.selectedFeedback).toBe("tania");
  });

  it("should resolve feedback", () => {
    const event = spyOn(component.feedbackUpdate, "emit");
    component.resolved(feedback);
    expect(event).toHaveBeenCalled();
  });

  it("should set section focus", () => {
    component.focusType = { type: arrowNavigation.down, isTabAction: false };
    component.changeFocus();
    expect(component.section.groups[0].names[0].focus.hasFocus).toBe(true);
    component.focusType = { type: arrowNavigation.up, isTabAction: false };
    component.changeFocus();
    expect(component.section.groups[0].rows[1].columns[0].focus.hasFocus).toBe(
      true
    );
  });

  it("should navigate in groups", () => {
    let focus = { type: arrowNavigation.up, isTabAction: false };
    component.groupsNavigate(focus, 1, 0);
    expect(component.section.groups[0].rows[1].columns[0].focus.hasFocus).toBe(
      true
    );
    focus = { type: arrowNavigation.down, isTabAction: false };
    component.groupsNavigate(focus, -1, 0);
    expect(component.section.groups[0].rows[0].columns[0].focus.hasFocus).toBe(
      true
    );
  });

  it("should activate multiselect", () => {
    const copyEvent = { behavior: behaviors.removeMultipleGroups };
    component.behavior(copyEvent);
    expect(component.multiSelect).toBeTruthy();
  });

  it("should cancel multiselect", () => {
    component.checkAllRowM(false);
    expect(component.multiSelect).toBe(false);
  });

  it("should check all groups", () => {
    component.checkAllGroupM(true);
    expect(component.selectedGroups.length).toBe(
      component.section.groups.length
    );
  });

  it("should uncheck all groups", () => {
    component.checkAllGroupM(false);
    expect(component.selectedGroups.length).toBe(0);
  });

  it("should check all rows", () => {
    component.checkAllRowM(true);
    expect(component.selectedRows.length).toBe(2);
  });

  it("should uncheck all rows", () => {
    component.checkAllRowM(false);
    expect(component.selectedRows.length).toBe(0);
  });

  it("should create a backup all the section to undo removed rows", () => {
    component.checkAllGroupHeader = true;
    const copyEvent = { behavior: behaviors.confirmRemoveMultipleGruped };
    component.behavior(copyEvent);
    expect(component.selectedBackUpGroups.length).toBe(1);
  });

  it("should create a backup all the section to undo removed rows", () => {
    component.checkAllGroupHeader = false;
    component.checkAllRowHeader = false;
    component.selectedGroups.push("d499f329-2d4c-4673-ae88-5fd5c8b9d58c");
    component.confirmRemoveMultipleRows(true);
    expect(component.selectedBackUpGroups.length).toBe(1);
  });

  it("should create a backup all the section to undo removed rows", () => {
    component.checkAllGroupHeader = false;
    component.checkAllRowHeader = false;
    component.selectedGroups.push("d499f329-2d4c-4673-ae88-5fd5c8b9d58c");
    component.confirmRemoveMultipleRows(true);
    component.undoRemoveMultiSelect();
    expect(component.selectedBackUpGroups.length).toBe(0);
    expect(component.selectedBackUpRows.length).toBe(0);
  });

  it("should create a backup all the section to undo removed rows", () => {
    component.checkAllGroupHeader = false;
    component.checkAllRowHeader = false;
    component.selectedGroups.push("d499f329-2d4c-4673-ae88-5fd5c8b9d58c");
    component.confirmRemoveMultipleRows(true);
    component.undoRemoveMultiSelect();
    expect(component.selectedBackUpGroups.length).toBe(0);
    expect(component.selectedBackUpRows.length).toBe(0);
  });

  it("should delete selected group", () => {
    component.checkAllGroupHeader = false;
    component.checkAllRowHeader = false;
    component.selectedGroups.push("1");
    const group = { ...component.section.groups[0] };
    component.section.groups = [{ ...group }, { ...group }];
    component.section.groups[0].codeGroupUI = "1";
    component.section.groups[0].rows[0].codeUI = "1";
    component.confirmRemoveMultipleRows(true);
    expect(component.section.groups.length).toBe(1);
    component.section.groups = [{ ...group }];
  });

  it("should delete selected rows", () => {
    component.checkAllGroupHeader = false;
    component.checkAllRowHeader = false;
    component.selectedRows.push("1");
    const group = component.section.groups[0];
    group.rows[0].codeUI = "1";
    component.confirmRemoveMultipleRows(true);
    expect(component.section.groups[0].rows.length).toBe(1);
  });

  it("should delete selected rows in dosign patterns", () => {
    component.checkAllGroupHeader = false;
    component.checkAllRowHeader = false;
    component.section.section.code = SectionCode.DosingPatterns;
    component.selectedRows.push("1");
    const group = component.section.groups[0];
    group.rows[0].codeUI = "1";
    component.confirmRemoveMultipleRows(true);
    expect(component.section.groups[0].rows.length).toBe(1);
  });

  it("should add many rows", () => {
    component.addRowCount = 3;
    component.selectedRowIndex = 0;
    component.selectedGroupIndex = 0;
    component.addManyRows();
    expect(component.section.groups[0].rows.length).toBe(5);
  });

  it("should not add many rows", () => {
    component.addRowCount = 22;
    component.selectedRowIndex = 0;
    component.selectedGroupIndex = 0;
    component.addManyRows();
    expect(component.section.groups[0].rows.length).toBe(2);
  });

  it("should focus up", () => {
    component.focusType = { type: arrowNavigation.up, isTabAction: false };
    const changes = {
      focusType: new SimpleChange(
        null,
        { type: arrowNavigation.up, isTabAction: false },
        true
      ),
    };
    component.ngOnChanges(changes);
    const lastColumn = component.section.groups[0].rows[1].columns[0];
    expect(lastColumn.focus.hasFocus).toBe(true);
  });

  it("should focus down", () => {
    component.focusType = { type: arrowNavigation.down, isTabAction: false };
    const changes = {
      focusType: new SimpleChange(
        null,
        { type: arrowNavigation.down, isTabAction: false },
        true
      ),
    };
    component.ngOnChanges(changes);
    const fristColumn = component.section.groups[0].names[0];
    expect(fristColumn.focus.hasFocus).toBe(true);
  });

  it("should open section feedbacks", () => {
    component.openSectionFeedbacks();
    expect(component.showFeedback).toBe(true);
  });

  it("should open copy many dialog", () => {
    const copyEvent = { behavior: behaviors.addManyRows };
    component.behavior(copyEvent);
    expect(component.addManyRowsDialog).toBe(true);
  });

  it("should open check feedbacks dialog", () => {
    component.currentColumn = {
      value: "",
      isReadOnly: false,
      feedbackLeft: 0,
      feedbackData: [],
    };
    const event = { behavior: behaviors.checkFeedback };
    component.behavior(event);
    expect(component.showFeedback).toBe(true);
  });

  it("should cancel multi select group", () => {
    const event = { behavior: behaviors.cancelMultiSelectGroupsM };
    component.behavior(event);
    expect(component.multiSelect).toBe(false);
  });

  it("should cancel multi select group", () => {
    const event = { behavior: behaviors.cancelMultiSelectGroupsM };
    component.behavior(event);
    expect(component.multiSelect).toBe(false);
  });

  it("should undo remove multiple select", () => {
    const event = { behavior: behaviors.undoRemoveMultiSelect };
    component.behavior(event);
    expect(component.undoItems.undoMultiSelect).toBe(false);
  });

  xit("should keep feedbacks when removing a group", () => {
    const removedGroup = component.section.groups[0];
    const event = { behavior: behaviors.removeGroup, removedGroup };
    component.section.groups[0].rows[0].columns[0].feedbackData = [feedback];
    component.section.groups[0].rows[0].columns[0].feedbackLeft = 1;
    component.behavior(event);
    expect(component.section.feedbackData[0]).toEqual(feedback);
  });

  xit("should keep feedbacks when removing a row", () => {
    const removedRow = component.section.groups[0].rows[0];
    const event = { behavior: behaviors.removeRow, removedRow };
    component.section.groups[0].rows[0].columns[0].feedbackData = [feedback];
    component.section.groups[0].rows[0].columns[0].feedbackLeft = 1;
    component.behavior(event);
    expect(component.section.feedbackData[0]).toEqual(feedback);
  });

  it("should close comment box on remove", () => {
    component.currentColumn = component.section.groups[0].rows[0].columns[0];
    component.currentColumn.comments = [commentData];
    component.removedComment(commentData);
    expect(component.showComment).toBe(false);
  });

  it("should add comment", () => {
    const event = {
      behavior: behaviors.addComment,
    };
    component.selectedRowIndex = 0;
    component.selectedColumnIndex = 0;
    component.selectedGroupIndex = 0;
    component.section.groups[0].rows[0].columns[0].comments = [commentData];
    component.currentColumn = component.section.groups[0].rows[0].columns[0];
    component.currentRange = {
      index: 5,
      length: 8,
    };
    component.behavior(event);
    expect(component.showComment).toBe(true);
  });

  it("should check comment", () => {
    const event = {
      behavior: behaviors.editComment,
    };
    component.commentBackup = commentData;
    component.behavior(event);
    expect(component.showComment).toBe(true);
  });

  it("should change the comment", () => {
    component.currentComment = commentData;
    component.commentChange({ ...commentData, comment: "new" });
    expect(component.currentComment.comment).toBe("new");
  });

  it("should change the comments", () => {
    const column = component.section.groups[0].rows[0].columns[0];
    component.commentsChange([commentData], column);
    expect(component.currentColumn).toEqual(column);
  });

  it("should check number key", () => {
    const evt = { keyCode: 30 };
    const result = component.isNumberKey(evt);
    expect(result).toBe(true);
  });

  it("should handle paste event", () => {
    const event2: any = {
      target: {
        value: null,
      },
      clipboardData: {
        types: ["text/plain"],
        getData(a: string) {
          return "test";
        },
      },
      stopPropagation() {},
      preventDefault() {},
    };
    component.onPaste(event2);
    expect(component.addRowCount + "").toBe("");
  });

  it("should add comment", () => {
    const event = {
      behavior: behaviors.addComment,
    };
    component.selectedRowIndex = 0;
    component.selectedColumnIndex = 0;
    component.selectedGroupIndex = 0;
    component.section.groups[0].rows[0].columns[0].comments = [commentData];
    component.currentColumn = component.section.groups[0].rows[0].columns[0];
    component.behavior(event);
    const comment = {
      comment: "asd",
      sectionRowUuid: "",
      beginIndex: 5,
      endIndex: 13,
      uiColumnAttribute: "",
      uiSectionCode: "",
    };
    component.saveComment(comment);
    component.updateCompareColumns();
    expect(component.showComment).toBe(false);
  });

  it("should update column width", () => {
    component.columnsChange(101, 0);
    expect(component.section.headersUIWidth[0]).toBe(101);
  });
});
