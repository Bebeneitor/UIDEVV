import { Component } from "@angular/core";
import { LoadingSpinnerService } from "../../../services/spinner.service";

@Component({
  selector: "app-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ["./loading-spinner.component.css"],
})
export class SpinnerComponent {
  constructor(public loaderService: LoadingSpinnerService) {}
}
