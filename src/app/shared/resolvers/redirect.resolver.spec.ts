import { TestBed } from '@angular/core/testing';

import { RedirectResolver } from './redirect.resolver';

describe('RedirectResolver', () => {
  let resolver: RedirectResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RedirectResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
