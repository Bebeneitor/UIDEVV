import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingSpinnerService {
  public isLoading = new BehaviorSubject<boolean>(false);
  private message: string = "Opening...";

  setMessage(operation: string, url: string) {
    if (
      operation === "POST" &&
      url.indexOf("/list-by-page") === -1 &&
      url.indexOf("/approval-process") === -1
    )
      this.message = "Saving...";
    else this.message = "Opening...";
  }

  setDisplayMessage(message: string){
    if (message)
      this.message = message;
  }
}
