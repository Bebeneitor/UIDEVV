import { Component } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { MessageService } from "primeng/api";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { MaxLengthDirective } from "./dnb-maxlength.directive";
import { ResizableDirective } from "./resize.directive";

@Component({
  template: ` <input
      id="test"
      appMaxLength="10"
      [ngModel]="value"
      (ngModelChange)="test()"
    />
    <table>
      <tr>
        <th id="test2" (resizable)="test2($event)"></th>
      </tr>
    </table>`,
})
class TestComponent {
  value = 5;
  value2 = 1;
  test(data) {
    this.value = data;
  }
  test2(data) {
    this.value2 = data;
  }
}

fdescribe("directives", () => {
  let toast: ToastMessageService;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, MaxLengthDirective, ResizableDirective],
      imports: [FormsModule],
      providers: [ToastMessageService, MessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    toast = TestBed.get(ToastMessageService);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it("should emit dialog hidden", () => {
    const spy = spyOn(toast, "messageWarning");
    fixture.detectChanges();
    let dr = fixture.debugElement.query(By.css("#test")).nativeElement;
    dr.value = "12345678900";
    dr.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it("should emit dialog hidden", () => {
    fixture.detectChanges();
    let dr = fixture.debugElement.query(By.css("#test2")).nativeElement;
    dr.dispatchEvent(new MouseEvent("mousedown"));
    document.dispatchEvent(new MouseEvent("mousemove", { clientX: 1 }));
    dr.dispatchEvent(new MouseEvent("mouseup"));
    dr.dispatchEvent(new MouseEvent("click"));
    fixture.detectChanges();
    expect(component.value2).toBe(-3000);
  });
});
