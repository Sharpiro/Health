import { TestBed, inject } from '@angular/core/testing';

import { NutritionService } from './nutrition.service';

describe('NutritionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NutritionService]
    });
  });

  it('should ...', inject([NutritionService], (service: NutritionService) => {
    expect(service).toBeTruthy();
  }));
});
