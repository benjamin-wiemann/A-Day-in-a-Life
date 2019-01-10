import { Component } from '@angular/core';
import { SurveyMessengerService } from './survey-messenger.service';
import { Survey } from 'survey-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title: string = 'A day in a life';
  surveyCompleted: boolean = false;
  survey: Survey;

  constructor( private messengerService: SurveyMessengerService ) {

  }

  ngOnInit(){
    this.messengerService.subscribe(
        ( surveyModel: Survey ) => {
          this.surveyCompleted = true;
          this.survey = surveyModel;
        }
    );
  }

}
