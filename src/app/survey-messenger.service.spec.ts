import { TestBed } from '@angular/core/testing';

import { SurveyMessengerService } from './survey-messenger.service';

describe('SurveyMessengerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyMessengerService = TestBed.get(SurveyMessengerService);
    expect(service).toBeTruthy();
  });
});
