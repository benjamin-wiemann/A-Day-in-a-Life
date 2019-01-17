import { Component, OnInit } from '@angular/core';
import { SurveyMessengerService } from '../survey-messenger.service';
import * as Survey from 'survey-angular';
import { surveyJSON } from './survey-data';


Survey.Survey.cssType = 'bootstrap';


@Component({
  selector: 'day-survey-comp',
  template:
      '<div id="surveyElement"></div>',
      styleUrls:
      ['../../../node_modules/bootstrap/scss/bootstrap.scss' ]
})
export class SurveyComponent implements OnInit {

    private survey: Survey.Model;

    constructor( private messengerService: SurveyMessengerService ) {

    }
    ngOnInit() {
        this.survey = new Survey.Model(surveyJSON);
        this.survey.onComplete.add( () => this.messengerService.emitSurveyCompleted( this.survey ) );
        Survey.SurveyNG.render('surveyElement', { model: this.survey });
    }

}
