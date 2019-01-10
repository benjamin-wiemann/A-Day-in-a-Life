import { Injectable, EventEmitter } from '@angular/core';
import { SurveyComponent } from './survey/survey.component';
import * as Survey from 'survey-angular';

@Injectable({
  providedIn: 'root'
})
export class SurveyMessengerService {

  private surveyCompleted: boolean = false;
  surveyEventEmitter: EventEmitter<Survey.Model> = new EventEmitter<Survey.Model>();

  constructor() { }

  public subscribe( callback: Function ): void {
    this.surveyEventEmitter.subscribe( callback );
  }

  public emitSurveyCompleted( model: Survey.Model ): void {
    this.surveyEventEmitter.emit( model );
  }

}
