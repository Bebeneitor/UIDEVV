import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { NgModel } from "@angular/forms";
import { ToastMessageService } from "src/app/services/toast-message.service";

@Directive({
  selector: "[appMaxLength]",
})
export class MaxLengthDirective {
  @Input() appMaxLength: any;

  constructor(
    private el: ElementRef,
    private toastService: ToastMessageService,
    private ngModel: NgModel
  ) {}

  @HostListener("input", ["$event"]) onChange(event) {
    const newData: string = this.ngModel.viewModel;
    if (newData.length > this.appMaxLength) {
      this.el.nativeElement.value = newData.slice(0, this.appMaxLength);
      this.toastService.messageWarning(
        "Warning!",
        `Maximum character limit exceeded in text field.`,
        6000,
        true
      );
    }
  }
}
