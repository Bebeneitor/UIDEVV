import { Component, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { OktaAuthService, OKTA_CONFIG } from "@okta/okta-angular";
import { PinnedSectionsComponent } from "./pinned-sections.component";

@Component({ selector: "app-sections-sticky", template: "" })
class SectionsStickyStubComponent {
  @Input() stickySection = null;
}

fdescribe("PinnedSectionsComponent", () => {
  let component: PinnedSectionsComponent;
  let fixture: ComponentFixture<PinnedSectionsComponent>;
  const oktaConfig = {
    issuer: "https://{yourOktaDomain}/oauth2/default",
    clientId: "{clientId}",
    redirectUri: window.location.origin + "/login/callback",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PinnedSectionsComponent, SectionsStickyStubComponent],
      providers: [
        OktaAuthService,
        {
          provide: OKTA_CONFIG,
          useValue: oktaConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnedSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should undo sticky section", () => {
    component.undoStickSection({ index: 1 });
    expect(component.stickySections.length).toBe(0);
  });
});
