import * as Tone from 'tone';
import * as Samples from './sample-mappings';
import * as Tools from './tools'



export type Transport =
    'walk'      |
    'car'       |
    'train'     |
    'bike'      |
    'bus'       |
    'skateboard';


export abstract class TimeSlot {

    atmo: Tone.Player = null;

    constructor(protected isCity: boolean) { }

    initAtmo(onLoad: Tone.Callback) {
        this.atmo = new Tone.Player(this.getAtmo(), onLoad);
        const atmoPan = new Tone.PanVol(0, 12);
        this.atmo.chain(atmoPan, Tone.Master);
    }

    play(start: number, duration: number, crossFade: number) {
        if (duration < 2 * crossFade) {
            throw new Error('Slot duration needs to be at least two times as long as crossfading time!');
        }
        this.atmo.fadeIn = `${crossFade}m`;
        this.atmo.fadeOut = `${crossFade}m`;
        const startString = `${start}m`;
        const durString = `${duration}m`;
        const offset = Math.floor(Math.random() * 30);
        this.atmo.sync().start( startString, offset, durString);
        console.log( 'Atmo starting at ' + startString + ' with duration ' + durString);
    }

    stop( time: Tone.Encoding.Time ) {
        this.atmo.stop('+0.1');
        // this.atmo.seek( '0:0:0' );
    }

    public getNumInstrumentsToLoad(): number {
        return this.atmo === null ? 0 : 1;
    }

    abstract getAtmo(): string;

}

export class TransitionSlot extends TimeSlot {

    constructor(private transport: Transport, isCity: boolean, onLoad: Tone.Callback) {
        super(isCity);
        this.initAtmo(onLoad);
    }

    public getAtmo(): string {
        const path = './assets/audio/transportation/';
        switch (this.transport) {
            case 'bike':
                return path + 'bicycle_atmo+.mp3';
            case 'bus':
                return path + 'bus_atmo.mp3';
            case 'car':
                return path + 'car_atmo+.mp3';
            case 'train':
                return path + 'train_and_metro_atmo.mp3';
            case 'skateboard':
                return path + 'skateboarding_atmo.mp3';
            case 'walk':
                return path + (this.isCity ? 'walking_city_atmo.mp3' : 'walking_village_atmo.mp3');
        }
    }

}

export class LocationSlot extends TimeSlot {

    private samplerSlow: Tone.Sampler = null;
    private samplerMid: Tone.Sampler = null;
    private samplerFast: Tone.Sampler = null;
    private urlsSlow: Samples.SamplesObject;
    private urlsMid: Samples.SamplesObject;
    private urlsFast: Samples.SamplesObject;
    private panVolSlow: Tone.PanVol;
    private panVolMid: Tone.PanVol;
    private panVolFast: Tone.PanVol;

    constructor(private location: Samples.Loc, isCity: boolean, onLoad: Tone.Callback, private food: Samples.Food = null) {
        super(isCity);
        this.initAtmo(onLoad);

        // randomly distribute categorys to samplers
        const categories: Samples.Category[] = ['slow', 'mid', 'fast'];
        let iCat = Math.floor(Math.random() * 3);
        
        if (Samples.getNoteToSampleURL( location, categories[iCat], food) != null) {
            this.urlsSlow = Samples.getNoteToSampleURL( location, categories[iCat], food);
            this.samplerSlow = new Tone.Sampler(
                this.urlsSlow,
                onLoad,
                this.getDir());
            this.panVolSlow = new Tone.PanVol(-0.7, 0);
            this.samplerSlow.chain(this.panVolSlow, Tone.Master);
        }

        iCat = Math.floor(Math.random() * 2);
        if (Samples.getNoteToSampleURL( location, categories[iCat], food) != null) {
            this.urlsMid = Samples.getNoteToSampleURL(location, categories[iCat], food);
            this.samplerMid = new Tone.Sampler(
                this.urlsMid,
                onLoad,
                this.getDir());
            this.panVolMid = new Tone.PanVol(0, 0);
            this.samplerMid.chain(this.panVolMid, Tone.Master);
        }

        if (Samples.getNoteToSampleURL(location, categories[0], food) != null) {
            this.urlsFast = Samples.getNoteToSampleURL(location, categories[iCat], food);
            this.samplerFast = new Tone.Sampler(
                this.urlsFast,
                onLoad,
                this.getDir());
            this.panVolFast = new Tone.PanVol(0.3, 0);            
            this.samplerFast.chain(this.panVolFast, Tone.Master);
        }

    }

    public play(startBar: number, duration: number, crossFadeTime: number) {
        super.play(startBar, duration, crossFadeTime);

        // time value initialization
        const start = `${startBar}m`;
        const stop = `${startBar + duration }m`;

        // generate slow sample sequence
        if (this.samplerSlow != null) {
            const numNotesSlow = 4;
            const noteGenProbabilitySlow = 0.7;

            this.fadeInFadeOut( this.samplerSlow, crossFadeTime, startBar, duration);
            const sequence = Tools.generateSequence( this.urlsSlow, numNotesSlow, noteGenProbabilitySlow);
            const slowLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note: Samples.Note) => {
                    this.samplerSlow.triggerAttackRelease(note, '2n', time);
                }).bind(this),
                sequence,
                `${numNotesSlow}n`);
            slowLine.probability = 1;                  
            slowLine.start(start).stop(stop);
            console.log( 'Slow starting at ' + start + ' and stopping at ' + stop + ' playing:');
        }

        // generate mid tempo sample sequence
        if (this.samplerMid != null) {
            const numNotesMid = 8;
            const noteGenProbabilityMid = 0.5;

            this.fadeInFadeOut( this.samplerMid, crossFadeTime, startBar, duration);
            const sequence = Tools.generateSequence( this.urlsMid, numNotesMid, noteGenProbabilityMid);
            const midLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note: Samples.Note) => {
                    this.samplerMid.triggerAttackRelease(note, '2n', time);
                }).bind(this),
                sequence,
                `${numNotesMid}n`);
            midLine.probability = 1;
            midLine.start(start).stop(stop);
            console.log( 'Mid starting at ' + start + ' and stopping at ' + stop + ' playing:');
        }

        // generate fast sample sequence
        if (this.samplerFast != null) {
            const numNotesFast = 16;
            const noteGenProbabilityFast = 0.5;

            this.fadeInFadeOut( this.samplerFast, crossFadeTime, startBar, duration);
            const sequence = Tools.generateSequence( this.urlsFast, numNotesFast, noteGenProbabilityFast);
            const fastLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note: Samples.Note) => {
                    this.samplerFast.triggerAttackRelease(note, '2n', time);
                }).bind(this),
                sequence,
                `${numNotesFast}n`);
            fastLine.probability = 1;
            fastLine.start(start).stop(stop);
            console.log( 'Fast starting at ' + start + ' and stopping at ' + stop + ' playing:');
        }
    }

    /**
     * Returns the number of available instruments
     */
    public getNumInstrumentsToLoad(): number {
        let numInstruments = super.getNumInstrumentsToLoad();
        if (this.samplerFast != null) {
            numInstruments++;
        }
        if (this.samplerMid != null) {
            numInstruments++;
        }
        if (this.samplerSlow != null) {
            numInstruments++;
        }

        return numInstruments;
    }

    private getDir(): string {
        return './assets/audio/location/' + this.location + '/';
    }


    public getAtmo(): string {
        const path = this.getDir() + 'atmo';
        if (this.location === 'home' ||
            this.location === 'work' ||
            this.location === 'outdoors') {
            return this.isCity ? path + '_city.mp3' : path + '_country.mp3';
        } else {
            return path + '.mp3';
        }
    }

    private fadeInFadeOut( sampler: Tone.Sampler, fadeTime: number, startTime: number, slotTime: number ){
        sampler.volume.value = -80;
        Tone.Transport.schedule( 
            ( time ) => { sampler.volume.linearRampTo( 0, `${fadeTime}m`, time ) },
            `${startTime}m`
        );
        Tone.Transport.schedule(
            ( time ) => { sampler.volume.linearRampTo( -80, `${fadeTime}m`, time ) },
            `${startTime + slotTime - fadeTime}m`
        )
    }

}
