import { TestBed } from '@angular/core/testing';

import { CurrencyOptionsService } from './currency-options.service';

describe('CurrencyOptionsService', () => {
  let service: CurrencyOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
