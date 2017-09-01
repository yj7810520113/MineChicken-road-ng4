import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountLinkPieComponent } from './count-link-pie.component';

describe('CountLinkPieComponent', () => {
  let component: CountLinkPieComponent;
  let fixture: ComponentFixture<CountLinkPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountLinkPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountLinkPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
