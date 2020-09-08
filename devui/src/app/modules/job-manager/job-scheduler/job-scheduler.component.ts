import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/api';

@Component({
  selector: 'app-job-scheduler',
  templateUrl: './job-scheduler.component.html',
  styleUrls: ['./job-scheduler.component.css']
})

export class JobSchedulerComponent implements OnInit {

  pageName: string;
  timeOptions: any[] = [];
  tens: number[] = [0, 1, 2, 3, 4, 5];
  units: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  daysOfWeekOptions: any[] = [];
  daysOfMonthOptions: any[] = [];
  weeksInMonthOptions: any[] = [];
  monthsOptions: any[] = [];
  yearsRangeOptions: any[] = [];
  followingYearsOptions: any[] = [];
  cols: any[] = [];
  cronExpressionParts: any[] = [];
  cronExpression: string = "";
  selectedSecondsRadio: string = "";
  everySecond: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  startingSecond: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  secondBetween1: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  secondBetween2: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  selectedSecondsCheckBox: string[] = [];
  selectedMinutesRadio: string = "";
  everyMinute: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  startingMinute: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  minuteBetween1: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  minuteBetween2: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  selectedMinutesCheckBox: string[] = [];
  selectedHoursRadio: string = "";
  everyHour: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  startingHour: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  hourBetween1: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  hourBetween2: any = { oneDigit: 1, twoDigits: "00", value: { oneDigit: 1, twoDigits: "00" } };
  selectedHoursCheckBox: string[] = [];
  selectedDaysRadio: string = "";
  everyDayOfWeek: any = { number: 1, name: "Sunday", value: { index: 1, prefix: "SUN" } };
  startingDayOfWeek: any = { number: 1, name: "Sunday", value: { index: 1, prefix: "SUN" } };
  everyDayOfMonth: any = { number: 1, ordinal: this.getOrdinalNumber(1), value: 1 };
  startingDayOfMonth: any = { number: 1, ordinal: this.getOrdinalNumber(1), value: 1 };
  lastDayOfWeekOfMonth: any = { number: 1, name: "Sunday", value: { index: 1, prefix: "SUN" } };
  daysBeforeEndOfMonth: any = { number: 1, ordinal: this.getOrdinalNumber(1), value: 1 };
  limitDayOfMonth: any = { number: 1, ordinal: this.getOrdinalNumber(1), value: 1 };
  ordinalWeekDayOfMonth: number = 1;
  weekDayOfMonth: any = { number: 1, name: "Sunday", value: { index: 1, prefix: "SUN" } };;
  selectedDaysOfWeekCheckBox: string[] = [];
  selectedDaysOfMonthCheckBox: string[] = [];
  selectedMonthsRadio: string = "";
  everyMonth: any = { number: 1, name: "January", value: { index: 1, prefix: "JAN" } };
  startingMonth: any = { number: 1, name: "January", value: { index: 1, prefix: "JAN" } };
  monthBetween1: any = { number: 1, name: "January", value: { index: 1, prefix: "JAN" } };
  monthBetween2: any = { number: 1, name: "January", value: { index: 1, prefix: "JAN" } };
  selectedMonthsCheckBox: string[] = [];
  selectedYearsRadio: string = "";
  everyYear: number = 1;
  startingYear: number = new Date().getFullYear();
  yearBetween1: number = new Date().getFullYear();
  yearBetween2: number = new Date().getFullYear();
  selectedYearsCheckBox: string[] = [];
  jobSchedulerButtonName = "";

  constructor(public route: ActivatedRoute, private messageService: MessageService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private dialogService: DialogService) {
    this.fillTimeOptions();
    this.fillDaysOfWeekOptions();
    this.fillDaysOfMonthOptions();
    this.fillWeeksInMonthOptions();
    this.fillMonthsOptions();
    this.fillYearsRangeOptions();
    this.fillFollowingYearsOptions();
  }

  ngOnInit() {
    let parentScreen = this.config.data.screen;
    if (parentScreen == "Job Manager") {
      this.jobSchedulerButtonName = "Use Cron Expression";
    } else if (parentScreen == "Job Creation") {
      this.jobSchedulerButtonName = "Generate Cron Expression";
    }
    let cronExpression = this.config.data.cronExpression;
    cronExpression = cronExpression == null || cronExpression == "" ? "0 0 0 ? * * *" : cronExpression;
    this.cronExpression = cronExpression;
    this.cols = [
      { field: 'cronSeconds', header: 'Seconds' },
      { field: 'cronMinutes', header: 'Minutes' },
      { field: 'cronHours', header: 'Hours' },
      { field: 'cronDaysOfMonth', header: 'Day Of Month' },
      { field: 'cronMonth', header: 'Month' },
      { field: 'cronDaysOfWeek', header: 'Day Of Week' },
      { field: 'cronYear', header: 'Year' }
    ];
    let cronExpressionParts = cronExpression.split(" ");
    this.cronExpressionParts = [
      {
        cronSeconds: cronExpressionParts[0],
        cronMinutes: cronExpressionParts[1],
        cronHours: cronExpressionParts[2],
        cronDaysOfMonth: cronExpressionParts[3],
        cronMonth: cronExpressionParts[4],
        cronDaysOfWeek: cronExpressionParts[5],
        cronYear: cronExpressionParts[6]
      }
    ];
    this.loadCronExpression(cronExpressionParts);
    this.route.data.subscribe(params => {
      this.pageName = params['pageTitle'];
    });
  }

  fillTimeOptions() {
    for (let tens = 0; tens < 6; tens++) {
      for (let units = 0; units < 10; units++) {
        let number = tens.toString() + units.toString();
        this.timeOptions.push({ oneDigit: (Number(number) + 1), twoDigits: number, value: { oneDigit: (Number(number) + 1), twoDigits: number } });
      }
    }
  }

  fillDaysOfWeekOptions() {
    this.daysOfWeekOptions.push(
      { number: 1, name: "Sunday", value: { index: 1, prefix: "SUN" } },
      { number: 2, name: "Monday", value: { index: 2, prefix: "MON" } },
      { number: 3, name: "Tuesday", value: { index: 3, prefix: "TUE" } },
      { number: 4, name: "Wednesday", value: { index: 4, prefix: "WED" } },
      { number: 5, name: "Thursday", value: { index: 5, prefix: "THU" } },
      { number: 6, name: "Friday", value: { index: 6, prefix: "FRI" } },
      { number: 7, name: "Saturday", value: { index: 7, prefix: "SAT" } }
    );
  }

  fillDaysOfMonthOptions() {
    for (let day = 1; day <= 31; day++) {
      this.daysOfMonthOptions.push({ number: day, ordinal: this.getOrdinalNumber(day), value: day });
    }
  }

  fillWeeksInMonthOptions() {
    for (let week = 1; week <= 5; week++) {
      this.weeksInMonthOptions.push({ label: this.getOrdinalNumber(week), value: week });
    }
  }

  fillMonthsOptions() {
    this.monthsOptions.push(
      { number: 1, name: "January", value: { index: 1, prefix: "JAN" } },
      { number: 2, name: "February", value: { index: 2, prefix: "FEB" } },
      { number: 3, name: "March", value: { index: 3, prefix: "MAR" } },
      { number: 4, name: "April", value: { index: 4, prefix: "APR" } },
      { number: 5, name: "May", value: { index: 5, prefix: "MAY" } },
      { number: 6, name: "June", value: { index: 6, prefix: "JUN" } },
      { number: 7, name: "July", value: { index: 7, prefix: "JUL" } },
      { number: 8, name: "August", value: { index: 8, prefix: "AUG" } },
      { number: 9, name: "September", value: { index: 9, prefix: "SEP" } },
      { number: 10, name: "October", value: { index: 10, prefix: "OCT" } },
      { number: 11, name: "November", value: { index: 11, prefix: "NOV" } },
      { number: 12, name: "December", value: { index: 12, prefix: "DEC" } }
    );
  }

  fillYearsRangeOptions() {
    for (let year = 1; year <= 10; year++) {
      this.yearsRangeOptions.push({ label: year, value: year });
    }
  }

  fillFollowingYearsOptions() {
    let currentYear = new Date().getFullYear();
    for (let year = currentYear; year < (currentYear + 40); year++) {
      this.followingYearsOptions.push({ label: year, value: year });
    }
  }

  getOrdinalNumber(number: number): string {
    let ordinalTerm = "";
    let value = number.toString();
    if (value.length > 1) {
      value = value.substring(1, 2);
    }
    switch (value) {
      case "1":
        ordinalTerm = "st";
        break;
      case "2":
        ordinalTerm = "nd";
        break;
      case "3":
        ordinalTerm = "rd";
        break;
      default:
        ordinalTerm = "th";
        break;
    }
    return number + ordinalTerm;
  }

  checkBoxHoursBoundary(ten: number, unit: number): boolean {
    return parseInt(ten.toString() + unit.toString()) < 24 ? true : false;
  }

  checkBoxDaysOfMonthBoundary(ten: number, unit: number): boolean {
    let value = parseInt(ten.toString() + unit.toString());
    return value < 31 ? true : false;
  }

  checkUnit(unit: number): number {
    return unit == 9 ? 0 : unit += 1;
  }

  checkTen(ten: number, unit: number): number {
    return unit == 0 ? ten += 1 : ten;
  }

  loadCronExpression(cronExpressionParts: string[]) {
    this.selectedSecondsRadio = this.loadCurrentCronSecondsMinutesAndHours(cronExpressionParts[0], 0);
    this.selectedMinutesRadio = this.loadCurrentCronSecondsMinutesAndHours(cronExpressionParts[1], 1);
    this.selectedHoursRadio = this.loadCurrentCronSecondsMinutesAndHours(cronExpressionParts[2], 2);
    this.selectedDaysRadio = this.loadCurrentCronDays(cronExpressionParts[3], cronExpressionParts[5]);
    this.selectedMonthsRadio = this.loadCurrentCronMonths(cronExpressionParts[4]);
    this.selectedYearsRadio = this.loadCurrentCronYears(cronExpressionParts[6]);
  }

  loadCurrentCronSecondsMinutesAndHours(cronPart: string, partNumber: number): string {
    let selectedOption = "Option ";
    if (cronPart == "*") {
      selectedOption += "1";
    } else if (cronPart.includes('/')) {
      selectedOption += "2";
      let parts = cronPart.split("/");
      switch (partNumber) {
        case 0:
          this.everySecond = this.getJSONOption(parts[1], "seconds", 1);
          this.startingSecond = this.getJSONOption(parts[0], "seconds", 2);
          break;
        case 1:
          this.everyMinute = this.getJSONOption(parts[1], "minutes", 1);
          this.startingMinute = this.getJSONOption(parts[0], "minutes", 2);
          break;
        case 2:
          this.everyHour = this.getJSONOption(parts[1], "hours", 1);
          this.startingHour = this.getJSONOption(parts[0], "hours", 2);
          break;
      }
    } else if (!isNaN(Number(cronPart)) || cronPart.includes(",")) {
      selectedOption += "3";
      if (cronPart.includes(",")) {
        let numbers = cronPart.split(",");
        numbers.forEach(number => {
          switch (partNumber) {
            case 0:
              this.selectedSecondsCheckBox.push(number.length == 1 ? "0" + number : number);
              break;
            case 1:
              this.selectedMinutesCheckBox.push(number.length == 1 ? "0" + number : number);
              break;
            case 2:
              this.selectedHoursCheckBox.push(number.length == 1 ? "0" + number : number);
              break;
          }
        });
      } else {
        switch (partNumber) {
          case 0:
            this.selectedSecondsCheckBox.push(cronPart.length == 1 ? "0" + cronPart : cronPart);
            break;
          case 1:
            this.selectedMinutesCheckBox.push(cronPart.length == 1 ? "0" + cronPart : cronPart);
            break;
          case 2:
            this.selectedHoursCheckBox.push(cronPart.length == 1 ? "0" + cronPart : cronPart);
            break;
        }
      }
    } else if (cronPart.includes('-')) {
      selectedOption += "4";
      let parts = cronPart.split("-");
      switch (partNumber) {
        case 0:
          this.secondBetween1 = this.getJSONOption(parts[0], "seconds", 2);
          this.secondBetween2 = this.getJSONOption(parts[1], "seconds", 2);
          break;
        case 1:
          this.minuteBetween1 = this.getJSONOption(parts[0], "minutes", 2);
          this.minuteBetween2 = this.getJSONOption(parts[1], "minutes", 2);
          break;
        case 2:
          this.hourBetween1 = this.getJSONOption(parts[0], "hours", 2);
          this.hourBetween2 = this.getJSONOption(parts[1], "hours", 2);
          break;
      }
    }
    return selectedOption;
  }

  loadCurrentCronDays(cronDaysOfMonth: string, cronDaysOfWeek: string): string {
    let selectedOption = "Option ";
    let daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    if (cronDaysOfWeek == "*") {
      selectedOption += "1";
    } else if (cronDaysOfWeek.includes("/")) {
      selectedOption += "2";
      let parts = cronDaysOfWeek.split("/");
      this.everyDayOfWeek = this.getJSONOption(parts[1], "daysOfWeek", null);
      this.startingDayOfWeek = this.getJSONOption(parts[0], "daysOfWeek", null);
    } else if (cronDaysOfMonth.includes("/")) {
      selectedOption += "3";
      let parts = cronDaysOfMonth.split("/");
      this.everyDayOfMonth = this.getJSONOption(parts[1], "daysOfMonth", null);
      this.startingDayOfMonth = this.getJSONOption(parts[0], "daysOfMonth", null);;
    } else if (cronDaysOfMonth == "?" && (cronDaysOfWeek.includes(",") || daysOfWeek.includes(cronDaysOfWeek))) {
      selectedOption += "4";
      this.daysOfWeekOptions.forEach(dayOfWeekOption => {
        if (cronDaysOfWeek.includes(",")) {
          let currentDaysOfWeek = cronDaysOfWeek.split(",");
          currentDaysOfWeek.forEach(currentDayOfWeek => {
            if (dayOfWeekOption.value.prefix === currentDayOfWeek) {
              this.selectedDaysOfWeekCheckBox.push(dayOfWeekOption.value.index.toString());
            }
          });
        } else {
          if (dayOfWeekOption.value.prefix === cronDaysOfWeek) {
            this.selectedDaysOfWeekCheckBox.push(dayOfWeekOption.value.index.toString());
          }
        }
      });
    } else if ((!isNaN(Number(cronDaysOfMonth)) || cronDaysOfMonth.includes(",")) && cronDaysOfWeek == "?") {
      selectedOption += "5";
      if (cronDaysOfMonth.includes(",")) {
        let daysOfMonth = cronDaysOfMonth.split(",");
        daysOfMonth.forEach(dayOfMonth => {
          this.selectedDaysOfMonthCheckBox.push(dayOfMonth.length == 1 ? "0" + dayOfMonth : dayOfMonth);
        });
      } else {
        this.selectedDaysOfMonthCheckBox.push(cronDaysOfMonth.length == 1 ? "0" + cronDaysOfMonth : cronDaysOfMonth);
      }
    } else if (cronDaysOfMonth == "L" && cronDaysOfWeek == "?") {
      selectedOption += "6";
    } else if (cronDaysOfMonth == "LW" && cronDaysOfWeek == "?") {
      selectedOption += "7";
    } else if (cronDaysOfMonth == "?" && cronDaysOfWeek.includes("L")) {
      selectedOption += "8";
      this.lastDayOfWeekOfMonth = this.getJSONOption(cronDaysOfWeek, "daysOfWeek", null);
    } else if (cronDaysOfMonth.includes("-")) {
      selectedOption += "9";
      let parts = cronDaysOfMonth.split("-");
      this.daysBeforeEndOfMonth = this.getJSONOption(parts[1], "daysOfMonth", null);
    } else if (cronDaysOfMonth.includes("W")) {
      selectedOption += "10";
      let parts = cronDaysOfMonth.split("W");
      this.limitDayOfMonth = this.getJSONOption(parts[0], "daysOfMonth", null);
    } else if (cronDaysOfMonth == "?" && cronDaysOfWeek.includes("#")) {
      selectedOption += "11";
      let parts = cronDaysOfWeek.split("#");
      this.ordinalWeekDayOfMonth = parseInt(parts[1]);
      this.weekDayOfMonth = this.getJSONOption(parts[0], "daysOfWeek", null);
    }
    return selectedOption;
  }

  loadCurrentCronMonths(cronMonths: string): string {
    let selectedOption = "Option ";
    let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    if (cronMonths == "*") {
      selectedOption += "1";
    } else if (cronMonths.includes('/')) {
      selectedOption += "2";
      let parts = cronMonths.split('/');
      this.everyMonth = this.getJSONOption(parts[1], "months", null);
      this.startingMonth = this.getJSONOption(parts[0], "months", null);
    } else if (cronMonths.includes(",") || months.includes(cronMonths)) {
      selectedOption += "3";
      this.monthsOptions.forEach(monthOption => {
        if (cronMonths.includes(",")) {
          let currentMonths = cronMonths.split(",");
          currentMonths.forEach(currentMonth => {
            if (monthOption.value.prefix === currentMonth) {
              this.selectedMonthsCheckBox.push(monthOption.value.index.toString());
            }
          });
        } else {
          if (monthOption.value.prefix === cronMonths) {
            this.selectedMonthsCheckBox.push(monthOption.value.index.toString());
          }
        }
      });
    } else if (cronMonths.includes('-')) {
      selectedOption += "4";
      let parts = cronMonths.split('-');
      this.monthBetween1 = this.getJSONOption(parts[0], "months", null);
      this.monthBetween2 = this.getJSONOption(parts[1], "months", null);
    }
    return selectedOption;
  }

  loadCurrentCronYears(cronYears: string): string {
    let selectedOption = "Option ";
    let followingYears = [];
    this.followingYearsOptions.forEach(year => {
      followingYears.push(year.value.toString());
    });
    if (cronYears == "*") {
      selectedOption += "1";
    } else if (cronYears.includes('/')) {
      selectedOption += "2";
      let parts = cronYears.split('/');
      this.everyYear = parseInt(parts[1]);
      this.startingYear = parseInt(parts[0]);
    } else if (cronYears.includes(",") || followingYears.includes(cronYears)) {
      selectedOption += "3";
      this.followingYearsOptions.forEach(yearOption => {
        if (cronYears.includes(",")) {
          let selectedYears = cronYears.split(",");
          selectedYears.forEach(selectedYear => {
            if (yearOption.value == selectedYear) {
              this.selectedYearsCheckBox.push(selectedYear);
            }
          });
        } else {
          if (yearOption.value == cronYears) {
            this.selectedYearsCheckBox.push(cronYears);
          }
        }
      });
    } else if (cronYears.includes('-')) {
      selectedOption += "4";
      let parts = cronYears.split('-');
      this.yearBetween1 = parseInt(parts[0]);
      this.yearBetween2 = parseInt(parts[1]);
    }
    return selectedOption;
  }

  updateCronSeconds(option: number) {
    let cronSeconds = "";
    switch (option) {
      case 1:
        cronSeconds = "*";
        break;
      case 2:
        this.selectedSecondsRadio = "Option 2";
        cronSeconds = this.startingSecond.value.twoDigits.toString() + "/" + this.everySecond.value.oneDigit.toString();
        break;
      case 3:
        this.selectedSecondsRadio = "Option 3";
        cronSeconds = this.getSelectedCheckBoxes(0);
        break;
      case 4:
        this.selectedSecondsRadio = "Option 4";
        cronSeconds = this.secondBetween1.value.twoDigits.toString() + "-" + this.secondBetween2.value.twoDigits.toString();
        break;
    }
    this.updateCronExpressionPart(cronSeconds, 0);
  }

  updateCronMinutes(option: number) {
    let cronMinutes = "";
    switch (option) {
      case 1:
        cronMinutes = "*";
        break;
      case 2:
        this.selectedMinutesRadio = "Option 2";
        cronMinutes = this.startingMinute.value.twoDigits.toString() + "/" + this.everyMinute.value.oneDigit.toString();
        break;
      case 3:
        this.selectedMinutesRadio = "Option 3";
        cronMinutes = this.getSelectedCheckBoxes(1);
        break;
      case 4:
        this.selectedMinutesRadio = "Option 4";
        cronMinutes = this.minuteBetween1.value.twoDigits.toString() + "-" + this.minuteBetween2.value.twoDigits.toString();
        break;
    }
    this.updateCronExpressionPart(cronMinutes, 1);
  }

  updateCronHours(option: number) {
    let cronHours = "";
    switch (option) {
      case 1:
        cronHours = "*";
        break;
      case 2:
        this.selectedMinutesRadio = "Option 2";
        cronHours = this.startingHour.value.twoDigits.toString() + "/" + this.everyHour.value.oneDigit.toString();
        break;
      case 3:
        this.selectedMinutesRadio = "Option 3";
        cronHours = this.getSelectedCheckBoxes(2);
        break;
      case 4:
        this.selectedMinutesRadio = "Option 4";
        cronHours = this.hourBetween1.value.twoDigits.toString() + "-" + this.hourBetween2.value.twoDigits.toString();
        break;
    }
    this.updateCronExpressionPart(cronHours, 2);
  }

  updateCronDays(option: number) {
    let cronDaysOfWeek = "?";
    let cronDaysOfMonth = "?";
    switch (option) {
      case 1:
        cronDaysOfWeek = "*";
        break;
      case 2:
        this.selectedDaysRadio = "Option 2";
        cronDaysOfWeek = this.startingDayOfWeek.value.index.toString() + "/" + this.everyDayOfWeek.value.index.toString();
        break;
      case 3:
        this.selectedDaysRadio = "Option 3";
        cronDaysOfMonth = this.startingDayOfMonth.value.toString() + "/" + this.everyDayOfMonth.value.toString();
        break;
      case 4:
        this.selectedDaysRadio = "Option 4";
        cronDaysOfWeek = this.getSelectedCheckBoxes(3);
        break;
      case 5:
        this.selectedDaysRadio = "Option 5";
        cronDaysOfMonth = this.getSelectedCheckBoxes(4);
        break;
      case 6:
        cronDaysOfMonth = "L";
        break;
      case 7:
        cronDaysOfMonth = "LW";
        break;
      case 8:
        this.selectedDaysRadio = "Option 8";
        cronDaysOfWeek = this.lastDayOfWeekOfMonth.value.index.toString() + "L";
        break;
      case 9:
        this.selectedDaysRadio = "Option 9";
        cronDaysOfMonth = "L-" + this.daysBeforeEndOfMonth.value.toString();
        break;
      case 10:
        this.selectedDaysRadio = "Option 10";
        cronDaysOfMonth = this.limitDayOfMonth.value.toString() + "W";
        break;
      case 11:
        this.selectedDaysRadio = "Option 11";
        cronDaysOfWeek = this.weekDayOfMonth.value.index.toString() + "#" + this.ordinalWeekDayOfMonth.toString();
        break;
    }
    this.updateCronExpressionPart(cronDaysOfMonth, 3);
    this.updateCronExpressionPart(cronDaysOfWeek, 5);
  }

  updateCronMonths(option: number) {
    let cronMonths = "";
    switch (option) {
      case 1:
        cronMonths = "*";
        break;
      case 2:
        this.selectedMonthsRadio = "Option 2";
        cronMonths = this.startingMonth.value.index.toString() + "/" + this.everyMonth.value.index.toString();
        break;
      case 3:
        this.selectedMonthsRadio = "Option 3";
        cronMonths = this.getSelectedCheckBoxes(5);
        break;
      case 4:
        this.selectedMonthsRadio = "Option 4";
        cronMonths = this.monthBetween1.value.index.toString() + "-" + this.monthBetween2.value.index.toString();
        break;
    }
    this.updateCronExpressionPart(cronMonths, 4);
  }

  updateCronYears(option: number) {
    let cronYears = "";
    switch (option) {
      case 1:
        cronYears = "*";
        break;
      case 2:
        this.selectedYearsRadio = "Option 2";
        cronYears = this.startingYear.toString() + "/" + this.everyYear.toString();
        break;
      case 3:
        this.selectedYearsRadio = "Option 3";
        cronYears = this.getSelectedCheckBoxes(6);
        break;
      case 4:
        this.selectedYearsRadio = "Option 4";
        cronYears = this.yearBetween1.toString() + "-" + this.yearBetween2.toString();
        break;
    }
    this.updateCronExpressionPart(cronYears, 6);
  }

  getSelectedCheckBoxes(cronPart: number): string {
    let selectedCheckBoxesCronPart = [];
    let compareFn = (n1: string, n2: string) => { return parseInt(n1) > parseInt(n2) ? 1 : parseInt(n1) < parseInt(n2) ? -1 : 0; };
    switch (cronPart) {
      case 0:
        selectedCheckBoxesCronPart = this.selectedSecondsCheckBox.toString().split(",").sort(compareFn);
        break;
      case 1:
        selectedCheckBoxesCronPart = this.selectedMinutesCheckBox.toString().split(",").sort(compareFn);
        break;
      case 2:
        selectedCheckBoxesCronPart = this.selectedHoursCheckBox.toString().split(",").sort(compareFn);
        break;
      case 3:
        selectedCheckBoxesCronPart = this.selectedDaysOfWeekCheckBox.toString().split(",").sort(compareFn);
        break;
      case 4:
        selectedCheckBoxesCronPart = this.selectedDaysOfMonthCheckBox.toString().split(",").sort(compareFn);
        break;
      case 5:
        selectedCheckBoxesCronPart = this.selectedMonthsCheckBox.toString().split(",").sort(compareFn);
        break;
      case 6:
        selectedCheckBoxesCronPart = this.selectedYearsCheckBox.toString().split(",").sort(compareFn);
        break;
    }
    let cronSelection = "";
    selectedCheckBoxesCronPart.forEach((checkBoxValue, checkBoxIndex) => {
      let value: string = "";
      if (cronPart == 3) {
        this.daysOfWeekOptions.forEach((dayOfWeek, index) => {
          if (checkBoxValue == (index + 1)) {
            value = dayOfWeek.value.prefix;
          }
        });
      } else if (cronPart == 5) {
        this.monthsOptions.forEach((month, index) => {
          if (checkBoxValue == (index + 1)) {
            value = month.value.prefix;
          }
        });
      } else {
        value = Number(checkBoxValue).toString();
      }
      cronSelection += checkBoxIndex > 0 ? "," + value : value;
    });
    return cronSelection;
  }

  getJSONOption(value: any, dropDownType: string, valueType: number) {
    let JSON = null;
    if (dropDownType === "seconds" || dropDownType === "minutes" || dropDownType === "hours") {
      let oneDigit = this.timeOptions[valueType == 1 ? parseInt(value) - 1 : value].oneDigit;
      let twoDigits = this.timeOptions[valueType == 1 ? parseInt(value) - 1 : value].twoDigits;
      JSON = { oneDigit: oneDigit, twoDigits: twoDigits, value: { oneDigit: oneDigit, twoDigits: twoDigits } };
    } else if (dropDownType === "daysOfWeek") {
      let number = this.daysOfWeekOptions[parseInt(value) - 1].number;
      let name = this.daysOfWeekOptions[parseInt(value) - 1].name;
      let prefix = this.daysOfWeekOptions[parseInt(value) - 1].value.prefix;
      JSON = { number: number, name: name, value: { index: number, prefix: prefix } };
    } else if (dropDownType === "daysOfMonth") {
      let day = this.daysOfMonthOptions[parseInt(value) - 1].number;
      JSON = { number: day, ordinal: this.getOrdinalNumber(day), value: day };
    } else if (dropDownType === "months") {
      let number = this.monthsOptions[parseInt(value) - 1].number;
      let name = this.monthsOptions[parseInt(value) - 1].name;
      let prefix = this.monthsOptions[parseInt(value) - 1].value.prefix;
      JSON = { number: number, name: name, value: { index: number, prefix: prefix } };
    }
    return JSON;
  }

  updateCronExpressionPart(cronPart: string, partNumber: number) {
    switch (partNumber) {
      case 0:
        this.cronExpressionParts[0].cronSeconds = cronPart;
        break;
      case 1:
        this.cronExpressionParts[0].cronMinutes = cronPart;
        break;
      case 2:
        this.cronExpressionParts[0].cronHours = cronPart;
        break;
      case 3:
        this.cronExpressionParts[0].cronDaysOfMonth = cronPart;
        break;
      case 4:
        this.cronExpressionParts[0].cronMonth = cronPart;
        break;
      case 5:
        this.cronExpressionParts[0].cronDaysOfWeek = cronPart;
        break;
      case 6:
        this.cronExpressionParts[0].cronYear = cronPart;
        break;
    }
    let cronExpressionParts = this.cronExpression.split(" ");
    let cronExpression = "";
    cronExpressionParts[partNumber] = cronPart;
    for (let cronExpressionPart of cronExpressionParts) {
      cronExpression += cronExpressionPart + " ";
    }
    this.cronExpression = cronExpression;
  }

  cancelJobScheduler() {
    this.dialogService.dialogComponentRef.destroy();
  }

  updateCronExpression() {
    this.ref.close(this.cronExpression);
  }

}