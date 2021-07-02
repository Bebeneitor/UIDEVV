import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { OktaAuthService, OKTA_CONFIG } from "@okta/okta-angular";
import { MessageService } from "primeng/components/common/messageservice";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { CommentComponent } from "./comment.component";

fdescribe("CommentComponent", () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  const oktaConfig = {
    issuer: "https://{yourOktaDomain}/oauth2/default",
    clientId: "{clientId}",
    redirectUri: window.location.origin + "/login/callback",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        ToastMessageService,
        MessageService,
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should spy update", () => {
    const spy = spyOn(component.changed, "emit");
    component.commentChange("");
    expect(spy).toHaveBeenCalled();
  });
});
