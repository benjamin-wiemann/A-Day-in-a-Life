import { Component } from '@angular/core';
import { SurveyMessengerService } from './survey-messenger.service';
import { Survey } from 'survey-angular';
import { isTestMode } from './global';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'A day in a life';
    surveyCompleted: boolean;
    survey: Survey;

    constructor(private messengerService: SurveyMessengerService) {
        this.surveyCompleted = isTestMode ? true : false;
    }

    ngOnInit() {
        this.messengerService.subscribe(
            (surveyModel: Survey) => {
                this.survey = surveyModel;
                this.surveyCompleted = true;
            }
        );
    }

}
