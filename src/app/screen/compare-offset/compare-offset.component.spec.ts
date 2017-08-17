import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareOffsetComponent } from './compare-offset.component';

describe('CompareOffsetComponent', () => {
  let component: CompareOffsetComponent;
  let fixture: ComponentFixture<CompareOffsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareOffsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareOffsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
