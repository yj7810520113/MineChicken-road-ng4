import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPannelComponent } from './control-pannel.component';

describe('ControlPannelComponent', () => {
  let component: ControlPannelComponent;
  let fixture: ComponentFixture<ControlPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
