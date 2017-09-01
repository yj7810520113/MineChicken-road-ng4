import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTimeSeriesComponent } from './overview-time-series.component';

describe('OverviewTimeSeriesComponent', () => {
  let component: OverviewTimeSeriesComponent;
  let fixture: ComponentFixture<OverviewTimeSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewTimeSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewTimeSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
