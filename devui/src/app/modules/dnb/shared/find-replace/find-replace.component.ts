import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { ConfirmationService } from "primeng/api";
import {
  HeaderDialog,
  IconDialog,
} from "../../models/constants/dialogConfig.constants";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import {
  Coincidence,
  Column,
  GroupedSection,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import { escapeRegExp } from "../../utils/tools.utils";

@Component({
  selector: "app-find",
  templateUrl: "./find-replace.component.html",
  styleUrls: ["./find-replace.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindReplaceComponent {
  @Input() sections: UISection[];
  @Input() showFindAndReplace: boolean = false;
  @Input() showButtonReplace: boolean = false;
  @Input() drugNameColumn: Column = null;
  @Input() shouldShowCurrent: boolean = true;
  @Output() showFindAndReplaceChange: EventEmitter<
    boolean
  > = new EventEmitter();
  shouldSeeReplaceBox: boolean = false;
  coincidences: Coincidence[] = [];
  allCoincidencesBackUp: Coincidence[] = [];
  replacedCoincidencesBackUp: Coincidence[] = null;
  replacedCoincidencesRef: Coincidence[] = null;
  findWord: string = "";
  replaceWord: string = "";
  disableArrowUp: boolean = false;
  disableArrowDown: boolean = false;
  disableReplace: boolean = false;
  disableReplaceAll: boolean = false;
  highlightIndex: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) {}

  toggleSearch(): void {
    this.showFindAndReplace = !this.showFindAndReplace;
    this.showFindAndReplaceChange.emit(this.showFindAndReplace);
    this.shouldSeeReplaceBox = false;
    if (!this.showFindAndReplace) {
      this.clearSearchData();
    }
    this.coincidences = [];
  }

  startSearch(): void {
    let columnId = { id: 0 };
    this.coincidences = [];
    this.disableReplace = this.disableReplaceAll = true;
    this.shouldSeeReplaceBox = false;
    this.clearSearchData();
    if (this.findWord.length === 0) {
      return;
    }
    this.findCoincidenceInColumn(this.drugNameColumn, columnId, -1, "");
    if (this.shouldShowCurrent) {
      this.sections.forEach((section, sectionIndex) => {
        this.findSearchInSection(
          section.current,
          columnId,
          section.grouped,
          sectionIndex,
          "current"
        );
      });
    }
    this.sections.forEach((section, sectionIndex) => {
      this.findSearchInSection(
        section.new,
        columnId,
        section.grouped,
        sectionIndex,
        "new"
      );
    });
    this.disableReplaceAll =
      this.coincidences.filter((coincidence) => !coincidence.column.isReadOnly)
        .length === 0;
    if (this.coincidences.length > 0) {
      this.highlightIndex = 0;
      const position = this.coincidences[this.highlightIndex].position;
      this.coincidences[this.highlightIndex].column.highlight = position;
      this.disableArrowUp = this.highlightIndex <= 0;
      this.disableArrowDown =
        this.highlightIndex >= this.coincidences.length - 1;
      this.disableReplace = this.coincidences[
        this.highlightIndex
      ].column.isReadOnly;
    }
  }

  findSearchInSection(
    section: Section | GroupedSection,
    columnId: { id: number },
    grouped: boolean,
    sectionIndex: number,
    type: string
  ): boolean {
    let found = false;
    if (grouped) {
      if (section.section.code === SectionCode.SecondaryMalignancy) {
        const foundCode = this.findCoincidenceInColumn(
          (section as Section).codesColumn,
          columnId,
          sectionIndex,
          type
        );
        found = found || foundCode;
      }
      (section as GroupedSection).groups.forEach((group) => {
        group.names.forEach((column) => {
          const foundCode = this.findCoincidenceInColumn(
            column,
            columnId,
            sectionIndex,
            type
          );
          found = found || foundCode;
        });
        group.rows.forEach((row) => {
          row.columns.forEach((column) => {
            const foundCode = this.findCoincidenceInColumn(
              column,
              columnId,
              sectionIndex,
              type
            );
            found = found || foundCode;
          });
        });
      });
    } else {
      if (section.section.code === SectionCode.DailyMaxUnits) {
        const foundCode = this.findCoincidenceInColumn(
          (section as Section).codesColumn,
          columnId,
          sectionIndex,
          type
        );
        found = found || foundCode;
      }
      (section as Section).rows.forEach((row) => {
        row.columns.forEach((column) => {
          const foundColumn = this.findCoincidenceInColumn(
            column,
            columnId,
            sectionIndex,
            type
          );
          found = found || foundColumn;
        });
      });
    }
    if (found) {
      if (type === "current") {
        this.sections[sectionIndex].current = {
          ...section,
        };
      }
      if (type === "new") {
        this.sections[sectionIndex].new = {
          ...section,
        };
      }
    }
    return found;
  }

  clearSearchData(): void {
    this.drugNameColumn.searchData = null;
    this.drugNameColumn.highlight = null;
    this.sections.forEach((section) => {
      this.clearSectionSearchData(section.current, section.grouped);
      this.clearSectionSearchData(section.new, section.grouped);
    });
  }

  findCoincidenceInColumn(
    column: Column,
    columnId: { id: number },
    sectionIndex: number,
    sectionType: string
  ): boolean {
    let found = false;
    const regexp = RegExp(escapeRegExp(this.findWord), "gi");
    const str = column.value;
    let match;
    const foundPositions = [];
    while ((match = regexp.exec(str)) !== null) {
      foundPositions.push(match.index);
    }
    if (foundPositions.length > 0) {
      found = true;
      column.searchData = {
        length: this.findWord.length,
        positions: foundPositions,
      };
      column.highlight = null;
      const highglights: Coincidence[] = column.searchData.positions.map(
        (position) => {
          return {
            column,
            position,
            columnId: columnId.id,
            sectionIndex,
            sectionType,
          };
        }
      );
      this.coincidences = this.coincidences.concat(highglights);
    }
    columnId.id++;
    return found;
  }

  clearSectionSearchData(section: Section | GroupedSection, grouped: boolean) {
    if (grouped) {
      const codes = (section as GroupedSection).codesColumn;
      if (codes) {
        codes.searchData = null;
        codes.highlight = null;
      }
      (section as GroupedSection).groups.forEach((group) => {
        group.names.forEach((column) => {
          column.searchData = null;
          column.highlight = null;
        });
        group.rows.forEach((row) => {
          row.columns.forEach((column) => {
            column.searchData = null;
            column.highlight = null;
          });
        });
      });
    } else {
      const codes = (section as Section).codesColumn;
      if (codes) {
        codes.searchData = null;
        codes.highlight = null;
      }
      (section as Section).rows.forEach((row) => {
        row.columns.forEach((column) => {
          column.searchData = null;
          column.highlight = null;
        });
      });
    }
  }

  updateSection(sectionIndex: number, sectionType: string): void {
    if (sectionType === "new") {
      this.sections[sectionIndex].new = {
        ...this.sections[sectionIndex].new,
      };
    }
    if (sectionType === "current") {
      this.sections[sectionIndex].current = {
        ...this.sections[sectionIndex].current,
      };
    }
  }

  updateHighlight(oldIndex: number): void {
    this.disableReplace = this.coincidences[
      this.highlightIndex
    ].column.isReadOnly;
    const position = this.coincidences[this.highlightIndex].position;
    this.coincidences[oldIndex].column.highlight = null;
    let sectionIndex = this.coincidences[oldIndex].sectionIndex;
    let sectionType = this.coincidences[oldIndex].sectionType;
    this.updateSection(sectionIndex, sectionType);
    this.coincidences[this.highlightIndex].column.highlight = position;
    sectionIndex = this.coincidences[this.highlightIndex].sectionIndex;
    sectionType = this.coincidences[this.highlightIndex].sectionType;
    this.updateSection(sectionIndex, sectionType);
  }

  highlightSearchUp(): void {
    const oldIndex = this.highlightIndex;
    this.highlightIndex = this.highlightIndex - 1;
    this.disableArrowUp = this.highlightIndex <= 0;
    this.disableArrowDown = this.highlightIndex >= this.coincidences.length - 1;
    if (this.disableArrowUp) {
      this.highlightIndex = 0;
    }
    this.updateHighlight(oldIndex);
  }

  highlightSearchDown(): void {
    const oldIndex = this.highlightIndex;
    this.highlightIndex = this.highlightIndex + 1;
    this.disableArrowUp = this.highlightIndex <= 0;
    this.disableArrowDown = this.highlightIndex >= this.coincidences.length - 1;
    if (this.disableArrowDown) {
      this.highlightIndex = this.coincidences.length - 1;
    }
    this.updateHighlight(oldIndex);
  }

  replaceSelected(): void {
    const selected = this.coincidences[this.highlightIndex].column;
    const sectionIndex = this.coincidences[this.highlightIndex].sectionIndex;
    const sectionType = this.coincidences[this.highlightIndex].sectionType;
    const text = selected.value;
    const index = this.coincidences[this.highlightIndex].position;
    const columnId = this.coincidences[this.highlightIndex].columnId;
    const firstColumnIndex = this.coincidences.findIndex(
      (column) => column.columnId === columnId
    );
    this.coincidences = this.coincidences.filter(
      (column) => column.columnId !== columnId
    );
    const regexp = RegExp(escapeRegExp(this.findWord), "gi");
    const newText =
      text.substring(0, index) +
      this.replaceWord +
      text.substring(index + selected.searchData.length);
    selected.value = newText;
    const str = selected.value;
    let match;
    const foundPositions = [];
    while ((match = regexp.exec(str)) !== null) {
      foundPositions.push(match.index);
    }
    let highglights: Coincidence[];
    if (foundPositions.length > 0) {
      selected.searchData = {
        length: this.findWord.length,
        positions: foundPositions,
      };
      highglights = selected.searchData.positions.map((position) => {
        return {
          column: selected,
          position,
          columnId,
          sectionIndex,
          sectionType,
        };
      });
    } else {
      selected.searchData = null;
      highglights = [];
    }
    selected.highlight = null;
    const arr1 = this.coincidences.slice(0, firstColumnIndex);
    const arr2 = this.coincidences.slice(firstColumnIndex);
    this.coincidences = arr1.concat(highglights, arr2);
    if (this.highlightIndex >= this.coincidences.length) {
      this.highlightIndex = 0;
    }

    if (this.coincidences.length === 0) {
      this.shouldSeeReplaceBox = false;
      this.disableReplace = this.disableReplaceAll = true;
    } else {
      const position = this.coincidences[this.highlightIndex].position;
      this.coincidences[this.highlightIndex].column.highlight = position;
      this.disableReplace = this.coincidences[
        this.highlightIndex
      ].column.isReadOnly;
      this.disableReplaceAll =
        this.coincidences.filter(
          (coincidence) => !coincidence.column.isReadOnly
        ).length === 0;
    }
    this.disableArrowUp = this.highlightIndex <= 0;
    this.disableArrowDown = this.highlightIndex >= this.coincidences.length - 1;
    this.updateSection(sectionIndex, sectionType);
  }

  confirmReplaceAll(): void {
    const replaceCount = this.coincidences.filter(
      (coincidence) => !coincidence.column.isReadOnly
    ).length;
    this.confirmationService.confirm({
      message: `Are you sure you want to replace ${replaceCount} matches?`,
      header: HeaderDialog.confirm,
      icon: IconDialog.question,
      accept: () => {
        this.replaceAll();
      },
      reject: () => {},
    });
  }

  replaceAll(): void {
    this.allCoincidencesBackUp = this.coincidences;
    const allConcidencesToReplace = this.coincidences.filter(
      (coincidence) => !coincidence.column.isReadOnly
    );
    const allConcidencesToRemain = this.coincidences.filter(
      (coincidence) => coincidence.column.isReadOnly
    );
    this.replacedCoincidencesRef = allConcidencesToReplace;
    this.replacedCoincidencesBackUp = allConcidencesToReplace.map(
      (coincidence) => {
        return {
          ...coincidence,
          column: {
            ...coincidence.column,
            searchData: { ...coincidence.column.searchData },
          },
        };
      }
    );
    allConcidencesToReplace.reverse().forEach((coincidence) => {
      const selected = coincidence.column;
      const text = selected.value;
      const searchData = selected.searchData;
      if (searchData) {
        const newText =
          text.substring(0, coincidence.position) +
          this.replaceWord +
          text.substring(coincidence.position + selected.searchData.length);
        selected.value = newText;
        const sectionIndex = coincidence.sectionIndex;
        const sectionType = coincidence.sectionType;
        this.updateSection(sectionIndex, sectionType);
      }
    });
    allConcidencesToReplace.forEach((coincidence) => {
      coincidence.column.searchData = null;
      coincidence.column.highlight = null;
    });
    this.coincidences = allConcidencesToRemain;
    const oldIndex = this.highlightIndex;
    this.highlightIndex = 0;
    this.updateHighlight(oldIndex);
    this.disableReplace = true;
    if (this.coincidences.length > 0) {
      const position = this.coincidences[this.highlightIndex].position;
      this.coincidences[this.highlightIndex].column.highlight = position;
      this.disableReplace = this.coincidences[
        this.highlightIndex
      ].column.isReadOnly;
    }
    this.disableArrowUp = this.highlightIndex <= 0;
    this.disableArrowDown = this.highlightIndex >= this.coincidences.length - 1;
    this.disableReplaceAll = true;
    this.cd.detectChanges();
  }

  confirmUndoReplaceAll(): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to undo the last replace all`,
      header: HeaderDialog.confirm,
      icon: IconDialog.warning,
      accept: () => {
        this.undoReplaceAll();
      },
      reject: () => {},
    });
  }

  undoReplaceAll(): void {
    this.replacedCoincidencesRef = this.replacedCoincidencesRef.reverse();
    this.replacedCoincidencesBackUp.forEach((coincidence, index) => {
      this.replacedCoincidencesRef[index].column.value =
        coincidence.column.value;
      this.replacedCoincidencesRef[index].column.searchData =
        coincidence.column.searchData;
      this.replacedCoincidencesRef[index].column.highlight =
        coincidence.column.highlight;
      const sectionIndex = coincidence.sectionIndex;
      const sectionType = coincidence.sectionType;
      this.updateSection(sectionIndex, sectionType);
    });

    this.coincidences = this.allCoincidencesBackUp;
    this.replacedCoincidencesBackUp = null;
    this.disableReplaceAll =
      this.coincidences.filter((coincidence) => !coincidence.column.isReadOnly)
        .length === 0;
    const oldIndex = this.highlightIndex;

    if (this.coincidences.length > 0) {
      this.highlightIndex = 0;
      const position = this.coincidences[this.highlightIndex].position;
      this.coincidences[this.highlightIndex].column.highlight = position;
      this.disableArrowUp = this.highlightIndex <= 0;
      this.disableArrowDown =
        this.highlightIndex >= this.coincidences.length - 1;
      this.disableReplace = this.coincidences[
        this.highlightIndex
      ].column.isReadOnly;
    }
    this.updateHighlight(oldIndex);
    this.cd.detectChanges();
  }
}
