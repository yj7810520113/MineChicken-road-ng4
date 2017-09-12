import {Component, HostListener, OnInit} from '@angular/core';
import {SharedVariableService} from "../../service/shared-variable.service";
import {share} from "rxjs/operator/share";

@Component({
  selector: 'app-control-pannel',
  templateUrl: './control-pannel.component.html',
  styleUrls: ['./control-pannel.component.css']
})
export class ControlPannelComponent implements OnInit {
  public controlItems=[
    {key:'before7day',value:'前7天',isValid:false,iconName:'navigate_before'},
    {key:'before1day',value:'前1天',isValid:false,iconName:'navigate_before'},
    {key:'before1h',value:'前1时',isValid:false,iconName:'navigate_before'},
    {key:'before20min',value:'前20分',isValid:false,iconName:'navigate_before'},
    {key:'before2min',value:'前2分',isValid:false,iconName:'navigate_before'},
    {key:'pause',value:'暂停',isValid:true,iconName:'pause'},
    {key:'after2min',value:'后2分',isValid:true,iconName:'navigate_next'},
    {key:'after20min',value:'后20分',isValid:true,iconName:'navigate_next'},
    {key:'after1h',value:'后1时',isValid:true,iconName:'navigate_next'},
    {key:'after1day',value:'后1天',isValid:true,iconName:'navigate_next'},
    {key:'after7day',value:'后7天',isValid:true,iconName:'navigate_next'}
  ];
  private iconStart='play_arrow';
  private labelStart='开始';

  //2016年3月1号
  private startSpanTime=1456761600000;
  //2016年5月31号
  private endSpanTime=1464710400000;
  //当前时间
  private currentTime=1456761600000;

  constructor(private sharedVariable:SharedVariableService) { }

  ngOnInit() {
    this.sharedVariable.getTimeNow()
      .subscribe(x=>{
          this.currentTime=x;
          if(x-1000*60*60*24*7>=this.startSpanTime){
            this.controlItems[0].isValid=true;
          }
          else{
            this.controlItems[0].isValid=false;
          }

        if(x-1000*60*60*24>=this.startSpanTime){
          this.controlItems[1].isValid=true;
        }
        else{
          this.controlItems[1].isValid=false;
        }

        if(x-1000*60*60>=this.startSpanTime){
          this.controlItems[2].isValid=true;
        }
        else{
          this.controlItems[2].isValid=false;
        }

        if(x-1000*60*20>=this.startSpanTime){
          this.controlItems[3].isValid=true;
        }
        else{
          this.controlItems[3].isValid=false;
        }

        if(x-1000*60*2>=this.startSpanTime){
          this.controlItems[4].isValid=true;
        }
        else{
          this.controlItems[4].isValid=false;
        }

        if(x<=this.endSpanTime){
          this.controlItems[5].isValid=true;
        }
        else{
          this.controlItems[5].isValid=false;
        }

        if(x+1000*60*2<=this.endSpanTime){
          this.controlItems[6].isValid=true;
        }
        else{
          this.controlItems[6].isValid=false;
        }

        if(x+1000*60*20<=this.endSpanTime){
          this.controlItems[7].isValid=true;
        }
        else{
          this.controlItems[7].isValid=false;
        }

        if(x+1000*60*60<=this.endSpanTime){
          this.controlItems[8].isValid=true;
        }
        else{
          this.controlItems[8].isValid=false;
        }

        if(x+1000*60*60*24<=this.endSpanTime){
          this.controlItems[9].isValid=true;
        }
        else{
          this.controlItems[9].isValid=false;
        }

        if(x+1000*60*60*24*7<=this.endSpanTime){
          this.controlItems[10].isValid=true;
        }
        else{
          this.controlItems[10].isValid=false;
        }
      });

    this.sharedVariable.getPauser()
      .subscribe(x=>{
        console.log(x)
        if(x==true) {
          this.controlItems[5].iconName = 'play_arrow';
          this.controlItems[5].value = this.labelStart;
        }
        else{
          this.controlItems[5].iconName = 'pause';
          this.controlItems[5].value = '暂停';
        }
      })
  }
  clickEvent(event:any){
    if(!event.isValid){
      return;
    }
    //开始暂停事件
    if(event.key=='pause'){
      // event.isValid=!event.isValid;
      if(event.iconName=='pause'){
        this.sharedVariable.setPauser(true);
        event.iconName='play_arrow';
        event.value=this.labelStart;
      }
      else{
        this.sharedVariable.setPauser(false);
        event.iconName='pause';
        event.value='暂停';
      }
    }
  //  时间判断
    if(event.key=='before7day'){
      this.sharedVariable.setTimeNow(this.currentTime-1000*60*60*24*7);
    }
    else if(event.key=='before1day'){
      this.sharedVariable.setTimeNow(this.currentTime-1000*60*60*24*1);
    }
    else if(event.key=='before1h'){
      this.sharedVariable.setTimeNow(this.currentTime-1000*60*60*1);
    }
    else if(event.key=='before20min'){
      this.sharedVariable.setTimeNow(this.currentTime-1000*60*20);
    }
    else if(event.key=='before2min'){
      this.sharedVariable.setTimeNow(this.currentTime-1000*60*2);
    }
    // else if(event.key=='pause'){
    //   this.sharedVariable.setTimeNow(this.currentTime+1000*60*60*24*1);
    // }
    else if(event.key=='after2min'){
      this.sharedVariable.setTimeNow(this.currentTime+1000*60*2);
    }
    else if(event.key=='after20min'){
      this.sharedVariable.setTimeNow(this.currentTime+1000*60*20);
    }
    else if(event.key=='after1h'){
      this.sharedVariable.setTimeNow(this.currentTime+1000*60*60*1);
    }
    else if(event.key=='after1day'){
      this.sharedVariable.setTimeNow(this.currentTime+1000*60*60*24*1);
    }
    else if(event.key=='after7day'){
      this.sharedVariable.setTimeNow(this.currentTime+1000*60*60*24*7);
    }
  }
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    // console.log(event)
    //空格暂停
    // if(x==true) {
    //   this.controlItems[5].iconName = 'play_arrow';
    //   this.controlItems[5].value = this.labelStart;
    // }
    // else{
    //   this.controlItems[5].iconName = 'pause';
    //   this.controlItems[5].value = '暂停';
    // }
    if(event.keyCode==32||event.keyCode==80){
      if(this.controlItems[5].iconName=='play_arrow'){
        this.controlItems[5].iconName = 'pause';
          this.controlItems[5].value = '暂停';
          this.sharedVariable.setPauser(false);
      }
      else {
          this.controlItems[5].iconName = 'play_arrow';
          this.controlItems[5].value = this.labelStart;
          this.sharedVariable.setPauser(true);
      }
    }
    if(event.keyCode==188||event.keyCode==37){
      this.sharedVariable.setTimeNow(this.currentTime-1000*60*2);
    }
    if(event.keyCode==190||event.keyCode==39){
      this.sharedVariable.setTimeNow(this.currentTime+1000*60*2);
    }
  }

}
