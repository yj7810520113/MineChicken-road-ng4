import {Component, OnInit} from '@angular/core';
import {SharedVariableService} from "./service/shared-variable.service";
import {MdDialog} from "@angular/material";
import {TimeLineDialogComponent} from "./screen/dialog/time-line-dialog/time-line-dialog.component";
import {StartDialogComponent} from "./screen/dialog/start-dialog/start-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit{
  speed = [
    {key: '2', value: '2分钟'},
    {key: '10', value: '10分钟'},
    {key: '20', value: '20分钟'},
    {key: '60', value: '1小时'},
    {key: '360', value: '6小时'},
    {key: '1440', value: '1天'},
  ];
  duration=[
    {key:'500',value:'500ms'},
    {key:'1000',value:'1s'},
    {key:'2000',value:'2s'},
    {key:'5000',value:'5s'},
    {key:'10000',value:'10s'},
  ];
  private dialogRef1;

  constructor(private sharedVariable: SharedVariableService, public dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.initialOpenDialog();
    this.dialogRef1.afterClosed().subscribe(x=>x);
  }

  initialOpenDialog(): void {
    this.dialogRef1 = this.dialog.open(StartDialogComponent, {
      // width: '300px',
      // data: { duration:this.duration,speed:this.speed }
    });

  }

  openDialog(): void {
    let dialogRef = this.dialog.open(TimeLineDialogComponent, {
      width: '300px',
      data: { duration:this.duration,speed:this.speed }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(result)
      // this.sharedVariable.setDuration(parseInt(result.duration));
      if(result) {
        this.sharedVariable.setSpeed(parseInt(result.speed));
      }
      // this.animal = result;
    });

  }
}
