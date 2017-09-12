import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineDialogComponent } from './time-line-dialog.component';

describe('TimeLineDialogComponent', () => {
  let component: TimeLineDialogComponent;
  let fixture: ComponentFixture<TimeLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
