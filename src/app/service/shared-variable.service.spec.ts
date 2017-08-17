import { TestBed, inject } from '@angular/core/testing';

import { SharedVariableService } from './shared-variable.service';

describe('SharedVariableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedVariableService]
    });
  });

  it('should be created', inject([SharedVariableService], (service: SharedVariableService) => {
    expect(service).toBeTruthy();
  }));
});
