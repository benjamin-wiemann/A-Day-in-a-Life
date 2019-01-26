import { Component, OnInit, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as Survey from 'survey-angular';
import * as Tone from 'tone';

import { SurveyMessengerService } from '../survey-messenger.service';
import * as Slot from './Slot';
import * as Global from '../global';

type Question =
    'living_place' |
    'spot' |
    'transport' |
    'busy' |
    'dinner' |
    'age' |
    'sickness' |
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
    atmo: Tone.Player;
    sample1: Tone.Sampler;
    sample2: Tone.Sampler;
    sample3: Tone.Sampler;

    // Slot sequence
    slots = Array<Slot.TimeSlot>();
    numBuffers = 0;
    numBuffersLoaded = 0;

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

        Tone.Transport.bpm.value = 80;

        const isCity = true;

        // add slots according to playback order
        this.addSlot(new Slot.LocationSlot('bed', isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot('bathroom', isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot('home_morning', isCity, this.enablePlayButton.bind(this)));

        let food: Slot.Food = null;
        if (Global.isTestMode) {
            // fixed slot queue for testing purposes
            this.addSlot(new Slot.TransitionSlot('skateboard', isCity, this.enablePlayButton.bind(this)));
            this.addSlot(new Slot.LocationSlot('work', isCity, this.enablePlayButton.bind(this)));
            this.addSlot(new Slot.TransitionSlot('skateboard', isCity, this.enablePlayButton.bind(this)));
        } else {
            // set parameters and add slots depending on survey answers
            const data = this.survey.data;
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
            if ( spots[spots.length - 1]['Column 1'] !== 'home' ) {
                this.addSlot(new Slot.TransitionSlot(
                    transport,
                    isCity,
                    this.enablePlayButton.bind(this)));
            }
        }
        this.addSlot(new Slot.LocationSlot('home_evening', isCity, this.enablePlayButton.bind(this), food));
        this.addSlot(new Slot.LocationSlot('bathroom', isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot('bed', isCity, this.enablePlayButton.bind(this)));

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

        this.play_enabled = false;
        this.pause_enabled = true;
        this.stop_enabled = true;

        // put slots in queue and start playing
        let bars = 0;
        const transDuration = 3;
        const locDuration = 4;
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

        let stopEvent = new Tone.Event((() => this.stop('+0.1')).bind(this), null);
        stopEvent.start(`${bars + crossFadeTime}m`);
        Tone.Transport.start('+0.1');

    }

    stop(time: Tone.Encoding.Time) {
        Tone.Transport.stop(time);
        this.slots.forEach(
            (slot) => { slot.stop(time); }
        );
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
