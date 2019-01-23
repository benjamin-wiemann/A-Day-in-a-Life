import { Component, OnInit, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import * as Survey from 'survey-angular';
import * as Tone from 'tone';

import { SurveyMessengerService } from '../survey-messenger.service';
import * as Slot from './Slot';
import * as Global from '../global';

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
        console.log( ` ${ this.numBuffersLoaded } of ${ this.numBuffers } loaded ` );
        if (this.numBuffers === this.numBuffersLoaded) {
            this.play_enabled = true;
        }
    }

    ngOnInit() {
        this.url = 'https://test.url.com';

        Tone.Transport.bpm.value = 80;

        const isCity = true;

        // add slots according to playback order
        this.addSlot(new Slot.LocationSlot(Slot.Loc.Bed, isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot(Slot.Loc.Bathroom, isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot(Slot.Loc.HomeMo, isCity, this.enablePlayButton.bind(this)));
        if (Global.isTestMode) {
            this.addSlot(new Slot.TransitionSlot(Slot.Transport.Skateboard, isCity, this.enablePlayButton.bind(this)));
            this.addSlot(new Slot.LocationSlot(Slot.Loc.Work, isCity, this.enablePlayButton.bind(this)));
            this.addSlot(new Slot.TransitionSlot(Slot.Transport.Skateboard, isCity, this.enablePlayButton.bind(this)));
        }
        this.addSlot(new Slot.LocationSlot(Slot.Loc.HomeEv, isCity, this.enablePlayButton.bind(this), 'Cooking'));
        this.addSlot(new Slot.LocationSlot(Slot.Loc.Bathroom, isCity, this.enablePlayButton.bind(this)));
        this.addSlot(new Slot.LocationSlot(Slot.Loc.Bed, isCity, this.enablePlayButton.bind(this)));

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
        const transDuration = 2;
        const locDuration = 4;
        const crossFadeTime = 1;
        this.slots.forEach(
            (slot) => {
                if (slot instanceof Slot.LocationSlot) {
                    slot.play( bars, locDuration, crossFadeTime);
                    bars += locDuration - crossFadeTime;
                } else {
                    slot.play( bars, transDuration, crossFadeTime);
                    bars += transDuration - crossFadeTime;
                }
            }
        );

        Tone.Transport.start('+0.1');

    }

    onPause(): void {
        Tone.Transport.pause('+0.1');
        this.play_enabled = true;
        this.pause_enabled = false;
    }

    onStop(): void {
        Tone.Transport.stop();
        this.slots.forEach(
            (slot) => { slot.stop() }
        );
        this.play_enabled = true;
        this.stop_enabled = false;
        this.pause_enabled = false;

    }

}
