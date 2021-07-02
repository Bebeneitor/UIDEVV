import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { OktaAuthService, OKTA_CONFIG } from "@okta/okta-angular";
import { of } from "rxjs";
import { DnbService } from "../../../services/dnb.service";
import { FeedbackComponent } from "./feedback.component";

fdescribe("FeedbackComponent", () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  const oktaConfig = {
    issuer: "https://{yourOktaDomain}/oauth2/default",
    clientId: "{clientId}",
    redirectUri: window.location.origin + "/login/callback",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        DnbService,
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should save new feedback", inject(
    [DnbService],
    (dnbService: DnbService) => {
      const spy = spyOn(dnbService, "addFeedback").and.returnValue(
        of({ getFeedbackInstanceItemId: "", feedbackInstanceId: "" })
      );
      component.feedback.sourceText = "tania";
      component.saveFeedback();
      expect(spy).toHaveBeenCalled();
    }
  ));
});
