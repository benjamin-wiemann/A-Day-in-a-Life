import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { SurveyComponent } from './survey/survey.component';
import { MusicGeneratorComponent } from './music-generator/music-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    SurveyComponent,
    MusicGeneratorComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
