import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Http} from "@angular/http";
import {FileReaderService} from "./file-reader.service";
import {LinkPathData} from "../screen/DataTransModel";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

@Injectable()
export class SharedVariableService {
  private timeNowSubject = new Subject();
  private everyHourSpeedOffset=new Subject();
  private linkPathSubject=new Subject<LinkPathData>();

  constructor(private http:Http,private fileReader:FileReaderService) {
  }

  setTimeNow(now: number): void {
    this.timeNowSubject.next(now);
  }

  getTimeNow(): any {
    return this.timeNowSubject;
  }
  setEveryHourSpeedOffset():any{
    // this.everyHourSpeedOffset.next(this.fileReader.readFileToJson('/assets/file/gy_contest_link_info.txt'));
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
    return this.linkPathSubject.debounceTime(100)
      // .distinctUntilChanged();
  }

}
