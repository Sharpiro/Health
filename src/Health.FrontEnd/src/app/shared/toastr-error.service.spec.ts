import { TestBed, inject } from '@angular/core/testing';

import { ToastrNotificationService } from './toastr-notification.service';

describe('ToastrErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastrNotificationService]
    });
  });

  it('should ...', inject([ToastrNotificationService], (service: ToastrNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
