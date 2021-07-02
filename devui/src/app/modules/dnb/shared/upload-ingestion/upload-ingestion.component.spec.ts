import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "primeng/primeng";
import { of } from "rxjs";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { DnbService } from "../../services/dnb.service";
import { UploadIngestionComponent } from "./upload-ingestion.component";
import {
  OKTA_CONFIG,
  OktaAuthService,
  OktaAuthModule,
} from "@okta/okta-angular";
fdescribe("UploadIngestionComponent", () => {
  let component: UploadIngestionComponent;
  let fixture: ComponentFixture<UploadIngestionComponent>;

  const oktaConfig = {
    issuer: "https://not-real.okta.com",
    clientId: "fake-client-id",
    redirectUri: "http://localhost:4200",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadIngestionComponent],
      imports: [
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        OktaAuthModule,
      ],
      providers: [
        OktaAuthService,
        { provide: OKTA_CONFIG, useValue: oktaConfig },
      ],
    }).compileComponents();
  }));
  beforeEach(inject([DnbService], (dnbService: DnbService) => {
    spyOn(dnbService, "uploadIngestTemplate").and.returnValue(
      of({
        processId: "id",
      })
    );
    spyOn(dnbService, "getIngestStatus").and.returnValue(
      of({
        completed: true,
        sections: [
          { ingested: true, sectionCode: SectionCode.GeneralInformation },
        ],
      })
    );

    fixture = TestBed.createComponent(UploadIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should upload and poll ingestion", () => {
    const event = {
      files: [{ name: "file" }],
    };
    component.uploadHandler(event);
    expect(component.dataIngested).toBe(true);
  });

  it("should cancel ingestion", () => {
    const event = {
      files: [{ name: "file" }],
    };
    component.uploadHandler(event);
    expect(component.dataIngested).toBe(true);
    component.cancel();
    expect(component.dataIngested).toBe(false);
  });

  it("should emit replace", () => {
    const spy = spyOn(component.getIngestedContent, "emit");
    const event = {
      files: [{ name: "file" }],
    };
    component.uploadHandler(event);
    expect(component.dataIngested).toBe(true);
    component.replaceContent();
    expect(spy).toHaveBeenCalled();
  });
});
