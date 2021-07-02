import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { DnBMidrulesService } from "../../../services/dnb-midrules.service";
import { MidRulesEllSummaryComponent } from "./mid-rules-ell-summary.component";
@Component({ selector: "p-dialog", template: "<div #dialog></div>" })
class DialogStub {
  @Input() header: string = "";
  @Input() visible: boolean = false;
  @Input() modal: boolean = false;
  center() {}
}
 describe("MidRulesEllSummaryComponent", () => {
  let component: MidRulesEllSummaryComponent;
  let fixture: ComponentFixture<MidRulesEllSummaryComponent>;
  let dnbMidruleService: DnBMidrulesService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MidRulesEllSummaryComponent, DialogStub],
      imports: [HttpClientTestingModule],
      providers: [DnBMidrulesService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRulesEllSummaryComponent);
    dnbMidruleService = TestBed.get(DnBMidrulesService);
    spyOn(dnbMidruleService, "getRulesDrugCode").and.returnValue(
      of([
        {
          midRuleKey: 1,
          ruleVersion: 1,
          topicTitle: "test",
          unresolvedDesc: "test",
          vtopicKey: 1,
        },
        {
          midRuleKey: 2,
          ruleVersion: 3,
          topicTitle: "test",
          unresolvedDesc: "test",
          vtopicKey: 1,
        },
      ])
    );
    component = fixture.componentInstance;
    component.draftVersion = {
      feedbackData: [],
      feedbackLeft: 0,
      headers: ["header 1", "header 2", "header 3"],
      headersUIWidth: [10, 10, 10],
      section: { code: "code", name: "section" },
      drugVersionCode: "id",
      id: "id",
      rows: [
        {
          columns: [
            {
              value: "test",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
            {
              value: "1.1",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
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
              value: "2.2",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
            {
              value: "Row1",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
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
              value: "3.3",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
            {
              value: "Row1",
              isReadOnly: false,
              feedbackData: [],
              feedbackLeft: 0,
              comments: [],
            },
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
      ],
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    component.openDialog = true;
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it("should emit dialog hidden", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.ngOnChanges();
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });
});
