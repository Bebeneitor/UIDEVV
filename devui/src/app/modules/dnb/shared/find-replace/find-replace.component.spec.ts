import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmationService } from "primeng/api";
import { UISection } from "../../models/interfaces/uibase";
import { DnbUndoRedoService } from "../../services/undo-redo.service";
import { FindReplaceComponent } from "./find-replace.component";

@Component({
  selector: "app-find",
  template: "",
})
class FindReplaceChildComponent {
  @Input() sections: UISection[] = [];
  @Input() showFindAndReplace: boolean = false;
  @Input() showButtonReplace: boolean = false;
}

fdescribe("findReplaceComponent", () => {
  let component: FindReplaceComponent;
  let fixture: ComponentFixture<FindReplaceComponent>;
  let undoRedo: DnbUndoRedoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FindReplaceComponent, FindReplaceChildComponent],
      providers: [ConfirmationService, DnbUndoRedoService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindReplaceComponent);
    component = fixture.componentInstance;
    undoRedo = TestBed.get(DnbUndoRedoService);

    component.sections = [
      {
        current: {
          drugVersionCode: "725401a0-d36b-4b85-bc08-94d4975c0dff",
          section: {
            code: "test",
            name: "test",
          },
          headers: [],
          headersUIWidth: [],
          id: "combination_therapy",
          rows: [
            {
              hasBorder: false,
              columns: [
                {
                  isReadOnly: true,
                  value: "[HCPCS] (Descriptor)",
                  feedbackData: [],
                  feedbackLeft: 0,
                },
              ],
            },
          ],
        },
        grouped: false,
        hasRowHeading: false,
        new: {
          drugVersionCode: "725401a0-d36b-4b85-bc08-94d4975c0dff",
          section: {
            code: "test",
            name: "test",
          },
          headers: [],
          headersUIWidth: [],
          id: "general_information",
          rows: [
            {
              hasBorder: false,
              columns: [
                {
                  isReadOnly: false,
                  value: "[HCPCS] (Descriptor)",
                  feedbackData: [],
                  feedbackLeft: 0,
                },
              ],
            },
          ],
        },
        id: "general_information",
      },
      {
        current: {
          drugVersionCode: "725401a0-d36b-4b85-bc08-94d4975c0dff",
          section: {
            code: "test",
            name: "test",
          },
          headers: [],
          headersUIWidth: [],
          id: "combination_therapy",
          groups: [
            {
              names: [],
              rows: [
                {
                  hasBorder: false,
                  columns: [
                    {
                      isReadOnly: true,
                      value: "test",
                      feedbackData: [],
                      feedbackLeft: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        grouped: true,
        hasRowHeading: false,
        new: {
          drugVersionCode: "725401a0-d36b-4b85-bc08-94d4975c0dff",
          section: {
            code: "test",
            name: "test",
          },
          headers: [],
          headersUIWidth: [],
          id: "combination_therapy",
          groups: [
            {
              names: [],
              rows: [
                {
                  hasBorder: false,
                  columns: [
                    {
                      isReadOnly: true,
                      value: "test",
                      feedbackData: [],
                      feedbackLeft: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        id: "combination_therapy",
      },
    ];
    component.drugNameColumn = {
      value: "drug",
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
    };
    undoRedo.sections = component.sections;
    undoRedo.drugNameColumn = component.drugNameColumn;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should search all cells and create coincidences", () => {
    component.findWord = "[HCPCS] (Descriptor)";
    component.startSearch();
    expect(component.coincidences.length).toBe(2);
  });

  it("should not move to the next coincidence", () => {
    component.findWord = "[HCPCS] (Descriptor)";
    component.startSearch();
    expect(component.disableArrowDown).toBe(false);
    expect(component.disableArrowUp).toBe(true);
  });

  it("should replace all coincides", () => {
    component.findWord = "[HCPCS] (Descriptor)";
    component.startSearch();
    component.replaceAll();
    expect(component.coincidences.length).toBe(1);
  });

  it("should replace the selected coincidence", () => {
    component.findWord = "[HCPCS] (Descriptor)";
    component.startSearch();
    component.highlightSearchDown();
    component.replaceSelected();
    expect(component.coincidences.length).toBe(1);
  });

  it("should undo afer replacing all coincides", () => {
    component.findWord = "[HCPCS] (Descriptor)";
    component.startSearch();
    component.replaceAll();
    expect(component.coincidences.length).toBe(1);
  });

  it("should move down and up in coincidences", () => {
    component.findWord = "[HCPCS] (Descriptor)";
    component.startSearch();
    component.highlightSearchDown();
    expect(component.highlightIndex).toBe(1);
    component.highlightSearchUp();
    expect(component.highlightIndex).toBe(0);
  });
});
