import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class SharedVariableService {
  private timeNowSubject = new Subject();

  constructor() {
  }

  setTimeNow(now: number): void {
    this.timeNowSubject.next(now);
  }

  getTimeNow(): any {
    return this.timeNowSubject;
  }
}
