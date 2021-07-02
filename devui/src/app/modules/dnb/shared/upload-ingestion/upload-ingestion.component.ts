import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FileUpload } from "primeng/primeng";
import {
  delay,
  filter,
  finalize,
  flatMap,
  map,
  repeatWhen,
  take,
} from "rxjs/operators";
import { FileManagerService } from "src/app/shared/services/file-manager.service";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import {
  IngestedData,
  IngestedSection,
} from "../../models/interfaces/drugversion";
import { DnbService } from "../../services/dnb.service";
import { clearNewSection } from "../../utils/convertAPIToUI.utils";

@Component({
  selector: "app-dnb-upload-ingestion",
  templateUrl: "./upload-ingestion.component.html",
  styleUrls: ["./upload-ingestion.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UploadIngestionComponent {
  @Input() isNew: boolean = false;
  @Input() editable: boolean = false;
  @Input() drugCode: string = "";
  @Input() drugName: string = "";
  @Output() getIngestedContent: EventEmitter<string> = new EventEmitter();
  @Output() drugNameChanged: EventEmitter<string> = new EventEmitter();
  @Output() drugCreated: EventEmitter<string> = new EventEmitter();
  @ViewChild("upload",{static: false}) upload: FileUpload;

  isIngesting: boolean = false;
  dataIngested: boolean = false;
  canIngest: boolean = false;
  ingestedData: IngestedSection[] = [];
  versionId: string = "";
  fileName: string = "";
  constructor(
    private dnbService: DnbService,
    private fileManagerService: FileManagerService
  ) {}

  downloadTemplate() {
    this.dnbService.getIngestionTemplate().subscribe((result) => {
      this.fileManagerService.createDownloadFileElement(
        result,
        "DandB_Template.docx"
      );
    });
  }

  nameChange() {
    this.drugNameChanged.emit(this.drugName);
  }

  getContent() {
    this.upload.upload();
  }

  onSelect(event) {
    this.fileName = event.files[0].name;
    this.canIngest = true;
  }

  uploadHandler(event) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append("drdDocument", file);
    if (this.isNew) {
      formData.append("drugName", this.drugName);
    } else {
      formData.append("drugCode", this.drugCode);
    }
    this.isIngesting = true;
    this.pollIngestStatus(formData);
  }

  pollIngestStatus(formData) {
    this.dnbService
      .uploadIngestTemplate(formData)
      .pipe(
        map((response) => {
          if (this.isNew) {
            this.drugCreated.emit(response.drugCode);
          }
          return response.processId;
        }),
        flatMap((versionId) =>
          this.dnbService.getIngestStatus(versionId).pipe(
            repeatWhen((obs) => obs.pipe(delay(5000))),
            filter((data) => data.completed),
            take(1)
          )
        ),
        finalize(() => (this.isIngesting = false))
      )
      .subscribe((response: IngestedData) => {
        this.dataIngested = true;
        this.versionId = response.processId;
        this.ingestedData = response.sections
          ? response.sections.map((section) => {
              return {
                ...section,
                name: this.getSectionNamebyCode(section.sectionCode),
              };
            })
          : [];
      });
  }

  replaceContent() {
    this.dataIngested = false;
    this.ingestedData = [];
    this.canIngest = false;
    this.getIngestedContent.emit(this.versionId);
  }

  cancel() {
    this.dataIngested = false;
    this.ingestedData = [];
    this.canIngest = false;
  }

  getSectionNamebyCode(code: string): string {
    const sections = [
      clearNewSection(SectionCode.GeneralInformation, ""),
      clearNewSection(SectionCode.References, ""),
      clearNewSection(SectionCode.DailyMaxUnits, ""),
      clearNewSection(SectionCode.LCD, ""),
      clearNewSection(SectionCode.MedicalJournal, ""),
      clearNewSection(SectionCode.Notes, ""),
      clearNewSection(SectionCode.Indications, ""),
      clearNewSection(SectionCode.DiagnosisCodes, ""),
      clearNewSection(SectionCode.DiagnosticCodeSummary, ""),
      clearNewSection(SectionCode.ManifestationCodes, ""),
      clearNewSection(SectionCode.DosingPatterns, ""),
      clearNewSection(SectionCode.DailyMaximumDose, ""),
      clearNewSection(SectionCode.MaximumFrequency, ""),
      clearNewSection(SectionCode.Age, ""),
      clearNewSection(SectionCode.Gender, ""),
      clearNewSection(SectionCode.UnitsOverTime, ""),
      clearNewSection(SectionCode.VisitOverTime, ""),
      clearNewSection(SectionCode.DiagnosisCodeOverlaps, ""),
      clearNewSection(SectionCode.SecondaryMalignancy, ""),
      clearNewSection(SectionCode.CombinationTherapy, ""),
      clearNewSection(SectionCode.GlobalReviewIndications, ""),
      clearNewSection(SectionCode.GlobalReviewCodes, ""),
      clearNewSection(SectionCode.Rules, "Rules"),
    ];

    const found = sections.find((section) => section.section.code === code);
    return found ? found.section.name : "";
  }
}
