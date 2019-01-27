import * as Tone from 'tone';


export type Note =
    'C1' |
    'C#1' |
    'D1' |
    'D#1' |
    'E1' |
    'F1' |
    'F#1' |
    'G1' |
    'G#1' |
    'A1';


export type Loc =
    'home'          |
    'home_morning'  |
    'home_evening'  |
    'bathroom'      |
    'bed'           |
    'work'          |
    'outdoors'      |
    'supermarket'   |
    'mall'          |
    'diner'         |
    'classroom';


export type Transport =
    'walk'      |
    'car'       |
    'train'     |
    'bike'      |
    'bus'       |
    'skateboard';


export type Category = 
    'slow'  |
    'mid'   |
    'fast';


export type Food =
    'cook' |
    'warmup' |
    'order';

export type SamplesObject = { [note in Note]?: string };


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

    samplerSlow: Tone.Sampler = null;
    samplerMid: Tone.Sampler = null;
    samplerFast: Tone.Sampler = null;
    urlsSlow: SamplesObject;
    urlsMid: SamplesObject;
    urlsFast: SamplesObject;
    panVolSlow: Tone.PanVol;
    panVolMid: Tone.PanVol;
    panVolFast: Tone.PanVol;

    constructor(private location: Loc, isCity: boolean, onLoad: Tone.Callback, private food: Food = null) {
        super(isCity);
        this.initAtmo(onLoad);

        // randomly distribute categorys to samplers
        const categories: Category[] = ['slow', 'mid', 'fast'];
        let iCat = Math.floor(Math.random() * 3);
        
        if (this.getNoteToSampleURL(categories[iCat], food) != null) {
            this.urlsSlow = this.getNoteToSampleURL(categories[iCat], food);
            this.samplerSlow = new Tone.Sampler(
                this.urlsSlow,
                onLoad,
                this.getDir());
            this.panVolSlow = new Tone.PanVol(-0.7, 0);
            this.samplerSlow.chain(this.panVolSlow, Tone.Master);
        }

        iCat = Math.floor(Math.random() * 2);
        if (this.getNoteToSampleURL(categories[iCat], food) != null) {
            this.urlsMid = this.getNoteToSampleURL(categories[iCat], food);
            this.samplerMid = new Tone.Sampler(
                this.urlsMid,
                onLoad,
                this.getDir());
            this.panVolMid = new Tone.PanVol(0, 0);
            this.samplerMid.chain(this.panVolMid, Tone.Master);
        }

        if (this.getNoteToSampleURL(categories[0], food) != null) {
            this.urlsFast = this.getNoteToSampleURL(categories[iCat], food);
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
        const start = `${startBar + crossFadeTime }m`;
        const stop = `${startBar + duration - crossFadeTime }m`;

        // generate slow sample sequence
        if (this.samplerSlow != null) {
            const numNotesSlow = 4;
            const noteGenProbabilitySlow = 0.7;

            const sequence = this.generateSequence( this.urlsSlow, numNotesSlow, noteGenProbabilitySlow);
            const slowLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note: Note) => {
                    this.samplerSlow.triggerAttackRelease(note, '8n', time);
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

            const sequence = this.generateSequence( this.urlsMid, numNotesMid, noteGenProbabilityMid);
            const midLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note: Note) => {
                    this.samplerMid.triggerAttackRelease(note, '8n', time);
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

            const sequence = this.generateSequence( this.urlsFast, numNotesFast, noteGenProbabilityFast);
            const fastLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note) => {
                    this.samplerFast.triggerAttackRelease(note, '8n', time);
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

    private generateSequence(noteToURL: SamplesObject, numNotes: number, probability: number): Array<string> {
        const sequence: string[] = [];

        if (noteToURL == null) {
            throw new Error('Tried to generate sequence with empty sampler. ');
        }
        const notes = Object.keys(noteToURL);

        let iNote: number;
        for (let i = 0; i < numNotes; i++) {
            if (Math.random() <= probability) {
                iNote = Math.floor(Math.random() * notes.length);
                sequence.push( notes[iNote] );
            } else {
                sequence.push(null);
            }
        }

        return sequence;
    }

    private getNoteToSampleURL(category: Category, food?: Food): SamplesObject {
        switch (this.location) {
            case 'home':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'knocking_1.mp3',
                            'C#1': 'knocking_2.mp3',
                            'D1': 'knocking_3.mp3',
                            'D#1': 'knocking_4.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'close_door_1.mp3',
                            'C#1': 'close_door_2.mp3',
                            'D1': 'close_door_3.mp3',
                            'D#1': 'close_door_4.mp3',
                            'E1': 'open_door_1.mp3',
                            'F1': 'open_door_2.mp3'
                        };
                    case 'fast':
                        return {
                            'C1': 'clock_1.mp3',
                            'C#1': 'clock_2.mp3',
                            'D1': 'clock_3.mp3',
                            'D#1': 'clock_4.mp3'
                        };
                }
                break;
            case 'home_evening':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'light_switch_1.mp3',
                            'C#1': 'light_switch_2.mp3',
                            'D1': 'light_switch_3.mp3',
                            'D#1': 'light_switch_4.mp3',
                            'E1': 'light_switch_5.mp3',
                            'F1': 'light_switch_6.mp3',
                            'F#1': 'light_switch_7.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'place_plate_1.mp3',
                            'C#1': 'place_plate_2.mp3',
                            'D1': 'place_plate_3.mp3'
                        };
                    case 'fast':
                        if (food != null) {
                            switch (food) {
                                case 'warmup':
                                    return {
                                        'C1': 'microwave/microwave.mp3'
                                    };
                                case 'order':
                                    return {
                                        'C1': 'order/phone_toot_1.mp3',
                                        'C#1': 'order/phone_toot_2.mp3',
                                        'D1': 'order/doorbell_-1.mp3',
                                        'D#1': 'order/doorbell_-2.mp3',
                                        'E1': 'order/doorbell_0.mp3',
                                        'F1': 'order/doorbell_1.mp3',
                                        'F#1': 'order/doorbell_2.mp3'
                                    };
                                case 'cook':
                                    return {
                                        'C1': 'cooking/cutting_1.mp3',
                                        'C#1': 'cooking/cutting_2.mp3',
                                        'D1': 'cooking/cutting_3.mp3',
                                        'D#1': 'cooking/cutting_4.mp3',
                                        'E1': 'cooking/cutting_5.mp3',
                                        'F1': 'cooking/cutting_6.mp3',
                                        'F#1': 'cooking/fridge_door_1.mp3',
                                        'G1': 'cooking/fridge_door_2.mp3',
                                        'G#1': 'cooking/fridge_door_3.mp3',
                                        'A1': 'cooking/fridge_door_4.mp3'
                                    };
                            }
                        }
                        throw new Error('Tried to create evening slot without giving food parameter.');
                }
                break;
            case 'home_morning':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'place_spoon_1.mp3',
                            'C#1': 'place_spoon_2.mp3',
                            'D1': 'place_spoon_3.mp3',
                            'D#1': 'place_spoon_4.mp3',
                            'E1': 'spoon_in_cup_1.mp3',
                            'F1': 'spoon_in_cup_2.mp3',
                            'F#1': 'spoon_in_cup_3.mp3',
                            'G1': 'spoon_in_cup_4.mp3',
                            'G#1': 'spoon_in_cup_5.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'light_switch_1.mp3',
                            'C#1': 'light_switch_2.mp3',
                            'D1': 'light_switch_3.mp3',
                            'D#1': 'light_switch_4.mp3',
                            'E1': 'light_switch_5.mp3',
                            'F1': 'light_switch_6.mp3',
                            'F#1': 'light_switch_7.mp3'
                        };
                    case 'fast':
                        return {
                            'C1': 'place_cup_1.mp3',
                            'C#1': 'place_cup_2.mp3',
                            'D1': 'place_cup_3.mp3',
                            'D#1': 'place_cup_4.mp3'
                        };
                }
                break;
            case 'bathroom':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'brushing_teeth_1.mp3',
                            'C#1': 'brushing_teeth_2.mp3',
                            'D1': 'brushing_teeth_3.mp3',
                            'D#1': 'brushing_teeth_4.mp3',
                            'E1': 'brushing_teeth_5.mp3',
                            'F1': 'brushing_teeth_6.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'toothbrush_in_cup_1.mp3',
                            'C#1': 'toothbrush_in_cup_2.mp3',
                            'D1': 'toothbrush_in_cup_3.mp3'
                        };
                    case 'fast':
                        return null;
                }
                break;
            case 'bed':
                return null;
                break;
            case 'diner':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'place_spoon_1.mp3',
                            'C#1': 'place_spoon_2.mp3',
                            'D1': 'place_spoon_3.mp3',
                            'D#1': 'place_spoon_4.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'clink_glasses_1.mp3',
                            'C#1': 'clink_glasses_2.mp3',
                            'D1': 'clink_glasses_3.mp3',
                            'D#1': 'clink_glasses_4.mp3',
                            'E1': 'clink_glasses_5.mp3',
                            'F1': 'clink_glasses_6.mp3',
                            'F#1': 'clink_glasses_7.mp3'
                        };
                    case 'fast':
                        return {
                            'C1': 'place_plate_1.mp3',
                            'C#1': 'place_plate_2.mp3',
                            'D1': 'place_plate_3.mp3'
                        };
                }
                break;
            case 'mall':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'shopping_beep_1.mp3',
                            'C#1': 'shopping_beep_2.mp3',
                            'D1': 'shopping_beep_3.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'credit_card_1.mp3',
                            'C#1': 'credit_card_2.mp3',
                            'D1': 'credit_card_3.mp3'
                        };
                    case 'fast':
                        return {
                            'C1': 'cash_register.mp3'
                        };
                }
                break;
            case 'outdoors':
                return null;
                break;
            case 'work':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'keyboard_1.mp3',
                            'C#1': 'keyboard_2.mp3',
                            'D1': 'keyboard_3.mp3',
                            'D#1': 'keyboard_4.mp3',
                            'E1': 'keyboard_5.mp3',
                            'F1': 'keyboard_6.mp3',
                            'F#1': 'keyboard_7.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'mouse_click_1.mp3',
                            'C#1': 'mouse_click_2.mp3',
                            'D1': 'mouse_click_3.mp3',
                            'D#1': 'mouse_click_4.mp3'
                        };
                    case 'fast':
                        return {
                            'C1': 'turn_page_1.mp3',
                            'C#1': 'turn_page_2.mp3',
                            'D1': 'turn_page_3.mp3',
                            'D#1': 'turn_page_4.mp3',
                            'E1': 'turn_page_5.mp3'
                        };
                }
                break;
            case 'supermarket':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'shopping_beep_1.mp3',
                            'C#1': 'shopping_beep_2.mp3',
                            'D1': 'shopping_beep_3.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'credit_card_1.mp3',
                            'C#1': 'credit_card_2.mp3',
                            'D1': 'credit_card_3.mp3'
                        };
                    case 'fast':
                        return {
                            'C1': 'cash_register.mp3'
                        };
                }
                break;
            case 'classroom':
                switch (category) {
                    case 'slow':
                        return {
                            'C1': 'keyboard_1.mp3',
                            'C#1': 'keyboard_2.mp3',
                            'D1': 'keyboard_3.mp3',
                            'D#1': 'keyboard_4.mp3',
                            'E1': 'keyboard_5.mp3',
                            'F1': 'keyboard_6.mp3',
                            'F#1': 'keyboard_7.mp3'
                        };
                    case 'mid':
                        return {
                            'C1': 'pencil_1.mp3',
                            'C#1': 'pencil_2.mp3',
                            'D1': 'pencil_3.mp3',
                            'D#1': 'pencil_4.mp3'
                        };
                    case 'fast':
                        return {
                            'C1': 'turn_page_1.mp3',
                            'C#1': 'turn_page_2.mp3',
                            'D1': 'turn_page_3.mp3',
                            'D#1': 'turn_page_4.mp3',
                            'E1': 'turn_page_5.mp3'
                        };
                }
            default:
                return null;
        }
    }


}
