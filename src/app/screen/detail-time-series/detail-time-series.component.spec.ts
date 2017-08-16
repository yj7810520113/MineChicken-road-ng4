import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTimeSeriesComponent } from './detail-time-series.component';

describe('DetailTimeSeriesComponent', () => {
  let component: DetailTimeSeriesComponent;
  let fixture: ComponentFixture<DetailTimeSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTimeSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTimeSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
