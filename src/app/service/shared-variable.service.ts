import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Http} from "@angular/http";
import {FileReaderService} from "./file-reader.service";
import {LinkPathData} from "../screen/DataTransModel";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/share";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/never";

@Injectable()
export class SharedVariableService {
  //全局定时器（每隔指定时间，发送值）
  private timerObserver=new Observable();
  //定时器暂停
  private  pauser = new Subject();
  private pausable;
  //测试的的时间为2016年3月26日
  private startTime=1458921600000;
  //2016年3月1号
  private startSpanTime=1456761600000;
  //2016年5月31号
  private endSpanTime=1464624000000;
  //测试的duration为500
  private duration=500;
  //当前时间
  private timeNowSubject = new Subject();
  private everyHourSpeedOffset=new Subject();
  //map和simulate之间的数据传递
  private linkPathSubject=new Subject<LinkPathData>();
  //map和饼图之间的数据传递
  private linkSpeedOffsetSubject=new Subject();
  //饼图像map和模拟出行传递的路径信息
  private pathSubject=new Subject();

  constructor(private http:Http,private fileReader:FileReaderService) {
    this.timerObserver=Observable.timer(2000,this.duration);

    // https://github.com/ReactiveX/rxjs/issues/1542
    this.pausable = this.pauser.switchMap(paused => paused ? Observable.never() : this.timerObserver);

    this.pausable.subscribe(x=>{
      this.setTimeNow(this.startTime);
      this.startTime+=1000*60*60*1;
    })
    this.pauser.next(true);

  }


  setTimeNow(now: number): void {
    this.startTime=now;
    this.timeNowSubject.next(now);
  }

  getTimeNow(): any {
    return this.timeNowSubject;
  }

  setPauser(isPaused:boolean):any{
    this.pauser.next(isPaused);
  }
  setEveryHourSpeedOffset():any{
    // this.everyHourSpeedOffset.next(this.fileReader.readFileToJson('/assets/file/gy_contest_link_info.csv'));
  }
  setLinkPathSubject(linkPathData:LinkPathData):any{
    this.linkPathSubject.next(linkPathData);
    ;
  }
  getLinkPathSubject():any{
    return this.linkPathSubject.debounceTime(300)
      // .distinctUntilChanged();
  }
  getLinkPathSubjectImmediately():any{
    return this.linkPathSubject;
      // .distinctUntilChanged();
  }

  getLinkSpeedOffsetSubject():any{
    return this.linkSpeedOffsetSubject;
  }
  setLinkSpeedOffsetSubject(linkSpeedOffsetData:any){
    return this.linkSpeedOffsetSubject.next(linkSpeedOffsetData);
  }

  getPathSubject():any{
    return this.pathSubject;
  }
  setPathSubject(path:any){
    return this.pathSubject.next(path);
  }

}
