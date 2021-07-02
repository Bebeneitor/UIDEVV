import { Component, Input, SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { MessageService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { SpinnerModule } from "primeng/primeng";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { SectionPosition } from "../../models/constants/actions.constants";
import {
  arrowNavigation,
  behaviors,
} from "../../models/constants/behaviors.constants";
import { defaultMenuPermissions } from "../../models/constants/rowMenuPermissions.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageCopy } from "../../models/constants/storage.constants";
import {
  Column,
  CommentData,
  FeedBackData,
  GroupedSection,
  SearchData,
  Section,
} from "../../models/interfaces/uibase";
import { DnBDirectivesModule } from "../../utils/directives/dnb-directives.module";
import { SectionComponent } from "./section.component";

@Component({ selector: "app-simple-cell", template: "" })
class SimpleCellStubComponent {
  @Input() column: Column = null;
  @Input() feedbackData: FeedBackData = null;
}
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

@Component({ selector: "app-dnb-row-menu", template: "" })
class RowMenuStubComponent {
  @Input() section: Section | GroupedSection;
  @Input() isGrouped: boolean = false;
  @Input() rowIndex: number = 0;
  @Input() groupIndex: number = 0;
  @Input() visible: boolean = true;
  @Input() undoItems = defaultMenuPermissions;
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
  @Input() versionId: boolean = false;
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

@Component({ selector: "app-feedback", template: "" })
class FeedBackStubComponent {
  @Input() feedback: Section | GroupedSection;
  @Input() versionId: string;
  @Input() selectedFeedback: boolean = false;
}

@Component({ selector: "app-comment", template: "" })
class CommentStubComponent {
  @Input() comment;
  @Input() sectionName;
  @Input() versionId: string;
}

@Component({ selector: "app-view-feedback", template: "" })
class ViewFeedBacksStubComponent {
  @Input() viewOnly: boolean;
  @Input() feedbacks: FeedBackData[];
}

fdescribe("SectionComponent", () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let storageService: StorageService;
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
        SectionComponent,
        CellEditorStubComponent,
        FeedBackStubComponent,
        SimpleCellStubComponent,
        FeedbackMenuStubComponent,
        RowMenuStubComponent,
        ViewFeedBacksStubComponent,
        CommentStubComponent,
      ],
      imports: [
        QuillModule,
        FormsModule,
        CheckboxModule,
        DialogModule,
        SpinnerModule,
        DnBDirectivesModule,
      ],
      providers: [StorageService, ToastMessageService, MessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    component.section = {
      feedbackData: [],
      feedbackLeft: 0,
      headers: ["header 1", "header 2", "header 3"],
      headersUIWidth: [100, 100, 100],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      rows: [
        {
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
          code: "1",
        },
        {
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
          code: "2",
        },
      ],
    };
    storageService = TestBed.get(StorageService);
    component.rowReference = { getBoundingClientRect: () => 0 };
    component.sectionReference = { getBoundingClientRect: () => 0 };
    fixture.detectChanges();
  });

  it("should create section", () => {
    expect(component).toBeTruthy();
  });

  it("should emit copy row", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.copyRow };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit copy column", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.copyColumn };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit detail edit", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.detailEdit };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should emit undo copy row", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.undoCopyRow };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should open copy many dialog", () => {
    const copyEvent = { behavior: behaviors.addManyRows };
    component.behavior(copyEvent);
    expect(component.addManyRowsDialog).toBe(true);
  });

  it("should undo remove multiple", () => {
    const event = spyOn(component.behaviorEvnt, "emit");
    const copyEvent = { behavior: behaviors.undoRemoveMultiSelect };
    component.behavior(copyEvent);
    expect(event).toHaveBeenCalled();
  });

  it("should correct input data", () => {
    component.spinnerInput = "1";
    component.addManyRows();
    expect(component.spinnerInput).toBe(component.addRowCount + "");
  });

  it("should open check feedbacks dialog", () => {
    component.currentColumn = {
      value: "",
      isReadOnly: false,
      feedbackLeft: 0,
      feedbackData: [],
    };
    const copyEvent = { behavior: behaviors.checkFeedback };
    component.behavior(copyEvent);
    expect(component.showFeedback).toBe(true);
  });

  it("should open menu context", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.open(mouseEvent, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context for diagnosis codes", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.section.section.code = SectionCode.DiagnosisCodeOverlaps;
    component.open(mouseEvent, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context for rules", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.section.section.code = SectionCode.Rules;
    component.open(mouseEvent, 1, 1, column);
    expect(component.contextMenuOpen).toBe(true);
  });

  it("should open menu context fot auto populate sections", () => {
    const mouseEvent = new MouseEvent("click", { clientX: 1, clientY: 1 });
    const column: Column = {
      isReadOnly: false,
      value: "",
      feedbackData: [],
      feedbackLeft: 0,
    };
    component.isReadOnly = false;
    component.section.id = "daily_maximum_dose";
    component.open(mouseEvent, 1, 1, column);
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
    component.open(mouseEvent, 1, 1, column);
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
    component.open(mouseEvent, 1, 1, column);
    column.feedbackData = [feedback];
    column.feedbackLeft = 1;
    component.open(mouseEvent, 1, 1, column);
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
    component.currentColumn = component.section.rows[0].columns[0];
    component.open(mouseEvent, 1, 1, column);
    column.feedbackData = [feedback];
    column.feedbackLeft = 1;
    component.open(mouseEvent, 1, 1, column);
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
    component.open(mouseEvent, 0, 0, column);
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
    component.open(mouseEvent, 0, 0, column);
    const copyEvent = { behavior: behaviors.copyColumn };
    component.behavior(copyEvent);
    component.open(mouseEvent, 1, 0, column);
    const pasteEvent = { behavior: behaviors.pasteColumn };
    component.behavior(pasteEvent);
    const newValue =
      component.section.rows[component.selectedRowIndex].columns[
        component.selectedColumnIndex
      ].value;
    expect(newValue).toBe("Row1");
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
    const lastColumn = component.section.rows[1].columns[0];
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
    const fristColumn = component.section.rows[0].columns[0];
    expect(fristColumn.focus.hasFocus).toBe(true);
  });

  it("should navigate right", () => {
    component.cellNavigate(
      { type: arrowNavigation.right, isTabAction: false },
      0,
      0
    );
    const lastColumn = component.section.rows[1].columns[0];
    expect(lastColumn.focus.hasFocus).toBe(true);
    component.cellNavigate(
      { type: arrowNavigation.left, isTabAction: false },
      0,
      1
    );
    const firstColumn = component.section.rows[0].columns[0];
    expect(firstColumn.focus.hasFocus).toBe(true);
    component.cellNavigate(
      { type: arrowNavigation.up, isTabAction: false },
      0,
      1
    );
    expect(firstColumn.focus.hasFocus).toBe(true);
    component.cellNavigate(
      { type: arrowNavigation.down, isTabAction: false },
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
    component.currentColumn = component.section.rows[0].columns[0];
    component.savedFeedback(feedback);
    expect(component.currentColumn.feedbackData[0]).toEqual(feedback);
    component.openFeedback();
    component.removedFeedback(feedback);
    expect(component.currentColumn.feedbackData.length).toBe(0);
  });

  it("should set selection", () => {
    const selection = { endIndex: 5, beginIndex: 0, text: "tania" };
    const column = component.section.rows[0].columns[0];
    const row = component.section.rows[0];
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
    const column = component.section.rows[0].columns[0];
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

  it("should open section feedbacks", () => {
    component.openSectionFeedbacks();
    expect(component.showFeedback).toBe(true);
  });

  it("should activate menu item removeMultipleRows", () => {
    const removeMultipleRows = { behavior: behaviors.removeMultipleRows };
    component.behavior(removeMultipleRows);
    expect(component.checkAll).toBe(false);
    expect(component.cancelMultiSelect).toBe(true);
  });

  it("should cancel multi select ", () => {
    const cancelMultiSelectRows = { behavior: behaviors.cancelMultiSelectRows };
    component.behavior(cancelMultiSelectRows);
    expect(component.cancelMultiSelect).toBe(false);
    expect(component.checkAll).toBe(false);
    expect(component.selectedValues.length).toBe(0);
  });

  it("should delete all rows", () => {
    const confirmRemoveMultipleRows = {
      behavior: behaviors.confirmRemoveMultipleRows,
    };
    component.checkAll = true;
    component.selectedValues = component.section.rows.map((row) => row.codeUI);
    component.behavior(confirmRemoveMultipleRows);
    expect(component.cancelMultiSelect).toBe(false);
    expect(component.checkAll).toBe(false);
    expect(component.selectedValues.length).toBe(0);
  });

  it("should delete selected rows", () => {
    const confirmRemoveMultipleRows = {
      behavior: behaviors.confirmRemoveMultipleRows,
    };
    component.checkAll = false;
    component.selectedValues = [component.section.rows[0].codeUI];
    component.behavior(confirmRemoveMultipleRows);
    expect(component.cancelMultiSelect).toBe(false);
    expect(component.checkAll).toBe(false);
    expect(component.selectedValues.length).toBe(0);
  });

  it("should check all rows", () => {
    component.checkAll = false;
    component.checkAllRows(true);
    expect(component.selectedValues.length).toBe(2);
    component.checkAllRows(false);
    expect(component.selectedValues.length).toBe(0);
  });

  it("should add many rows", () => {
    component.addRowCount = 3;
    component.addManyRows();
    expect(component.section.rows.length).toBe(5);
  });

  it("should undo removed multiples rows", () => {
    const confirmRemoveMultipleRows = {
      behavior: behaviors.confirmRemoveMultipleRows,
    };
    component.checkAll = true;
    component.selectedValues = component.section.rows.map((row) => row.codeUI);
    component.behavior(confirmRemoveMultipleRows);
    component.undoRemoveMultiSelect(true);
  });

  it("should undo removed multiples rows", () => {
    component.confirmRemoveMultipleRows(false);
    expect(component.cancelMultiSelect).toBe(false);
  });

  it("should close comment box on remove", () => {
    component.currentColumn = component.section.rows[0].columns[0];
    component.currentColumn.comments = [commentData];
    component.removedComment(commentData);
    expect(component.showComment).toBe(false);
  });

  it("should display add comment", () => {
    const event = {
      behavior: behaviors.addComment,
    };
    component.selectedRowIndex = 0;
    component.selectedColumnIndex = 0;
    component.section.rows[0].columns[0].comments = [commentData];
    component.currentColumn = component.section.rows[0].columns[0];
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
    const column = component.section.rows[0].columns[0];
    component.commentsChange([commentData], column);
    expect(component.currentColumn).toEqual(column);
  });

  it("should check number key", () => {
    const evt = { keyCode: 30 };
    const result = component.isNumberKey(evt);
    expect(result).toBe(true);
  });

  it("should change sort", () => {
    component.section.section.code = SectionCode.DiagnosisCodes;
    component.sortData();
    expect(component.section.rows[0].columns[0].value).toBe("Row1");
  });

  it("should change sort", () => {
    component.section.section.code = SectionCode.DiagnosisCodes;
    component.sortReverse = true;
    component.sortData();
    expect(component.section.rows[0].columns[0].value).toBe("Row2");
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
    component.section.rows[0].columns[0].comments = [commentData];
    component.currentColumn = component.section.rows[0].columns[0];
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
    expect(component.showComment).toBe(false);
  });

  it("should update column width", () => {
    component.columnsChange(101, 0);
    expect(component.section.headersUIWidth[0]).toBe(101);
  });
});
