import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { NavigationItem } from "../../models/interfaces/navigation";

@Component({
  selector: "app-dnb-section-navigation",
  templateUrl: "./section-navigation.component.html",
  styleUrls: ["./section-navigation.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionNavigationComponent {
  @Input() navigationItems: NavigationItem[];
  @Input() isFullScreen: boolean = false;
  @Input() isNavigationOpen: boolean = false;
  @Output() isNavigationOpenChange: EventEmitter<boolean> = new EventEmitter();

  scrollTo(section: string): void {
    const el = document.getElementById(section);
    if (el) {
      const yOffset = 45;
      const y = el.getBoundingClientRect().top + window.pageYOffset;
      if ((this, this.isFullScreen)) {
        const el = document.getElementById(section);
        const fixedDiv = document.querySelector(".dnb-page.is-fullscreen");
        fixedDiv.scrollTop = el.offsetTop - yOffset;
      } else {
        window.scrollTo({ top: y - yOffset, behavior: "smooth" });
      }
    }
  }

  toggleNavigation(): void {
    this.isNavigationOpen = !this.isNavigationOpen;
    this.isNavigationOpenChange.emit(this.isNavigationOpen);
  }
}
