import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateTravelComponent } from './simulate-travel.component';

describe('SimulateTravelComponent', () => {
  let component: SimulateTravelComponent;
  let fixture: ComponentFixture<SimulateTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulateTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
