import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareOffsetDialogComponent } from './compare-offset-dialog.component';

describe('CompareOffsetDialogComponent', () => {
  let component: CompareOffsetDialogComponent;
  let fixture: ComponentFixture<CompareOffsetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareOffsetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareOffsetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
