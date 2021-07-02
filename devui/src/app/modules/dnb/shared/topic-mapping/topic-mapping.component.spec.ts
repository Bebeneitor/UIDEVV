import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input, SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { of } from "rxjs";
import { StorageService } from "src/app/services/storage.service";
import { DnbEllService } from "../../services/dnb-ell.service";
import { TopicMappingComponent } from "./topic-mapping.component";
@Component({ selector: "app-mid-rules-ell", template: "" })
class topicMapingStubComponent {
  @Input() openDialog: boolean;
  @Input() readOnlyDialog: boolean;
  @Input() topicName: string;
}

@Component({ selector: "p-dialog", template: "" })
class DialogStubComponent {
  @Input() visible: any;
  @Input() header: string;
}

@Component({ selector: "p-footer", template: "" })
class foterStubComponent {}

@Component({ selector: "input", template: "" })
class inputStubComponent {
  @Input() ngModel: any;
}
fdescribe("TopicMappingComponent", () => {
  let component: TopicMappingComponent;
  let fixture: ComponentFixture<TopicMappingComponent>;
  let ellService: DnbEllService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TopicMappingComponent,
        topicMapingStubComponent,
        DialogStubComponent,
        inputStubComponent,
        foterStubComponent,
      ],
      providers: [DnbEllService, StorageService, MessageService],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    ellService = TestBed.get(DnbEllService);
    spyOn(ellService, "updateEllTopic").and.returnValue(of([{ test: "test" }]));
    spyOn(ellService, "createEllTopic").and.returnValue(of([{ test: "test" }]));
    spyOn(ellService, "deleteEllTopic").and.returnValue(of([{ test: "test" }]));
    fixture = TestBed.createComponent(TopicMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should detect changes", () => {
    const changes = {
      openDialog: new SimpleChange(null, true, true),
      ellTopic: new SimpleChange(null, "test", true),
    };
    component.ngOnChanges(changes);
    expect(component).toBeTruthy();
  });

  it("should emit dialog hidden", () => {
    const event = spyOn(component.openDialogChange, "emit");
    component.dialogHidden();
    expect(event).toHaveBeenCalled();
  });

  it("should open ell rules on read only", () => {
    component.openEllRules();
    expect(component.readOnlyDialog).toBe(true);
    expect(component.openEllRulesFlag).toBe(true);
  });

  it("should validate max length and special characters", () => {
    component.ellTopic =
      "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890@#$$#%#$%&$%^$&^QWERTYU";
    component.validateData(component.ellTopic);
    expect(component.ellTopic.length).toBe(512);
  });

  it("should create new topic relation", () => {
    const spy = spyOn(component.updateData, "emit");
    component.ellTopic = "New topic";
    component.newTopic = true;
    component.drugCode = "";
    component.applyChanges();
    expect(spy).toHaveBeenCalled();
  });

  it("should update topic relation", () => {
    const spy = spyOn(component.updateData, "emit");
    component.ellTopic = "Update topic";
    component.newTopic = false;
    component.applyChanges();
    expect(spy).toHaveBeenCalled();
  });

  it("should delete topic relation", () => {
    const spy = spyOn(component.updateData, "emit");
    component.ellTopic = "";
    component.newTopic = false;
    component.applyChanges();
    expect(spy).toHaveBeenCalled();
  });
});
