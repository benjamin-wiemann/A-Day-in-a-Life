import { Component, OnInit, Input } from '@angular/core';
import * as Survey from 'survey-angular';
import * as Tone from 'tone';

import { SurveyMessengerService } from '../survey-messenger.service';

@Component({
  selector: 'day-music-generator',
  templateUrl: './music-generator.component.html',
  styleUrls: ['./music-generator.component.css']
})
export class MusicGeneratorComponent implements OnInit {

  url: string;
  @Input() survey: Survey.Survey;

  constructor( ) { }

  ngOnInit() {
    this.url = 'https://test.url.com';
  }

  onPlay(): void {
    const synth = new Tone.MembraneSynth().toMaster();

    // create a loop
    let loop = new Tone.Loop(function (time) {
      synth.triggerAttackRelease('C1', '8n', time);
    }, '4n');

    // play the loop between 0-2m on the transport
    loop.start(0).stop('2m');
    Tone.Transport.start('+0.1');
    //alert( JSON.stringify( this.survey.data ));
  }

  onStop(): void {
    Tone.Transport.stop();
  }

}
