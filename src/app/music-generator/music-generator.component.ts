import { Component, OnInit, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as Survey from 'survey-angular';
import * as Tone from 'tone';

import { SurveyMessengerService } from '../survey-messenger.service';
import * as Slot from './Slot';
import * as Global from '../global';
import { surveyAnswers } from '../survey/survey-data-test';
import * as Samples from './sample-mappings';
import * as Tools from './tools';

type Question =
    'living_place'  |
    'spot'          |
    'transport'     |
    'busy'          |
    'dinner'        |
    'age'           |
    'sickness'      |
    'drink';

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
    drinking: Tone.Sampler;
    flushing: Tone.Sampler;
    coughingSneezing: Tone.Sampler;

    panVolDrink: Tone.PanVol;
    panVolFlush: Tone.PanVol;
    panVolSickness: Tone.PanVol;

    // Slot sequence
    slots = Array<Slot.TimeSlot>();
    numBuffers = 0;
    numBuffersLoaded = 0;
    seqDrink: Tone.Sequence;
    seqFlush: Tone.Sequence;
    seqSick: Tone.Sequence;

    constructor() { }

    enablePlayButton() {
        this.numBuffersLoaded++;
        console.log(` ${this.numBuffersLoaded} of ${this.numBuffers} loaded `);
        if (this.numBuffers === this.numBuffersLoaded) {
            this.play_enabled = true;
        }
    }

    ngOnInit() {
        this.url = 'https://test.url.com';

        let data: Object;
        if (Global.isTestMode) {
            // fixed slot queue for testing purposes
            data = surveyAnswers;
        } else {
            // set parameters and add slots depending on survey answers
            data = this.survey.data;
        }

        Tone.Transport.bpm.value = Math.floor( (data['busy'] / 10) * 40) + 80;

        const isCity = true;

        // add slots according to playback order
        this.addSlot(new Slot.LocationSlot('bed', isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot('bathroom', isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot('home_morning', isCity, this.enablePlayButton.bind(this)));

        let food: Samples.Food = null;

        const spots: Object[] = data['spot'];
        food = data['dinner'];
        const transport: Slot.Transport = data['transport'];
        spots.forEach(
            (spot) => {
                // only add a transition slot when leaving home
                if (spot['Column 1'] !== 'home') {
                    this.addSlot(new Slot.TransitionSlot(
                        transport,
                        isCity,
                        this.enablePlayButton.bind(this)));
                }
                this.addSlot(new Slot.LocationSlot(
                    spot['Column 1'],
                    data['living_place'] === 'city',
                    this.enablePlayButton.bind(this),
                    food));
            }
        );
        if (spots[spots.length - 1]['Column 1'] !== 'home') {
            this.addSlot(new Slot.TransitionSlot(
                transport,
                isCity,
                this.enablePlayButton.bind(this)));
        }

        this.addSlot(new Slot.LocationSlot('home_evening', isCity, this.enablePlayButton.bind(this), food));
        this.addSlot(new Slot.LocationSlot('bathroom', isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot('bed', isCity, this.enablePlayButton.bind(this)));

        // initialize continous sound sources
        this.coughingSneezing = new Tone.Sampler(Samples.getSicknessSamples().fileNames, 
            this.enablePlayButton.bind( this ),
            Samples.getSicknessSamples().path);
        this.panVolSickness = new Tone.PanVol(0, 0);
        this.coughingSneezing.chain( this.panVolSickness, Tone.Master);

        this.drinking = new Tone.Sampler(Samples.getDrinkingSamples().fileNames, 
            this.enablePlayButton.bind( this ),
            Samples.getDrinkingSamples().path);
        this.panVolDrink = new Tone.PanVol(0, 0);
        this.drinking.chain( this.panVolDrink, Tone.Master);
        
        this.flushing = new Tone.Sampler(Samples.getFlushingSamples().fileNames, 
            this.enablePlayButton.bind( this ),
            Samples.getFlushingSamples().path);
        this.panVolFlush = new Tone.PanVol(0, 0);
        this.flushing.chain( this.panVolDrink, Tone.Master);
        this.numBuffers += 3;
            
        // adding master effects
        let filter = new Tone.Filter( 22100 - data['age'] * 200, 'lowpass', -24 );
        Tone.Master.chain(filter);
    }

    addSlot(slot: Slot.TimeSlot) {
        this.slots.push(slot);
        if (slot instanceof Slot.TransitionSlot) {
            this.numBuffers++;
        } else {
            this.numBuffers = this.numBuffers + slot.getNumInstrumentsToLoad();
        }
    }

    onPlay(): void {

        let data: Object;
        if (Global.isTestMode) {
            data = surveyAnswers;
        } else {
            data = this.survey.data;
        }

        this.play_enabled = false;
        this.pause_enabled = true;
        this.stop_enabled = true;

        // put slots in queue
        let bars = 0;
        const transDuration = 3;
        const locDuration = 6;
        const crossFadeTime = 1;
        this.slots.forEach(
            (slot) => {
                if (slot instanceof Slot.LocationSlot) {
                    slot.play(bars, locDuration, crossFadeTime);
                    bars += locDuration - crossFadeTime;
                } else {
                    slot.play(bars, transDuration, crossFadeTime);
                    bars += transDuration - crossFadeTime;
                }
            }
        );

        let stopTime = bars + crossFadeTime;
        let stopString = `${ stopTime + locDuration*2 }m`;

        // add continous samples
        this.seqDrink = new Tone.Sequence((
            (time: Tone.Encoding.Time, note: Samples.Note) => {
                this.drinking.triggerAttackRelease(note, '1m', time);
            }).bind(this),
            Tools.generateSequence( Samples.getDrinkingSamples().fileNames, 4, 1 ),
            '4n');
        this.seqDrink.probability = data['drink']/20;
        this.seqDrink.start( `${locDuration + crossFadeTime}m` ).stop( `${stopTime - locDuration - crossFadeTime}m` );

        this.seqFlush = new Tone.Sequence((
            (time: Tone.Encoding.Time, note: Samples.Note) => {
                this.flushing.triggerAttackRelease(note, '2m', time);
            }).bind(this),
            Tools.generateSequence( Samples.getFlushingSamples().fileNames, 4, 1 ),
            '4n');
        this.seqFlush.probability = data['drink']/80;
        this.seqFlush.start( `${locDuration + crossFadeTime}m` ).stop( `${stopTime - locDuration - crossFadeTime}m` );
        
        this.seqSick = new Tone.Sequence((
            (time: Tone.Encoding.Time, note: Samples.Note) => {
                this.coughingSneezing.triggerAttackRelease(note, '1m', time);
            }).bind(this),
            Tools.generateSequence( Samples.getSicknessSamples().fileNames, 4, 1 ),
            '4n');
        this.seqSick.probability = data['sickness']/20;
        this.seqSick.start( `${locDuration + crossFadeTime}m` ).stop( `${stopTime - locDuration - crossFadeTime}m` );        

        let stopEvent = new Tone.Event((() => this.stop('+0.1')).bind(this), null);
        stopEvent.start( stopString );

        Tone.Transport.start('+0.1').stop( stopString );
        console.log('Stopping at ' + stopString);

    }

    stop(time: Tone.Encoding.Time) {
        Tone.Transport.stop(time);
        this.slots.forEach(
            (slot) => { slot.stop(time); }
        );
        Tone.Transport.position = '0:0:0';
        this.play_enabled = true;
        this.stop_enabled = false;
        this.pause_enabled = false;
    }

    onPause(): void {
        Tone.Transport.pause('+0.1');
        this.play_enabled = true;
        this.pause_enabled = false;
    }

    onStop(): void {
        this.stop('+0.1');
    }

}
