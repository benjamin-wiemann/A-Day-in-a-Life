import { Component, OnInit, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
  @Input() play_enabled = false;
  @Input() stop_enabled = false;
  @Input() pause_enabled = false;

  // instruments
  atmo: Tone.Player;
  drum1: Tone.Sampler;
  drum2: Tone.Sampler;

  constructor( ) { }

  enablePlayButton() {
    if ( this.atmo.loaded &&
          this.drum1.loaded &&
          this.drum2.loaded ) {
          this.play_enabled = true;
    }
  }

  ngOnInit() {
    this.url = 'https://test.url.com';

    Tone.Transport.bpm.value = 80;

    // create instruments and map notes to sounds
    this.atmo = new Tone.Player( './assets/audio/bathroom/bathroom_atmo.mp3',
    this.enablePlayButton.bind(this));
    this.atmo.fadeIn = '1m';
    this.atmo.fadeOut = '1m';
    const atmoPan  = new Tone.PanVol( 0, 12 );
    this.atmo.chain( atmoPan, Tone.Master);

    this.drum1 = new Tone.Sampler({
      'C1' : 'brushing_teeth_1.mp3',
      'C#1' : 'brushing_teeth_2.mp3',
      'D1' : 'brushing_teeth_3.mp3',
      'D#1' : 'brushing_teeth_4.mp3',
      'E1' : 'brushing_teeth_5.mp3',
      'F1' : 'brushing_teeth_6.mp3'
    },
    this.enablePlayButton.bind(this),
    './assets/audio/bathroom/samples/brushing/').toMaster();
    const drum1Pan  = new Tone.PanVol( -0.5, -24 );
    this.drum1.chain( drum1Pan, Tone.Master);

    this.drum2 = new Tone.Sampler({
      'C1' : 'toothbrush_in_cup_1.mp3',
      'C#1' : 'toothbrush_in_cup_2.mp3',
      'D1' : 'toothbrush_in_cup_3.mp3'
    },
    this.enablePlayButton.bind(this),
    './assets/audio/bathroom/samples/toothbrush_in_cup/');
    // const drum2Mono = new Tone.Mono();
    const drum2Pan  = new Tone.PanVol( 0.5, 0 );
    this.drum2.chain( drum2Pan, Tone.Master);
  }

  onPlay(): void {
    this.play_enabled   = false;
    this.pause_enabled  = true;
    this.stop_enabled   = true;

    const atmoEvent = new Tone.Event(
      (( time: Tone.Encoding.Time ) => {
        this.atmo.start(time, 0, '8m');
      }).bind(this), null );
    atmoEvent.start(0);

    const drums1 = new Tone.Sequence(((time: Tone.Encoding.Time, note) => {
      this.drum1.triggerAttackRelease(note, '16n', time);
    }).bind(this), ['C1', 'C#1', 'D1', 'D#1', 'C1', 'C#1', 'E1', 'F1'], '16n');
    drums1.probability = 0.8;
    drums1.start(0).stop('8m');

    const loop = new Tone.Loop(function (time: Tone.Encoding.Time ) {
      this.drum2.triggerAttackRelease('C1', '8n', time);
    }.bind(this), '4n');
    loop.probability = 0.3;
    loop.start(0).stop('8m');

    Tone.Transport.start('+0.1');

  }

  onPause(): void {
    Tone.Transport.pause('+0.1');
    this.atmo.stop();
    this.play_enabled = true;
    this.pause_enabled = false;
  }

  onStop(): void {
    Tone.Transport.stop();
    this.atmo.stop();
    this.play_enabled = true;
    this.stop_enabled = false;
    this.pause_enabled = false;
  }

}
