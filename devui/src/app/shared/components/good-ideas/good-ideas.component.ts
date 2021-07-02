import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoodIdeasDto } from 'src/app/shared/models/dto/good-ideas-dto';
import { GoodIdeasServiceService } from 'src/app/services/good-ideas-service.service';
import { Constants } from '../../models/constants';

const RESPONSE_EXIT = "exit";

@Component({
  selector: 'app-good-ideas',
  templateUrl: './good-ideas.component.html',
  styleUrls: ['./good-ideas.component.css']
})
export class GoodIdeasComponent implements OnInit {

  @Input()
  typeTable: String;

  @Input()
  goodIdeasBody: GoodIdeasDto[];

  @Output()
  statusGoodIdeasSaved: EventEmitter<String>;

  goodIdeasHeader: any[];
  todayDate : Date = new Date();
  minDateGoodIdeas: Date = new Date(this.todayDate.setDate(this.todayDate.getDate() + 1 ));

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  constructor(private goodIdeasServiceService: GoodIdeasServiceService, private http: HttpClient) { 
    this.statusGoodIdeasSaved = new EventEmitter();
  }

  ngOnInit() {
    this.goodIdeasHeader = this.goodIdeasServiceService.getGoodIdeasHeader(this.typeTable);
  }

  public submitGoodIdeas(): void {
    this.goodIdeasServiceService.submitGoodIdeas(this.goodIdeasBody).then((response: any) => {
      this.statusGoodIdeasSaved.emit(response);   
    });
    
  }

  public exit(){
    this.statusGoodIdeasSaved.emit(RESPONSE_EXIT);
  }

  public isDisabledSubmit(): boolean{
    let response: boolean = true;
    if (this.goodIdeasBody){
      for(let i=0; i<this.goodIdeasBody.length; i++){
        if(this.goodIdeasBody[i].goodIdeaDt){
          response = false;
          break;
        }
      }
    }
    return response;
  }


}
