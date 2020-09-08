import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CrosswalkService } from '../../../../services/crosswalk.service';

@Component({
  selector: 'mid-rule-box',
  templateUrl: './mid-rule-box.component.html',
  styleUrls: ['./mid-rule-box.component.css']
})
export class MidRuleBoxComponent implements OnInit {

  @ViewChild('editable') high: ElementRef;
  @Output() midTextOutput: EventEmitter<string[]> = new EventEmitter();
  midText: string = '';
  updatedMidText: string = '';

  constructor(private crossService: CrosswalkService) { }

  ngOnInit() {
  }

  async validCheck() {
    let result = this.updatedMidText.split(',');
    let invalidList = [];
    await this.checkMidRuleIds(result).then(value => {
      invalidList = value;
    });
    let lastCheck: boolean = false;
    let setText: string = '';
    let setCheck: boolean = false;
    this.high.nativeElement.textContent = '';
    result.forEach((ele, index) => {
      ele = ele.trim();
      if (ele !== '') {
        if (invalidList.includes(ele)) {
          setText = this.applyHighlights(ele, true, setText);
          setCheck = true;
        } else {
          if (index === result.length - 1) {
            lastCheck = true;
            setCheck = true;
          }
          setText = this.applyHighlights(ele, false, setText, setCheck, lastCheck);
        }
      }
    });
  }

  applyHighlights(text, boolean?, setText?, setCheck?, lastCheck?): string {
    let span = document.createElement('span');
    if (boolean) {
      let highlighted = document.createElement('span');
      highlighted.className = "happy";
      span.textContent = setText;
      this.high.nativeElement.appendChild(span);
      highlighted.textContent = text;
      this.high.nativeElement.appendChild(highlighted);
      return ',';
    } else {
      if (!setCheck) {
        return setText.concat(text + ',');
      } else {
        if (!lastCheck) {
          return setText.concat(text + ',')
        } else {
          setText = setText.concat(text)
          span.textContent = setText;
          this.high.nativeElement.appendChild(span);
          return ''
        }
      }
    }

  }

  updateModel(e) {
    this.updatedMidText = e;
    if (e && e.trim()) {
      if (this.updatedMidText.includes(',')) {
      this.midTextOutput.emit(this.updatedMidText.split(','));
      } else {
        let array: string[] = [this.updatedMidText];
      this.midTextOutput.emit(array);
      }
    } else {
      if (this.midText.includes(',')) {
      this.midTextOutput.emit(this.midText.split(','));
      } else {
        let array: string[] = [this.midText];
        this.midTextOutput.emit(array);
      }
    }
  }

  /**
   *  checkMidRuleIds send to the service to check
   * @param midRuleIds - List of mid rule Id from the user
   * @returns - return the list of invalid rules Id to used for highlighting
   * TODO: Service CALLs GOES HERE
   */
  checkMidRuleIds(idList: string[]): Promise<any> {


    let requestBody = {
      midRuleIds: idList
      
    }
    return new Promise((resolve, reject) => {
      this.crossService.getAllInvalidMidRuleIds(requestBody).subscribe(response => {
        let newList = response.data;
        resolve(newList.invalidMidRuleIds);
      });
    })

  }

}
