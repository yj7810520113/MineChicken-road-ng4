import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Http} from "@angular/http";
import {FileReaderService} from "./file-reader.service";

@Injectable()
export class SharedVariableService {
  private timeNowSubject = new Subject();
  private everyHourSpeedOffset=new Subject();

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
}
