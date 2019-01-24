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


export const enum Loc {
    Home = 'Home',
    HomeMo = 'HomeMo',
    HomeEv = 'HomeEv',
    Bathroom = 'Bathroom',
    Bed = 'Bed',
    Work = 'Work',
    Outdoors = 'Outdoors',
    Supermarket = 'Supermarket',
    Mall = 'Mall',
    Diner = 'Diner',
    Classroom = 'Classroom'
}

export const enum Transport {
    Walk = 'Walk',
    Car = 'Car',
    Train = 'Train',
    Bike = 'Bike',
    Bus = 'Bus',
    Skateboard = 'Skateboard'
}

export const enum Category {
    Slow = 1,
    Mid = 2,
    Fast = 3
}

export type Food =
    'Cooking' |
    'WarmUp' |
    'Order';

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
            case Transport.Bike:
                return path + 'bycycle_atmo+.mp3';
            case Transport.Bus:
                return path + 'bus_atmo.mp3';
            case Transport.Car:
                return path + 'car_atmo+.mp3';
            case Transport.Train:
                return path + 'train_and_metro_atmo.mp3';
            case Transport.Skateboard:
                return path + 'skateboarding_atmo.mp3';
            case Transport.Walk:
                return path + (this.isCity ? 'walking_city_atmo.mp3' : 'walking_village_atmo.mp3');
        }
    }

}

export class LocationSlot extends TimeSlot {

    samplerSlow: Tone.Sampler = null;
    samplerMid: Tone.Sampler = null;
    samplerFast: Tone.Sampler = null;

    constructor(private location: Loc, isCity: boolean, onLoad: Tone.Callback, private food: Food = null) {
        super(isCity);
        this.initAtmo(onLoad);

        if (this.getNoteToSampleURL(Category.Slow, food) != null) {
            this.samplerSlow = new Tone.Sampler(
                this.getNoteToSampleURL(Category.Slow, food),
                onLoad,
                this.getDir());
            const panVolSlow = new Tone.PanVol(0, 0);
            this.samplerSlow.chain(panVolSlow, Tone.Master);
        }

        if (this.getNoteToSampleURL(Category.Mid, food) != null) {
            this.samplerMid = new Tone.Sampler(
                this.getNoteToSampleURL(Category.Mid, food),
                onLoad,
                this.getDir());
            const panVolMid = new Tone.PanVol(0, 0);
            this.samplerMid.chain(panVolMid, Tone.Master);
        }

        if (this.getNoteToSampleURL(Category.Fast, food) != null) {
            this.samplerFast = new Tone.Sampler(
                this.getNoteToSampleURL(Category.Fast, food),
                onLoad,
                this.getDir());
            const panVolFast = new Tone.PanVol(0, 0);
            this.samplerFast.chain(panVolFast, Tone.Master);
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
            const noteGenProbabilitySlow = 1;

            const sequence = this.generateSequence(Category.Slow, numNotesSlow, noteGenProbabilitySlow);
            const slowLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note: Note) => {
                    this.samplerSlow.triggerAttackRelease(note, '8n', time);
                }).bind(this),
                sequence,
                `${numNotesSlow}n`);
            slowLine.probability = 1;
            slowLine.start(start).stop(stop);
            console.log( 'Slow starting at ' + start + ' and stopping at ' + stop + ' playing:');
            console.log(sequence);
        }

        // generate mid tempo sample sequence
        if (this.samplerMid != null) {
            const numNotesMid = 8;
            const noteGenProbabilityMid = 1;

            const sequence = this.generateSequence(Category.Mid, numNotesMid, noteGenProbabilityMid);
            const midLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note: Note) => {
                    this.samplerMid.triggerAttackRelease(note, '8n', time);
                }).bind(this),
                sequence,
                `${numNotesMid}n`);
            midLine.probability = 1;
            midLine.start(start).stop(stop);
            console.log( 'Mid starting at ' + start + ' and stopping at ' + stop + ' playing:');
            console.log(sequence);
        }

        // generate fast sample sequence
        if (this.samplerFast != null) {
            const numNotesFast = 16;
            const noteGenProbabilityFast = 1;

            const sequence = this.generateSequence(Category.Fast, numNotesFast, noteGenProbabilityFast);
            const fastLine = new Tone.Sequence((
                (time: Tone.Encoding.Time, note) => {
                    this.samplerFast.triggerAttackRelease(note, '8n', time);
                }).bind(this),
                sequence,
                `${numNotesFast}n`);
            fastLine.probability = 1;
            fastLine.start(start).stop(stop);
            console.log( 'Fast starting at ' + start + ' and stopping at ' + stop + ' playing:');
            console.log(sequence);
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
        const path = './assets/audio/location/';
        switch (this.location) {
            case Loc.Home:
                return path + 'home/';
            case Loc.HomeEv:
                return path + 'home_evening/';
            case Loc.HomeMo:
                return path + 'home_morning/';
            case Loc.Bathroom:
                return path + 'bathroom/';
            case Loc.Bed:
                return path + 'bed/';
            case Loc.Diner:
                return path + 'diner/';
            case Loc.Mall:
                return path + 'mall/';
            case Loc.Outdoors:
                return path + 'outdoors/';
            case Loc.Work:
                return path + 'work/';
            case Loc.Supermarket:
                return path + 'supermarket/';
            case Loc.Classroom:
                return path + 'classroom/';
        }
        throw new Error('this.location is undefined');
    }

    private getNoteToSampleURL(category: Category, food?: Food): SamplesObject {
        switch (this.location) {
            case Loc.Home:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'knocking_1.mp3',
                            'C#1': 'knocking_2.mp3',
                            'D1': 'knocking_3.mp3',
                            'D#1': 'knocking_4.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'close_door_1.mp3',
                            'C#1': 'close_door_2.mp3',
                            'D1': 'close_door_3.mp3',
                            'D#1': 'close_door_4.mp3',
                            'E1': 'open_door_1.mp3',
                            'F1': 'open_door_2.mp3'
                        };
                    case Category.Fast:
                        return {
                            'C1': 'clock_1.mp3',
                            'C#1': 'clock_2.mp3',
                            'D1': 'clock_3.mp3',
                            'D#1': 'clock_4.mp3'
                        };
                }
                break;
            case Loc.HomeEv:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'light_switch_1.mp3',
                            'C#1': 'light_switch_2.mp3',
                            'D1': 'light_switch_3.mp3',
                            'D#1': 'light_switch_4.mp3',
                            'E1': 'light_switch_5.mp3',
                            'F1': 'light_switch_6.mp3',
                            'F#1': 'light_switch_7.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'place_plate_1.mp3',
                            'C#1': 'place_plate_2.mp3',
                            'D1': 'place_plate_3.mp3'
                        };
                    case Category.Fast:
                        if (food != null) {
                            switch (food) {
                                case 'WarmUp':
                                    return {
                                        'C1': 'microwave/microwave.mp3'
                                    };
                                case 'Order':
                                    return {
                                        'C1': 'order/phone_toot_1.mp3',
                                        'C#1': 'order/phone_toot_2.mp3',
                                        'D1': 'order/doorbell_-1.mp3',
                                        'D#1': 'order/doorbell_-2.mp3',
                                        'E1': 'order/doorbell_0.mp3',
                                        'F1': 'order/doorbell_1.mp3',
                                        'F#1': 'order/doorbell_2.mp3'
                                    };
                                case 'Cooking':
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
            case Loc.HomeMo:
                switch (category) {
                    case Category.Slow:
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
                    case Category.Mid:
                        return {
                            'C1': 'light_switch_1.mp3',
                            'C#1': 'light_switch_2.mp3',
                            'D1': 'light_switch_3.mp3',
                            'D#1': 'light_switch_4.mp3',
                            'E1': 'light_switch_5.mp3',
                            'F1': 'light_switch_6.mp3',
                            'F#1': 'light_switch_7.mp3'
                        };
                    case Category.Fast:
                        return {
                            'C1': 'place_cup_1.mp3',
                            'C#1': 'place_cup_2.mp3',
                            'D1': 'place_cup_3.mp3',
                            'D#1': 'place_cup_4.mp3'
                        };
                }
                break;
            case Loc.Bathroom:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'brushing_teeth_1.mp3',
                            'C#1': 'brushing_teeth_2.mp3',
                            'D1': 'brushing_teeth_3.mp3',
                            'D#1': 'brushing_teeth_4.mp3',
                            'E1': 'brushing_teeth_5.mp3',
                            'F1': 'brushing_teeth_6.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'toothbrush_in_cup_1.mp3',
                            'C#1': 'toothbrush_in_cup_2.mp3',
                            'D1': 'toothbrush_in_cup_3.mp3'
                        };
                    case Category.Fast:
                        return null;
                }
                break;
            case Loc.Bed:
                return null;
                break;
            case Loc.Diner:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'place_spoon_1.mp3',
                            'C#1': 'place_spoon_2.mp3',
                            'D1': 'place_spoon_3.mp3',
                            'D#1': 'place_spoon_4.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'clink_glasses_1.mp3',
                            'C#1': 'clink_glasses_2.mp3',
                            'D1': 'clink_glasses_3.mp3',
                            'D#1': 'clink_glasses_4.mp3',
                            'E1': 'clink_glasses_5.mp3',
                            'F1': 'clink_glasses_6.mp3',
                            'F#1': 'clink_glasses_7.mp3'
                        };
                    case Category.Fast:
                        return {
                            'C1': 'place_plate_1.mp3',
                            'C#1': 'place_plate_2.mp3',
                            'D1': 'place_plate_3.mp3'
                        };
                }
                break;
            case Loc.Mall:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'shopping_beep_1.mp3',
                            'C#1': 'shopping_beep_2.mp3',
                            'D1': 'shopping_beep_3.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'credit_card_1.mp3',
                            'C#1': 'credit_card_2.mp3',
                            'D1': 'credit_card_3.mp3'
                        };
                    case Category.Fast:
                        return {
                            'C1': 'cash_register.mp3'
                        };
                }
                break;
            case Loc.Outdoors:
                return null;
                break;
            case Loc.Work:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'keyboard_1.mp3',
                            'C#1': 'keyboard_2.mp3',
                            'D1': 'keyboard_3.mp3',
                            'D#1': 'keyboard_4.mp3',
                            'E1': 'keyboard_5.mp3',
                            'F1': 'keyboard_6.mp3',
                            'F#1': 'keyboard_7.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'mouse_click_1.mp3',
                            'C#1': 'mouse_click_2.mp3',
                            'D1': 'mouse_click_3.mp3',
                            'D#1': 'mouse_click_4.mp3'
                        };
                    case Category.Fast:
                        return {
                            'C1': 'turn_page_1.mp3',
                            'C#1': 'turn_page_2.mp3',
                            'D1': 'turn_page_3.mp3',
                            'D#1': 'turn_page_4.mp3',
                            'E1': 'turn_page_5.mp3'
                        };
                }
                break;
            case Loc.Supermarket:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'shopping_beep_1.mp3',
                            'C#1': 'shopping_beep_2.mp3',
                            'D1': 'shopping_beep_3.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'credit_card_1.mp3',
                            'C#1': 'credit_card_2.mp3',
                            'D1': 'credit_card_3.mp3'
                        };
                    case Category.Fast:
                        return {
                            'C1': 'cash_register.mp3'
                        };
                }
                break;
            case Loc.Classroom:
                switch (category) {
                    case Category.Slow:
                        return {
                            'C1': 'keyboard_1.mp3',
                            'C#1': 'keyboard_2.mp3',
                            'D1': 'keyboard_3.mp3',
                            'D#1': 'keyboard_4.mp3',
                            'E1': 'keyboard_5.mp3',
                            'F1': 'keyboard_6.mp3',
                            'F#1': 'keyboard_7.mp3'
                        };
                    case Category.Mid:
                        return {
                            'C1': 'pencil_1.mp3',
                            'C#1': 'pencil_2.mp3',
                            'D1': 'pencil_3.mp3',
                            'D#1': 'pencil_4.mp3'
                        };
                    case Category.Fast:
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

    public getAtmo(): string {
        const path = this.getDir() + 'atmo';
        if (this.location === Loc.Home ||
            this.location === Loc.Work ||
            this.location === Loc.Outdoors) {
            return this.isCity ? path + '_city.mp3' : path + '_country.mp3';
        } else {
            return path + '.mp3';
        }
    }

    private generateSequence(category: Category, numNotes: number, probability: number): Array<string> {
        const sequence: string[] = [];

        const noteToURL: SamplesObject = this.getNoteToSampleURL(category, this.food);
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

}
