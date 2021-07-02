import { DatePipe } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { OktaAuthService, OKTA_CONFIG } from "@okta/okta-angular";
import { ViewFeedbackComponent } from "./view-feedback.component";

fdescribe("ViewFeedbackComponent", () => {
  let component: ViewFeedbackComponent;
  let fixture: ComponentFixture<ViewFeedbackComponent>;
  const oktaConfig = {
    issuer: "https://{yourOktaDomain}/oauth2/default",
    clientId: "{clientId}",
    redirectUri: window.location.origin + "/login/callback",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFeedbackComponent],
      imports: [RouterTestingModule],
      providers: [
        DatePipe,
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeedbackComponent);
    component = fixture.componentInstance;
    component.feedbacks = [
      {
        resolved: false,
        hidden: false,
        instanceId: 0,
        itemId: 0,
        sectionRowUuid: "test",
        feedback: "fix this",
        sourceText: "some column text",
        beginIndex: 0,
        endIndex: 5,
        uiColumnAttribute: "test",
        uiSectionCode: "test",
        createdBy: "test",
        createdById: 0,
        createdOn: "10/10/2020",
      },
    ];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should sdisplay the feedback", () => {
    component.ngOnChanges();
    expect(component.feedbacks[0].htmlSourceText).toBe(
      "<span class='feedback-highlight'>some </span>column text"
    );
  });
});
