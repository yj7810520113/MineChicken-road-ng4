import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-time-line-dialog',
  templateUrl: './time-line-dialog.component.html',
  styleUrls: ['./time-line-dialog.component.css']
})
export class TimeLineDialogComponent implements OnInit {
  durationSelectedValue='500';
  speedSelectdValue='2';

  ngOnInit(): void {
  }

  constructor(
    public dialogRef: MdDialogRef<TimeLineDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
