import { Component, OnInit } from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {DateAdapter, MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-compare-offset-dialog',
  templateUrl: './compare-offset-dialog.component.html',
  styleUrls: ['./compare-offset-dialog.component.css']
})
export class CompareOffsetDialogComponent implements OnInit {
  //2016年3月1号
  startSpanTime=new Date(1456761600000);
  //2016年5月31号
  endSpanTime=new Date(1464710300000);
  //2016年4月15号
  timeValue=new Date(1460649600000);

  selectedDates=[];
  model: NgbDateStruct;
  private formatDate=d3.timeFormat('%Y-%m-%d');

  constructor(public dialogRef: MdDialogRef<CompareOffsetDialogComponent>,private dateAdapter:DateAdapter<Date>) {
    dateAdapter.setLocale('zh'); // DD.MM.YYYY
  }

  ngOnInit() {
  }
  changeDate(date){
    this.selectedDates.push(this.formatDate(date.value));
  }

  removeChips(date:any){
    let nowDatas=[];
    this.selectedDates=this.selectedDates.filter(d=>d!=date)


  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
