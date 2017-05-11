import { TestBed, inject } from '@angular/core/testing';

import { ToastrErrorService } from './toastr-error.service';

describe('ToastrErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastrErrorService]
    });
  });

  it('should ...', inject([ToastrErrorService], (service: ToastrErrorService) => {
    expect(service).toBeTruthy();
  }));
});
